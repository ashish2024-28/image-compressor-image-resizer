import React from 'react';
import { Sliders, Sun, Contrast, Wand2, RotateCcw } from 'lucide-react';
import type { ImageFilterOptions } from '../../utils/filterUtils';
import { DEFAULT_FILTERS, hasActiveFilters } from '../../utils/filterUtils';

export interface ImageFilterControlsProps {
  filters: ImageFilterOptions;
  onChange: (filters: ImageFilterOptions) => void;
  onApplyInstant?: () => void;
  disabled?: boolean;
}

export const ImageFilterControls: React.FC<ImageFilterControlsProps> = ({
  filters,
  onChange,
  onApplyInstant,
  disabled = false,
}) => {
  const isModified = hasActiveFilters(filters);

  const handleReset = () => {
    onChange({ ...DEFAULT_FILTERS });
    if (onApplyInstant) {
      setTimeout(onApplyInstant, 0);
    }
  };

  const handlePreset = (type: 'none' | 'bw' | 'sepia' | 'vintage' | 'high-contrast' | 'invert') => {
    let next: ImageFilterOptions = { ...DEFAULT_FILTERS };
    switch (type) {
      case 'bw':
        next = { grayscale: 100, sepia: 0, invert: 0, brightness: 105, contrast: 120 };
        break;
      case 'sepia':
        next = { grayscale: 0, sepia: 85, invert: 0, brightness: 100, contrast: 110 };
        break;
      case 'vintage':
        next = { grayscale: 15, sepia: 40, invert: 0, brightness: 110, contrast: 90 };
        break;
      case 'high-contrast':
        next = { grayscale: 0, sepia: 0, invert: 0, brightness: 105, contrast: 145 };
        break;
      case 'invert':
        next = { grayscale: 0, sepia: 0, invert: 100, brightness: 100, contrast: 100 };
        break;
      default:
        next = { ...DEFAULT_FILTERS };
        break;
    }
    onChange(next);
    if (onApplyInstant) {
      setTimeout(onApplyInstant, 0);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 space-y-4">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              Image Editing Suite & Filters
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Apply photo filters and tonal adjustments in real-time
            </p>
          </div>
        </div>

        {isModified && (
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 rounded-md transition-colors cursor-pointer"
            title="Reset all filters to default"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Quick 1-Click Filter Presets */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <Wand2 className="w-3 h-3 text-purple-500" /> Quick Filter Styles
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          <button
            type="button"
            onClick={() => handlePreset('none')}
            disabled={disabled}
            className={`px-2 py-1.5 text-[11px] rounded-lg border font-medium transition-all text-center cursor-pointer ${
              !isModified
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => handlePreset('bw')}
            disabled={disabled}
            className={`px-2 py-1.5 text-[11px] rounded-lg border font-medium transition-all text-center cursor-pointer ${
              filters.grayscale === 100 && filters.sepia === 0 && filters.invert === 0
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Grayscale
          </button>
          <button
            type="button"
            onClick={() => handlePreset('sepia')}
            disabled={disabled}
            className={`px-2 py-1.5 text-[11px] rounded-lg border font-medium transition-all text-center cursor-pointer ${
              filters.sepia >= 75
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Sepia
          </button>
          <button
            type="button"
            onClick={() => handlePreset('invert')}
            disabled={disabled}
            className={`px-2 py-1.5 text-[11px] rounded-lg border font-medium transition-all text-center cursor-pointer ${
              filters.invert === 100
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Invert
          </button>
          <button
            type="button"
            onClick={() => handlePreset('high-contrast')}
            disabled={disabled}
            className={`px-2 py-1.5 text-[11px] rounded-lg border font-medium transition-all text-center cursor-pointer ${
              filters.contrast >= 130
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            High Contrast
          </button>
          <button
            type="button"
            onClick={() => handlePreset('vintage')}
            disabled={disabled}
            className={`px-2 py-1.5 text-[11px] rounded-lg border font-medium transition-all text-center cursor-pointer ${
              filters.sepia === 40 && filters.grayscale === 15
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Vintage
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1">
        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sun className="w-3 h-3 text-amber-500" /> Brightness
            </span>
            <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {filters.brightness}%
            </span>
          </div>
          <input
            type="range"
            min={30}
            max={180}
            step={2}
            value={filters.brightness}
            disabled={disabled}
            onChange={(e) => onChange({ ...filters, brightness: Number(e.target.value) })}
            onMouseUp={onApplyInstant}
            onTouchEnd={onApplyInstant}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Contrast className="w-3 h-3 text-indigo-500" /> Contrast
            </span>
            <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {filters.contrast}%
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={180}
            step={2}
            value={filters.contrast}
            disabled={disabled}
            onChange={(e) => onChange({ ...filters, contrast: Number(e.target.value) })}
            onMouseUp={onApplyInstant}
            onTouchEnd={onApplyInstant}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Grayscale */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Grayscale (Black & White)
            </span>
            <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {filters.grayscale}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.grayscale}
            disabled={disabled}
            onChange={(e) => onChange({ ...filters, grayscale: Number(e.target.value) })}
            onMouseUp={onApplyInstant}
            onTouchEnd={onApplyInstant}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Sepia */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Sepia (Warm Vintage Tone)
            </span>
            <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {filters.sepia}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.sepia}
            disabled={disabled}
            onChange={(e) => onChange({ ...filters, sepia: Number(e.target.value) })}
            onMouseUp={onApplyInstant}
            onTouchEnd={onApplyInstant}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Invert */}
        <div className="space-y-1 sm:col-span-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Invert Colors (Negative)
            </span>
            <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {filters.invert}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.invert}
            disabled={disabled}
            onChange={(e) => onChange({ ...filters, invert: Number(e.target.value) })}
            onMouseUp={onApplyInstant}
            onTouchEnd={onApplyInstant}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
};
