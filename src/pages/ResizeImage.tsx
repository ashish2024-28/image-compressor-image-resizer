import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { ImageDropzone } from '../components/upload/ImageDropzone';
import { ImageList } from '../components/upload/ImageList';
import { ImagePreviewModal } from '../components/image/ImagePreviewModal';
import { useImageProcessor } from '../hooks/useImageProcessor';
import { useImageSettings } from '../hooks/useImageSettings';
import type { ImageItem, ResizeMode } from '../types';
import {
  Maximize2,
  ShieldCheck,
  Lock,
  Unlock,
  Sliders,
  UserCheck,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const RESIZE_FAQS = [
  {
    question: 'Will resizing an image reduce its file size?',
    answer: 'Yes! File size scales quadratically with pixel count (width × height). If you resize a 4000×3000 photo to 2000×1500, you reduce the total pixel count by 75%, which dramatically shrinks the file size even before lossy compression is applied.',
  },
  {
    question: 'What is the difference between Fit and Fill modes?',
    answer: 'Fit scales the entire image so it fits completely within the target bounding box without cropping any part of your photo. Fill scales the image to completely cover the specified target dimensions, cropping outer edges if the aspect ratio differs.',
  },
  {
    question: 'What does "Do not enlarge smaller images" do?',
    answer: 'Upscaling smaller images causes pixelation and blurriness. When this setting is enabled, images whose original dimensions are already smaller than your target width and height are preserved at their original resolution.',
  },
  {
    question: 'Can I resize multiple images to the same dimensions in batch?',
    answer: 'Yes! Drop multiple images, set your target width/height or choose a standard preset (like Full HD or Instagram Square), and click Resize All to batch process every image in your browser.',
  },
];

const RESIZE_HOW_TO = [
  {
    name: 'Drop Your Photos',
    text: 'Drag and drop one or many JPG, PNG, or WebP images into the upload area.',
  },
  {
    name: 'Set Desired Dimensions',
    text: 'Enter your exact pixel width and height, or select a preset like 1920x1080 (Full HD), 1080x1080 (Square), or 1200x630 (Social Share).',
  },
  {
    name: 'Choose Aspect Ratio & Fit Mode',
    text: 'Keep the aspect ratio lock enabled to avoid distorting proportions, and choose between Fit or Fill mode.',
  },
  {
    name: 'Process & Download',
    text: 'Click Process All or download your resized pictures individually or bundled in a ZIP archive.',
  },
];

export const ResizeImage: React.FC = () => {
  const {
    images,
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
    updateSetting,
    resetSettings,
  } = useImageSettings({
    resizeEnabled: true,
    maintainAspectRatio: true,
    width: 1920,
    height: 1080,
    resizeMode: 'fit',
    quality: 85,
  });

  const [previewItem, setPreviewItem] = useState<ImageItem | null>(null);

  const presets = [
    { label: 'Full HD (1920 × 1080)', w: 1920, h: 1080 },
    { label: 'HD 720p (1280 × 720)', w: 1280, h: 720 },
    { label: 'Square / IG (1080 × 1080)', w: 1080, h: 1080 },
    { label: 'Social Share (1200 × 630)', w: 1200, h: 630 },
    { label: 'Blog Web (800 × 450)', w: 800, h: 450 },
    { label: 'Avatar (500 × 500)', w: 500, h: 500 },
  ];

  const applyPreset = (w: number, h: number) => {
    updateSetting('width', w);
    updateSetting('height', h);
  };

  return (
    <PageContainer
      title="Resize Images Online – Change Width & Height Fast"
      description="Resize images online directly in your browser. Maintain aspect ratio, choose fit or fill modes, and preserve picture quality with zero uploads."
      breadcrumbs={[{ name: 'Resize Image', url: '/resize' }]}
      faqs={RESIZE_FAQS}
      howToSteps={RESIZE_HOW_TO}
      schemaType="WebApplication"
    >
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Local Browser Resizing · Zero Server Uploads</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Resize Images Online
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Scale pixel dimensions, change aspect ratios, and crop to exact dimensions for social media, blogs, and web design.
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

      {/* Main Resizer Area */}
      <div className="mb-12">
        {images.length === 0 ? (
          <ImageDropzone onFilesSelected={addFiles} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Controls */}
            <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-4">
              <div className="pro-card rounded-2xl p-4 sm:p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    Resize Configuration
                  </h2>
                  <button
                    type="button"
                    onClick={resetSettings}
                    className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Reset
                  </button>
                </div>

                {/* Dimension inputs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Target Dimensions (px)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateSetting('maintainAspectRatio', !settings.maintainAspectRatio)
                      }
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                        settings.maintainAspectRatio
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      {settings.maintainAspectRatio ? (
                        <>
                          <Lock className="w-3 h-3" /> Locked Ratio
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" /> Unlocked
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        value={settings.width ?? ''}
                        onChange={(e) =>
                          updateSetting('width', e.target.value ? parseInt(e.target.value, 10) : null)
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 1920"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        value={settings.height ?? ''}
                        onChange={(e) =>
                          updateSetting('height', e.target.value ? parseInt(e.target.value, 10) : null)
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 1080"
                      />
                    </div>
                  </div>
                </div>

                {/* Resize Mode */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Resize Scaling Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['fit', 'fill'] as ResizeMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => updateSetting('resizeMode', mode)}
                        className={`py-2 px-3 rounded-lg border font-medium capitalize text-center transition-colors ${
                          settings.resizeMode === mode
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {mode === 'fit' ? 'Fit (No Crop)' : 'Fill (Exact Crop)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Dimension Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Quick Dimension Presets
                  </label>
                  <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {presets.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyPreset(p.w, p.h)}
                        className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-xs text-left text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <span>{p.label}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {p.w}x{p.h}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Do not enlarge */}
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-800">
                  <input
                    type="checkbox"
                    checked={settings.doNotEnlarge}
                    onChange={(e) => updateSetting('doNotEnlarge', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>Do not enlarge smaller images</span>
                </label>
              </div>
            </div>

            {/* Right Images */}
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
                Need to convert resized photos into a PDF?
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

      {/* SEO & Instructional Sections */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-12 max-w-4xl mx-auto">
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>How to Resize Images in 4 Simple Steps</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESIZE_HOW_TO.map((step, idx) => (
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
            <span>Frequently Asked Questions About Resizing</span>
          </h2>
          <div className="space-y-3">
            {RESIZE_FAQS.map((faq, idx) => (
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

        {/* Related Tools Navigation */}
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Related Tools
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
                Reduce file size of your resized photos by up to 80%.
              </p>
            </Link>

            <Link
              to="/passport-photo-creator"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Passport Photo Creator
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crop precisely to official 2x2 inch and 35x45mm biometric passport sizes.
              </p>
            </Link>

            <Link
              to="/guides/image-optimization-for-web-performance"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Web Performance Guide
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Learn how dimensional sizing directly impacts Google Core Web Vitals.
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
