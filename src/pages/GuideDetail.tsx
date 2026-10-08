import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { GUIDES } from '../data/guidesData';
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

export const GuideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    return <Navigate to="/404" replace />;
  }

  const relatedGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 2);

  return (
    <PageContainer
      title={guide.metaTitle}
      description={guide.metaDescription}
      ogType="article"
      schemaType="Article"
      articleData={{
        publishedTime: `${guide.publishedDate}T00:00:00Z`,
        modifiedTime: `${guide.modifiedDate}T00:00:00Z`,
        author: guide.author,
        section: guide.category,
      }}
      breadcrumbs={[
        { name: 'Guides', url: '/guides' },
        { name: guide.title, url: `/guides/${guide.slug}` },
      ]}
      faqs={guide.faqs}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/guides"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Guides</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">
              {guide.category}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {guide.readingTime}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              Published {new Date(guide.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {guide.summary}
          </p>

          <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <span>By <strong className="text-slate-800 dark:text-slate-200">{guide.author}</strong></span>
          </div>
        </header>

        {/* Quick Action Interactive Tool Banner */}
        <div className="my-8 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Recommended In-Browser Tool
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {guide.relatedTool.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {guide.relatedTool.description}
            </p>
          </div>
          <Link
            to={guide.relatedTool.path}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs w-full sm:w-auto"
          >
            <span>Launch Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table of Contents */}
        <div className="pro-card my-8 p-5 rounded-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            In this guide:
          </h2>
          <ul className="space-y-2 text-sm">
            {guide.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  {section.title}
                </a>
              </li>
            ))}
            {guide.faqs.length > 0 && (
              <li>
                <a
                  href="#frequently-asked-questions"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Frequently Asked Questions
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Main Article Content */}
        <article className="prose dark:prose-invert max-w-none space-y-10 my-8">
          {guide.sections.map((section, idx) => (
            <React.Fragment key={section.id}>
              <section id={section.id} className="scroll-mt-24 space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  {section.title}
                </h2>

                <div className="space-y-3.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {section.callout && (
                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm my-4 flex items-start gap-3 ${
                      section.callout.type === 'tip'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : section.callout.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {section.callout.type === 'tip' && <Lightbulb className="w-4 h-4 text-emerald-600" />}
                      {section.callout.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {section.callout.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{section.callout.title}</h3>
                      <p>{section.callout.text}</p>
                    </div>
                  </div>
                )}
              </section>
            </React.Fragment>
          ))}

          {/* FAQs Section */}
          {guide.faqs.length > 0 && (
            <section id="frequently-asked-questions" className="scroll-mt-24 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {guide.faqs.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-2"
                  >
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Bottom CTA to Matching Tool */}
        <div className="my-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold">Try the Tool Mentioned in This Guide</h3>
            <p className="text-sm text-blue-100 max-w-lg">
              Optimize your files right now with complete client-side privacy.
            </p>
          </div>
          <Link
            to={guide.relatedTool.path}
            className="shrink-0 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-colors"
          >
            {guide.relatedTool.name}
          </Link>
        </div>

        {/* Related Articles */}
        {relatedGuides.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedGuides.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/guides/${rel.slug}`}
                  className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {rel.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
