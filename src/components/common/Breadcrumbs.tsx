import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumbs"
      className={`flex items-center text-xs text-slate-500 dark:text-slate-400 mb-6 overflow-x-auto whitespace-nowrap py-1 ${className}`}
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Image Optimizer Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.url} className="flex items-center space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
              {isLast ? (
                <span
                  className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[140px] sm:max-w-xs"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
