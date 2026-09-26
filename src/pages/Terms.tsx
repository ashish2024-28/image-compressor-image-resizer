import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { FileCheck, Shield } from 'lucide-react';
import { AdBanner } from '../components/ads/AdBanner';

export const Terms: React.FC = () => {
  return (
    <PageContainer
      title="Terms of Service – Image Optimizer"
      description="Read the terms of service governing the usage of Image Optimizer and our free client-side optimization utilities."
      breadcrumbs={[{ name: 'Terms of Service', url: '/terms' }]}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Last Updated: September 2026
          </p>
        </div>

        <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Image Optimizer by ASHISH SYSTEMSX (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the application.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Description of Service
            </h2>
            <p>
              Image Optimizer is an experimental client-side software utility built by ASHISH SYSTEMSX (Explore. Build. Experiment.) providing in-browser tools to compress, resize, format convert, and inspect digital images. The service executes locally on client hardware through browser Web APIs. No warranty is made regarding exact file reduction percentages or lossless guarantees for inherently lossy formats.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Permitted Use
            </h2>
            <p>
              You may use the service for personal, educational, or commercial image optimization. Because processing happens locally on your own machine, you are responsible for ensuring that you have legal rights to any images you choose to process.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. Image Optimizer does not warrant that browser canvas encoding will not encounter memory exhaustion when handling extremely high-resolution files. Users are advised to retain backup copies of original images prior to processing.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              Under no circumstances shall the creators or operators of Image Optimizer be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this web service.
            </p>
          </section>
        </div>

        <AdBanner format="horizontal" />
      </div>
    </PageContainer>
  );
};
