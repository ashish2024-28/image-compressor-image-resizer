import React, { useState } from 'react';
import { Play, Download, Trash2, AlertCircle } from 'lucide-react';
import type { ImageItem, ImageSettings, BatchProgress } from '../../types';
import { ImageCard } from './ImageCard';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';
import { downloadAllAsZip } from '../../utils/fileUtils';
import { formatFileSize } from '../../utils/formatFileSize';

export interface ImageListProps {
  images: ImageItem[];
  globalSettings: ImageSettings;
  progress: BatchProgress;
  batchWarning?: string | null;
  onPreview: (item: ImageItem) => void;
  onRemove: (id: string) => void;
  onProcess: (id: string) => void;
  onProcessAll: () => void;
  onClearAll: () => void;
}

export const ImageList: React.FC<ImageListProps> = ({
  images,
  globalSettings,
  progress,
  batchWarning,
  onPreview,
  onRemove,
  onProcess,
  onProcessAll,
  onClearAll,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const completedCount = images.filter((img) => img.status === 'done').length;
  const totalOriginalBytes = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalOptimizedBytes = images.reduce(
    (acc, img) => acc + (img.outputSize !== undefined ? img.outputSize : img.originalSize),
    0
  );
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalOptimizedBytes);

  const handleDownloadAllZip = async () => {
    if (completedCount === 0) return;
    setIsZipping(true);
    setZipProgress(0);
    try {
      await downloadAllAsZip(images, 'optimized-images.zip', (p) => setZipProgress(p));
    } catch {
      // Error handled
    } finally {
      setIsZipping(false);
    }
  };

  const handleClearClick = () => {
    // Only ask confirmation if there are completed images or more than 3 images
    if (completedCount > 0 || images.length > 2) {
      setShowClearConfirm(true);
    } else {
      onClearAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Warning Banner */}
      {batchWarning && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Memory Safety Notice</p>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">{batchWarning}</p>
          </div>
        </div>
      )}

      {/* Action Header Bar */}
      <div className="pro-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Selected Images ({images.length})
            </h3>
            {completedCount > 0 && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                · {completedCount} ready
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total original size: {formatFileSize(totalOriginalBytes)}
            {completedCount > 0 && totalSavedBytes > 0 && (
              <>
                {' '}
                · <span className="text-emerald-600 dark:text-emerald-400 font-medium">Saved: {formatFileSize(totalSavedBytes)}</span>
              </>
            )}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleClearClick}
            leftIcon={<Trash2 className="w-4 h-4 text-slate-400" />}
          >
            Clear All
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="w-full sm:w-auto flex-1 sm:flex-initial"
            onClick={onProcessAll}
            isLoading={progress.isProcessing}
            leftIcon={<Play className="w-4 h-4" />}
          >
            {progress.isProcessing
              ? `Saving ${progress.completed + 1} of ${images.length}...`
              : 'Save All Changes'}
          </Button>

          {completedCount > 0 && (
            <Button
              variant="success"
              size="sm"
              className="w-full sm:w-auto flex-1 sm:flex-initial"
              onClick={handleDownloadAllZip}
              isLoading={isZipping}
              leftIcon={<Download className="w-4 h-4" />}
            >
              {isZipping ? `Creating ZIP (${zipProgress}%)...` : `Download All (${completedCount})`}
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar during Batch Processing */}
      {progress.isProcessing && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl">
          <ProgressBar
            progress={progress.percentage}
            label={`Processing: ${progress.currentName || 'Preparing...'}`}
            sublabel={`${progress.completed} of ${progress.total} completed (${progress.percentage}%)`}
          />
        </div>
      )}

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((item) => (
          <ImageCard
            key={item.id}
            item={item}
            globalSettings={globalSettings}
            onPreview={onPreview}
            onRemove={onRemove}
            onProcess={onProcess}
          />
        ))}
      </div>

      {/* Confirmation Modal for Clear All */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All Images?"
        maxWidth="sm"
      >
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Are you sure you want to remove all {images.length} images? Any optimized results will be cleared from memory.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setShowClearConfirm(false);
              onClearAll();
            }}
          >
            Yes, Clear All
          </Button>
        </div>
      </Modal>
    </div>
  );
};
