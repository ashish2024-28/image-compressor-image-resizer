import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Cpu, Zap, Lock, Heart } from 'lucide-react';
import { AdBanner } from '../components/ads/AdBanner';

export const About: React.FC = () => {
  return (
    <PageContainer
      title="About Image Optimizer – In-Browser Image Processing"
      description="Learn about Image Optimizer, our privacy-first architecture, and how client-side image compression protects your personal photos."
      breadcrumbs={[{ name: 'About', url: '/about' }]}
      schemaType="WebApplication"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
            <span>About Image Optimizer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Fast, Private, Zero-Server Image Utility
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Engineered to give web developers, content creators, and privacy-conscious users an online compression tool that never uploads their files to remote servers.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">True Client-Side Privacy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Unlike traditional image converter websites that send your sensitive personal documents, family photos, or proprietary assets to cloud servers, Image Optimizer operates entirely inside your web browser.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Hardware Accelerated</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              By using your computer&apos;s or mobile phone&apos;s own GPU and CPU through HTML5 Canvas and ImageBitmap, compression happens in milliseconds without network latency or upload queues.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">No Fake Claims</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We never promise misleading claims such as &quot;compress 95% without any quality loss.&quot; We transparently explain lossy tradeoffs and real format capabilities like WebP vs PNG.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">Free Forever</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No hidden subscriptions, no file watermarking, and no arbitrary limits designed to force you into a paid tier. Pure browser utility.
            </p>
          </div>
        </div>

        {/* AdSense Slot */}
        <AdBanner format="horizontal" />

        {/* ASHISH SYSTEMSX Philosophy Section */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                Brand Philosophy & Origin
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                ASHISH SYSTEMSX
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                Explore. Build. Experiment.
              </span>
              <p className="text-[11px] text-slate-300 mt-1">Engineering through exploration</p>
            </div>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed space-y-3">
            <p className="text-base font-medium text-blue-100 italic border-l-2 border-blue-400 pl-4">
              &ldquo;A personal engineering space where Ashish explores, builds, and experiments with software systems.&rdquo;
            </p>
            <p className="text-xs text-slate-300">
              The name <strong>ASHISH SYSTEMSX</strong> is grounded in a clear engineering philosophy rather than an arbitrary letter. It reflects an ongoing journey of technical mastery and discovery:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Ashish
              </span>
              <h4 className="font-bold text-white text-sm mb-1.5">Personal Identity</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Hands-on craftsmanship, personal responsibility for every line of code, and authentic creative vision.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Systems
              </span>
              <h4 className="font-bold text-white text-sm mb-1.5">Software Engineering</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Deterministic architectures, distributed pipelines, client-side execution, and resilient digital infrastructure.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                X (eXplore)
              </span>
              <h4 className="font-bold text-white text-sm mb-1.5">Experimentation & Learning</h4>
              <p className="text-xs text-slate-300 leading-normal">
                Continuous discovery of new technologies, rapid prototyping, and learning through unconstrained experimentation.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
            <span>
              Portfolio Experiments: <strong>Image Optimizer (PWA)</strong> · <strong>DERP</strong> · <strong>E-Commerce Engines</strong> · <strong>File Utilities</strong>
            </span>
            <span className="text-[11px] text-blue-300 font-mono">
              systemsx.lab
            </span>
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
