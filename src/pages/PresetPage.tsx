import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ImageDropzone } from '../components/upload/ImageDropzone';
import { ImageList } from '../components/upload/ImageList';
import { CompressionTool } from '../features/compression/CompressionTool';
import { ImagePreviewModal } from '../components/image/ImagePreviewModal';
import { AdBanner } from '../components/ads/AdBanner';
import { useImageProcessor } from '../hooks/useImageProcessor';
import { useImageSettings } from '../hooks/useImageSettings';
import type { ImageItem, ImageSettings } from '../types';
import { Sparkles } from 'lucide-react';

export interface PresetConfig {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  defaultSettings: Partial<ImageSettings>;
  tips: string[];
}

export const PRESET_CONFIGS: Record<string, PresetConfig> = {
  'compress-image-for-website': {
    slug: 'compress-image-for-website',
    title: 'Compress Images for Websites & Blogs',
    subtitle: 'Optimize page speed, improve SEO rankings, and pass Google Core Web Vitals',
    badge: 'Website Speed Preset',
    description: 'Compresses photos to WebP format at 80% quality with a maximum width of 1920px. Ensures ultra-fast loading across desktop and mobile browsers.',
    defaultSettings: {
      format: 'image/webp',
      quality: 80,
      qualityPreset: 'medium',
      maxDimensionsEnabled: true,
      maxWidth: 1920,
      maxHeight: 1080,
      doNotEnlarge: true,
    },
    tips: [
      'Serving WebP instead of raw JPG cuts page weight by 30% on average.',
      'Google Lighthouse penalizes images larger than necessary for their display container.',
      'Maximum width of 1920px covers 98% of modern desktop monitors cleanly.',
    ],
  },
  'compress-image-for-email': {
    slug: 'compress-image-for-email',
    title: 'Compress Images for Email & Newsletters',
    subtitle: 'Avoid inbox clipping, slow send times, and spam filter triggers',
    badge: 'Email Deliverability Preset',
    description: 'Compresses images to JPEG format with 75% quality and limits width to 1024px so emails load instantly and stay under strict ISP attachment limits.',
    defaultSettings: {
      format: 'image/jpeg',
      quality: 75,
      qualityPreset: 'medium',
      maxDimensionsEnabled: true,
      maxWidth: 1024,
      maxHeight: 1024,
      doNotEnlarge: true,
    },
    tips: [
      'Most email templates have a content width between 600px and 680px.',
      'Gmail clips emails larger than 102KB total HTML size; keeping images lightweight is essential.',
      'JPEG is universally supported across Outlook, Gmail, Apple Mail, and Yahoo.',
    ],
  },
  'compress-image-for-whatsapp': {
    slug: 'compress-image-for-whatsapp',
    title: 'Compress Images for WhatsApp & Messaging',
    subtitle: 'Send pictures quickly on mobile data without WhatsApp compressing them into mush',
    badge: 'Mobile Messaging Preset',
    description: 'Pre-optimizes images to high-efficiency JPEG under 1280px. By sending an already balanced image, you retain clarity while using very little mobile bandwidth.',
    defaultSettings: {
      format: 'image/jpeg',
      quality: 80,
      qualityPreset: 'medium',
      maxDimensionsEnabled: true,
      maxWidth: 1280,
      maxHeight: 1280,
      doNotEnlarge: true,
    },
    tips: [
      'Sending images under 1MB uploads 5x faster over fluctuating 4G/5G mobile connections.',
      'Pre-sizing prevents WhatsApp from applying harsh automatic blurring artifacts.',
    ],
  },
  'compress-image-for-resume': {
    slug: 'compress-image-for-resume',
    title: 'Compress Photos for Resumes & Job Applications',
    subtitle: 'Meet job portal upload limits (e.g. 500KB or 1MB) without pixelated headshots',
    badge: 'Career & Documents Preset',
    description: 'Optimizes profile photos and document attachments to clean JPEG format at 800px maximum dimension, perfectly suited for Applicant Tracking Systems (ATS).',
    defaultSettings: {
      format: 'image/jpeg',
      quality: 85,
      qualityPreset: 'high',
      maxDimensionsEnabled: true,
      maxWidth: 800,
      maxHeight: 800,
      doNotEnlarge: true,
    },
    tips: [
      'Most corporate application portals enforce strict file size caps between 500KB and 2MB.',
      'An 800px portrait headshot looks crisp when printed or viewed on high-DPI screens.',
    ],
  },
  'compress-image-for-instagram': {
    slug: 'compress-image-for-instagram',
    title: 'Optimize & Resize Images for Instagram',
    subtitle: 'Prepare square and portrait posts that retain crispness after upload',
    badge: 'Social Media Preset',
    description: 'Sets standard 1080px width with 85% high-grade JPEG compression to prevent Instagram’s aggressive compression algorithm from ruining fine details.',
    defaultSettings: {
      format: 'image/jpeg',
      quality: 85,
      qualityPreset: 'high',
      resizeEnabled: true,
      maintainAspectRatio: true,
      width: 1080,
      resizeMode: 'fit',
    },
    tips: [
      'Instagram displays feed photos at a maximum width of 1080px.',
      'Uploading photos with resolutions higher than 1080px triggers Instagram’s server downsampler, causing blur.',
    ],
  },
  'social-media-image-resizer': {
    slug: 'social-media-image-resizer',
    title: 'Social Media Image Resizer & Optimizer',
    subtitle: 'Format banner graphics, profile pictures, and posts for all networks',
    badge: 'Multi-Platform Social Preset',
    description: 'Easily resize images for Instagram (1080x1080), Facebook, X/Twitter headers (1500x500), and YouTube thumbnails (1280x720).',
    defaultSettings: {
      format: 'image/jpeg',
      quality: 85,
      resizeEnabled: true,
      maintainAspectRatio: true,
      width: 1200,
      height: 630,
      resizeMode: 'fit',
    },
    tips: [
      '1200 × 630px is the standard OpenGraph share card size for Twitter/X, LinkedIn, and Facebook.',
      'Fit mode ensures nothing gets chopped off when sharing across varied feed layouts.',
    ],
  },
  'compress-jpg': {
    slug: 'compress-jpg',
    title: 'Free JPG / JPEG Compressor Online',
    subtitle: 'Compress JPG images directly in your browser with zero quality degradation',
    badge: 'JPG Optimization',
    description: 'High-performance client-side JPEG compressor. Fine-tune quantization tables, reduce file size by up to 80%, and retain camera EXIF or remove it for maximum privacy.',
    defaultSettings: {
      format: 'image/jpeg',
      quality: 80,
      qualityPreset: 'medium',
      stripMetadata: true,
    },
    tips: [
      'JPEG uses lossy discrete cosine transform compression, ideal for photographs with complex gradients.',
      'Stripping redundant EXIF metadata saves an extra 10KB–60KB per image.',
      '80% quality delivers virtually indiscernible visual difference from 100% original.',
    ],
  },
  'compress-png': {
    slug: 'compress-png',
    title: 'Free PNG Compressor Online',
    subtitle: 'Reduce PNG file weight while preserving transparent backgrounds and sharp vectors',
    badge: 'Lossless PNG Optimizer',
    description: 'Lossless & high-efficiency PNG compression. Keep clean transparent alpha channels intact while reducing bulky graphics, logos, and UI screenshot file sizes.',
    defaultSettings: {
      format: 'image/png',
      quality: 90,
      qualityPreset: 'high',
    },
    tips: [
      'PNG is best suited for illustrations, line art, icons, and graphics requiring transparent backgrounds.',
      'Browser canvas quantizes transparent colors to optimize deflate compression without jagged borders.',
    ],
  },
  'compress-webp': {
    slug: 'compress-webp',
    title: 'Free WebP Compressor Online',
    subtitle: 'Next-gen Google WebP compression for lightning-fast page loading and top Core Web Vitals',
    badge: 'Next-Gen Format',
    description: 'Compress modern WebP images with superior VP8 predictive coding. WebP files are on average 26% smaller than PNGs and 25-34% smaller than comparable JPEGs.',
    defaultSettings: {
      format: 'image/webp',
      quality: 80,
      qualityPreset: 'medium',
    },
    tips: [
      'WebP is natively supported in 97%+ of all browsers worldwide.',
      'WebP supports both lossy photo compression and transparent alpha channels simultaneously.',
    ],
  },
  'compress-image-to-100kb': {
    slug: 'compress-image-to-100kb',
    title: 'Compress Image to 100KB Online',
    subtitle: 'Target strict 100KB limits for government forms, admissions, exam portals, and job applications',
    badge: 'Target 100KB Tool',
    description: 'Automatically tunes compression quality and downscales large camera dimensions to ensure your output photo stays under the strict 100 Kilobyte upload ceiling.',
    defaultSettings: {
      format: 'image/jpeg',
      quality: 68,
      qualityPreset: 'medium',
      maxDimensionsEnabled: true,
      maxWidth: 1024,
      maxHeight: 1024,
      targetSizeEnabled: true,
      targetSizeKB: 100,
      stripMetadata: true,
    },
    tips: [
      'Government and exam portals commonly enforce a rigid 100KB file ceiling.',
      'Limiting maximum dimension to 1024px guarantees photos compress under 100KB while looking crisp.',
      'Check the live file size indicator on the card before downloading.',
    ],
  },
  'compress-image-to-200kb': {
    slug: 'compress-image-to-200kb',
    title: 'Compress Image to 200KB Online',
    subtitle: 'Reduce photos and documents under 200KB without blurry artifacts or pixelation',
    badge: 'Target 200KB Tool',
    description: 'Perfect for passport portals, visa submissions, and enterprise HR systems that require documents and photos strictly under 200 Kilobytes.',
    defaultSettings: {
      format: 'image/jpeg',
      quality: 78,
      qualityPreset: 'medium',
      maxDimensionsEnabled: true,
      maxWidth: 1400,
      maxHeight: 1400,
      targetSizeEnabled: true,
      targetSizeKB: 200,
      stripMetadata: true,
    },
    tips: [
      '200KB provides enough data headroom for high-clarity facial features on biometric ID photos.',
      'High JPEG compression with 1400px bounding box reliably satisfies 200KB caps.',
    ],
  },
  'reduce-image-size': {
    slug: 'reduce-image-size',
    title: 'Reduce Image File Size Online',
    subtitle: 'Fast, secure in-browser image size reducer with zero quality loss',
    badge: 'Size Reducer',
    description: 'Smart multi-parameter size reducer. Combine intelligent resolution scaling, format conversion, and quantization to reduce image MBs down to KBs effortlessly.',
    defaultSettings: {
      format: 'image/webp',
      quality: 78,
      qualityPreset: 'medium',
      maxDimensionsEnabled: true,
      maxWidth: 1920,
      maxHeight: 1920,
      doNotEnlarge: true,
    },
    tips: [
      'Combine dimension reduction with WebP conversion to achieve up to 90% reduction.',
      'Drag and drop multiple images to batch reduce entire folders at once.',
    ],
  },
  'resize-jpg': {
    slug: 'resize-jpg',
    title: 'Resize JPG Online – Change JPEG Dimensions',
    subtitle: 'Scale JPEG image width and height by exact pixels or percentage',
    badge: 'JPG Resizer',
    description: 'Resize JPEG pictures in high definition with bicubic interpolation. Maintain aspect ratio or specify custom dimensions with live preview.',
    defaultSettings: {
      format: 'image/jpeg',
      quality: 88,
      resizeEnabled: true,
      maintainAspectRatio: true,
      width: 1200,
    },
    tips: [
      'Locking aspect ratio prevents photos from becoming horizontally or vertically stretched.',
      'Bicubic pixel interpolation prevents aliasing and jagged edges.',
    ],
  },
  'resize-png': {
    slug: 'resize-png',
    title: 'Resize PNG Online – Scale PNG Dimensions',
    subtitle: 'Resize PNG images while preserving pixel-perfect transparency and sharp edges',
    badge: 'PNG Resizer',
    description: 'Scale PNG graphics, transparent logos, stickers, and icons without losing alpha clarity or introducing halos.',
    defaultSettings: {
      format: 'image/png',
      quality: 90,
      resizeEnabled: true,
      maintainAspectRatio: true,
      width: 800,
    },
    tips: [
      'PNG resizing retains full 8-bit alpha transparency with zero artifacting.',
      'Great for preparing logo variants for website navigation headers and favicons.',
    ],
  },
  'resize-webp': {
    slug: 'resize-webp',
    title: 'Resize WebP Online',
    subtitle: 'Quickly scale modern WebP images to exact resolution',
    badge: 'WebP Resizer',
    description: 'Change WebP image dimensions directly in your browser. Fast, private, and zero server wait times.',
    defaultSettings: {
      format: 'image/webp',
      quality: 82,
      resizeEnabled: true,
      maintainAspectRatio: true,
      width: 1200,
    },
    tips: [
      'WebP images resize faster in browser canvas than legacy formats.',
      'Ideal for responsive `srcset` generation.',
    ],
  },
  'jpg-to-webp': {
    slug: 'jpg-to-webp',
    title: 'Convert JPG to WebP Online',
    subtitle: 'Modernize JPG photos into ultra-compact Google WebP format for 30% smaller files',
    badge: 'JPG → WebP Converter',
    description: 'Convert standard JPG photos to high-performance WebP. Accelerate your website load speeds and save cloud storage with modern next-gen encoding.',
    defaultSettings: {
      format: 'image/webp',
      quality: 82,
      qualityPreset: 'medium',
      stripMetadata: true,
    },
    tips: [
      'WebP provides lossy compression that averages 25%–34% smaller than JPEG at equivalent SSIM quality.',
      'Google search rankings reward websites that deliver WebP images to users.',
    ],
  },
  'png-to-webp': {
    slug: 'png-to-webp',
    title: 'Convert PNG to WebP Online',
    subtitle: 'Transform bulky PNG files into lightweight WebP with 100% transparency preservation',
    badge: 'PNG → WebP Converter',
    description: 'Convert PNG graphics and screenshots to WebP with full alpha transparency. Reduce page weight dramatically while keeping every detail razor-sharp.',
    defaultSettings: {
      format: 'image/webp',
      quality: 85,
      qualityPreset: 'high',
    },
    tips: [
      'WebP supports lossless and lossy transparency, shrinking PNG graphics by up to 50%.',
      'Perfect for website illustrations, hero banners, and app store screenshots.',
    ],
  },
};

