import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Cpu, Zap, Lock, Heart } from 'lucide-react';
import { AdBanner } from '../components/ads/AdBanner';

export const About: React.FC = () => {
  return (
    <PageContainer
      title="About Image Compressor & Resizer – In-Browser Privacy & Performance"
      description="Learn about Image Compressor & Resizer, our privacy-first client-side architecture by Ashish Systems, and how in-browser processing preserves your data."
      breadcrumbs={[{ name: 'About', url: '/about' }]}
      schemaType="WebApplication"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Ashish Systems</span>
            <span aria-hidden="true">·</span>
            <span>About Image Compressor &amp; Resizer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Fast, Private, Zero-Server Image Optimization
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Engineered to give web developers, content creators, photographers, and privacy-conscious users an online compression suite that never uploads their files to remote servers.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="pro-card rounded-2xl p-5 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">True Client-Side Privacy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Unlike traditional converter sites that upload personal documents, family photos, or proprietary assets to cloud servers, Image Compressor &amp; Resizer operates entirely inside your local browser memory.
            </p>
          </div>

          <div className="pro-card rounded-2xl p-5 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Hardware Accelerated</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              By using your computer or smartphone GPU and CPU through HTML5 Canvas and ImageBitmap, compression happens in milliseconds without network latency, file queues, or transmission lag.
            </p>
          </div>

          <div className="pro-card rounded-2xl p-5 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Transparent Quality Controls</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We never promise misleading claims such as &quot;compress 95% without any quality loss.&quot; We transparently explain lossy tradeoffs and real format capabilities like WebP vs PNG.
            </p>
          </div>

          <div className="pro-card rounded-2xl p-5 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">100% Free &amp; Unrestricted</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No hidden subscriptions, no file watermarking, and no arbitrary paywalls designed to restrict everyday webmaster and photography workflows.
            </p>
          </div>
        </div>

        {/* AdSense Slot */}
        <AdBanner format="horizontal" />

        {/* Ashish Systems Engineering Section */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Engineering Lab
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                Ashish Systems
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-blue-300 font-semibold block">
                Client-Side Web Systems
              </span>
              <p className="text-[11px] text-slate-300 mt-0.5">High-performance browser utilities</p>
            </div>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed space-y-3">
            <p className="text-xs sm:text-sm text-slate-300">
              <strong>Ashish Systems</strong> builds robust, privacy-first web utilities designed to solve digital asset management challenges directly in the client browser. Our mission is to leverage the full power of modern hardware and W3C standards to deliver zero-latency tools without demanding user data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Privacy
              </span>
              <h4 className="font-bold text-white text-sm mb-1.5">Zero Data Exposure</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Files are kept in local device sandbox memory. Zero cloud storage or tracking analytics on image pixels.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Engineering
              </span>
              <h4 className="font-bold text-white text-sm mb-1.5">Open Web Standards</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Strict adherence to HTML5, WebP, AVIF, and Canvas 2D standards for deterministic cross-browser behavior.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Accessibility
              </span>
              <h4 className="font-bold text-white text-sm mb-1.5">Free &amp; Offline</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Progressive Web App (PWA) offline capabilities allow image optimization anywhere, even without internet.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture details */}
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Architecture</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The application relies on standardized W3C Web APIs:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
            <li><strong>File API & Drag-and-Drop:</strong> Safely accesses selected files in sandbox memory without reading the file system arbitrarily.</li>
            <li><strong>createImageBitmap & HTMLImageElement:</strong> Decodes raw encoded bytes into pixel representations while automatically resolving EXIF orientation.</li>
            <li><strong>Canvas 2D Context:</strong> Provides bicubic interpolation for resizing and draws pixels with optimized color matrices.</li>
            <li><strong>HTMLCanvasElement.toBlob():</strong> Compresses the raster canvas into standardized JPEG, PNG, WebP, or AVIF blobs.</li>
            <li><strong>JSZip:</strong> Assembles multiple compressed files into a standardized .ZIP archive directly in browser RAM when requested.</li>
          </ul>
        </section>
      </div>
    </PageContainer>
  );
};
