import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sliders,
  Maximize2,
  FileType,
  Layers,
  SplitSquareVertical,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { ImageDropzone } from '../components/upload/ImageDropzone';
import { ImageList } from '../components/upload/ImageList';
import { CompressionTool } from '../features/compression/CompressionTool';
import { ImagePreviewModal } from '../components/image/ImagePreviewModal';
import { AdBanner, MultiplexAd } from '../components/ads';
import { useImageProcessor } from '../hooks/useImageProcessor';
import { useImageSettings } from '../hooks/useImageSettings';
import { createSampleImage } from '../utils/sampleImages';
import type { ImageItem } from '../types';

const HOME_FAQS = [
  {
    question: 'How does Image Optimizer protect my privacy?',
    answer: 'Every operation—compression, resizing, biometric passport cropping, and format conversion—is executed 100% inside your web browser via HTML5 Canvas. Your image files never leave your device and are never transmitted to external cloud servers.',
  },
  {
    question: 'How much file size reduction can I expect?',
    answer: 'Typical photo compression achieves 60% to 80% reduction without noticeable loss of visual sharpness. Converting uncompressed camera photos or PNGs to modern WebP format often saves an additional 25% to 35%.',
  },
  {
    question: 'Can I set an exact target file size (e.g., under 200 KB)?',
    answer: 'Yes! Image Optimizer features a dedicated Target File Size constraint. When enabled, our algorithm automatically iterates the quality curve to guarantee the exported file strictly meets government portal or email upload limits.',
  },
  {
    question: 'Does this tool support batch compression?',
    answer: 'Yes! You can drop multiple images simultaneously, apply unified settings, process all files with one click, and download the entire set in a neat ZIP archive.',
  },
];

const HOME_HOW_TO = [
  {
    name: 'Add Images or Try Sample',
    text: 'Drag and drop your images into the dropzone or click Try Sample Photo to preview the workflow instantly.',
  },
  {
    name: 'Choose Optimization Mode',
    text: 'Select your preferred quality preset, specify target dimensions, or choose a specialized preset like Website Speed or Passport Photo.',
  },
  {
    name: 'Real-Time In-Browser Processing',
    text: 'Your browser computes optimal quantization and encodes the pixels locally in milliseconds.',
  },
  {
    name: 'Compare Fidelity & Download',
    text: 'Inspect original vs compressed image quality with the side-by-side comparison slider and download single files or a ZIP archive.',
  },
];