export interface PresetPageProps {
  presetKey: string;
}

export const PresetPage: React.FC<PresetPageProps> = ({ presetKey }) => {
  const config = PRESET_CONFIGS[presetKey] || PRESET_CONFIGS['compress-image-for-website'];

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
    setSettings,
    setQualityPreset,
    setQuality,
    setFormat,
    updateSetting,
    resetSettings,
  } = useImageSettings(config.defaultSettings);

  const [previewItem, setPreviewItem] = useState<ImageItem | null>(null);

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      ...config.defaultSettings,
    }));
  }, [config, setSettings]);

  const activeImage = images.find((i) => i.id === activeImageId);

  return (
    <PageContainer
      title={config.title}
      description={config.description}
      breadcrumbs={[
        { name: 'Tools', url: '/tools' },
        { name: config.badge, url: `/${config.slug}` },
      ]}
      schemaType="WebApplication"
    >
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{config.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {config.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {config.subtitle}
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

      {/* Main Workspace */}
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

      <AdBanner format="horizontal" />

      {/* Tips section */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Why this preset works best:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.tips.map((tip, i) => (
            <div key={i} className="pro-card rounded-xl p-4 sm:p-5 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                Tip #{i + 1}
              </span>
              {tip}
            </div>
          ))}
        </div>
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
