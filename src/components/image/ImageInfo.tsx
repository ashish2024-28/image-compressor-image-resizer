import React from 'react';
import type { ImageItem } from '../../types';
import { formatFileSize } from '../../utils/formatFileSize';
import { getExtensionFromMime } from '../../utils/fileUtils';

export interface ImageInfoProps {
  item: ImageItem;
  className?: string;
}

export const ImageInfo: React.FC<ImageInfoProps> = ({ item, className = '' }) => {
  const aspectRounded = item.aspectRatio ? item.aspectRatio.toFixed(2) : '1.0';

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${className}`}>
      <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/90 dark:border-slate-800">
        <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Original Dimensions</span>
        <span className="font-semibold text-slate-900 dark:text-white">
          {item.originalWidth} × {item.originalHeight} px
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Ratio: {aspectRounded}:1</span>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/90 dark:border-slate-800">
        <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Original Size</span>
        <span className="font-semibold text-slate-900 dark:text-white">
          {formatFileSize(item.originalSize)}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 font-mono uppercase">
          {getExtensionFromMime(item.originalType)}
        </span>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/90 dark:border-slate-800">
        <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">New Size</span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {item.outputSize ? formatFileSize(item.outputSize) : 'Pending save'}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 font-mono uppercase">
          {item.outputType ? getExtensionFromMime(item.outputType) : 'Pending'}
        </span>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/90 dark:border-slate-800">
        <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Space Saved</span>
        <span
          className={`font-semibold ${
            item.reductionPercentage && item.reductionPercentage > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {item.reductionPercentage !== undefined ? `${item.reductionPercentage}%` : '0%'}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
          {item.savingsBytes && item.savingsBytes > 0
            ? `Saved ${formatFileSize(item.savingsBytes)}`
            : 'Same size'}
        </span>
      </div>
    </div>
  );
};
