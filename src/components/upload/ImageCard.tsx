import React from 'react';
import { Eye, Download, Trash2, RefreshCw, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import type { ImageItem, ImageSettings } from '../../types';
import { formatFileSize } from '../../utils/formatFileSize';
import { getOutputFilename, downloadBlob, getExtensionFromMime } from '../../utils/fileUtils';
import { Button } from '../common/Button';

export interface ImageCardProps {
  item: ImageItem;
  globalSettings: ImageSettings;
  onPreview: (item: ImageItem) => void;
  onRemove: (id: string) => void;
  onProcess: (id: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  item,
  globalSettings,
  onPreview,
  onRemove,
  onProcess,
}) => {
  const currentSettings = item.customSettings || globalSettings;
  const targetMime = item.outputType || (currentSettings.format === 'original' ? item.originalType : currentSettings.format);
  const targetExt = getExtensionFromMime(targetMime).toUpperCase();

  const handleDownload = () => {
    if (!item.outputBlob) return;
    const filename = getOutputFilename(item.name, item.outputType || targetMime);
    downloadBlob(item.outputBlob, filename);
  };

  return (
    <div className="pro-card rounded-2xl p-3.5 sm:p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        {/* Top: Thumbnail & Status */}
        <div className="flex gap-3 sm:gap-4 items-start">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-transparency-pattern border border-slate-200 dark:border-slate-700 shrink-0">
            <img
              src={item.outputUrl || item.originalUrl}
              alt={item.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
            {item.status === 'processing' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4
                className="text-sm font-semibold text-slate-900 dark:text-white truncate"
                title={item.name}
              >
                {item.name}
              </h4>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Remove image"
                aria-label="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Dimensions & Formats */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>
                {item.originalWidth} × {item.originalHeight}
              </span>
              <span>·</span>
              <span className="font-mono uppercase">{getExtensionFromMime(item.originalType)}</span>
              <span>→</span>
              <span className="font-mono uppercase text-blue-600 dark:text-blue-400 font-semibold">
                {targetExt}
              </span>
            </div>

            {/* Sizes & Savings */}
            <div className="mt-2 text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Original</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {formatFileSize(item.originalSize)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-medium">New Size</span>
                {item.status === 'done' && item.outputSize !== undefined ? (
                  <span
                    className={`font-medium ${
                      item.outputSize > item.originalSize
                        ? 'text-amber-600 dark:text-amber-400 font-semibold'
                        : 'text-blue-600 dark:text-blue-400 font-semibold'
                    }`}
                  >
                    {formatFileSize(item.outputSize)}
                  </span>
                ) : item.status === 'processing' ? (
                  <span className="text-slate-400 italic">Working...</span>
                ) : (
                  <span className="text-slate-400 italic">Ready to save</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results row if processed */}
        {item.status === 'done' && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                {item.outputSize !== undefined && item.outputSize > item.originalSize ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Size:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      +{Math.abs(item.reductionPercentage || 0)}% (Larger)
                    </span>
                  </>
                ) : item.isFallbackToOriginal ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      Preserved (Already optimal)
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Reduced:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {item.reductionPercentage && item.reductionPercentage > 0
                        ? `-${item.reductionPercentage}%`
                        : '0% (Lossless)'}
                    </span>
                  </>
                )}
              </div>
              {item.processingTimeMs !== undefined && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" /> {item.processingTimeMs}ms
                </span>
              )}
            </div>

            {item.outputSize !== undefined && item.outputSize > item.originalSize && targetExt === 'PNG' && (
              <p className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-md leading-tight">
                PNG is an uncompressed lossless format. To reduce size below {formatFileSize(item.originalSize)}, choose <strong>WebP</strong> or enable <strong>Target File Size (KB)</strong>.
              </p>
            )}
          </div>
        )}

        {item.status === 'error' && (
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/50 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="truncate">{item.errorMessage || 'Optimization failed'}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        {item.status === 'done' ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              leftIcon={<Eye className="w-3.5 h-3.5" />}
              onClick={() => onPreview(item)}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            isLoading={item.status === 'processing'}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => onProcess(item.id)}
          >
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
};
