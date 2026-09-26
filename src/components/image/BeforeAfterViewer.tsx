import React, { useState, useRef, useCallback } from 'react';
import { Columns, SplitSquareVertical, ZoomIn, ZoomOut } from 'lucide-react';
import { formatFileSize } from '../../utils/formatFileSize';

export interface BeforeAfterViewerProps {
  originalUrl: string;
  optimizedUrl?: string;
  originalSize: number;
  optimizedSize?: number;
  originalWidth: number;
  originalHeight: number;
  optimizedWidth?: number;
  optimizedHeight?: number;
  reductionPercentage?: number;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  originalUrl,
  optimizedUrl,
  originalSize,
  optimizedSize,
  originalWidth,
  originalHeight,
  optimizedWidth,
  optimizedHeight,
  reductionPercentage,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
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

  return (
    <div className="space-y-3 select-none">
      {/* View Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side by Side</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setZoomFit(!zoomFit)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          {zoomFit ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
          <span>{zoomFit ? 'Fit View' : '100% Pixels'}</span>
        </button>
      </div>

      {/* Main Comparison Area */}
      {viewMode === 'slider' && optimizedUrl ? (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onClick={handleContainerClick}
          className="relative w-full h-[320px] sm:h-[460px] bg-transparency-pattern rounded-xl overflow-hidden cursor-ew-resize border border-slate-300 dark:border-slate-800 select-none touch-none shadow-xs"
        >
          {/* Background: Optimized Image (Right side reveal) */}
          <div className="absolute inset-0 flex items-center justify-center overflow-auto">
            <img
              src={optimizedUrl}
              alt="Optimized result"
              className={`select-none pointer-events-none transition-all ${
                zoomFit ? 'max-w-full max-h-full object-contain' : 'max-w-none'
              }`}
            />
          </div>

          {/* Foreground: Original Image (Clipped to sliderPosition) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="relative w-full h-full">
              <div
                className="absolute inset-y-0 left-0 flex items-center justify-center"
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

          {/* Divider Line & Handle */}
          <div
            className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-800 shadow-xl border border-slate-300 flex items-center justify-center text-[10px] font-bold">
              ⇄
            </div>
          </div>

          {/* Badges on images */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium z-20 pointer-events-none border border-white/20 max-w-[45%] truncate">
            <span className="hidden xs:inline">ORIG: </span>{formatFileSize(originalSize)}
          </div>
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-blue-600/90 backdrop-blur-xs text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium z-20 pointer-events-none border border-white/20 max-w-[50%] truncate text-right">
            <span className="hidden xs:inline">OPT: </span>{optimizedSize ? formatFileSize(optimizedSize) : 'N/A'}
            {reductionPercentage !== undefined && reductionPercentage > 0 && ` (-${reductionPercentage}%)`}
          </div>
        </div>
      ) : (
        /* Side by Side Mode or Single view */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">BEFORE (Original)</span>
              <span className="text-slate-500 dark:text-slate-400">
                {originalWidth}×{originalHeight} • {formatFileSize(originalSize)}
              </span>
            </div>
            <div className="relative flex-1 min-h-[220px] sm:min-h-[300px] flex items-center justify-center bg-transparency-pattern rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
              <img
                src={originalUrl}
                alt="Original"
                className={`select-none ${zoomFit ? 'max-w-full max-h-[300px] object-contain' : 'max-w-none'}`}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400">AFTER (Optimized)</span>
              <span className="text-slate-500 dark:text-slate-400">
                {optimizedWidth || originalWidth}×{optimizedHeight || originalHeight} •{' '}
                {optimizedSize ? formatFileSize(optimizedSize) : 'N/A'}
                {reductionPercentage !== undefined && reductionPercentage > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-1">(-{reductionPercentage}%)</span>
                )}
              </span>
            </div>
            <div className="relative flex-1 min-h-[220px] sm:min-h-[300px] flex items-center justify-center bg-transparency-pattern rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
              <img
                src={optimizedUrl || originalUrl}
                alt="Optimized"
                className={`select-none ${zoomFit ? 'max-w-full max-h-[300px] object-contain' : 'max-w-none'}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
