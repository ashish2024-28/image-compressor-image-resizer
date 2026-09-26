import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  sublabel,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full ${className}`}>
      {(label || sublabel) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>{label}</span>
          <span>{sublabel ?? `${clamped}%`}</span>
        </div>
      )}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
