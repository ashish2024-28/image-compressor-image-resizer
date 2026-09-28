import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Sun, Moon, Monitor, Menu, X, ShieldCheck, ExternalLink } from 'lucide-react';
import type { ThemeMode } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { ADVANCE_PDF_URL } from '../pdf/AdvancePdfCallout';

export interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Compress', path: '/compress' },
    { name: 'Resize', path: '/resize' },
    { name: 'Convert', path: '/convert' },
    { name: 'PDF Studio', path: '/pdf-studio' },
    { name: 'Image to PDF', path: '/image-to-pdf' },
    { name: 'Passport Photo', path: '/passport-photo-creator' },
    { name: 'Guides', path: '/guides' },
    { name: 'All Tools', path: '/tools' },
  ];

  const cycleTheme = () => {
    if (theme === 'light') onThemeChange('dark');
    else if (theme === 'dark') onThemeChange('system');
    else onThemeChange('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-blue-400" />;
    return <Monitor className="w-4 h-4 text-slate-400" />;
  };

  const getThemeTitle = () => {
    if (theme === 'light') return 'Theme: Light (Click for Dark)';
    if (theme === 'dark') return 'Theme: Dark (Click for System)';
    return 'Theme: System (Click for Light)';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group focus:outline-none min-w-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
              <Layers className="w-5 h-5" />
              <span className="absolute -bottom-1 -right-1 text-[7px] sm:text-[8px] font-black tracking-tight bg-slate-900 text-blue-400 border border-blue-500/40 rounded px-1 leading-none py-0.5 shadow-xs">
                IC
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white block leading-tight truncate">
                <span className="hidden sm:inline">Image Compressor &amp; Resizer</span>
                <span className="sm:hidden">Image Compressor</span>
              </span>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5 truncate">
                <span>Ashish Systems</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% In-Browser</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <a
              href={ADVANCE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 transition-colors ml-0.5"
              title="Need Advance PDF operations? Open PDF Tools Pro"
            >
              <span>Advance PDF</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <PWAInstallButton />

            <button
              type="button"
              onClick={cycleTheme}
              title={getThemeTitle()}
              aria-label={getThemeTitle()}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {getThemeIcon()}
            </button>

            <Link
              to="/compress"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload Images
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {link.name}
            </Link>
          ))}
          <a
            href={ADVANCE_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80"
          >
            <span className="flex items-center gap-2">
              <span>Advance PDF Tools</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">
                External ↗
              </span>
            </span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </a>
          <div className="pt-2">
            <Link
              to="/compress"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium"
            >
              Upload Images
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
