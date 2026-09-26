import type { ImageSettings, ResizeMode } from '../types';
import { isMimeTypeSupported } from './fileUtils';

export interface DimensionCalcResult {
  targetWidth: number;
  targetHeight: number;
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
}

/**
 * Loads an image from Blob or File, preserving EXIF orientation
 */
export async function loadImageSource(
  fileOrBlob: Blob
): Promise<{ source: ImageBitmap | HTMLImageElement; width: number; height: number; cleanup: () => void }> {
  // Try ImageBitmap with 'from-image' orientation (handles EXIF orientation automatically)
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(fileOrBlob, { imageOrientation: 'from-image' });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Fallback to HTMLImageElement
    }
  }

  // Fallback to HTMLImageElement
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fileOrBlob);
    const img = new Image();
    img.onload = () => {
      resolve({
        source: img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        cleanup: () => URL.revokeObjectURL(url),
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image. File may be corrupted or unsupported.'));
    };
    img.src = url;
  });
}

/**
 * Calculates target width and height based on user settings
 */
export function calculateTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  settings: ImageSettings
): DimensionCalcResult {
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;
  const originalAspect = originalWidth / originalHeight;

  // 1. Check direct Resize Settings
  if (settings.resizeEnabled && (settings.width || settings.height)) {
    const reqW = settings.width;
    const reqH = settings.height;

    if (settings.maintainAspectRatio) {
      if (reqW && reqH) {
        // Mode handling when both are specified with maintainAspectRatio
        if (settings.resizeMode === 'fit') {
          // Fit inside box
          const scale = Math.min(reqW / originalWidth, reqH / originalHeight);
          targetWidth = Math.round(originalWidth * scale);
          targetHeight = Math.round(originalHeight * scale);
        } else if (settings.resizeMode === 'fill') {
          // Fill target canvas and crop
          targetWidth = reqW;
          targetHeight = reqH;
        } else {
          // Stretch
          targetWidth = reqW;
          targetHeight = reqH;
        }
      } else if (reqW) {
        targetWidth = reqW;
        targetHeight = Math.round(reqW / originalAspect);
      } else if (reqH) {
        targetHeight = reqH;
        targetWidth = Math.round(reqH * originalAspect);
      }
    } else {
      // No maintain aspect ratio (stretch or direct)
      targetWidth = reqW || originalWidth;
      targetHeight = reqH || originalHeight;
    }
  }

  // 2. Check Maximum Dimensions constraint
  if (settings.maxDimensionsEnabled && (settings.maxWidth || settings.maxHeight)) {
    const maxW = settings.maxWidth || Infinity;
    const maxH = settings.maxHeight || Infinity;

    if (settings.doNotEnlarge) {
      // Only shrink if larger than max
      if (targetWidth > maxW || targetHeight > maxH) {
        const scale = Math.min(maxW / targetWidth, maxH / targetHeight);
        targetWidth = Math.round(targetWidth * scale);
        targetHeight = Math.round(targetHeight * scale);
      }
    } else {
      const scale = Math.min(maxW / targetWidth, maxH / targetHeight);
      targetWidth = Math.round(targetWidth * scale);
      targetHeight = Math.round(targetHeight * scale);
    }
  }

  // Ensure minimum 1px
  targetWidth = Math.max(1, Math.round(targetWidth));
  targetHeight = Math.max(1, Math.round(targetHeight));

  // Determine draw coordinates for fill/fit/stretch
  let drawX = 0;
  let drawY = 0;
  let drawWidth = targetWidth;
  let drawHeight = targetHeight;

  if (settings.resizeEnabled && settings.resizeMode === 'fill' && settings.width && settings.height) {
    const canvasAspect = targetWidth / targetHeight;
    if (originalAspect > canvasAspect) {
      // Original is wider than canvas: fit height, crop width
      drawHeight = targetHeight;
      drawWidth = Math.round(targetHeight * originalAspect);
      drawX = Math.round((targetWidth - drawWidth) / 2);
    } else {
      // Original is taller than canvas: fit width, crop height
      drawWidth = targetWidth;
      drawHeight = Math.round(targetWidth / originalAspect);
      drawY = Math.round((targetHeight - drawHeight) / 2);
    }
  }

  return {
    targetWidth,
    targetHeight,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  };
}

/**
 * Resolves the actual output MIME type considering 'original' setting and browser capabilities
 */
