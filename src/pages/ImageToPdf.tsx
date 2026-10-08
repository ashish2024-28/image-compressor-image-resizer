import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { PageContainer } from '../components/layout/PageContainer';
import { AdvancePdfCallout } from '../components/pdf/AdvancePdfCallout';
import { PdfPreviewModal } from '../components/pdf/PdfPreviewModal';
import { 
  FileText, 
  Upload, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Check, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  FileImage,
  Sparkles,
  Zap,
  Printer,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { formatFileSize } from '../utils/formatFileSize';

interface PdfImageItem {
  id: string;
  file: File;
  name: string;
  size: number;
  dataUrl: string;
  width: number;
  height: number;
}

const PDF_PAGE_SIZES: Record<string, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
};

const PDF_MARGIN_SIZES: Record<string, number> = {
  none: 0,
  small: 5,
  normal: 12,
};

export const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<PdfImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('small');
  const [pdfFileName, setPdfFileName] = useState('merged-document.pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    const newItems: PdfImageItem[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const { width, height } = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.src = dataUrl;
      });

      newItems.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        dataUrl,
        width,
        height,
      });
    }

    setImages((prev) => [...prev, ...newItems]);
    setCompleted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setCompleted(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      // Create jsPDF instance
      // Default to portrait A4 in mm
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      // Page dimensions in mm
      const PAGE_SIZES: Record<string, { width: number; height: number }> = {
        a4: { width: 210, height: 297 },
        letter: { width: 215.9, height: 279.4 },
      };

      const MARGIN_SIZES: Record<string, number> = {
        none: 0,
        small: 5,
        normal: 12,
      };

      const baseMargin = MARGIN_SIZES[margin];

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        if (i > 0) {
          doc.addPage();
        }

        // Determine orientation
        let isLandscape = false;
        if (orientation === 'landscape') {
          isLandscape = true;
        } else if (orientation === 'auto') {
          isLandscape = item.width > item.height;
        }

        let pWidth = 210;
        let pHeight = 297;

        if (pageSize === 'fit') {
          // Fit page to image aspect ratio (rendered at 72dpi to mm conversion)
          pWidth = (item.width * 25.4) / 96;
          pHeight = (item.height * 25.4) / 96;
          // Set page size to match image exactly
          doc.setPage(i + 1);
        } else {
          const dims = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
          pWidth = isLandscape ? dims.height : dims.width;
          pHeight = isLandscape ? dims.width : dims.height;
        }

        const availWidth = Math.max(10, pWidth - baseMargin * 2);
        const availHeight = Math.max(10, pHeight - baseMargin * 2);

        // Scale image while preserving aspect ratio
        const imgRatio = item.width / item.height;
        const availRatio = availWidth / availHeight;

        let renderWidth = availWidth;
        let renderHeight = availHeight;

        if (imgRatio > availRatio) {
          renderWidth = availWidth;
          renderHeight = availWidth / imgRatio;
        } else {
          renderHeight = availHeight;
          renderWidth = availHeight * imgRatio;
        }

        // Center on page
        const posX = (pWidth - renderWidth) / 2;
        const posY = (pHeight - renderHeight) / 2;

        // Image format detection
        let format = 'JPEG';
        if (item.file.type === 'image/png') format = 'PNG';
        if (item.file.type === 'image/webp') format = 'WEBP';

        doc.addImage(item.dataUrl, format, posX, posY, renderWidth, renderHeight, undefined, 'FAST');
      }

      const saveName = pdfFileName.endsWith('.pdf') ? pdfFileName : `${pdfFileName}.pdf`;
      const blob = doc.output('blob');
      setGeneratedBlob(blob);
      doc.save(saveName);
      setCompleted(true);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBlobOnly = async (): Promise<Blob | null> => {
    if (images.length === 0) return null;
    const doc = new jsPDF({
      orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: pageSize === 'fit' ? 'a4' : (PDF_PAGE_SIZES[pageSize] ? [PDF_PAGE_SIZES[pageSize].width, PDF_PAGE_SIZES[pageSize].height] : 'a4'),
    });

    const baseMargin = PDF_MARGIN_SIZES[margin];

    for (let i = 0; i < images.length; i++) {
      const item = images[i];
      if (i > 0) doc.addPage();

      let isLandscape = false;
      if (orientation === 'landscape') isLandscape = true;
      else if (orientation === 'auto') isLandscape = item.width > item.height;

      let pWidth = 210;
      let pHeight = 297;

      if (pageSize === 'fit') {
        pWidth = (item.width * 25.4) / 96;
        pHeight = (item.height * 25.4) / 96;
        doc.setPage(i + 1);
      } else {
        const dims = PDF_PAGE_SIZES[pageSize] || PDF_PAGE_SIZES.a4;
        pWidth = isLandscape ? dims.height : dims.width;
        pHeight = isLandscape ? dims.width : dims.height;
      }

      const availWidth = Math.max(10, pWidth - baseMargin * 2);
      const availHeight = Math.max(10, pHeight - baseMargin * 2);
      const imgRatio = item.width / item.height;
      const availRatio = availWidth / availHeight;

      let renderWidth = availWidth;
      let renderHeight = availHeight;
      if (imgRatio > availRatio) {
        renderWidth = availWidth;
        renderHeight = availWidth / imgRatio;
      } else {
        renderHeight = availHeight;
        renderWidth = availHeight * imgRatio;
      }

      const posX = (pWidth - renderWidth) / 2;
      const posY = (pHeight - renderHeight) / 2;

      let format = 'JPEG';
      if (item.file.type === 'image/png') format = 'PNG';
      if (item.file.type === 'image/webp') format = 'WEBP';

      doc.addImage(item.dataUrl, format, posX, posY, renderWidth, renderHeight, undefined, 'FAST');
    }

    const b = doc.output('blob');
    setGeneratedBlob(b);
    return b;
  };

  const handlePreview = async () => {
    if (images.length === 0) return;
    if (generatedBlob) {
      setShowPreview(true);
      return;
    }
    setIsGenerating(true);
    try {
      await generateBlobOnly();
      setShowPreview(true);
    } catch (err) {
      console.error('Failed to preview PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageContainer
      title="Image to PDF Converter – Convert & Merge Photos to PDF Online Free"
      description="Convert JPG, PNG, and WebP images to PDF online for free. Photo se PDF kaise banaye: Merge multiple photos into a single PDF document in your browser. 100% private, no watermark."
      breadcrumbs={[
        { name: 'Tools', url: '/tools' },
        { name: 'Image to PDF', url: '/image-to-pdf' },
      ]}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Photo to PDF Maker &bull; Photo Se PDF Banaye</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Convert Images to PDF &amp; Merge Multiple Photos
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Combine JPG, PNG, and WebP pictures into one clean, high-resolution PDF file. Perfect for college assignments, exam portals, job resumes, and government document verification.
          </p>
        </div>

        {/* Upload Dropzone */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] p-8 text-center hover:border-rose-500 transition-colors shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFilesAdded}
            className="hidden"
            id="pdf-images-upload"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                + Select Photos to Convert
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select one or multiple photos (JPG, PNG, WebP). 100% private in-browser processing.
            </p>
          </div>
        </div>

        {/* Active Files & PDF Settings */}
        {images.length > 0 && (
          <div className="space-y-6">
            {/* Control Panel */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {images.length} Image(s) Ready to Merge
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setImages([])}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Grid of Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* Page Size */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Page Size
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="a4">A4 (Standard Sheet)</option>
                    <option value="letter">US Letter</option>
                    <option value="fit">Fit to Image</option>
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="portrait">Portrait (Vertical)</option>
                    <option value="landscape">Landscape (Horizontal)</option>
                    <option value="auto">Auto (Match Image)</option>
                  </select>
                </div>

                {/* Margins */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Page Margin
                  </label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="small">Small Margin (5mm)</option>
                    <option value="normal">Standard Margin (12mm)</option>
                    <option value="none">No Margin (Full Bleed)</option>
                  </select>
                </div>

                {/* PDF Filename */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    PDF File Name
                  </label>
                  <input
                    type="text"
                    value={pdfFileName}
                    onChange={(e) => setPdfFileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    placeholder="my-document.pdf"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={isGenerating}
                  className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-rose-500" />
                  <span>Preview PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleGeneratePdf}
                  disabled={isGenerating}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer transition-all"
                >
                  {isGenerating ? (
                    <span>Generating PDF Document...</span>
                  ) : completed ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>PDF Downloaded! Click to Generate Again</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Merge &amp; Download PDF ({images.length} Pages)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Reorderable Image Page List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
                <span>PDF Pages &amp; Ordering</span>
                <span>Use arrows to rearrange page order</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-3 shadow-xs space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                        Page {index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                          title="Move Page Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === images.length - 1}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                          title="Move Page Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-500 cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="h-32 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800">
                      <img
                        src={item.dataUrl}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                      <p className="truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.width} &times; {item.height} px &bull; {formatFileSize(item.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        <PdfPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          pdfBlob={generatedBlob}
          fileName={pdfFileName.endsWith('.pdf') ? pdfFileName : `${pdfFileName}.pdf`}
          title={`Images to PDF Preview (${images.length} Pages)`}
          onDownload={handleGeneratePdf}
        />

        {/* Advance PDF Operations Companion Callout */}
        <AdvancePdfCallout
          variant="compact"
          title="Need Advanced Multi-Format PDF Conversion or Editing?"
          description="Convert complex documents, office files, apply OCR, or encrypt your newly generated PDF with our companion PDF Tools Pro platform."
        />

        {/* Hinglish & English Guide / Solution Section */}
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-rose-500 uppercase tracking-wider block">
              Step-by-Step Guide &bull; Photo Se PDF Banane Ka Tarika
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Photo Ko PDF Me Kaise Convert Kare? (Mobile &amp; PC)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-extrabold text-rose-500 text-sm">Step 1:</span>
              <p className="font-bold text-slate-900 dark:text-white">Upload Photos</p>
              <p className="text-slate-500 dark:text-slate-400">
                '+ Select Photos' par click kare aur apni single ya multiple JPG, PNG ya WebP images chune.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-extrabold text-rose-500 text-sm">Step 2:</span>
              <p className="font-bold text-slate-900 dark:text-white">Page Settings &amp; Order</p>
              <p className="text-slate-500 dark:text-slate-400">
                A4 sheet size select kare. Arrow buttons se photos ka sequence (page order) aage-peeche set kare.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-extrabold text-rose-500 text-sm">Step 3:</span>
              <p className="font-bold text-slate-900 dark:text-white">Download Merged PDF</p>
              <p className="text-slate-500 dark:text-slate-400">
                'Merge &amp; Download PDF' par click kare. Aapka high-resolution PDF document turant download ho jayega.
              </p>
            </div>
          </div>
        </section>

        {/* Hinglish & English FAQs */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-500" />
            <span>Frequently Asked Questions (Hinglish &amp; English)</span>
          </h2>

          <div className="space-y-3">
            {[
              {
                q: 'Kya multiple photos ko ek single PDF file me merge kar sakte hain?',
                a: 'Haan! Aap jitni chahein utni photos (Aadhaar card, Marksheet, PAN card, Certificate) ek sath upload karke unhe ek multi-page PDF document me combine kar sakte hain.',
              },
              {
                q: 'Kya is tool par koi watermark lagta hai?',
                a: 'Bilkul nahi! Yeh tool 100% free hai aur aapke PDF me koi watermark ya branding add nahi karta. Clean, official format me PDF export hota hai.',
              },
              {
                q: 'Is conversion private and safe for my confidential IDs and documents?',
                a: 'Yes, 100%! All PDF generation happens strictly inside your browser memory using JavaScript. Your confidential documents, marksheets, and identity photos are NEVER uploaded to any cloud server.',
              },
              {
                q: 'How do I compress the generated PDF under 100KB or 200KB?',
                a: 'Before merging into PDF, you can first pass your large photos through our "/compress-image-to-100kb" tool. When lightweight images are placed in the PDF, the final PDF size will stay extremely small.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 text-xs open:border-rose-500/50"
              >
                <summary className="font-bold text-slate-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-rose-500 group-open:rotate-180 transition-transform">&darr;</span>
                </summary>
                <p className="mt-2 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* DocuLite Advanced PDF Suite Direct Link Banner */}
        <div className="p-4 sm:p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Looking for Advanced PDF Operations?</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  DocuLite
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Merge multiple PDFs, compress below 100KB, split pages, and extract to JPG at <strong>pdf-tools-ten-eta.vercel.app</strong>.
              </p>
            </div>
          </div>
          <a
            href="https://pdf-tools-ten-eta.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <span>Open DocuLite PDF Suite</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Related Quick Tools Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs font-semibold">
          <Link to="/compress" className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500">
            Compress Images
          </Link>
          <Link to="/resize" className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500">
            Resize Dimensions
          </Link>
          <Link to="/compress-image-to-100kb" className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500">
            Compress to 100KB
          </Link>
          <Link to="/passport-photo-creator" className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500">
            Passport Photo Maker
          </Link>
          <Link to="/support" className="px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
            Help &amp; Support
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};
