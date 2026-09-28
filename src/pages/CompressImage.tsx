import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { ImageDropzone } from '../components/upload/ImageDropzone';
import { ImageList } from '../components/upload/ImageList';
import { CompressionTool } from '../features/compression/CompressionTool';
import { ImagePreviewModal } from '../components/image/ImagePreviewModal';
import { AdBanner, MultiplexAd } from '../components/ads';
import { useImageProcessor } from '../hooks/useImageProcessor';
import { useImageSettings } from '../hooks/useImageSettings';
import type { ImageItem } from '../types';
import {
  ShieldCheck,
  HelpCircle,
  FileText,
  CheckCircle2,
  Maximize2,
  FileType,
  BookOpen,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const COMPRESS_FAQS = [
  {
    question: 'Are my images uploaded to an external server?',
    answer: 'No. Image Optimizer operates completely inside your web browser using HTML5 Canvas and WebAssembly APIs. Your images remain 100% private on your device at all times with zero server storage or telemetry.',
  },
  {
    question: 'Why does PNG compression not change file size as much as JPEG?',
    answer: 'PNG is a strictly lossless format. When you reduce the quality slider on PNG files, standard browser canvas implementations preserve all visual data. To achieve substantial file size reductions with PNG photos or artwork, convert them to WebP (which supports alpha transparency) or JPEG.',
  },
  {
    question: 'What quality setting is recommended for web images?',
    answer: 'For websites, blog posts, and e-commerce listings, a quality setting of 75% to 85% delivers the ideal sweet spot—slashing file weight by 65% to 80% while remaining visually indistinguishable from uncompressed camera output.',
  },
  {
    question: 'Can I compress multiple images at the same time in batch?',
    answer: 'Yes! You can drop dozens of images simultaneously. Use the Batch Action controls to compress all files in one click or download all optimized images bundled in a clean ZIP archive.',
  },
];

const HOW_TO_STEPS = [
  {
    name: 'Upload Images',
    text: 'Drag and drop your JPG, PNG, or WebP files into the upload box or click to select from your device.',
  },
  {
    name: 'Select Quality Preset or Custom Target',
    text: 'Choose High (85%), Balanced (75%), Maximum Compression (60%), or configure custom quality and maximum file size constraints.',
  },
  {
    name: 'Process Locally',
    text: 'Click Compress All to optimize your images in real time directly within your browser.',
  },
  {
    name: 'Compare & Download',
    text: 'Inspect side-by-side visual fidelity using the preview modal and download individual files or a combined ZIP archive.',
  },
];

export const CompressImage: React.FC = () => {
  const {
    images,
    activeImageId,
    validationWarnings,
    batchWarning,
    progress,
    addFiles,
    removeImage,
    clearAll,
    processImage,
    processAll,
    clearWarnings,
  } = useImageProcessor();

  const {
    settings,
    setQualityPreset,
    setQuality,
    setFormat,
    updateSetting,
    resetSettings,
  } = useImageSettings({
    qualityPreset: 'medium',
    quality: 80,
    format: 'image/webp',
  });

  const [previewItem, setPreviewItem] = useState<ImageItem | null>(null);

  const activeImage = images.find((i) => i.id === activeImageId);

  return (
    <PageContainer
      title="Compress Images Online – Free Client-Side Image Compressor"
      description="Compress JPG, PNG, and WebP images online directly in your browser. Fast, private batch image compression with zero server uploads."
      breadcrumbs={[{ name: 'Compress Image', url: '/compress' }]}
      faqs={COMPRESS_FAQS}
      howToSteps={HOW_TO_STEPS}
      schemaType="WebApplication"
    >
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Local Browser Compression · Zero Server Uploads</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Compress Images Online
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Reduce the file size of your JPG, PNG, and WebP images in seconds while keeping pixel-sharp visual quality.
        </p>
      </div>

      {validationWarnings.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex justify-between items-center font-bold">
            <span>Validation Notice</span>
            <button
              type="button"
              onClick={clearWarnings}
              className="underline hover:text-amber-700"
            >
              Dismiss
            </button>
          </div>
          {validationWarnings.map((w, idx) => (
            <p key={idx}>• {w}</p>
          ))}
        </div>
      )}

      {/* Main Compressor Area */}
      <div className="mb-12">
        {images.length === 0 ? (
          <ImageDropzone onFilesSelected={addFiles} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-4">
              <CompressionTool
                settings={settings}
                onUpdateSetting={updateSetting}
                onQualityPresetChange={setQualityPreset}
                onQualityChange={setQuality}
                onFormatChange={setFormat}
                onResetSettings={resetSettings}
                sampleAspectRatio={activeImage?.aspectRatio}
              />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <ImageList
                images={images}
                globalSettings={settings}
                progress={progress}
                batchWarning={batchWarning}
                onPreview={(item) => setPreviewItem(item)}
                onRemove={removeImage}
                onProcess={(id) => processImage(id, undefined, settings)}
                onProcessAll={() => processAll(settings)}
                onClearAll={clearAll}
              />

              <div className="pt-2">
                <ImageDropzone onFilesSelected={addFiles} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DocuLite Companion PDF Tool Banner */}
      <div className="mb-10 p-5 sm:p-6 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 via-blue-950/10 to-indigo-900/20 dark:from-[#0d1527] dark:to-[#0f172a] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                Need to convert photos into PDF or merge documents?
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                DocuLite Suite
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
              Need to convert your photos into a PDF, merge multiple PDFs, or compress PDF documents? Use our 100% private companion tool <strong>DocuLite</strong> (<a href="https://pdf-tools-ten-eta.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">https://pdf-tools-ten-eta.vercel.app/</a>).
            </p>
          </div>
        </div>
        <a
          href="https://pdf-tools-ten-eta.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer group"
        >
          <span>Open DocuLite PDF Tool</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* AdSense Slot */}
      <AdBanner format="horizontal" />

      {/* Step-by-Step Instructions */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-12 max-w-4xl mx-auto">
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>How to Compress Images in 4 Easy Steps</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HOW_TO_STEPS.map((step, idx) => (
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

        {/* Technical Explanation */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Lossy vs. Lossless Image Compression</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Image compression is the process of encoding digital graphics to take up substantially less storage space and bandwidth. When preparing media for websites, email attachments, digital resumes, or mobile messaging, uncompressed photos cause high bounce rates and trigger file size errors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="pro-card rounded-xl p-4 sm:p-5 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Lossy Compression</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Lossy compression discards subtle pixel variations that human retinas cannot perceive at standard viewing distances (such as fine high-frequency color variations in gradients). This achieves substantial reductions (60%–85%) with virtually zero noticeable quality loss. Ideal for photographs and web graphics.
              </p>
            </div>
            <div className="pro-card rounded-xl p-4 sm:p-5 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Lossless Compression</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Lossless compression reorganizes pixel data through mathematical entropy algorithms without discarding any visual data. Every single pixel matches the original perfectly. Format examples include PNG and lossless WebP. While pristine, the byte reduction is smaller.
              </p>
            </div>
          </div>
        </section>

        {/* Compression FAQs */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-3">
            {COMPRESS_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="pro-card rounded-xl p-4 sm:p-5 space-y-1.5"
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

        {/* AdSense Multiplex / Recommendations Slot */}
        <MultiplexAd slotLabel="Sponsored & Recommended" />

        {/* Related Tools Internal Linking */}
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Related Image Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                Change width, height, or aspect ratio precisely before compressing.
              </p>
            </Link>

            <Link
              to="/convert"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileType className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Convert Format
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Convert between JPG, PNG, WebP, and AVIF in one quick step.
              </p>
            </Link>

            <Link
              to="/guides/how-to-compress-image-without-losing-quality"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Compression Guide
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Read our in-depth analysis on visual thresholds and quantization tables.
              </p>
            </Link>
          </div>
        </section>
      </div>

      {previewItem && (
        <ImagePreviewModal
          item={previewItem}
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          globalSettings={settings}
          onReoptimize={async (id, updatedSettings) => {
            const success = await processImage(id, updatedSettings);
            if (success) {
              setPreviewItem((prev) => (prev ? images.find((i) => i.id === id) || prev : null));
            }
            return success;
          }}
        />
      )}
    </PageContainer>
  );
};
