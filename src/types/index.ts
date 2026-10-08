export type OutputFormat = 'original' | 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export type QualityPreset = 'low' | 'medium' | 'high' | 'custom';

export type ResizeMode = 'fit' | 'fill' | 'stretch';

export interface ImageSettings {
  format: OutputFormat;
  qualityPreset: QualityPreset;
  quality: number; // 10 to 100
  // Target File Size constraint (e.g. strict cap under 200 KB for passport/visa/job portals)
  targetSizeEnabled: boolean;
  targetSizeKB: number | null; // e.g. 50, 100, 200, 500, 1024
  // Transform & Geometry
  rotation: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
  // Canvas background (for transparent PNG/WebP -> JPG, custom color)
  backgroundColor: string; // '#ffffff', '#000000', 'transparent'
  // Sizing
  resizeEnabled: boolean;
  resizeMode: ResizeMode;
  maintainAspectRatio: boolean;
  width: number | null;
  height: number | null;
  maxDimensionsEnabled: boolean;
  maxWidth: number | null;
  maxHeight: number | null;
  doNotEnlarge: boolean;
  stripMetadata: boolean;
  filters?: {
    grayscale: number;
    sepia: number;
    invert: number;
    brightness: number;
    contrast: number;
  };
}

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalType: string;
  originalUrl: string;
  aspectRatio: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  customSettings?: ImageSettings;
  outputBlob?: Blob;
  outputUrl?: string;
  outputSize?: number;
  outputWidth?: number;
  outputHeight?: number;
  outputType?: string;
  savingsBytes?: number;
  reductionPercentage?: number;
  processingTimeMs?: number;
  isFallbackToOriginal?: boolean;
}

export interface BatchProgress {
  total: number;
  completed: number;
  currentName: string;
  percentage: number;
  isProcessing: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';
