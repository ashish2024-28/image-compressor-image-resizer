import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { isAvifSupported } from '../../utils/fileUtils';
import { createSampleImage } from '../../utils/sampleImages';

export interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onFilesSelected,
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const avifSupported = isAvifSupported();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      // reset so the same file can be picked again if removed
      e.target.value = '';
    }
  };

  const handleTrySample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGeneratingSample(true);
    try {
      const sample = await createSampleImage('landscape');
      onFilesSelected([sample]);
    } catch {
      // ignore
    } finally {
      setIsGeneratingSample(false);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer group select-none shadow-xs ${
        isDragOver
          ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 scale-[1.008]'
          : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50/70 dark:hover:bg-[#131b2e]'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
            isDragOver
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
          }`}
        >
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isDragOver ? 'Drop images right here' : 'Drop your images here'}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          or click anywhere to browse from your device. All processing stays local in your browser.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={isLoading}
            leftIcon={<ImageIcon className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Select Images
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            isLoading={isGeneratingSample}
            leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
            onClick={handleTrySample}
          >
            Try Sample
          </Button>
        </div>

        {/* Supported formats & limits */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200/90 dark:border-slate-800 w-full">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Supported:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">JPG</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">PNG</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">WebP</span>
          {avifSupported && (
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">AVIF</span>
          )}
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>Max recommended: ~50MB per image</span>
        </div>
      </div>
    </div>
  );
};
