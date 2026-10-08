import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import {
  Search,
  FileCode,
  ExternalLink,
  ShieldCheck,
  Globe,
  Layers,
} from 'lucide-react';

export const WebmasterGuide: React.FC = () => {
  return (
    <PageContainer
      title="Search Engine Discovery & Webmaster Verification Guide"
      description="Production instructions for indexing Image Optimizer on Google Search Console, Bing Webmaster Tools, and validating XML sitemaps and Core Web Vitals."
      breadcrumbs={[
        { name: 'Guides', url: '/guides' },
        { name: 'Webmaster Verification', url: '/webmaster' },
      ]}
      schemaType="Article"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Search className="w-3.5 h-3.5" />
            <span>Search Engine Optimization Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Search Engine Discovery & Indexing Guide
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            A comprehensive checklist for submitting this application to Google Search Console, Bing Webmaster Tools, and auditing Core Web Vitals.
          </p>
        </header>

        {/* Section 1: Ready-Made Assets */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>1. Verification & Indexing Assets Built-In</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="pro-card rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                /robots.txt
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Robots Directives Active
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Allows full crawling by Googlebot, Bingbot, and legitimate web crawlers while pointing directly to the XML sitemap.
              </p>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                <span>View live robots.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pro-card rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                /sitemap.xml
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Comprehensive XML Sitemap
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Contains all canonical indexable pages: home, 4 major tools, 6 preset landing pages, 4 deep educational guides, and legal pages with strict priority weighting.
              </p>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                <span>View live sitemap.xml</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: Google Search Console Submission */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>2. Google Search Console Setup Steps</span>
          </h2>
          <div className="pro-card rounded-xl p-5 sm:p-6 space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <ol className="space-y-3 list-decimal list-inside">
              <li>
                <strong className="text-slate-900 dark:text-white">Add Property:</strong> Sign in to{' '}
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Google Search Console
                </a>{' '}
                and click <em>Add property</em> (choose URL prefix or Domain).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Verify Ownership:</strong> Choose the HTML meta tag method (e.g.,{' '}
                <code className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                  &lt;meta name="google-site-verification" content="..." /&gt;
                </code>
                ) or DNS TXT record.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Submit Sitemap:</strong> Navigate to the <em>Sitemaps</em> menu on the left sidebar, enter{' '}
                <code className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                  sitemap.xml
                </code>
                , and click <em>Submit</em>.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Request URL Inspection:</strong> Enter{' '}
                <code className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                  https://yourdomain.com/
                </code>{' '}
                and click <em>Request Indexing</em> to expedite initial crawl.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Monitor Core Web Vitals:</strong> Review the <em>Page Experience</em> and <em>Core Web Vitals</em> reports after 7 days. Because all processing is local with zero heavy third-party tracking scripts, this app natively achieves high Performance ratings.
              </li>
            </ol>
          </div>
        </section>

        {/* Section 3: Bing Webmaster Tools */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>3. Bing Webmaster Tools & IndexNow</span>
          </h2>
          <div className="pro-card rounded-xl p-5 sm:p-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p>
              Bing powers Yahoo, DuckDuckGo, and several AI search engines. You can instantly import verified properties directly from Google Search Console into{' '}
              <a
                href="https://www.bing.com/webmasters"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 underline font-medium"
              >
                Bing Webmaster Tools
              </a>
              :
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Log in to Bing Webmaster Tools and choose <em>Import from Google Search Console</em>.</li>
              <li>Confirm sitemaps are mirrored automatically.</li>
              <li>Enable IndexNow protocol for instant notification whenever new tool pages or guides are published.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Schema.org Validation */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>4. Structured Data Validation</span>
          </h2>
          <div className="pro-card rounded-xl p-5 sm:p-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p>
              Every page automatically renders standard Schema.org JSON-LD structured data. You can validate the live markup with Google’s official test tools:
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="https://search.google.com/test/rich-results"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
              >
                <span>Google Rich Results Test</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://validator.schema.org/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
              >
                <span>Schema.org Validator</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
