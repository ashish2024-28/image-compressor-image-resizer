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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
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
            <div key={i} className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs text-slate-600 dark:text-slate-400 shadow-xs">
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
