import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AdBanner } from '../components/ads/AdBanner';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: 'Are my pictures uploaded to any server or cloud?',
      a: 'Never. Image Optimizer runs completely in your web browser. All compression, resizing, and format conversions take place within your device’s local memory using HTML5 Canvas. We do not maintain any image storage backend.',
    },
    {
      q: 'What is the maximum file size I can optimize?',
      a: 'We recommend images up to 50MB per file. Because processing occurs inside your browser memory, exceedingly gigantic images (e.g. 100MB+ RAW camera files) may hit device memory limits. For standard digital photos and web assets, Image Optimizer handles files effortlessly.',
    },
    {
      q: 'Why did my PNG file not shrink when I moved the quality slider?',
      a: 'Standard PNG is fundamentally a lossless raster image format. Browsers ignore lossy quality sliders when encoding PNG blobs. If you want noticeable file reduction for illustrations, screenshots, or graphics, we suggest converting them to WebP or JPEG.',
    },
    {
      q: 'Will my camera metadata (EXIF) be preserved?',
      a: 'When an image is drawn onto an HTML5 canvas and re-encoded into a new Blob, browser engines naturally strip embedded EXIF tags (such as GPS coordinates, camera model, and shutter speed). This protects your personal location privacy.',
    },
    {
      q: 'Why do smartphone photos sometimes appear rotated?',
      a: 'Modern smartphones store portrait or upside-down images with an embedded EXIF orientation tag rather than rotating the raw pixel matrix. Image Optimizer decodes images using orientation-aware browser APIs to ensure output images always face the correct direction.',
    },
    {
      q: 'Can I download all my processed images at once?',
      a: 'Yes! Once you process multiple images, click the "Download All" button. We package all your optimized files into a single, clean .ZIP archive right inside your browser without any network delays.',
    },
    {
      q: 'What is WebP and should I use it?',
      a: 'WebP is an open, modern image format developed by Google. It produces files that are typically 25% to 35% smaller than comparable JPEGs at similar visual quality and also supports alpha transparency like PNG. It is supported by all modern browsers (Chrome, Safari, Edge, Firefox).',
    },
    {
      q: 'Is this service completely free to use?',
      a: 'Yes, 100% free with no account required, no email submission, no watermarks, and no usage limits.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const formattedFaqs = faqs.map((f) => ({
    question: f.q,
    answer: f.a,
  }));

  return (
    <PageContainer
      title="Frequently Asked Questions (FAQ) – Image Optimizer"
      description="Find answers to common questions about in-browser image compression, formats, privacy, and batch processing."
      breadcrumbs={[{ name: 'FAQ', url: '/faq' }]}
      faqs={formattedFaqs}
      schemaType="FAQPage"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help & FAQ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Have questions about how Image Optimizer works or how to get the best results? Here is everything you need to know.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl bg-white dark:bg-[#111827] shadow-xs overflow-hidden transition-all ${
                  isOpen
                    ? 'border-blue-500/60 dark:border-blue-600/60 ring-1 ring-blue-500/20'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      isOpen ? 'transform rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <AdBanner format="horizontal" />
      </div>
    </PageContainer>
  );
};