export const Home: React.FC = () => {
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
  } = useImageSettings();

  const [previewItem, setPreviewItem] = useState<ImageItem | null>(null);
  const [isSampleLoading, setIsSampleLoading] = useState(false);

  const handleFiles = (files: File[]) => {
    addFiles(files);
  };

  const handleTrySample = async () => {
    setIsSampleLoading(true);
    try {
      const sample = await createSampleImage('landscape');
      await addFiles([sample]);
    } finally {
      setIsSampleLoading(false);
    }
  };

  const activeImage = images.find((i) => i.id === activeImageId);

  return (
    <PageContainer
      title="Compress Images Without Losing More Quality Than Necessary"
      description="Reduce image file size, resize images and convert formats directly in your browser. 100% private, free, and fast."
      faqs={HOME_FAQS}
      howToSteps={HOME_HOW_TO}
      schemaType="WebApplication"
    >
      {/* Hero Section */}
      <section className="text-center py-10 sm:py-16 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <span className="font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
            ASHISH SYSTEMSX
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>100% In-Browser Privacy</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden sm:inline text-[11px] text-slate-500 dark:text-slate-400 font-normal">
            Explore. Build. Experiment.
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          Compress Images Without Losing More Quality Than Necessary
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Reduce image file size, resize images, and convert formats directly in your browser with zero server uploads.
        </p>

        {images.length === 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('uploader-area');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Upload Images
            </Button>
            <Button
              variant="outline"
              size="lg"
              isLoading={isSampleLoading}
              onClick={handleTrySample}
              leftIcon={<Sparkles className="w-5 h-5 text-amber-500" />}
            >
              Try Sample
            </Button>
          </div>
        )}
      </section>

      {/* Interactive Optimization Workspace */}
      <section id="uploader-area" className="mb-12">
        {validationWarnings.length > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex justify-between items-center font-bold">
              <span>Notice</span>
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

        {images.length === 0 ? (
          <ImageDropzone onFilesSelected={handleFiles} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Settings panel in sidebar */}
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

              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Batch Tip
                </span>
                Clicking &quot;Optimize All&quot; applies these settings to all uploaded images sequentially without clogging memory.
              </div>
            </div>

            {/* Image list & processing */}
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

              {/* Quick Add More Zone */}
              <div className="pt-2">
                <ImageDropzone onFilesSelected={handleFiles} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Non-obtrusive Google AdSense Placeholder Slot */}
      <AdBanner format="horizontal" />

      {/* Feature Cards Grid (Requested by prompt) */}
      <section className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Comprehensive In-Browser Optimization
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Professional tools designed for developers, designers, content creators, and photographers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-900 flex items-center justify-center mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Compress Images</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Reduce file size with adjustable quality presets or fine-grained sliders. Achieve up to 80% file reduction while maintaining high visual clarity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-900 flex items-center justify-center mb-4">
              <Maximize2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Resize Images</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Change width and height while maintaining aspect ratio. Support for Fit, Fill, and Stretch modes with safeguards against accidental distortion.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200/70 dark:border-purple-900 flex items-center justify-center mb-4">
              <FileType className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Convert Format</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert seamlessly between JPG, PNG, and WebP (plus AVIF where browser engine allows) to maximize speed and compatibility across modern devices.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/70 dark:border-amber-900 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Batch Processing</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Optimize dozens of images at once with controlled concurrency, real-time progress indicators, and instant ZIP bundle download.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900 flex items-center justify-center mb-4">
              <SplitSquareVertical className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Compare Results</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Interactive before/after split slider lets you inspect pixel fidelity, compression artifacts, and exact byte savings before downloading.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200/70 dark:border-teal-900 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">100% Privacy</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your images never leave your computer. Processing uses client-side HTML5 Canvas and browser APIs. No cloud storage, no surveillance, no server logs.
            </p>
          </div>
        </div>
      </section>

      {/* Educational & SEO Content */}
      <section className="py-12 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            How Client-Side Image Optimization Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Image Optimizer leverages high-performance browser APIs including HTML5 Canvas 2D, ImageBitmap decoders, and Blob generation. When you select an image, your browser decodes the file in memory, applies resizing transformations using bicubic interpolation, and encodes the resulting pixels with optimized quantization matrices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">JPEG Optimization</h4>
            <p className="text-slate-600 dark:text-slate-400">
              Ideal for photographic content containing rich gradients and real-world scenes. Uses discrete cosine transforms to reduce high-frequency chrominance data.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">WebP Encoding</h4>
            <p className="text-slate-600 dark:text-slate-400">
              Modern web format providing superior lossy and lossless compression for web graphics, often 25–35% smaller than comparable JPEGs.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">PNG Transparency</h4>
            <p className="text-slate-600 dark:text-slate-400">
              Best for screenshots, line art, icons, and graphics requiring alpha channel transparency. Preserves razor-sharp borders without artifacts.
            </p>
          </div>
        </div>
      </section>

      {/* Guides & Educational Knowledge Base */}
      <section className="py-12 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Optimization Guides & Tutorials
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Engineering insights on codecs, Google Core Web Vitals, and government biometric photo standards.
            </p>
          </div>
          <Link
            to="/guides"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>All Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/guides/how-to-compress-image-without-losing-quality"
            className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
          >
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              Compression Guide
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              How to Compress Images Without Losing Visual Quality
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Learn how quantization tables and chroma subsampling eliminate redundant data while keeping details sharp.
            </p>
          </Link>

          <Link
            to="/guides/image-optimization-for-web-performance"
            className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
          >
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              Web Performance
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Image Optimization for Google Core Web Vitals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Fix Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) with modern responsive images.
            </p>
          </Link>
        </div>
      </section>

      {/* ASHISH SYSTEMSX Brand Exploration Callout */}
      <section className="py-8 max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border border-blue-900/40 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">
                ASHISH SYSTEMSX
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Explore. Build. Experiment.
              </h3>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors self-start sm:self-auto"
            >
              <span>Learn Brand Philosophy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            &ldquo;A personal engineering space where Ashish explores, builds, and experiments with software systems.&rdquo;
            Image Optimizer is built to deliver fast, deterministic, 100% private file transformations with zero server latency.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-3 text-[11px] text-slate-300 font-medium">
            <span className="px-2.5 py-1 rounded bg-white/10 border border-white/15">Ashish (Identity)</span>
            <span className="px-2.5 py-1 rounded bg-white/10 border border-white/15">Systems (Software)</span>
            <span className="px-2.5 py-1 rounded bg-white/10 border border-white/15">X (eXplore & Experiment)</span>
          </div>
        </div>
      </section>

      {/* AdSense Multiplex / Autorelaxed Recommendations */}
      <MultiplexAd slotLabel="Sponsored & Recommended" />

      {/* Frequently Asked Questions */}
      <section className="py-12 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Common questions regarding privacy, image processing limits, and format compatibility.
          </p>
        </div>

        <div className="space-y-3">
          {HOME_FAQS.map((faq, idx) => (
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

      {/* Comparison Modal */}
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