export function resolveOutputMime(formatSetting: string, originalMime: string): string {
  if (formatSetting === 'original') {
    const norm = originalMime.toLowerCase();
    if (norm.includes('png')) return 'image/png';
    if (norm.includes('webp')) return 'image/webp';
    if (norm.includes('avif') && isMimeTypeSupported('image/avif')) return 'image/avif';
    return 'image/jpeg';
  }

  if (formatSetting === 'image/avif' && !isMimeTypeSupported('image/avif')) {
    // Fallback to WebP if AVIF unsupported
    return 'image/webp';
  }

  return formatSetting;
}

/**
 * Renders image to Canvas and outputs compressed Blob, supporting rotation,
 * background color, and iterative binary-search target file size convergence.
 */
export async function processImageCanvas(
  fileOrBlob: Blob,
  settings: ImageSettings,
  originalMime: string
): Promise<{ blob: Blob; width: number; height: number; mimeType: string }> {
  const { source, width: rawW, height: rawH, cleanup } = await loadImageSource(fileOrBlob);

  try {
    // 1. Account for 90 or 270 degree rotation swapping base aspect ratio
    const isRotated90or270 = settings.rotation === 90 || settings.rotation === 270;
    const baseW = isRotated90or270 ? rawH : rawW;
    const baseH = isRotated90or270 ? rawW : rawH;

    const dims = calculateTargetDimensions(baseW, baseH, settings);
    const canvas = document.createElement('canvas');
    canvas.width = dims.targetWidth;
    canvas.height = dims.targetHeight;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: false,
    });

    if (!ctx) {
      throw new Error('Canvas 2D context could not be initialized.');
    }

    // High quality interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const outputMime = resolveOutputMime(settings.format, originalMime);

    // Background color filling (for transparent images converting to JPG or user choice)
    if (outputMime === 'image/jpeg' || (settings.backgroundColor && settings.backgroundColor !== 'transparent')) {
      ctx.fillStyle = settings.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Transformations (Rotation & Flips)
    ctx.save();

    // Center transform matrix
    const centerX = dims.drawX + dims.drawWidth / 2;
    const centerY = dims.drawY + dims.drawHeight / 2;
    ctx.translate(centerX, centerY);

    if (settings.rotation) {
      ctx.rotate((settings.rotation * Math.PI) / 180);
    }

    const scaleX = settings.flipHorizontal ? -1 : 1;
    const scaleY = settings.flipVertical ? -1 : 1;
    if (scaleX !== 1 || scaleY !== 1) {
      ctx.scale(scaleX, scaleY);
    }

    // Draw source centered
    if (isRotated90or270) {
      ctx.drawImage(source, -dims.drawHeight / 2, -dims.drawWidth / 2, dims.drawHeight, dims.drawWidth);
    } else {
      ctx.drawImage(source, -dims.drawWidth / 2, -dims.drawHeight / 2, dims.drawWidth, dims.drawHeight);
    }

    ctx.restore();

    // Helper to encode canvas to blob with given quality
    const encodeCanvas = (q: number): Promise<Blob> => {
      const qClamped = Math.max(0.05, Math.min(1.0, q));
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error(`Failed to encode image to ${outputMime}`));
          },
          outputMime,
          outputMime === 'image/png' ? undefined : qClamped
        );
      });
    };

    // If Target File Size is enabled (and format is lossy WebP/JPEG/AVIF)
    let finalBlob: Blob;
    const isTargetSizeActive =
      settings.targetSizeEnabled &&
      settings.targetSizeKB &&
      settings.targetSizeKB > 0 &&
      outputMime !== 'image/png';

    if (isTargetSizeActive) {
      const targetBytes = (settings.targetSizeKB || 200) * 1024;
      // Binary search quality between 0.05 and 0.98 to hit <= targetBytes closely
      let lowQ = 0.05;
      let highQ = 0.98;
      let bestBlob: Blob | null = null;

      for (let iter = 0; iter < 6; iter++) {
        const testQ = (lowQ + highQ) / 2;
        const currentBlob = await encodeCanvas(testQ);

        if (currentBlob.size <= targetBytes) {
          bestBlob = currentBlob;
          lowQ = testQ; // Try to get higher quality still under limit
        } else {
          highQ = testQ; // Too big, lower quality
        }
      }

      finalBlob = bestBlob || (await encodeCanvas(0.05));
    } else {
      const initialQualityDecimal = Math.max(0.05, Math.min(1.0, settings.quality / 100));
      finalBlob = await encodeCanvas(initialQualityDecimal);
    }

    return {
      blob: finalBlob,
      width: dims.targetWidth,
      height: dims.targetHeight,
      mimeType: outputMime,
    };
  } finally {
    cleanup();
  }
}
