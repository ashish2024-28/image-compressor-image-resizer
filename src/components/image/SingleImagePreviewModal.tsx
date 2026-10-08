import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatFileSize } from '../../utils/formatFileSize';
import { Download, ZoomIn, ZoomOut, RotateCcw, ImageIcon, Wand2, RefreshCw } from 'lucide-react';
import { ImageFilterControls } from './ImageFilterControls';
import {
  DEFAULT_FILTERS,
  ImageFilterOptions,
  getCssFilterString,
  hasActiveFilters,
  exportFilteredImageBlob,
} from '../../utils/filterUtils';

export interface SingleImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null;
  imageBlob?: Blob | null;
  fileName?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  title?: string;
  onDownload?: () => void;
}

export const SingleImagePreviewModal: React.FC<SingleImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageBlob,
  fileName = 'image.jpg',
  width,
  height,
  fileSize,
  title = 'Image Preview',
  onDownload,
}) => {
  const [zoom, setZoom] = useState(1);
  const [filters, setFilters] = useState<ImageFilterOptions>({ ...DEFAULT_FILTERS });
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Reset zoom and filters whenever modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setFilters({ ...DEFAULT_FILTERS });
      setShowFilters(false);
    }
  }, [isOpen, imageUrl, imageBlob]);

  if (!isOpen || (!imageUrl && !imageBlob)) return null;

  const displayUrl = imageUrl || (imageBlob ? URL.createObjectURL(imageBlob) : '');
  const cssFilterStr = getCssFilterString(filters);
  const isFilterActive = hasActiveFilters(filters);

  const handleDownload = async () => {
    // If filters are active, export a new blob with the filters burned in!
    if (isFilterActive && (imageBlob || displayUrl)) {
      setIsExporting(true);
      try {
        const source = imageBlob || displayUrl;
        const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
        const filteredBlob = await exportFilteredImageBlob(source, filters, mimeType, 0.94);
        const url = URL.createObjectURL(filteredBlob);
        const a = document.createElement('a');
        a.href = url;
        const ext = mimeType === 'image/png' ? '.png' : '.jpg';
        const baseName = fileName.replace(/\.[^/.]+$/, '');
        a.download = `${baseName}-edited${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Failed to export filtered image, falling back to original:', err);
        fallbackDownload();
      } finally {
        setIsExporting(false);
      }
      return;
    }

    // Default download without custom filters
    fallbackDownload();
  };

  const fallbackDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
  const handleResetZoom = () => setZoom(1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2.5 min-w-0 pr-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {title}
              </span>
              {fileSize !== undefined && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                  {formatFileSize(fileSize)}
                </span>
              )}
              {isFilterActive && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 shrink-0 border border-purple-200 dark:border-purple-800">
                  Edited
                </span>
              )}
            </div>
            {(width || height) && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {width} &times; {height} px &bull; {fileName}
              </p>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<Wand2 className="w-3.5 h-3.5" />}
            >
              {showFilters ? 'Hide Filters' : 'Edit & Filters'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={isExporting}
              onClick={handleDownload}
              leftIcon={
                isExporting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )
              }
            >
              {isExporting ? 'Applying Filters...' : `Download ${isFilterActive ? 'Edited' : ''} (${fileName})`}
            </Button>
          </div>
        </div>

        {/* Basic Image Editing Suite (Grayscale, Sepia, Invert, Brightness, Contrast) */}
        {showFilters && (
          <div className="transition-all animate-in fade-in duration-200">
            <ImageFilterControls
              filters={filters}
              onChange={setFilters}
              disabled={isExporting}
            />
          </div>
        )}

        {/* Viewport */}
        <div className="h-[52vh] sm:h-[62vh] rounded-xl bg-slate-900/95 dark:bg-black overflow-auto flex items-center justify-center p-4 border border-slate-200 dark:border-slate-800 select-none">
          <img
            src={displayUrl}
            alt={fileName}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              filter: cssFilterStr,
            }}
            className="max-h-full max-w-full object-contain transition-all duration-100 rounded shadow-md"
          />
        </div>
      </div>
    </Modal>
  );
};
