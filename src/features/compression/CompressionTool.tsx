import React from 'react';
import {
  Sliders,
  Maximize2,
  FileType,
  Check,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Target,
  Shield,
} from 'lucide-react';
import type { ImageSettings, OutputFormat, QualityPreset, ResizeMode } from '../../types';
import { isAvifSupported } from '../../utils/fileUtils';

export interface CompressionToolProps {
  settings: ImageSettings;
  onUpdateSetting: <K extends keyof ImageSettings>(key: K, value: ImageSettings[K]) => void;
  onQualityPresetChange: (preset: QualityPreset) => void;
  onQualityChange: (quality: number) => void;
  onFormatChange: (format: OutputFormat) => void;
  onResetSettings: () => void;
  defaultAspectRatio?: number;
}

export const CompressionTool: React.FC<CompressionToolProps> = ({
  settings,
  onUpdateSetting,
  onQualityPresetChange,
  onQualityChange,
  onFormatChange,
  defaultAspectRatio = 16 / 9,
}) => {
  const avifSupported = isAvifSupported();

  const handleWidthChange = (w: number | null) => {
    onUpdateSetting('width', w);
    if (settings.maintainAspectRatio && w !== null && defaultAspectRatio) {
      onUpdateSetting('height', Math.round(w / defaultAspectRatio));
    }
  };

  const handleHeightChange = (h: number | null) => {
    onUpdateSetting('height', h);
    if (settings.maintainAspectRatio && h !== null && defaultAspectRatio) {
      onUpdateSetting('width', Math.round(h * defaultAspectRatio));
    }
  };

  const handleRotate = () => {
    const nextRot = (settings.rotation + 90) % 360;
    onUpdateSetting('rotation', nextRot);
  };

  return (
    <div className="pro-card rounded-2xl p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Image Settings & Tools
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust image quality, file size limit, format, and size
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onQualityPresetChange('medium');
            onFormatChange('original');
            onUpdateSetting('targetSizeEnabled', false);
            onUpdateSetting('rotation', 0);
            onUpdateSetting('flipHorizontal', false);
            onUpdateSetting('flipVertical', false);
            onUpdateSetting('resizeEnabled', false);
            onUpdateSetting('maxDimensionsEnabled', false);
          }}
          className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors font-medium cursor-pointer"
        >
          Reset to Default
        </button>
      </div>

      {/* 1. Quality Control */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            Image Quality
          </label>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 rounded">
            {settings.quality}%
          </span>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3">
          {(['low', 'medium', 'high', 'custom'] as QualityPreset[]).map((preset) => {
            const isSelected = settings.qualityPreset === preset;
            const labels: Record<QualityPreset, { name: string; pct: string }> = {
              low: { name: 'Small File', pct: '50%' },
              medium: { name: 'Balanced', pct: '75%' },
              high: { name: 'High Quality', pct: '85%' },
              custom: { name: 'Custom', pct: 'Slider' },
            };

            return (
              <button
                key={preset}
                type="button"
                onClick={() => onQualityPresetChange(preset)}
                className={`py-2 px-1 text-center rounded-lg border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div>{labels[preset].name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{labels[preset].pct}</div>
              </button>
            );
          })}
        </div>

        {/* Custom Slider */}
        <div className="space-y-1.5">
          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={settings.quality}
            onChange={(e) => onQualityChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Smaller file (10%)</span>
            <span>Balanced (75%)</span>
            <span>Best look (100%)</span>
          </div>
        </div>

        {settings.format === 'image/png' && (
          <div className="text-[11px] text-amber-700 dark:text-amber-300 mt-2 bg-amber-50 dark:bg-amber-950/50 p-2.5 rounded-lg space-y-1">
            <p className="font-semibold">💡 Helpful Tip for PNG:</p>
            <p>
              PNG keeps all image details crisp. If you need a strict file size under a specific limit (like 50 KB or 100 KB), check <strong>Limit File Size (Max KB)</strong> below. Or choose <strong>WebP</strong> format for much smaller photos.
            </p>
          </div>
        )}
      </div>

      {/* 2. Target File Size (KB) Mode */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <label className="flex items-center gap-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={settings.targetSizeEnabled}
            onChange={(e) => onUpdateSetting('targetSizeEnabled', e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-600" />
            Limit File Size (Max KB)
          </span>
        </label>

        {settings.targetSizeEnabled && (
          <div className="space-y-3 bg-emerald-50/50 dark:bg-emerald-950/30 p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={10}
                max={10000}
                step={10}
                value={settings.targetSizeKB ?? 200}
                onChange={(e) => onUpdateSetting('targetSizeKB', Number(e.target.value))}
                className="w-28 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">KB Maximum Size</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[50, 100, 200, 500, 1024].map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => onUpdateSetting('targetSizeKB', kb)}
                  className={`text-[11px] px-2 py-1 rounded-md border cursor-pointer ${
                    settings.targetSizeKB === kb
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
              Guarantees your photo stays strictly under this limit (ideal for exam, passport, and job portals).
            </p>
          </div>
        )}
      </div>

      {/* 3. Output Format */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <FileType className="w-4 h-4 text-blue-600" />
            Save As Format
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'original', name: 'Original', desc: 'Keep same type' },
            { id: 'image/webp', name: 'WebP', desc: 'Smallest file size' },
            { id: 'image/jpeg', name: 'JPG', desc: 'Best for standard photos' },
            { id: 'image/png', name: 'PNG', desc: 'Clear & transparent' },
          ].map((fmt) => {
            const isSelected = settings.format === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onFormatChange(fmt.id as OutputFormat)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{fmt.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{fmt.desc}</div>
              </button>
            );
          })}
        </div>

        {avifSupported && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => onFormatChange('image/avif')}
              className={`w-full p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                settings.format === 'image/avif'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>AVIF (Next-Gen Format)</span>
                {settings.format === 'image/avif' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                High compression efficiency, verified supported in your browser
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 4. Transform & Orientation (Fix sideways phone photos / flip) */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2.5">
          <RotateCw className="w-4 h-4 text-blue-600" />
          Rotate & Flip Image
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRotate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rotate 90° ({settings.rotation}°)</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSetting('flipHorizontal', !settings.flipHorizontal)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              settings.flipHorizontal
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span>Flip Left / Right</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSetting('flipVertical', !settings.flipVertical)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              settings.flipVertical
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <FlipVertical className="w-3.5 h-3.5" />
            <span>Flip Up / Down</span>
          </button>
        </div>
      </div>

      {/* 5. Resize Options */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.resizeEnabled}
              onChange={(e) => onUpdateSetting('resizeEnabled', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-blue-600" />
              Change Dimensions (Width / Height)
            </span>
          </label>
        </div>

        {settings.resizeEnabled && (
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="Auto"
                  value={settings.width ?? ''}
                  onChange={(e) =>
                    handleWidthChange(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="Auto"
                  value={settings.height ?? ''}
                  onChange={(e) =>
                    handleHeightChange(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={settings.maintainAspectRatio}
                  onChange={(e) => onUpdateSetting('maintainAspectRatio', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span>Maintain aspect ratio</span>
              </label>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px]">Mode:</span>
                {(['fit', 'fill', 'stretch'] as ResizeMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onUpdateSetting('resizeMode', mode)}
                    className={`px-2 py-0.5 rounded text-[11px] uppercase capitalize font-medium border ${
                      settings.resizeMode === mode
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Maximum Dimensions constraint */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <label className="flex items-center gap-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={settings.maxDimensionsEnabled}
            onChange={(e) => onUpdateSetting('maxDimensionsEnabled', e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Set Maximum Size Cap
          </span>
        </label>

        {settings.maxDimensionsEnabled && (
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Max Width (px)</label>
                <input
                  type="number"
                  value={settings.maxWidth ?? 1920}
                  onChange={(e) =>
                    onUpdateSetting('maxWidth', e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Max Height (px)</label>
                <input
                  type="number"
                  value={settings.maxHeight ?? 1080}
                  onChange={(e) =>
                    onUpdateSetting('maxHeight', e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={settings.doNotEnlarge}
                onChange={(e) => onUpdateSetting('doNotEnlarge', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
              />
              <span>Do not stretch smaller images (Recommended)</span>
            </label>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          Location & camera details safely removed
        </span>
        <span>100% In-Browser & Private</span>
      </div>
    </div>
  );
};
