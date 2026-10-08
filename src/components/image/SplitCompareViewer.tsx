import React, { useState, useRef, useCallback } from 'react';
import { Columns, SplitSquareVertical, ZoomIn, ZoomOut, Eye } from 'lucide-react';
import { formatFileSize } from '../../utils/formatFileSize';
import { getExtensionFromMime } from '../../utils/fileUtils';

export interface SplitCompareViewerProps {
  originalUrl: string;
  changedUrl?: string;
  originalSize: number;
  changedSize?: number;
  originalWidth: number;
  originalHeight: number;
  changedWidth?: number;
  changedHeight?: number;
  originalFormat?: string;
  changedFormat?: string;
  isProcessing?: boolean;
  isFallbackToOriginal?: boolean;
}

export const SplitCompareViewer: React.FC<SplitCompareViewerProps> = ({
  originalUrl,
  changedUrl,
  originalSize,
  changedSize,
  originalWidth,
  originalHeight,
  changedWidth,
  changedHeight,
  originalFormat = 'image/jpeg',
  changedFormat,
  isProcessing = false,
  isFallbackToOriginal = false,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [zoomFit, setZoomFit] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const activeChangedUrl = changedUrl || originalUrl;
  const origFmtText = getExtensionFromMime(originalFormat).toUpperCase();
  const changedFmtText = changedFormat ? getExtensionFromMime(changedFormat).toUpperCase() : origFmtText;

  return (
    <div className="space-y-3 select-none">
      {/* Top View Mode & Zoom Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side by Side</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setZoomFit(!zoomFit)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-medium shadow-xs"
        >
          {zoomFit ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
          <span>{zoomFit ? 'Fit View' : 'Original Size'}</span>
        </button>
      </div>

      {/* Mode 1: Split Slider View */}
      {viewMode === 'slider' ? (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={handleContainerClick}
          className="relative w-full h-[280px] sm:h-[400px] md:h-[460px] bg-transparency-pattern rounded-2xl overflow-hidden cursor-ew-resize border border-slate-200 dark:border-slate-800 select-none touch-none shadow-inner"
        >
          {/* Background: Current Change (Right side reveal) */}
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <img
              src={activeChangedUrl}
              alt="Current change"
              className={`select-none pointer-events-none transition-all ${
                zoomFit ? 'max-w-full max-h-full object-contain' : 'max-w-none'
              }`}
            />
          </div>

          {/* Foreground: Original (Left side clipped) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="relative w-full h-full">
              <div
                className="absolute inset-y-0 left-0 flex items-center justify-center p-2"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
                }}
              >
                <img
                  src={originalUrl}
                  alt="Original"
                  className={`select-none pointer-events-none ${
                    zoomFit ? 'max-w-full max-h-full object-contain' : 'max-w-none'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Vertical Split Divider Bar & Drag Button */}
          <div
            className="absolute inset-y-0 w-0.5 bg-white shadow-2xl pointer-events-none z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-2xl border-2 border-blue-600 flex items-center justify-center text-xs font-bold transition-transform hover:scale-110">
              ⇄
            </div>
          </div>

          {/* Left Tag: Part 1 - Original Image */}
          <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold z-20 pointer-events-none border border-white/20 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Part 1: Original Image</span>
            <span className="text-slate-300 font-normal">
              ({formatFileSize(originalSize)} · {origFmtText})
            </span>
          </div>

          {/* Right Tag: Part 2 - Current Change */}
          <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold z-20 pointer-events-none border border-white/20 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Part 2: Current Change</span>
            <span className="text-blue-100 font-normal">
              ({changedSize ? formatFileSize(changedSize) : 'Live Preview'} · {changedFmtText})
            </span>
            {isFallbackToOriginal && (
              <span className="bg-emerald-500/80 text-[10px] px-1.5 py-0.5 rounded text-white font-medium">
                Protected (Original Kept)
              </span>
            )}
          </div>

          {/* Drag instruction helper on bottom */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/75 backdrop-blur-md text-slate-200 px-3 py-1 rounded-full text-[11px] pointer-events-none border border-white/10 hidden sm:block">
            Drag the slider sideways to compare Original vs Current Change
          </div>
        </div>
      ) : (
        /* Mode 2: Side by Side Two Column View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Part 1: Original Image */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                Part 1: Original Image
              </span>
              <span className="text-slate-500 font-medium">
                {originalWidth} × {originalHeight} px · {formatFileSize(originalSize)}
              </span>
            </div>
            <div className="h-[240px] sm:h-[300px] rounded-xl bg-transparency-pattern flex items-center justify-center p-2 overflow-hidden border border-slate-200/80 dark:border-slate-800">
              <img
                src={originalUrl}
                alt="Original"
                className={`select-none ${zoomFit ? 'max-w-full max-h-full object-contain' : 'max-w-none'}`}
              />
            </div>
          </div>

          {/* Part 2: Current Change */}
          <div className="rounded-2xl border-2 border-blue-500/40 dark:border-blue-500/30 bg-white dark:bg-slate-900/60 p-3.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Part 2: Current Change
              </span>
              <span className="text-slate-500 font-medium">
                {changedWidth || originalWidth} × {changedHeight || originalHeight} px ·{' '}
                {changedSize ? formatFileSize(changedSize) : 'Pending save'}
              </span>
            </div>
            <div className="h-[240px] sm:h-[300px] rounded-xl bg-transparency-pattern flex items-center justify-center p-2 overflow-hidden border border-slate-200/80 dark:border-slate-800">
              <img
                src={activeChangedUrl}
                alt="Current change"
                className={`select-none ${zoomFit ? 'max-w-full max-h-full object-contain' : 'max-w-none'}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
