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
  ExternalLink,
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

const QUICK_ACTIONS = [
  {
    title: 'Compress',
    description: 'Shrink JPG, PNG, WebP and AVIF files to meet size limits quickly.',
    href: '/compress',
    icon: Sliders,
    tone: 'blue',
  },
  {
    title: 'Resize',
    description: 'Set exact dimensions while preserving aspect ratio for web or print.',
    href: '/resize',
    icon: Maximize2,
    tone: 'emerald',
  },
  {
    title: 'Convert',
    description: 'Switch between JPG, PNG, WebP and AVIF formats without leaving the browser.',
    href: '/convert',
    icon: FileType,
    tone: 'purple',
  },
  {
    title: 'PDF Studio',
    description: 'Merge, split, compress, rotate and watermark PDFs in one place.',
    href: '/pdf-studio',
    icon: Layers,
    tone: 'amber',
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
      <section className="text-center py-8 sm:py-16 max-w-4xl mx-auto space-y-5 px-2">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">
            Ashish Systems
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            100% In-Browser Privacy
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>Zero Server Uploads</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
          Image Compressor &amp; Image Resizer
        </h1>

        <p className="text-sm sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compress, resize, and convert JPG, PNG, WebP, and AVIF images directly in your browser. Fast, 100% private, and losslessly optimized with zero server uploads.
        </p>

        {images.length === 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 w-full max-w-xs sm:max-w-none mx-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
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
              className="w-full sm:w-auto"
              isLoading={isSampleLoading}
              onClick={handleTrySample}
              leftIcon={<Sparkles className="w-5 h-5 text-amber-500" />}
            >
              Try Sample
            </Button>
          </div>
        )}
      </section>

      <section className="mb-8 sm:mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(({ title, description, href, icon: Icon, tone }) => (
            <Link
              key={title}
              to={href}
              className="group rounded-2xl border border-slate-200/90 bg-white/80 p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-[#111827]/90 dark:hover:border-slate-700"
            >
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl border ${
                tone === 'blue'
                  ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/80 dark:text-blue-400 dark:border-blue-900'
                  : tone === 'emerald'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-900'
                    : tone === 'purple'
                      ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/80 dark:text-purple-400 dark:border-purple-900'
                      : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-900'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
            </Link>
          ))}
        </div>
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

      {/* Client-Side Architecture & Privacy Highlight */}
      <section className="py-8 max-w-4xl mx-auto px-2">
        <div className="pro-card rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Local In-Browser Processing
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Client-Side Privacy &amp; Performance
              </h3>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors self-start sm:self-auto shrink-0"
            >
              <span>Learn About Privacy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Image Compressor &amp; Resizer executes entirely inside your device browser using native HTML5 Canvas and ImageBitmap APIs. Photos and files are processed strictly in local RAM memory without any server uploads, guaranteeing complete confidentiality and zero data leakage.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">100% In-Browser</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Canvas encoding executes locally in your device RAM.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Memory-Safe Queue</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Sequential batch processing protects mobile and desktop devices.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Metadata Scrubbing</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Camera EXIF GPS and device identifiers are stripped automatically.</span>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Multiplex / Autorelaxed Recommendations */}
      <MultiplexAd slotLabel="Sponsored & Recommended" />

      {/* Popular Searches & Hinglish/English Intent Hub */}
      <section className="py-10 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold text-amber-500 uppercase tracking-wider block">
              Quick Solutions &bull; All Languages &bull; Hinglish &amp; English
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Photo Ka Size Kam Kaise Kare? (Quick Help Hub)
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            100% Free &bull; No Uploads
          </span>
        </div>

        {/* 1-Tap Solution Cards for Common Searches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link
            to="/compress-image-to-100kb"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-amber-500 dark:hover:border-amber-500 transition-all shadow-xs group"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Govt Form 100KB
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 group-hover:text-amber-500 transition-colors">
              Photo ko 100KB me kaise convert kare?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              UPSC, SSC, Admit Card aur Exam portals ke liye photo ko 100KB ke andar laane ka direct tool.
            </p>
          </Link>

          <Link
            to="/compress-image-to-200kb"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-xs group"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Portal Limit 200KB
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 group-hover:text-emerald-500 transition-colors">
              Photo ka size 200KB me kaise banaye?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visa, Passport Portal aur Job applications ke liye bina quality kharab kiye 200KB limit fix kare.
            </p>
          </Link>

          <Link
            to="/passport-photo-creator"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-xs group"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Passport Maker
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 group-hover:text-blue-500 transition-colors">
              Mobile se Passport photo kaise banaye?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Biometric 2x2 inch ya 3.5x4.5 cm crop kare, white background dale aur printable 6-pack sheet paye.
            </p>
          </Link>

          <Link
            to="/reduce-image-size"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-purple-500 dark:hover:border-purple-500 transition-all shadow-xs group"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              MB to KB Reducer
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 group-hover:text-purple-500 transition-colors">
              Photo ka MB kaise kam kare?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              10MB ya 5MB ki heavy camera photo ko 80% shrink kare WhatsApp aur Email sharing ke liye.
            </p>
          </Link>

          <Link
            to="/resize-image"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-teal-500 dark:hover:border-teal-500 transition-all shadow-xs group"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Signature &amp; Dimensions
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 group-hover:text-teal-500 transition-colors">
              Signature ka size kaise chhota kare?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Online forms ke required pixels (e.g. 200x230 px) me signature aur photo resize kare.
            </p>
          </Link>

          <Link
            to="/image-to-pdf"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-rose-500 dark:hover:border-rose-500 transition-all shadow-xs group"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Photo to PDF Maker
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 group-hover:text-rose-500 transition-colors">
              Photo se PDF kaise banaye?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              JPG aur PNG photos ko A4 size high-quality PDF me convert kare bina watermark.
            </p>
          </Link>

          <Link
            to="/merge-images-to-pdf"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-xs group"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Multiple Photos Merge
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 group-hover:text-indigo-500 transition-colors">
              Multiple photos ko 1 PDF me kaise jode?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Marksheet, certificates aur IDs ko ek hi multi-page PDF me combine &amp; merge kare.
            </p>
          </Link>

          <Link
            to="/jpg-to-webp"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-sky-500 dark:hover:border-sky-500 transition-all shadow-xs group"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              JPG &rarr; WebP
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 group-hover:text-sky-500 transition-colors">
              JPG se WebP me kaise badle?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Website speed badhane ke liye Google WebP format me convert kare, 30% chhota file size.
            </p>
          </Link>
        </div>

        {/* DocuLite Advanced PDF Suite Direct Connect Card */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 via-blue-950/10 to-indigo-900/20 dark:from-[#0d1527] dark:to-[#0f172a] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                  Need Advanced PDF Operations?
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  DocuLite Suite
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
                Merge multiple PDFs, compress below 100KB/200KB, split documents, and extract high-res images in our dedicated sister platform with zero server uploads.
              </p>
            </div>
          </div>
          <a
            href="https://pdf-tools-ten-eta.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer group"
          >
            <span>Open DocuLite PDF Tools</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Crawlable Popular Searches & Keyword Directory */}
        <div className="pt-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Popular Searches &amp; Keyword Directory (English &bull; Español &bull; हिंदी &bull; Hinglish)</span>
          </div>
          <nav aria-label="Popular searches" className="flex flex-wrap gap-1.5 text-[11px]">
            {[
              { term: 'PDF a imagen', path: '/pdf-to-images' },
              { term: 'combinar PDF', path: '/merge-pdf' },
              { term: 'comprimir imagen online', path: '/compress' },
              { term: 'reducir tamaño de foto', path: '/reduce-image-size' },
              { term: 'foto a PDF', path: '/photo-to-pdf' },
              { term: 'unir imágenes en PDF', path: '/merge-images-to-pdf' },
              { term: 'फोटो से पीडीएफ कैसे बनाएं', path: '/guides/photo-se-pdf-kaise-banaye-pdf-compress-merge-guide' },
              { term: 'फोटो का साइज कैसे कम करें', path: '/compress-image-to-100kb' },
              { term: 'पीडीएफ टू फोटो कैसे बनाएं', path: '/pdf-to-images' },
              { term: 'फोटो मर्ज करें', path: '/merge-images-to-pdf' },
              { term: 'PDF to photo kaise banaye', path: '/pdf-to-images' },
              { term: 'photo se pdf kaise banaye', path: '/image-to-pdf' },
              { term: 'photo ka size kaise kam kare', path: '/compress' },
              { term: 'image to pdf converter online', path: '/image-to-pdf' },
              { term: 'multiple photos merge into one pdf', path: '/merge-images-to-pdf' },
              { term: 'photo combine karke pdf banaye', path: '/image-to-pdf' },
              { term: 'image compress kaise kare', path: '/compress' },
              { term: 'photo size kam karne wala app', path: '/compress-image-to-100kb' },
              { term: 'compress image to 100kb', path: '/compress-image-to-100kb' },
              { term: 'compress photo to 200kb', path: '/compress-image-to-200kb' },
              { term: 'reduce image size in kb', path: '/reduce-image-size' },
              { term: 'photo resize online free', path: '/resize' },
              { term: 'photo ko pdf me kaise convert kare', path: '/image-to-pdf' },
              { term: 'jpg to pdf converter without watermark', path: '/image-to-pdf' },
              { term: 'sarkari form photo resizer', path: '/passport-photo-creator' },
              { term: 'passport size photo mobile se kaise banaye', path: '/passport-photo-creator' },
              { term: 'signature resize for admit card', path: '/resize' },
              { term: 'photo ka mb kaise kam kare', path: '/compress' },
              { term: 'pdf merge photo combine', path: '/merge-pdf' },
              { term: 'jpg se webp converter online', path: '/jpg-to-webp' },
              { term: 'bina quality kharab kiye photo compress kare', path: '/guides/how-to-compress-image-without-losing-quality' },
              { term: 'bulk image compressor zip download', path: '/compress' },
              { term: 'pan card photo signature size maker', path: '/passport-photo-creator' },
              { term: 'how to convert pdf to jpg in high resolution', path: '/pdf-to-images' },
              { term: 'combine multiple pdf files into one document', path: '/merge-pdf' },
              { term: 'reduce pdf file size below 100kb', path: '/compress-pdf' },
              { term: 'split and extract pdf pages online', path: '/split-pdf' },
              { term: 'rotate and watermark pdf', path: '/pdf-rotate-watermark' },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                #{item.term}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-12 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions (English &amp; Hinglish)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Common questions regarding privacy, image processing limits, format compatibility, and government portal guidelines.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              question: 'Photo ka size MB se KB me kaise kam kare (How to reduce photo size)?',
              answer: 'Apni photo upload kare, slider se quality 70% ya 80% select kare, ya \'Target Size\' me 100KB / 200KB enter kare. Hamara tool seconds me photo ka file size 80% tak kam kar deta hai bina photo dhundhli (blur) kiye. Phir 1-click me download kare.',
            },
            {
              question: 'Sarkari exams / online forms (UPSC, SSC, Railway) ke liye photo kaise banaye?',
              answer: 'Sarkari portal hamesha 50KB–100KB photo aur 10KB–20KB signature mangte hain. Aap hamare "/compress-image-to-100kb" tool se photo aur "/resize-image" se signature ki exact pixel dimensions aur file size set kar sakte hain.',
            },
            {
              question: 'How does Image Optimizer protect my privacy?',
              answer: 'Every operation—compression, resizing, biometric passport cropping, and format conversion—is executed 100% inside your web browser via HTML5 Canvas. Your image files never leave your device and are never transmitted to external cloud servers.',
            },
            {
              question: 'How much file size reduction can I expect?',
              answer: 'Typical photo compression achieves 60% to 80% reduction without noticeable loss of visual sharpness. Converting uncompressed camera photos or PNGs to modern WebP format often saves an additional 25% to 35%.',
            },
            {
              question: 'Can I set an exact target file size (e.g., under 100 KB or 200 KB)?',
              answer: 'Yes! Image Optimizer features a dedicated Target File Size constraint. When enabled, our algorithm automatically iterates the quality curve to guarantee the exported file strictly meets government portal or email upload limits.',
            },
            {
              question: 'Kya photo ko combine / merge karke ek sath download kar sakte hain?',
              answer: 'Haan! Multiple photos ko ek sath drag & drop kare. Batch mode sabhi photos ko locally process karke 1-click me ek compact ZIP file me download karne ki suvidha deta hai.',
            },
          ].map((faq, idx) => (
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
