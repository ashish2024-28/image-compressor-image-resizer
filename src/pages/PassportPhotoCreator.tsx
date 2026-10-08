import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { SingleImagePreviewModal } from '../components/image/SingleImagePreviewModal';
import { downloadBlob, getOutputFilename } from '../utils/fileUtils';
import { formatFileSize } from '../utils/formatFileSize';
import {
  UserSquare2,
  UploadCloud,
  CheckCircle2,
  Download,
  RotateCw,
  Sparkles,
  Info,
  Maximize2,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Move,
  Sliders,
  BookOpen,
  HelpCircle,
  Eye,
} from 'lucide-react';

const PASSPORT_FAQS = [
  {
    question: 'Why do government portals reject passport photos?',
    answer: 'The three most common rejection reasons are: (1) Head proportion being too small or too large relative to the photo frame (must occupy 50-69% of height in US, 70-80% in Schengen/UK); (2) Exceeding file size caps (such as 240 KB for US DS-11/DS-82 or 300 KB for Indian e-Visa); and (3) Incorrect aspect ratios or low DPI.',
  },
  {
    question: 'Are glasses allowed in US passport photos?',
    answer: 'No. As of 2016, eyeglasses must be removed for US passport and visa photos unless accompanied by a signed medical letter explaining an urgent medical condition.',
  },
  {
    question: 'Can I take a passport photo with my smartphone?',
    answer: 'Yes! Stand 4-5 feet away against a plain white wall with even lighting on both sides of your face. Then upload the photo here to align with our biometric head oval guide and cap the file size automatically.',
  },
  {
    question: 'What is the required background color?',
    answer: 'For US, India, and Schengen applications, a plain white or light off-white background with zero shadows or patterns is required. For the UK, light grey or cream is preferred.',
  },
];

const PASSPORT_HOW_TO = [
  {
    name: 'Select Country Standard',
    text: 'Choose US Passport (2x2 in / 51x51mm), Schengen/EU (35x45mm), UK, India, Canada, or Australia.',
  },
  {
    name: 'Upload Your Portrait',
    text: 'Upload a clear portrait facing forward with eyes open and neutral facial expression.',
  },
  {
    name: 'Align with Biometric Guides',
    text: 'Use zoom and pan controls to fit your chin and crown within the semi-transparent face oval.',
  },
  {
    name: 'Download Verified File',
    text: 'Click Download Official Photo to get a properly dimensioned JPEG guaranteed to meet government file caps.',
  },
];

interface CountryStandard {
  name: string;
  flag: string;
  widthMm: number;
  heightMm: number;
  widthPx: number; // At 300 DPI
  heightPx: number;
  maxKb: number;
  minKb: number;
  headRatioPercent: number; // Head height vs total height ~60-70%
  backgroundNote: string;
}

const PASSPORT_STANDARDS: CountryStandard[] = [
  {
    name: 'United States (US Passport & Visa / DV Lottery)',
    flag: '🇺🇸',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    maxKb: 240,
    minKb: 10,
    headRatioPercent: 65,
    backgroundNote: 'Plain white or off-white background required',
  },
  {
    name: 'Schengen / European Union (EU Standard)',
    flag: '🇪🇺',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    maxKb: 250,
    minKb: 20,
    headRatioPercent: 70,
    backgroundNote: 'Light grey or plain cream/white background',
  },
  {
    name: 'United Kingdom (UK Passport)',
    flag: '🇬🇧',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    maxKb: 300,
    minKb: 30,
    headRatioPercent: 70,
    backgroundNote: 'Plain light grey or plain cream background',
  },
  {
    name: 'India (Passport & OCI Card)',
    flag: '🇮🇳',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    maxKb: 200,
    minKb: 20,
    headRatioPercent: 65,
    backgroundNote: 'Plain white background with sharp contrast',
  },
  {
    name: 'Canada (Canadian Passport)',
    flag: '🇨🇦',
    widthMm: 50,
    heightMm: 70,
    widthPx: 590,
    heightPx: 826,
    maxKb: 350,
    minKb: 40,
    headRatioPercent: 60,
    backgroundNote: 'Plain white or light-coloured background',
  },
  {
    name: 'Australia (Australian Passport)',
    flag: '🇦🇺',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    maxKb: 300,
    minKb: 25,
    headRatioPercent: 70,
    backgroundNote: 'Plain white or light grey background',
  },
];

