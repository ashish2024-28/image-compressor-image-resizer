import React from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <UploadCloud className="w-12 h-12 text-blue-500/80" />,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="text-center py-12 px-4 max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-2xl text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <Button onClick={onAction} variant="primary">
            {actionText}
          </Button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="outline">
            {secondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
};
