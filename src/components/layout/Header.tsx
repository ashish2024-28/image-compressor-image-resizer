import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layers,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  ExternalLink,
  Minimize2,
  Maximize2,
  Image as ImageIcon,
  UserSquare2,
  FileType,
  Scissors,
  FileText,
  FileImage,
  RotateCw,
  Sparkles,
  ChevronDown,
  Home,
  Lock,
  Scan,
} from 'lucide-react';
import type { ThemeMode } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { ADVANCE_PDF_URL } from '../pdf/AdvancePdfCallout';

export interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageDropdownOpen, setImageDropdownOpen] = useState(false);
  const [pdfDropdownOpen, setPdfDropdownOpen] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setImageDropdownOpen(false);
    setPdfDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setImageDropdownOpen(false);
        setPdfDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Structured tools matching user reference screenshots
  const imageTools = [
    {
      name: 'Compress Image',
      path: '/compress',
      icon: <Minimize2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      name: 'Resize Image',
      path: '/resize',
      icon: <Maximize2 className="w-4 h-4 text-blue-400" />,
    },
    {
      name: 'JPG to PNG',
      path: '/jpg-to-png',
      icon: <ImageIcon className="w-4 h-4 text-purple-400" />,
    },
    {
      name: 'PNG to JPG',
      path: '/png-to-jpg',
      icon: <ImageIcon className="w-4 h-4 text-orange-400" />,
    },
    {
      name: 'Passport Photo',
      path: '/passport-photo-creator',
      icon: <UserSquare2 className="w-4 h-4 text-rose-400" />,
    },
    {
      name: 'Convert Image',
      path: '/convert',
      icon: <FileType className="w-4 h-4 text-indigo-400" />,
    },
  ];

  const pdfTools = [
    {
      name: 'Compress PDF',
      path: '/compress-pdf',
      icon: <Minimize2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      name: 'Merge PDF',
      path: '/merge-pdf',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
    },
    {
      name: 'Split PDF',
      path: '/split-pdf',
      icon: <Scissors className="w-4 h-4 text-teal-400" />,
    },
    {
      name: 'Image to PDF',
      path: '/image-to-pdf',
      icon: <FileImage className="w-4 h-4 text-sky-400" />,
    },
    {
      name: 'JPG to PDF',
      path: '/jpg-to-pdf',
      icon: <FileText className="w-4 h-4 text-orange-400" />,
    },
    {
      name: 'PDF to Image',
      path: '/pdf-to-images',
      icon: <ImageIcon className="w-4 h-4 text-blue-400" />,
    },
    {
      name: 'Rotate & Watermark',
      path: '/pdf-rotate-watermark',
      icon: <RotateCw className="w-4 h-4 text-teal-400" />,
    },
    {
      name: 'Encrypt PDF',
      path: '/encrypt-pdf',
      icon: <Lock className="w-4 h-4 text-indigo-400" />,
    },
    {
      name: 'Scan & OCR Text',
      path: '/scan-ocr',
      icon: <Scan className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2" ref={dropdownRef}>
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
            <nav className="hidden lg:flex items-center gap-1">
              {/* Home */}
              <Link
                to="/"
                title="Home"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              {/* Image Tools Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setImageDropdownOpen(!imageDropdownOpen);
                    setPdfDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    location.pathname.startsWith('/compress') ||
                    location.pathname.startsWith('/resize') ||
                    location.pathname.startsWith('/convert') ||
                    location.pathname.startsWith('/passport')
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span>Image Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${imageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {imageDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Image Tools
                    </div>
                    {imageTools.map((t) => (
                      <Link
                        key={t.name}
                        to={t.path}
                        onClick={() => setImageDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {t.icon}
                        <span>{t.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* PDF Tools Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setPdfDropdownOpen(!pdfDropdownOpen);
                    setImageDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    location.pathname.includes('pdf')
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span>PDF Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${pdfDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {pdfDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      PDF Tools
                    </div>
                    {pdfTools.map((t) => (
                      <Link
                        key={t.name}
                        to={t.path}
                        onClick={() => setPdfDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {t.icon}
                        <span>{t.name}</span>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <Link
                        to="/pdf-studio"
                        onClick={() => setPdfDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                      >
                        <span>PDF Studio Hub &rarr;</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Advance PDF Studio External Link */}
              <a
                href={ADVANCE_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all shadow-xs group"
                title="Need Advance PDF Operations? Go to PDF Tools Pro"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Advance PDF Studio</span>
                <ExternalLink className="w-3 h-3 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Guides */}
              <Link
                to="/guides"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/guides')
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                }`}
              >
                Guides
              </Link>

              {/* Support */}
              <Link
                to="/support"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/support'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                }`}
              >
                Support
              </Link>

              {/* All Tools */}
              <Link
                to="/tools"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/tools'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                }`}
              >
                All Tools
              </Link>
            </nav>

            {/* Actions & Theme Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <PWAInstallButton />

              {/* Home symbol on top nav */}
              <Link
                to="/"
                title="Return to Home"
                aria-label="Return to Home"
                className={`p-1.5 sm:p-2 rounded-lg border transition-colors flex items-center justify-center ${
                  location.pathname === '/'
                    ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/70 dark:text-blue-400 dark:border-blue-800'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Home className="w-4 h-4" />
              </Link>

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

              {/* Mobile menu hamburger button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 focus:outline-none cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer (Matches Exact Design in Reference Images 1, 2, 3, 4) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0a0f1d] text-white overflow-y-auto flex flex-col justify-between animate-in fade-in duration-150">
          {/* Top Bar of Drawer (Image 1) */}
          <div className="sticky top-0 z-10 bg-[#0a0f1d] border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <Layers className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 text-[7px] font-black tracking-tight bg-slate-900 text-blue-400 border border-blue-500/40 rounded px-1 leading-none py-0.5">
                  IC
                </span>
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-white block leading-tight">
                  Image Compressor
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                  <span>Ashish Systems</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">100% In-Browser</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                title="Return to Home"
                aria-label="Return to Home"
                className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <Home className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={cycleTheme}
                title={getThemeTitle()}
                className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-blue-300 cursor-pointer"
              >
                {getThemeIcon()}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="p-4 space-y-6 flex-1">
            {/* 1. IMAGE TOOLS (Matches Image 2) */}
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 px-1">
                IMAGE TOOLS
              </div>
              <div className="space-y-0.5">
                {imageTools.map((t) => (
                  <Link
                    key={t.name}
                    to={t.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 px-2 py-2.5 rounded-lg text-white hover:text-emerald-300 hover:bg-slate-850 text-sm font-medium transition-colors"
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {t.icon}
                    </div>
                    <span>{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. PDF TOOLS (Matches Image 3) */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400 px-1">
                PDF TOOLS
              </div>
              <div className="space-y-0.5">
                {pdfTools.map((t) => (
                  <Link
                    key={t.name}
                    to={t.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 px-2 py-2.5 rounded-lg text-white hover:text-sky-300 hover:bg-slate-850 text-sm font-medium transition-colors"
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {t.icon}
                    </div>
                    <span>{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. ADVANCED PDF / IMAGE STUDIO BANNER (Matches Image 4) */}
            <div className="pt-2">
              <a
                href={ADVANCE_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/30 text-emerald-400 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-sm text-emerald-400">
                    Advanced PDF Studio (Pro Tools)
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* 4. INFORMATION & SUPPORT (Matches Image 4) */}
            <div className="space-y-3 pt-2 border-t border-slate-800/60">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                INFORMATION &amp; SUPPORT
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-1 text-sm">
                <Link
                  to="/guides"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Blog &amp; Guides
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  Help &amp; Support
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </div>

              <div className="px-1 pt-1">
                <Link
                  to="/tools"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-block"
                >
                  All Tools &amp; Presets &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Action Button (Image 1) */}
          <div className="sticky bottom-0 bg-[#0a0f1d] border-t border-slate-800/80 p-4">
            <Link
              to="/compress"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-500 font-bold text-sm shadow-lg flex items-center justify-center transition-colors"
            >
              Upload Images
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