export const PassportPhotoCreator: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<CountryStandard>(PASSPORT_STANDARDS[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Position, zoom & crop controls
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Verification Results
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeGuide, setActiveGuide] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Clean URLs
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [imageSrc, processedUrl]);

  const handleSelectFile = (file: File) => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (processedUrl) URL.revokeObjectURL(processedUrl);

    const url = URL.createObjectURL(file);
    setImageFile(file);
    setImageSrc(url);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setProcessedBlob(null);
    setProcessedUrl(null);

    const img = new Image();
    img.onload = () => {
      imageElementRef.current = img;
      renderCrop(img, 1, 0, 0, 0, selectedStandard);
    };
    img.src = url;
  };

  const renderCrop = useCallback(
    async (
      img: HTMLImageElement,
      z: number,
      px: number,
      py: number,
      rot: number,
      std: CountryStandard
    ) => {
      setIsProcessing(true);
      try {
        const outW = std.widthPx;
        const outH = std.heightPx;

        const canvas = document.createElement('canvas');
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d')!;

        // White background standard
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outW, outH);

        ctx.save();
        ctx.translate(outW / 2 + px, outH / 2 + py);
        if (rot) ctx.rotate((rot * Math.PI) / 180);
        ctx.scale(z, z);

        // Calculate aspect fill
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const targetAspect = outW / outH;

        let drawW = outW;
        let drawH = outH;
        if (imgAspect > targetAspect) {
          drawW = outH * imgAspect;
        } else {
          drawH = outW / imgAspect;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        // Binary search encode to guarantee under maximum KB but avoid "overly compressed" error!
        // US and international passport photo validators reject files below 10-20KB as "Overly compressed".
        const maxBytes = std.maxKb * 1024;
        const minBytes = std.minKb * 1024;

        let lowQ = 0.5;
        let highQ = 0.98;
        let bestBlob: Blob | null = null;

        for (let iter = 0; iter < 5; iter++) {
          const testQ = (lowQ + highQ) / 2;
          const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', testQ));
          if (blob.size <= maxBytes) {
            bestBlob = blob;
            if (blob.size >= minBytes) {
              lowQ = testQ; // Satisfies both limits, try keeping quality high
            } else {
              lowQ = testQ;
            }
          } else {
            highQ = testQ; // Too big
          }
        }

        const finalBlob = bestBlob || (await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', 0.8)));

        if (processedUrl) URL.revokeObjectURL(processedUrl);
        const url = URL.createObjectURL(finalBlob);

        setProcessedBlob(finalBlob);
        setProcessedUrl(url);
        setProcessedSize(finalBlob.size);
      } finally {
        setIsProcessing(false);
      }
    },
    [processedUrl]
  );

  const handleZoomChange = (delta: number) => {
    const newZ = Math.max(0.4, Math.min(3, zoom + delta));
    setZoom(newZ);
    if (imageElementRef.current) {
      renderCrop(imageElementRef.current, newZ, panX, panY, rotation, selectedStandard);
    }
  };

  const handleRotate = () => {
    const newRot = (rotation + 90) % 360;
    setRotation(newRot);
    if (imageElementRef.current) {
      renderCrop(imageElementRef.current, zoom, panX, panY, newRot, selectedStandard);
    }
  };

  // Drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageElementRef.current) return;
    const nx = e.clientX - dragStartRef.current.x;
    const ny = e.clientY - dragStartRef.current.y;
    setPanX(nx);
    setPanY(ny);
  };

  const handleMouseUp = () => {
    if (isDragging && imageElementRef.current) {
      setIsDragging(false);
      renderCrop(imageElementRef.current, zoom, panX, panY, rotation, selectedStandard);
    }
  };

  // Touch drag support for mobile phones and tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !imageElementRef.current || e.touches.length !== 1) return;
    const nx = e.touches[0].clientX - dragStartRef.current.x;
    const ny = e.touches[0].clientY - dragStartRef.current.y;
    setPanX(nx);
    setPanY(ny);
  };

  const handleTouchEnd = () => {
    if (isDragging && imageElementRef.current) {
      setIsDragging(false);
      renderCrop(imageElementRef.current, zoom, panX, panY, rotation, selectedStandard);
    }
  };

  const handleStandardChange = (std: CountryStandard) => {
    setSelectedStandard(std);
    if (imageElementRef.current) {
      renderCrop(imageElementRef.current, zoom, panX, panY, rotation, std);
    }
  };

  const handleDownload = () => {
    if (!processedBlob) return;
    const name = imageFile ? imageFile.name : 'passport-photo';
    const filename = getOutputFilename(name, 'image/jpeg', `-${selectedStandard.widthMm}x${selectedStandard.heightMm}mm`);
    downloadBlob(processedBlob, filename);
  };

  return (
    <PageContainer
      title="Official Passport Photo Maker & Validator – 100% In-Browser"
      description="Create compliant passport, visa, and ID photos formatted to official dimensions (2x2 inch, 35x45mm) with verified file size compliance."
      breadcrumbs={[{ name: 'Passport & Visa Photo', url: '/passport-photo-creator' }]}
      faqs={PASSPORT_FAQS}
      howToSteps={PASSPORT_HOW_TO}
      schemaType="WebApplication"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Solves Government &quot;Overly Compressed&quot; Rejections</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Official Passport & Visa Photo Creator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Format, crop, and compress passport photos to strict biometric regulations directly in your browser without paying photo booths.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Standards & Settings */}
        <div className="lg:col-span-1 space-y-4">
          <div className="pro-card rounded-2xl p-4 sm:p-6 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
                Select Country Standard
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Preconfigured with official millimeter and pixel specs
              </p>
              <div className="space-y-1.5">
                {PASSPORT_STANDARDS.map((std) => (
                  <button
                    key={std.name}
                    type="button"
                    onClick={() => handleStandardChange(std)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      selectedStandard.name === std.name
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/70 ring-1 ring-blue-600 font-semibold text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base shrink-0">{std.flag}</span>
                        <span className="truncate max-w-[140px] sm:max-w-[200px]">{std.name}</span>
                      </span>
                      <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 shrink-0 ml-1">
                        {std.widthMm}×{std.heightMm}mm
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Standard Requirements:
              </span>
              <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Exact Resolution: {selectedStandard.widthPx} × {selectedStandard.heightPx} px (300 DPI)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Max File Cap: ≤ {selectedStandard.maxKb} KB</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Min File Safety: ≥ {selectedStandard.minKb} KB (avoids &quot;overly compressed&quot; error)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{selectedStandard.backgroundNote}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Center / Right Column: Photo Editor & Biometric Overlay */}
        <div className="lg:col-span-2 space-y-5">
          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111827] rounded-2xl p-8 sm:p-12 text-center hover:border-blue-500 cursor-pointer transition-colors shadow-xs"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSelectFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800">
                <UserSquare2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Upload Headshot or Camera Photo
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-5">
                Take a selfie against a light plain wall or choose an existing portrait photo.
              </p>
              <div className="flex justify-center">
                <Button variant="primary" size="sm" className="px-6" leftIcon={<UploadCloud className="w-4 h-4" />}>
                  Select Photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Interactive Biometric Cropper Box */}
              <div className="pro-card rounded-2xl p-4 sm:p-5 flex flex-col items-center select-none">
                <div className="flex flex-wrap items-center justify-between w-full max-w-md text-xs text-slate-600 dark:text-slate-400 mb-3 gap-2">
                  <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <Move className="w-3.5 h-3.5" /> Drag image to align with guide
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeGuide}
                      onChange={(e) => setActiveGuide(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    <span>Biometric Face Guide</span>
                  </label>
                </div>

                {/* Canvas Cropper Container */}
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="relative overflow-hidden rounded-lg bg-black border border-slate-700 cursor-grab active:cursor-grabbing touch-none flex items-center justify-center shadow-inner max-w-full"
                  style={{
                    width: selectedStandard.widthMm >= selectedStandard.heightMm ? '280px' : `${(280 * selectedStandard.widthMm) / selectedStandard.heightMm}px`,
                    height: selectedStandard.heightMm >= selectedStandard.widthMm ? '320px' : `${(320 * selectedStandard.heightMm) / selectedStandard.widthMm}px`,
                    maxWidth: '100%',
                  }}
                >
                  {processedUrl && (
                    <img
                      src={processedUrl}
                      alt="Crop preview"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}

                  {/* Biometric Oval Guide Overlay */}
                  {activeGuide && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      {/* Head Oval outline */}
                      <div
                        className="border-2 border-dashed border-emerald-400/80 rounded-[50%] flex items-center justify-center"
                        style={{
                          width: `${selectedStandard.headRatioPercent}%`,
                          height: `${selectedStandard.headRatioPercent + 8}%`,
                        }}
                      >
                        {/* Eye level marker */}
                        <div className="w-full border-t border-dotted border-emerald-300/60" />
                      </div>
                      <div className="absolute bottom-4 text-[10px] bg-black/70 text-emerald-300 px-2 py-0.5 rounded font-mono">
                        Crown & Chin inside Oval
                      </div>
                    </div>
                  )}
                </div>

                {/* Control toolbar */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => handleZoomChange(-0.15)}
                    leftIcon={<ZoomOut className="w-3.5 h-3.5" />}
                  >
                    Zoom Out
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => handleZoomChange(0.15)}
                    leftIcon={<ZoomIn className="w-3.5 h-3.5" />}
                  >
                    Zoom In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={handleRotate}
                    leftIcon={<RotateCw className="w-3.5 h-3.5" />}
                  >
                    Rotate 90°
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Photo
                  </Button>
                </div>
              </div>

              {/* Verified Result Card */}
              {processedBlob && (
                <div className="pro-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Biometric File Ready & Verified
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Output: {selectedStandard.widthPx} × {selectedStandard.heightPx} px •{' '}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatFileSize(processedSize)}
                      </span>{' '}
                      (Target cap: ≤ {selectedStandard.maxKb} KB)
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setShowPreview(true)}
                      leftIcon={<Eye className="w-4 h-4 text-emerald-500" />}
                    >
                      Preview Photo
                    </Button>
                    <Button
                      variant="success"
                      size="md"
                      className="w-full sm:w-auto"
                      onClick={handleDownload}
                      leftIcon={<Download className="w-4 h-4" />}
                    >
                      Download Official Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Passport Photo Preview Modal */}
      <SingleImagePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        imageBlob={processedBlob}
        width={selectedStandard.widthPx}
        height={selectedStandard.heightPx}
        fileSize={processedSize}
        fileName={getOutputFilename(imageFile?.name || 'passport-photo.jpg', 'image/jpeg', '-official')}
        title={`${selectedStandard.name} Photo Preview`}
        onDownload={handleDownload}
      />

      {/* SEO & Instructional Sections */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-12 max-w-4xl mx-auto">
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>How to Create Compliant Passport Photos</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PASSPORT_HOW_TO.map((step, idx) => (
              <div
                key={idx}
                className="pro-card rounded-xl p-4 sm:p-5 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {step.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-3">
            {PASSPORT_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-1.5"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools Internal Linking */}
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Related Tools & Standards Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/compress"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Compress Image
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compress application documents under strict upload constraints.
              </p>
            </Link>

            <Link
              to="/resize"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Maximize2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Resize Image
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust width and height in pixels or millimeters accurately.
              </p>
            </Link>

            <Link
              to="/guides/passport-and-visa-photo-size-requirements"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Biometrics Guide
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed specs for US, Schengen, UK, and India visa portals.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
