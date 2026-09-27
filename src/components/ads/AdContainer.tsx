import React from 'react';

export interface AdContainerProps {
  children?: React.ReactNode;
  className?: string;
  slotLabel?: string;
}

/**
 * AdContainer provides a dedicated, clearly labeled, non-obtrusive slot
 * compliant with Google AdSense layout guidelines.
 */
export const AdContainer: React.FC<AdContainerProps> = ({
  children,
  className = '',
  slotLabel = 'Advertisement',
}) => {
  return (
    <div className={`my-6 sm:my-8 flex flex-col items-center justify-center w-full min-w-0 ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 select-none font-medium">
        {slotLabel}
      </span>
      <div className="w-full max-w-4xl flex items-center justify-center min-h-[90px] bg-slate-50/50 dark:bg-slate-900/30 rounded-xl overflow-x-auto text-center text-xs text-slate-500 dark:text-slate-400">
        {children || (
          <div className="flex flex-col items-center justify-center py-4">
            <span className="font-medium text-slate-700 dark:text-slate-300">Responsive Ad Space</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              (Google AdSense Slot)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
