import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PageContainer } from '../components/layout/PageContainer';
import { AdBanner, MultiplexAd } from '../components/ads';
import { AdvancePdfCallout } from '../components/pdf/AdvancePdfCallout';
import { rotatePdf, addWatermarkToPdf } from '../utils/pdfUtils';
import { formatFileSize } from '../utils/formatFileSize';
import {
  RotateCw,
  Stamp,
  Upload,
  Download,
  Check,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const PdfRotateWatermark: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'rotate' | 'watermark'>('rotate');

  // Rotate settings
  const [rotateAngle, setRotateAngle] = useState<number>(90);

  // Watermark settings
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.25);
  const [watermarkColor, setWatermarkColor] = useState('#ef4444');
  const [watermarkAngle, setWatermarkAngle] = useState(-45);

  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMsg('Please select a valid PDF file.');
      return;
    }

    setSelectedFile(file);
    setErrorMsg(null);
    setCompleted(false);
  };

  const handleApply = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      let outputBytes: Uint8Array;
      let downloadPrefix = 'rotated';

      if (activeTab === 'rotate') {
        outputBytes = await rotatePdf(selectedFile, rotateAngle);
        downloadPrefix = `rotated-${rotateAngle}deg`;
      } else {
        if (!watermarkText.trim()) {
          throw new Error('Please enter watermark text.');
        }
        outputBytes = await addWatermarkToPdf(selectedFile, watermarkText, {
          opacity: watermarkOpacity,
          colorHex: watermarkColor,
          angle: watermarkAngle,
          fontSize: 44,
        });
        downloadPrefix = 'watermarked';
      }

      const blob = new Blob([outputBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${downloadPrefix}-${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setCompleted(true);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Operation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageContainer
      title="Rotate & Watermark PDF Online Free – Add Text Watermark | PDF Rotate Aur Watermark Lagaye"
      description="Rotate PDF pages 90, 180, or 270 degrees and add custom text watermarks (Confidential, Draft, Copy) with custom opacity and angle. 100% private in-browser."
      breadcrumbs={[
        { name: 'Tools', url: '/tools' },
        { name: 'Rotate & Watermark PDF', url: '/pdf-rotate-watermark' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <RotateCw className="w-3.5 h-3.5" />
            <span>PDF Rotate &amp; Watermark &bull; PDF Sidha Kare &amp; Stamp Lagaye</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Rotate Pages &amp; Add Custom Watermark to PDF
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Fix upside-down scanned PDF pages and brand documents with customizable text watermarks. Zero cloud uploads.
          </p>
        </div>

        <AdBanner slotLabel="Header Banner" />

        {/* Dropzone */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] p-8 text-center hover:border-teal-500 transition-colors shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-rotate-input"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                + Choose PDF Document
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any PDF to rotate orientation or apply watermark stamp.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* Controls */}
        {selectedFile && (
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('rotate')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'rotate'
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Rotate
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('watermark')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'watermark'
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Watermark
                </button>
              </div>
            </div>

            {/* Rotate settings */}
            {activeTab === 'rotate' ? (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Select Rotation Angle:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { angle: 90, label: '90° Clockwise' },
                    { angle: 180, label: '180° Flip Upside-Down' },
                    { angle: 270, label: '270° Counter-Clockwise' },
                  ].map((item) => (
                    <button
                      key={item.angle}
                      type="button"
                      onClick={() => setRotateAngle(item.angle)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        rotateAngle === item.angle
                          ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Watermark settings */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    placeholder="CONFIDENTIAL"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Opacity ({Math.round(watermarkOpacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Angle ({watermarkAngle}°)
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="15"
                    value={watermarkAngle}
                    onChange={(e) => setWatermarkAngle(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={watermarkColor}
                      onChange={(e) => setWatermarkColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                    <span className="font-mono text-slate-500">{watermarkColor}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApply}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                {isProcessing ? (
                  <span>Processing Document...</span>
                ) : completed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied &amp; Downloaded! Click to Run Again</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Apply {activeTab === 'rotate' ? 'Rotation' : 'Watermark'} &amp; Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <MultiplexAd slotLabel="Sponsored & Recommended" />
      </div>
    </PageContainer>
  );
};
