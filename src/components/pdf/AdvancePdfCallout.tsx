import React from 'react';
import { ExternalLink, Sparkles, Shield, FileCheck, Key, FileSignature, FileSearch, ArrowRight, Zap } from 'lucide-react';

interface AdvancePdfCalloutProps {
  variant?: 'banner' | 'card' | 'compact' | 'mini';
  title?: string;
  description?: string;
  className?: string;
}

export const ADVANCE_PDF_URL = 'https://pdf-tools-ten-eta.vercel.app/';

export const AdvancePdfCallout: React.FC<AdvancePdfCalloutProps> = ({
  variant = 'banner',
  title,
  description,
  className = '',
}) => {
  if (variant === 'mini') {
    return (
      <a
        href={ADVANCE_PDF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 hover:border-indigo-500 hover:shadow-xs transition-all ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>Need Advance PDF Operations? Go to PDF Tools Pro</span>
        <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`p-4 sm:p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-blue-50/60 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{title || 'Need More Advanced PDF Operations?'}</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-600 text-white uppercase tracking-wider">
                External Tool
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              {description ||
                'For advanced tasks like PDF Password Unlock/Protect, OCR Text Extraction, Digital Signatures, and Office Conversions, visit our dedicated companion portal.'}
            </p>
          </div>
        </div>

        <a
          href={ADVANCE_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer group"
        >
          <span>Open PDF Tools Pro</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <a
        href={ADVANCE_PDF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative overflow-hidden p-5 sm:p-6 rounded-2xl border-2 border-indigo-500/40 dark:border-indigo-500/40 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white hover:border-indigo-400 hover:shadow-xl transition-all group flex flex-col justify-between ${className}`}
      >
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-400/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
              <span>Advance Operations</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-200 transition-colors flex items-center gap-1.5">
              <span>{title || 'Advance PDF Tools Portal'}</span>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
              {description ||
                'Looking for specialized PDF operations? Head over to our full-featured PDF tools platform for OCR, signing, encryption, unlocking, and deep conversions.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['OCR Text', 'Protect & Unlock', 'Digital Sign', 'Page Numbering', 'Form Fill'].map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-indigo-100 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-5 pt-3 border-t border-indigo-800/80 flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-white transition-colors">
          <span>Go to pdf-tools-ten-eta.vercel.app</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </a>
    );
  }

  // Default: full-featured 'banner'
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-indigo-300/80 dark:border-indigo-800/80 bg-gradient-to-br from-indigo-900 via-[#131b38] to-[#0a0e1c] text-white p-6 sm:p-8 shadow-xl ${className}`}
    >
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Companion Platform &bull; Advance PDF Operations</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {title || 'Need Advance PDF Operations?'}
          </h3>

          <p className="text-xs sm:text-sm text-indigo-100/85 leading-relaxed">
            {description ||
              'If you require enterprise-grade or advanced PDF capabilities—such as PDF Password Encryption & Decryption, OCR Text Extraction, Digital Signatures, Batch Numbering, or Advanced Multi-Document Manipulation—hop over to our dedicated companion portal.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-indigo-200">
              <Key className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Password Protect</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-200">
              <FileSearch className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>OCR &amp; Search</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-200">
              <FileSignature className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Sign &amp; Annotate</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-200">
              <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Deep Operations</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
          <a
            href={ADVANCE_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer group"
          >
            <span>Go to Advance PDF Tools</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <span className="text-[11px] text-center text-indigo-300/80 font-mono">
            pdf-tools-ten-eta.vercel.app
          </span>
        </div>
      </div>
    </div>
  );
};
