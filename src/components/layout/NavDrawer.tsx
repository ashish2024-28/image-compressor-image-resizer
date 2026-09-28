import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layers,
  Sun,
  Moon,
  Monitor,
  X,
  Search,
  ExternalLink,
  Sparkles,
  Minimize2,
  Maximize2,
  FileImage,
  Scissors,
  FileText,
  RotateCw,
  Camera,
  BookOpen,
  Info,
  HelpCircle,
  FileQuestion,
  ArrowDownLeft,
} from 'lucide-react';
import type { ThemeMode } from '../../types';

export interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

interface ToolItem {
  id: string;
  name: string;
  path: string;
  isExternal?: boolean;
  category: 'image' | 'pdf';
  icon: React.ReactNode;
  iconBg?: string;
  badge?: string;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    
    // Auto-focus search input after drawer opens
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  const imageTools: ToolItem[] = [
    {
      id: 'compress-img',
      name: 'Compress Image',
      path: '/compress',
      category: 'image',
      icon: <ArrowDownLeft className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'resize-img',
      name: 'Resize Image',
      path: '/resize',
      category: 'image',
      icon: <Maximize2 className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'jpg-to-png',
      name: 'JPG to PNG',
      path: '/jpg-to-png',
      category: 'image',
      icon: <FileImage className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'png-to-jpg',
      name: 'PNG to JPG',
      path: '/png-to-jpg',
      category: 'image',
      icon: <FileImage className="w-4 h-4 text-orange-400" />,
    },
    {
      id: 'webp-converter',
      name: 'WebP Converter',
      path: '/convert',
      category: 'image',
      icon: <FileImage className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'passport-photo',
      name: 'Passport & ID Photo',
      path: '/passport-photo-creator',
      category: 'image',
      icon: <Camera className="w-4 h-4 text-amber-400" />,
    },
  ];

  const pdfTools: ToolItem[] = [
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      path: '/compress-pdf',
      category: 'pdf',
      icon: <ArrowDownLeft className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'merge-pdf',
      name: 'Merge PDF',
      path: '/merge-pdf',
      category: 'pdf',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'split-pdf',
      name: 'Split PDF',
      path: '/split-pdf',
      category: 'pdf',
      icon: <Scissors className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'image-to-pdf',
      name: 'Image to PDF',
      path: '/image-to-pdf',
      category: 'pdf',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      path: '/image-to-pdf',
      category: 'pdf',
      icon: <FileImage className="w-4 h-4 text-orange-400" />,
    },
    {
      id: 'pdf-to-image',
      name: 'PDF to Image',
      path: '/pdf-to-images',
      category: 'pdf',
      icon: <FileImage className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'rotate-watermark-pdf',
      name: 'Rotate & Watermark PDF',
      path: '/pdf-rotate-watermark',
      category: 'pdf',
      icon: <RotateCw className="w-4 h-4 text-teal-400" />,
    },
  ];

  const filteredImageTools = useMemo(() => {
    if (!searchQuery.trim()) return imageTools;
    const q = searchQuery.toLowerCase();
    return imageTools.filter((t) => t.name.toLowerCase().includes(q));
  }, [searchQuery, imageTools]);

  const filteredPdfTools = useMemo(() => {
    if (!searchQuery.trim()) return pdfTools;
    const q = searchQuery.toLowerCase();
    return pdfTools.filter((t) => t.name.toLowerCase().includes(q));
  }, [searchQuery, pdfTools]);

  const cycleTheme = () => {
    if (theme === 'light') onThemeChange('dark');
    else if (theme === 'dark') onThemeChange('system');
    else onThemeChange('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-400" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-blue-400" />;
    return <Monitor className="w-4 h-4 text-slate-400" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <aside
        className="relative w-full max-w-md bg-[#080d19] text-slate-100 h-full shadow-2xl flex flex-col z-10 border-l border-slate-800/80 animate-in slide-in-from-right duration-200"
        aria-label="Navigation and Tool Directory"
      >
        {/* Top Header Bar with responsive clean wrap */}
        <div className="px-4 py-3.5 border-b border-slate-800/80 bg-[#060a13] flex flex-col gap-2.5">
          {/* Top Row: Brand on left, Controls on right */}
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 focus:outline-none min-w-0 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-extrabold text-white block leading-tight tracking-tight truncate">
                  Image Compressor
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block leading-none mt-0.5 truncate">
                  PDF &amp; IMAGE TOOLS
                </span>
              </div>
            </Link>

            {/* Right Controls: Theme + Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={cycleTheme}
                className="p-1.5 rounded-lg bg-[#111928] border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Toggle color theme"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-[#111928] border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full-width Search Input Row (Wraps cleanly without squeezing) */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-[#111928] border border-slate-700/80 text-white placeholder-slate-400 text-xs rounded-full pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Tool Directory Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* 1. TOP: IMAGE TOOLS */}
          {filteredImageTools.length > 0 && (
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 mb-2.5 px-2">
                IMAGE TOOLS
              </div>
              <div className="space-y-1">
                {filteredImageTools.map((tool) => {
                  const isActive = location.pathname === tool.path;
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-[#162544] text-white font-semibold border border-blue-500/20 shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-[#111b2d]'
                      }`}
                    >
                      <div className="shrink-0">{tool.icon}</div>
                      <span className="text-sm tracking-normal group-hover:translate-x-0.5 transition-transform">
                        {tool.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. THEN: PDF TOOLS */}
          {filteredPdfTools.length > 0 && (
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400 mb-2.5 px-2">
                PDF TOOLS
              </div>
              <div className="space-y-1">
                {filteredPdfTools.map((tool) => {
                  const isActive = location.pathname === tool.path;
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-[#162544] text-white font-semibold border border-blue-500/20 shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-[#111b2d]'
                      }`}
                    >
                      <div className="shrink-0">{tool.icon}</div>
                      <span className="text-sm tracking-normal group-hover:translate-x-0.5 transition-transform">
                        {tool.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty search state */}
          {filteredImageTools.length === 0 && filteredPdfTools.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No matching tools found for "{searchQuery}".
            </div>
          )}

          {/* 3. THEN: ADVANCE PDF TOOLS STUDIO (Card exactly as screenshot 2) */}
          <div>
            <a
              href="https://pdf-tools-ten-eta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#06241b] border border-emerald-500/30 text-emerald-300 hover:bg-[#082e23] hover:border-emerald-500/50 shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-bold truncate text-emerald-200 group-hover:text-emerald-100">
                  Advanced PDF Tools Studio (DocuLite)
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* 4. THEN: INFORMATION & SUPPORTS (2 columns grid matching screenshot 2) */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 px-2">
              INFORMATION &amp; SUPPORT
            </div>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 px-2 text-sm">
              <Link
                to="/guides"
                onClick={onClose}
                className="text-slate-300 hover:text-white transition-colors py-1 block"
              >
                Blog &amp; Guides
              </Link>
              <Link
                to="/about"
                onClick={onClose}
                className="text-slate-300 hover:text-white transition-colors py-1 block"
              >
                About
              </Link>
              <Link
                to="/faq"
                onClick={onClose}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors py-1 block"
              >
                Help &amp; Support
              </Link>
              <Link
                to="/faq"
                onClick={onClose}
                className="text-slate-300 hover:text-white transition-colors py-1 block"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* Footer note in drawer */}
          <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400">
              100% Client-Side In-Browser Processing &bull; Zero Server Uploads
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};
