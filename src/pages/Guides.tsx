import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { GUIDES } from '../data/guidesData';
import { BookOpen, Clock, Calendar, ArrowRight, Search, Sparkles } from 'lucide-react';

export const Guides: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Compression', 'Formats', 'Performance', 'Biometrics'];

  const filteredGuides = GUIDES.filter((guide) => {
    const matchesCategory =
      selectedCategory === 'All' || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer
      title="Image Optimization Guides & Technical Tutorials"
      description="In-depth tutorials, technical comparisons, and best practices for image compression, format selection, Core Web Vitals, and passport photo standards."
      breadcrumbs={[{ name: 'Guides & Tutorials', url: '/guides' }]}
    >
      <div className="max-w-4xl mx-auto mb-10 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Knowledge Base & Technical Guides</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Image Optimization Guides
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Clear, engineering-backed answers on human visual perception, modern image codecs, page speed optimization, and biometric document standards.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="max-w-4xl mx-auto mb-10 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. Core Web Vitals, WebP vs PNG, passport specs)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide, idx) => (
          <React.Fragment key={guide.slug}>
            <article
              className="pro-card flex flex-col justify-between p-5 sm:p-6 rounded-2xl hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {guide.readingTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  <Link to={`/guides/${guide.slug}`}>
                    {guide.title}
                  </Link>
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Updated {new Date(guide.modifiedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>

                <Link
                  to={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          </React.Fragment>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12 max-w-md mx-auto text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-base mb-1">No guides found matching your query.</p>
          <p className="text-xs">Try clearing your search term or picking another category.</p>
        </div>
      )}

      {/* Bottom Tool Promo Banner */}
      <div className="max-w-4xl mx-auto mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-200">
            <Sparkles className="w-3.5 h-3.5" /> Hands-On In-Browser Tools
          </div>
          <h3 className="text-xl font-bold">Ready to optimize your images now?</h3>
          <p className="text-sm text-blue-100 max-w-md">
            All our algorithms run directly on your device via HTML5 Canvas. Zero uploads, zero latency, 100% privacy.
          </p>
        </div>
        <Link
          to="/compress"
          className="shrink-0 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-colors"
        >
          Open Image Compressor
        </Link>
      </div>
    </PageContainer>
  );
};
