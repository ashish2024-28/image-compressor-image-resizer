import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Heart, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#090d16] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs">
                <Layers className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-black tracking-tight bg-slate-900 text-blue-400 border border-blue-500/40 rounded px-1 leading-none py-0.5">
                  IC
                </span>
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight block">
                  Image Compressor &amp; Resizer
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Developed by Ashish Systems
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Professional, free in-browser image optimization. Compress JPG, PNG, and WebP images, resize dimensions, and create biometric passport photos with 100% privacy and zero server uploads.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% Local HTML5 Processing · Zero Server Telemetry</span>
            </div>
          </div>

          {/* Image Tools */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Image Tools
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/compress" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link to="/resize" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link to="/convert" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Convert Image
                </Link>
              </li>
              <li>
                <Link to="/passport-photo-creator" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Passport & ID Photo
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  All Image Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn & Guides */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Guides & Tutorials
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/guides" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  Knowledge Hub
                </Link>
              </li>
              <li>
                <Link to="/guides/how-to-compress-image-without-losing-quality" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress Without Quality Loss
                </Link>
              </li>
              <li>
                <Link to="/guides/webp-vs-jpeg-vs-png-format-guide" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  WebP vs JPEG vs PNG
                </Link>
              </li>
              <li>
                <Link to="/guides/image-optimization-for-web-performance" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Core Web Vitals Guide
                </Link>
              </li>
              <li>
                <Link to="/guides/passport-and-visa-photo-size-requirements" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Passport Photo Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Information & Technical SEO */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Trust & Discovery
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/webmaster" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Webmaster & Indexing
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs flex items-center gap-1 pt-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>sitemap.xml</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Image Compressor &amp; Resizer · Developed by Ashish Systems. All rights reserved. Zero server uploads.</p>
          <div className="flex items-center gap-1.5 justify-center sm:justify-end">
            <span>Fast · Private · Free</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
