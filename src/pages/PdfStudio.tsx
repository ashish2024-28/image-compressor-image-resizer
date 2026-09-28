import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { AdBanner, MultiplexAd } from '../components/ads';
import { AdvancePdfCallout } from '../components/pdf/AdvancePdfCallout';
import {
  FileText,
  Layers,
  FileImage,
  Zap,
  Scissors,
  RotateCw,
  Stamp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const PdfStudio: React.FC = () => {
  const tools = [
    {
      title: 'Images to PDF (Photo se PDF)',
      path: '/image-to-pdf',
      desc: 'Combine multiple JPG, PNG, and WebP photos into one high-resolution PDF with custom page order and A4 margins.',
      icon: <FileText className="w-6 h-6 text-rose-500" />,
      badge: 'Most Popular',
      color: 'hover:border-rose-500',
    },
    {
      title: 'Merge PDF (Do PDF Ek Sath Jode)',
      path: '/merge-pdf',
      desc: 'Join multiple separate PDF files into a single unified document with custom ordering and instant export.',
      icon: <Layers className="w-6 h-6 text-indigo-500" />,
      badge: 'Core Utility',
      color: 'hover:border-indigo-500',
    },
    {
      title: 'Compress PDF (100KB / 200KB)',
      path: '/compress-pdf',
      desc: 'Reduce PDF file size specifically for government exam forms (SSC, UPSC), college portals, and emails.',
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      badge: 'Govt Form Ready',
      color: 'hover:border-emerald-500',
    },
    {
      title: 'PDF to Images (PDF se Photo)',
      path: '/pdf-to-images',
      desc: 'Extract every page of any PDF document into crisp JPG or PNG images. Download individually or as ZIP.',
      icon: <FileImage className="w-6 h-6 text-amber-500" />,
      badge: 'High Res',
      color: 'hover:border-amber-500',
    },
    {
      title: 'Split & Extract PDF Pages',
      path: '/split-pdf',
      desc: 'Separate specific page numbers or page ranges (e.g. 1, 3-5) into a brand new standalone PDF file.',
      icon: <Scissors className="w-6 h-6 text-purple-500" />,
      badge: 'Page Selector',
      color: 'hover:border-purple-500',
    },
    {
      title: 'Rotate & Watermark PDF',
      path: '/pdf-rotate-watermark',
      desc: 'Fix upside-down scanned pages (90°, 180°) and protect confidential documents with custom text watermarks.',
      icon: <RotateCw className="w-6 h-6 text-teal-500" />,
      badge: 'Document Security',
      color: 'hover:border-teal-500',
    },
  ];

  return (
    <PageContainer
      title="Advanced PDF Studio – Free Client-Side PDF Tools | Zero Server Uploads"
      description="Modern 100% in-browser PDF suite. Merge PDF, Compress PDF to 100KB, Convert Images to PDF, Extract PDF to JPG, Split and Watermark documents with zero server uploads."
      breadcrumbs={[{ name: 'PDF Studio', url: '/pdf-studio' }]}
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Top Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Client-Side In-Browser PDF Suite &bull; Zero Server Uploads</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Advanced PDF Studio
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Process, compress, merge, split, and convert all your PDF documents directly inside your browser. No registration, no subscription, zero data transmitted to cloud servers.
          </p>
        </div>

        <AdBanner slotLabel="Header Banner" />

        {/* Advance PDF Platform Callout Banner */}
        <AdvancePdfCallout variant="banner" />

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className={`p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] ${tool.color} transition-all shadow-xs hover:shadow-md group flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tool.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}

          {/* Dedicated External Card for Advance PDF Operations */}
          <AdvancePdfCallout variant="card" />
        </div>

        {/* Privacy Callout */}
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Guaranteed Client-Side Privacy
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Every file is parsed, merged, and rendered locally in your device's browser memory (HTML5 Canvas &amp; WebAssembly). No file is ever sent to external cloud servers.
              </p>
            </div>
          </div>
          <Link
            to="/privacy"
            className="shrink-0 text-xs font-bold px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors"
          >
            Learn About Security
          </Link>
        </div>

        <MultiplexAd slotLabel="Sponsored & Recommended" />
      </div>
    </PageContainer>
  );
};
