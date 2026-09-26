import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import {
  FileQuestion,
  Home,
  Sliders,
  Maximize2,
  FileType,
  UserCheck,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const NotFound: React.FC = () => {
  const popularTools = [
    {
      title: 'Compress Image',
      desc: 'Reduce file size of JPG, PNG, and WebP images while preserving visual quality.',
      path: '/compress',
      icon: Sliders,
      badge: 'Most Popular',
    },
    {
      title: 'Resize Image',
      desc: 'Scale exact pixel dimensions or percentages with aspect ratio locks.',
      path: '/resize',
      icon: Maximize2,
    },
    {
      title: 'Convert Image',
      desc: 'Convert between WebP, PNG, JPG, and AVIF in seconds with zero uploads.',
      path: '/convert',
      icon: FileType,
    },
    {
      title: 'Passport Photo Creator',
      desc: 'Biometric face guides, background compliance, and government file caps.',
      path: '/passport-photo-creator',
      icon: UserCheck,
    },
    {
      title: 'Image Guides & Tutorials',
      desc: 'Learn about WebP vs PNG, Core Web Vitals, and lossless vs lossy compression.',
      path: '/guides',
      icon: BookOpen,
    },
  ];

  return (
    <PageContainer
      title="404 – Page Not Found"
      description="The page or tool you are looking for may have been moved or does not exist. Browse our free, in-browser image optimization tools."
      noindex={true}
      breadcrumbs={[{ name: '404 Not Found', url: '/404' }]}
    >
      <div className="max-w-3xl mx-auto py-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            The link you followed may be broken or the page may have been relocated.
            You can return to the homepage or jump directly to one of our tools below.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-left">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            Popular Image Tools & Guides
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-xs group flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.title}
                        </h3>
                        {tool.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
