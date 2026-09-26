import React, { useState } from 'react';
import { Download, Sliders, Plus, Minus, Info, RotateCw } from 'lucide-react';
import type { ImageItem, ImageSettings } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { BeforeAfterViewer } from './BeforeAfterViewer';
import { ImageInfo } from './ImageInfo';
import { downloadBlob, getOutputFilename } from '../../utils/fileUtils';

export interface ImagePreviewModalProps {
  item: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  globalSettings: ImageSettings;
  onReoptimize: (id: string, updatedSettings: ImageSettings) => Promise<boolean>;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  item,
  isOpen,
  onClose,
  globalSettings,
  onReoptimize,
}) => {
  if (!item) return null;

  const currentSettings = item.customSettings || globalSettings;
  const [localQuality, setLocalQuality] = useState(currentSettings.quality);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRotate = async () => {
    const nextRot = ((currentSettings.rotation || 0) + 90) % 360;
    setIsProcessing(true);
    try {
      await onReoptimize(item.id, {
        ...currentSettings,
        rotation: nextRot,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdjustQuality = async (delta: number) => {
    const newQ = Math.max(10, Math.min(100, localQuality + delta));
    setLocalQuality(newQ);
    setIsProcessing(true);
    try {
      await onReoptimize(item.id, {
        ...currentSettings,
        quality: newQ,
        qualityPreset: 'custom',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCustomQuality = async (q: number) => {
    setLocalQuality(q);
    setIsProcessing(true);
    try {
      await onReoptimize(item.id, {
        ...currentSettings,
        quality: q,
        qualityPreset: 'custom',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!item.outputBlob) return;
    const filename = getOutputFilename(item.name, item.outputType || item.originalType);
    downloadBlob(item.outputBlob, filename);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex flex-col">
          <span className="truncate max-w-md">{item.name}</span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            Compare original with optimized result
          </span>
        </div>
      }
      maxWidth="4xl"
    >
      <div className="space-y-5">
        {/* Interactive Comparison Viewer */}
        <BeforeAfterViewer
          originalUrl={item.originalUrl}
          optimizedUrl={item.outputUrl}
          originalSize={item.originalSize}
          optimizedSize={item.outputSize}
          originalWidth={item.originalWidth}
          originalHeight={item.originalHeight}
          optimizedWidth={item.outputWidth}
          optimizedHeight={item.outputHeight}
          reductionPercentage={item.reductionPercentage}
        />

        {/* Detailed Image Specs */}
        <ImageInfo item={item} />

        {/* Quality Controls if user wants to tweak result directly */}
        <div className="bg-slate-50 dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Adjust Quality for this image:
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800">
                {localQuality}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={localQuality}
              disabled={isProcessing}
              onChange={(e) => setLocalQuality(Number(e.target.value))}
              onMouseUp={() => handleApplyCustomQuality(localQuality)}
              onTouchEnd={() => handleApplyCustomQuality(localQuality)}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={handleRotate}
              leftIcon={<RotateCw className="w-3.5 h-3.5" />}
            >
              Rotate 90°
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={localQuality >= 100 || isProcessing}
              onClick={() => handleAdjustQuality(10)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              +10%
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={localQuality <= 15 || isProcessing}
              onClick={() => handleAdjustQuality(-10)}
              leftIcon={<Minus className="w-3.5 h-3.5" />}
            >
              -10%
            </Button>
          </div>
        </div>

        {/* Technical Notice */}
        <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 p-3 rounded-lg">
          <Info className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
          <span>
            Compression balances visual fidelity and file size. PNG output uses lossless encoding where quality percentage is intentionally bypassed by the browser standard. WebP and JPEG yield significant reduction with minimal perceptible difference.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          {item.outputBlob && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
            >
              Download Optimized Image
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
