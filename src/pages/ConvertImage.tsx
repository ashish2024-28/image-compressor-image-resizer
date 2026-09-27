import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { ImageDropzone } from '../components/upload/ImageDropzone';
import { ImageList } from '../components/upload/ImageList';
import { ImagePreviewModal } from '../components/image/ImagePreviewModal';
import { AdBanner, MultiplexAd } from '../components/ads';
import { useImageProcessor } from '../hooks/useImageProcessor';
import { useImageSettings } from '../hooks/useImageSettings';
import type { ImageItem, OutputFormat } from '../types';
import { isAvifSupported } from '../utils/fileUtils';
import {
  FileType,
  ShieldCheck,
  Check,
  Sliders,
  Maximize2,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const CONVERT_FAQS = [
  {
    question: 'How do I convert a PNG to WebP while keeping transparent backgrounds?',
    answer: 'Simply select WebP as your target output format and drop your PNG file. WebP natively supports 8-bit alpha transparency, so all transparent areas are preserved while file size is cut by up to 70%.',
  },
  {
    question: 'What happens to transparency when converting PNG to JPG?',
    answer: 'JPEG does not support alpha channel transparency. When converting a transparent PNG to JPG, transparent areas are automatically composited onto a clean white background canvas.',
  },
  {
    question: 'Why should I convert my JPG and PNG photos to WebP?',
    answer: 'WebP provides superior compression compared to JPEG and PNG. Google reports that WebP lossy images are 25-34% smaller than comparable JPEG images, and WebP lossless images are 26% smaller than PNGs, dramatically speeding up website loading times.',
  },
  {
    question: 'Is conversion done locally on my computer?',
    answer: 'Yes! 100% of format encoding is handled inside your browser via HTML5 Canvas. Your files never touch any external server or cloud storage.',
  },
];

const CONVERT_HOW_TO = [
  {
    name: 'Add Images',
    text: 'Drag and drop your photos into the converter dropzone.',
  },
  {
    name: 'Select Target Format',
    text: 'Choose WebP for modern web speed, JPG for universal photo compatibility, PNG for sharp graphics with transparency, or AVIF for next-gen compression.',
  },
  {
    name: 'Adjust Encoding Quality',
    text: 'Fine-tune the quality slider (80-85% recommended) or let default settings handle optimal compression.',
  },
  {
    name: 'Export Your Images',
    text: 'Download your newly converted images individually or batch-download all files packed in a single ZIP.',
  },
];

export const ConvertImage: React.FC = () => {
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
    setFormat,
    updateSetting,
    resetSettings,
  } = useImageSettings({
    format: 'image/webp',
    quality: 85,
  });

  const [previewItem, setPreviewItem] = useState<ImageItem | null>(null);
  const avifSupported = isAvifSupported();

  const formats: { id: OutputFormat; name: string; tag: string; desc: string; bestFor: string }[] = [
    {
      id: 'image/webp',
      name: 'WebP',
      tag: '.webp',
      desc: 'Modern web format offering high compression efficiency with alpha transparency support.',
      bestFor: 'Websites, blogs, online stores, modern digital apps',
    },
    {
      id: 'image/jpeg',
      name: 'JPG / JPEG',
      tag: '.jpg',
      desc: 'The ubiquitous photographic format. Compresses color-rich real-world photography cleanly without alpha transparency.',
      bestFor: 'Photographs, camera captures, print previews, email attachments',
    },
    {
      id: 'image/png',
      name: 'PNG',
      tag: '.png',
      desc: 'Lossless raster graphic format supporting full 8-bit alpha transparency. Keeps text and line edges pin-sharp.',
      bestFor: 'Logos, icons, screenshots, diagrams, UI design mockups',
    },
    ...(avifSupported
      ? [
          {
            id: 'image/avif' as OutputFormat,
            name: 'AVIF',
            tag: '.avif',
            desc: 'Next-generation AV1-based image format delivering the highest compression ratios currently available.',
            bestFor: 'High-detail photographs on cutting-edge modern browsers',
          },
        ]
      : []),
  ];

  return (
    <PageContainer
      title="Convert Image Format Online – WebP, JPG, PNG & AVIF"
      description="Convert images between WebP, PNG, JPG, and AVIF directly in your browser. Fast, private batch image conversion with zero server uploads."
      breadcrumbs={[{ name: 'Convert Image', url: '/convert' }]}
      faqs={CONVERT_FAQS}
      howToSteps={CONVERT_HOW_TO}
      schemaType="WebApplication"
    >
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Local Browser Conversion · Zero Server Uploads</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Convert Image Formats
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Convert between WebP, JPG, PNG, and AVIF instantly with complete control over compression quality.
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

      {/* Main Converter Area */}
      <div className="mb-12">
        {images.length === 0 ? (
          <ImageDropzone onFilesSelected={addFiles} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Format Selection Column */}
            <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-4">
              <div className="pro-card rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileType className="w-4 h-4 text-blue-600" />
                    Target Output Format
                  </h2>
                  <button
                    type="button"
                    onClick={resetSettings}
                    className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-2">
                  {formats.map((fmt) => {
                    const isSelected = settings.format === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setFormat(fmt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                            : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-[#111827]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {fmt.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {fmt.tag}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1.5">
                          {fmt.desc}
                        </p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                          Best for: {fmt.bestFor}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {settings.format !== 'image/png' && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Output Quality
                      </span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {settings.quality}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      step={5}
                      value={settings.quality}
                      onChange={(e) => updateSetting('quality', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Images Column */}
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

      <AdBanner format="horizontal" />

      {/* Instructional & FAQ Sections */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-12 max-w-4xl mx-auto">
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>How to Convert Image Formats in 4 Simple Steps</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONVERT_HOW_TO.map((step, idx) => (
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
            <span>Frequently Asked Questions About Conversion</span>
          </h2>
          <div className="space-y-3">
            {CONVERT_FAQS.map((faq, idx) => (
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

        {/* AdSense Multiplex Recommendations Slot */}
        <MultiplexAd slotLabel="Sponsored & Recommended" />

        {/* Related Tools Internal Linking */}
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Related Tools & Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/compress"
              className="pro-card rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Compress Image
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shrink file weight while maintaining maximum visual quality.
              </p>
            </Link>

            <Link
              to="/resize"
              className="pro-card rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Maximize2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Resize Image
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scale dimensions to exact pixels with aspect ratio preservation.
              </p>
            </Link>

            <Link
              to="/guides/webp-vs-jpeg-vs-png-format-guide"
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Format Guide
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deep comparison of compression ratios and decoding benchmarks.
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
