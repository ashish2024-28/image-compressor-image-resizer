import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';
import { AdBanner } from '../components/ads/AdBanner';

export const PrivacyPolicy: React.FC = () => {
  return (
    <PageContainer
      title="Privacy Policy – Image Compressor & Resizer"
      description="Read how Image Compressor & Resizer by Ashish Systems preserves your absolute privacy with 100% client-side image processing and zero server uploads."
      breadcrumbs={[{ name: 'Privacy Policy', url: '/privacy' }]}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ashish Systems · Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Effective Date: September 2026
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="pro-card rounded-2xl p-5 text-center">
            <ServerOff className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Server Uploads</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Your pictures never travel over the network to any server.
            </p>
          </div>

          <div className="pro-card rounded-2xl p-5 text-center">
            <EyeOff className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Content Tracking</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              We never inspect, log, or track visual contents of images.
            </p>
          </div>

          <div className="pro-card rounded-2xl p-5 text-center">
            <Lock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Local Sandboxing</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Execution is restricted within your browser security sandbox.
            </p>
          </div>
        </div>

        {/* Full Policy Copy */}
        <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Fundamental Privacy Guarantee: In-Browser Execution
            </h2>
            <p>
              Image Optimizer operates under a local-execution model. When you drag and drop or select image files, the application uses modern HTML5 File, ImageBitmap, and Canvas Web APIs available directly in your web browser. <strong>Your images are processed locally in your browser.</strong> We do not upload your images to any backend server, cloud database, or third-party storage service.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Temporary Memory & Data Lifecycle
            </h2>
            <p>
              When an image is loaded, a temporary Object URL (<code>blob:</code> URI) is created in your browser&apos;s volatile RAM. Once you remove an image from the list, click &quot;Clear All&quot;, or close your browser tab, all allocated memory references are immediately revoked and destroyed. No permanent records remain.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Image Metadata (EXIF)
            </h2>
            <p>
              Digital camera and smartphone images often embed metadata such as geographic GPS coordinates, camera model, date/time timestamps, and exposure settings. Re-encoding an image through HTML5 Canvas standardizes the raw pixels and naturally discards embedded EXIF tags. We do not extract, store, or transmit this metadata.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. Analytics & Telemetry
            </h2>
            <p>
              If anonymous usage metrics or performance telemetry are collected, they track only generalized aggregate events (such as whether a tool was opened or whether a browser supported AVIF). We never record image pixels, filenames, document contents, or personal identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              5. Advertisements, Third-Party Vendors & Cookies
            </h2>
            <p>
              This website displays third-party advertisements served by Google AdSense to fund free operational access and continuous engineering development.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Third-party vendors, including Google</strong>, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our sites and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Google Ads Settings
                </a>
                . Alternatively, users can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  www.aboutads.info
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              6. Realistic Privacy Boundaries
            </h2>
            <p>
              While Image Optimizer guarantees zero uploads to our infrastructure, your security also relies on the integrity of your own device, operating system, and browser extensions. We recommend keeping your web browser up to date and using reputable software.
            </p>
          </section>
        </div>

        <AdBanner format="horizontal" />
      </div>
    </PageContainer>
  );
};
