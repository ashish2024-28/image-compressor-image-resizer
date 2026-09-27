import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { AdBanner, InFeedAd, MultiplexAd } from '../components/ads';
import {
  Sliders,
  Maximize2,
  FileType,
  Globe,
  Mail,
  MessageSquare,
  FileText,
  Instagram,
  Share2,
  ArrowRight,
  ShieldCheck,
  UserSquare2,
} from 'lucide-react';

export const Tools: React.FC = () => {
  const coreTools = [
    {
      title: 'Compress Image',
      path: '/compress',
      icon: <Sliders className="w-6 h-6 text-blue-600" />,
      desc: 'Reduce image file size with lossy or lossless quality controls. Supports batch processing and comparison.',
      badge: 'Most Popular',
    },
    {
      title: 'Passport & Visa Photo Creator',
      path: '/passport-photo-creator',
      icon: <UserSquare2 className="w-6 h-6 text-rose-600" />,
      desc: 'Format to US (2x2"), EU/UK (35x45mm), and Indian passport specs. Avoids government "overly compressed" errors.',
      badge: 'Biometric Ready',
    },
    {
      title: 'Resize Image',
      path: '/resize',
      icon: <Maximize2 className="w-6 h-6 text-emerald-600" />,
      desc: 'Change image dimensions (width & height), lock aspect ratio, and apply fit, fill, or stretch scaling.',
      badge: 'Core Utility',
    },
    {
      title: 'Convert Image',
      path: '/convert',
      icon: <FileType className="w-6 h-6 text-purple-600" />,
      desc: 'Convert seamlessly between modern web formats: JPG, PNG, WebP, and AVIF.',
      badge: 'Format Matrix',
    },
  ];

  const presets = [
    {
      title: 'Compress for Website',
      path: '/compress-image-for-website',
      icon: <Globe className="w-5 h-5 text-indigo-600" />,
      desc: 'Converts to WebP at 80% quality with 1920px max width for optimal Google Core Web Vitals.',
    },
    {
      title: 'Compress for Email',
      path: '/compress-image-for-email',
      icon: <Mail className="w-5 h-5 text-sky-600" />,
      desc: 'Resizes to 1024px JPEG to stay under email client HTML clipping caps and spam thresholds.',
    },
    {
      title: 'Compress for WhatsApp',
      path: '/compress-image-for-whatsapp',
      icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
      desc: 'Saves mobile data and avoids WhatsApp compression blur by sending a pre-balanced 1280px photo.',
    },
    {
      title: 'Compress for Resume',
      path: '/compress-image-for-resume',
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      desc: 'Formats profile photos under 800px to meet strict job application portal size requirements.',
    },
    {
      title: 'Compress for Instagram',
      path: '/compress-image-for-instagram',
      icon: <Instagram className="w-5 h-5 text-pink-600" />,
      desc: 'Prepares 1080px square or portrait images with crisp details before Instagram compression runs.',
    },
    {
      title: 'Social Media Resizer',
      path: '/social-media-image-resizer',
      icon: <Share2 className="w-5 h-5 text-purple-600" />,
      desc: 'Quickly resize banners, headers, and share cards for Twitter/X, LinkedIn, Facebook, and YouTube.',
    },
  ];

  return (
    <PageContainer
      title="Free Online Image Optimization Tools & Utilities"
      description="Explore our full collection of client-side image compression, resizing, and format conversion tools. Fast, free, and completely private."
      breadcrumbs={[{ name: 'All Tools', url: '/tools' }]}
      schemaType="WebApplication"
    >
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Server Uploads · 100% In-Browser Processing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Image Optimization Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Everything you need to compress, resize, convert, and format digital images directly in your browser.
        </p>
      </div>

      {/* Core Tools Grid */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Core Utilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {coreTools.map((t) => (
            <Link
              key={t.title}
              to={t.path}
              className="pro-card rounded-2xl p-5 sm:p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 rounded-xl group-hover:scale-105 transition-transform">
                    {t.icon}
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {t.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                Open Tool <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AdBanner format="horizontal" />

      {/* Popular Presets Grid */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Specialized Use Case Presets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((p) => (
            <Link
              key={p.title}
              to={p.path}
              className="pro-card rounded-2xl p-4 sm:p-5 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 shrink-0">
                    {p.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {p.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Use Preset <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AdSense Multiplex / Recommendations */}
      <MultiplexAd slotLabel="Sponsored & Recommended" />

      {/* Educational Guides Section */}
      <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Knowledge Base & Educational Guides
          </h2>
          <Link
            to="/guides"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View all guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/guides/how-to-compress-image-without-losing-quality"
            className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
          >
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              Compression
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
              Compress Without Losing Quality
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Understand chroma subsampling and quantization tables.
            </p>
          </Link>

          <Link
            to="/guides/webp-vs-jpeg-vs-png-format-guide"
            className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
          >
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              Formats
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
              WebP vs JPEG vs PNG vs AVIF
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Deep codec comparison for speed, transparency, and ratio.
            </p>
          </Link>

          <Link
            to="/guides/image-optimization-for-web-performance"
            className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
          >
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              Performance
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
              Core Web Vitals Optimization
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Optimize Largest Contentful Paint (LCP) and zero out CLS.
            </p>
          </Link>

          <Link
            to="/guides/passport-and-visa-photo-size-requirements"
            className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
          >
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              Biometrics
            </span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
              Passport Photo Regulations
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              US, Schengen, UK, and India portal requirements and file caps.
            </p>
          </Link>
        </div>
      </section>
    </PageContainer>
  );
};
