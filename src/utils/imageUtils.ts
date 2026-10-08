import type { ImageSettings, ResizeMode } from '../types';
import { isMimeTypeSupported } from './fileUtils';
import { applyCanvasFilters, hasActiveFilters } from './filterUtils';

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
        if (settings.resizeMode === 'fit') {
          const scale = Math.min(reqW / originalWidth, reqH / originalHeight);
          targetWidth = Math.round(originalWidth * scale);
          targetHeight = Math.round(originalHeight * scale);
        } else if (settings.resizeMode === 'fill') {
          targetWidth = reqW;
          targetHeight = reqH;
        } else {
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
      targetWidth = reqW || originalWidth;
      targetHeight = reqH || originalHeight;
    }
  }

  // 2. Check Maximum Dimensions constraint
  if (settings.maxDimensionsEnabled && (settings.maxWidth || settings.maxHeight)) {
    const maxW = settings.maxWidth || Infinity;
    const maxH = settings.maxHeight || Infinity;

    if (settings.doNotEnlarge) {
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
      drawHeight = targetHeight;
      drawWidth = Math.round(targetHeight * originalAspect);
      drawX = Math.round((targetWidth - drawWidth) / 2);
    } else {
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
    return 'image/webp';
  }

  return formatSetting;
}

/**
 * High-quality stepped downsampling to avoid aliasing and blurriness when scaling down.
 * Standard HTML5 canvas drawImage blurs severely if scale is < 0.5; half-stepping retains sharpness.
 */
function drawImageHighClarity(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  srcW: number,
  srcH: number
) {
  // If downscaling by more than 2x, step down in 50% increments for crisp details
  if (dw < srcW * 0.5 && dh < srcH * 0.5 && srcW > 64 && srcH > 64) {
    let curW = Math.round(srcW * 0.5);
    let curH = Math.round(srcH * 0.5);

    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = curW;
    tempCanvas.height = curH;
    let tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(source, 0, 0, curW, curH);

    while (curW * 0.5 > dw && curH * 0.5 > dh) {
      const nextW = Math.round(curW * 0.5);
      const nextH = Math.round(curH * 0.5);
      const nextCanvas = document.createElement('canvas');
      nextCanvas.width = nextW;
      nextCanvas.height = nextH;
      const nextCtx = nextCanvas.getContext('2d')!;
      nextCtx.imageSmoothingEnabled = true;
      nextCtx.imageSmoothingQuality = 'high';
      nextCtx.drawImage(tempCanvas, 0, 0, nextW, nextH);
      tempCanvas = nextCanvas;
      curW = nextW;
      curH = nextH;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(tempCanvas, dx, dy, dw, dh);
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, dx, dy, dw, dh);
  }
}

/**
 * Subtle edge-preserving clarity boost filter.
 * Slightly sharpens fine high-frequency details (text, facial features, edges)
 * to prevent loss of clarity during lossy JPEG/WebP compression.
 */
function applyClaritySharpness(canvas: HTMLCanvasElement, amount: number = 0.18) {
  if (amount <= 0 || canvas.width > 5000 || canvas.height > 5000) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  try {
    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);

    // 3x3 unsharp mask kernel: [0, -a, 0, -a, 1 + 4a, -a, 0, -a, 0]
    const a = amount;
    const center = 1 + 4 * a;

    // Process interior pixels
    for (let y = 1; y < h - 1; y++) {
      const row = y * w;
      const rowAbove = (y - 1) * w;
      const rowBelow = (y + 1) * w;

      for (let x = 1; x < w - 1; x++) {
        const idx = (row + x) * 4;

        // Red
        const rC = copy[idx];
        const rT = copy[(rowAbove + x) * 4];
        const rB = copy[(rowBelow + x) * 4];
        const rL = copy[(row + (x - 1)) * 4];
        const rR = copy[(row + (x + 1)) * 4];
        data[idx] = Math.min(255, Math.max(0, rC * center - a * (rT + rB + rL + rR)));

        // Green
        const gC = copy[idx + 1];
        const gT = copy[(rowAbove + x) * 4 + 1];
        const gB = copy[(rowBelow + x) * 4 + 1];
        const gL = copy[(row + (x - 1)) * 4 + 1];
        const gR = copy[(row + (x + 1)) * 4 + 1];
        data[idx + 1] = Math.min(255, Math.max(0, gC * center - a * (gT + gB + gL + gR)));

        // Blue
        const bC = copy[idx + 2];
        const bT = copy[(rowAbove + x) * 4 + 2];
        const bB = copy[(rowBelow + x) * 4 + 2];
        const bL = copy[(row + (x - 1)) * 4 + 2];
        const bR = copy[(row + (x + 1)) * 4 + 2];
        data[idx + 2] = Math.min(255, Math.max(0, bC * center - a * (bT + bB + bL + bR)));
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // If browser security blocks getImageData, silently skip
  }
}

/**
 * Quantizes image pixel data to reduce color entropy, allowing Deflate (PNG)
 * compression to achieve substantially smaller file sizes while preserving visual fidelity.
 */
export function quantizeImageData(imgData: ImageData, quality: number = 85) {
  if (quality >= 98) return;
  const data = imgData.data;
  const len = data.length;

  // Compute quantization step based on quality slider (10 - 100)
  // Higher quality -> smaller step (more fidelity, e.g. step 2-4)
  // Lower quality -> larger step (fewer color levels, e.g. step 12-24, much smaller PNG size)
  const step = Math.max(2, Math.round((100 - quality) * 0.32));
  const halfStep = Math.floor(step / 2);

  for (let i = 0; i < len; i += 4) {
    data[i] = Math.min(255, Math.floor(data[i] / step) * step + halfStep);
    data[i + 1] = Math.min(255, Math.floor(data[i + 1] / step) * step + halfStep);
    data[i + 2] = Math.min(255, Math.floor(data[i + 2] / step) * step + halfStep);
    if (data[i + 3] < 255 && data[i + 3] > 0) {
      data[i + 3] = Math.min(255, Math.floor(data[i + 3] / step) * step + halfStep);
    }
  }
}

/**
 * Renders image to Canvas and outputs compressed Blob, supporting rotation,
 * background color, stepped downsampling, clarity sharpening, color quantization,
 * and guaranteed target file size convergence so files never unintentionally inflate.
 */
export async function processImageCanvas(
  fileOrBlob: Blob,
  settings: ImageSettings,
  originalMime: string
): Promise<{ blob: Blob; width: number; height: number; mimeType: string; isFallbackToOriginal?: boolean }> {
  const { source, width: rawW, height: rawH, cleanup } = await loadImageSource(fileOrBlob);

  try {
    const isRotated90or270 = settings.rotation === 90 || settings.rotation === 270;
    const baseW = isRotated90or270 ? rawH : rawW;
    const baseH = isRotated90or270 ? rawW : rawH;

    let dims = calculateTargetDimensions(baseW, baseH, settings);
    const outputMime = resolveOutputMime(settings.format, originalMime);

    // Target File Size mode (active for any format including PNG, JPG, WebP, AVIF)
    const isTargetSizeActive =
      Boolean(settings.targetSizeEnabled) &&
      Boolean(settings.targetSizeKB) &&
      (settings.targetSizeKB || 0) > 0;

    const canvas = document.createElement('canvas');
    canvas.width = dims.targetWidth;
    canvas.height = dims.targetHeight;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true,
    });

    if (!ctx) {
      throw new Error('Canvas 2D context could not be initialized.');
    }

    // Maximum interpolation quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Background color filling (for transparent images converting to JPG or user choice)
    if (outputMime === 'image/jpeg' || (settings.backgroundColor && settings.backgroundColor !== 'transparent')) {
      ctx.fillStyle = settings.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Transformations (Rotation & Flips)
    ctx.save();
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

    // Draw using high-clarity stepped downsampling
    const drawW = isRotated90or270 ? dims.drawHeight : dims.drawWidth;
    const drawH = isRotated90or270 ? dims.drawWidth : dims.drawHeight;
    drawImageHighClarity(ctx, source, -drawW / 2, -drawH / 2, drawW, drawH, rawW, rawH);

    ctx.restore();

    // Apply color/image filters (Brightness, Contrast, Grayscale, Sepia, Invert)
    if (settings.filters) {
      applyCanvasFilters(canvas, settings.filters);
    }

    // Apply subtle edge clarity sharpening for lossy formats
    if (outputMime !== 'image/png') {
      applyClaritySharpness(canvas, 0.16);
    }

    // Helper to encode canvas to blob with given quality
    const encodeCanvas = (sourceCanvas: HTMLCanvasElement, mime: string, q?: number): Promise<Blob> => {
      const qClamped = q !== undefined ? Math.max(0.05, Math.min(1.0, q)) : undefined;
      return new Promise<Blob>((resolve, reject) => {
        sourceCanvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error(`Failed to encode image to ${mime}`));
          },
          mime,
          mime === 'image/png' ? undefined : qClamped
        );
      });
    };

    let finalBlob: Blob;

    if (outputMime === 'image/png') {
      // PNG PROCESSING
      if (isTargetSizeActive) {
        const targetBytes = (settings.targetSizeKB || 200) * 1024;

        const encodeQuantizedPng = async (cvs: HTMLCanvasElement, qVal: number): Promise<Blob> => {
          const tempCvs = document.createElement('canvas');
          tempCvs.width = cvs.width;
          tempCvs.height = cvs.height;
          const tCtx = tempCvs.getContext('2d')!;
          tCtx.drawImage(cvs, 0, 0);

          try {
            const imgData = tCtx.getImageData(0, 0, tempCvs.width, tempCvs.height);
            quantizeImageData(imgData, qVal);
            tCtx.putImageData(imgData, 0, 0);
          } catch {
            // ignore security exceptions
          }

          return encodeCanvas(tempCvs, 'image/png');
        };

        // 1. Check if current resolution with requested quality fits
        const initialPng = await encodeQuantizedPng(canvas, settings.quality || 85);

        if (initialPng.size <= targetBytes) {
          finalBlob = initialPng;
        } else {
          // 2. Binary search resolution scale to strictly satisfy targetBytes limit
          let lowScale = 0.05;
          let highScale = 0.98;
          let bestBlob: Blob | null = null;
          let bestW = dims.targetWidth;
          let bestH = dims.targetHeight;

          for (let iter = 0; iter < 6; iter++) {
            const testScale = (lowScale + highScale) / 2;
            const testW = Math.max(32, Math.round(dims.targetWidth * testScale));
            const testH = Math.max(32, Math.round(dims.targetHeight * testScale));

            const scaledCvs = document.createElement('canvas');
            scaledCvs.width = testW;
            scaledCvs.height = testH;
            const sCtx = scaledCvs.getContext('2d')!;
            sCtx.imageSmoothingEnabled = true;
            sCtx.imageSmoothingQuality = 'high';
            sCtx.drawImage(canvas, 0, 0, testW, testH);

            const qVal = Math.max(35, Math.min(85, settings.quality || 75));
            const testBlob = await encodeQuantizedPng(scaledCvs, qVal);

            if (testBlob.size <= targetBytes) {
              bestBlob = testBlob;
              bestW = testW;
              bestH = testH;
              lowScale = testScale; // try larger scale for crisper display
            } else {
              highScale = testScale; // shrink to fit under cap
            }
          }

          if (bestBlob) {
            finalBlob = bestBlob;
            dims.targetWidth = bestW;
            dims.targetHeight = bestH;
          } else {
            // Fallback: minimal scale to guarantee under target limit
            const fallbackScale = 0.15;
            const fbW = Math.max(32, Math.round(dims.targetWidth * fallbackScale));
            const fbH = Math.max(32, Math.round(dims.targetHeight * fallbackScale));
            const fbCvs = document.createElement('canvas');
            fbCvs.width = fbW;
            fbCvs.height = fbH;
            const fbCtx = fbCvs.getContext('2d')!;
            fbCtx.drawImage(canvas, 0, 0, fbW, fbH);
            finalBlob = await encodeQuantizedPng(fbCvs, 45);
            dims.targetWidth = fbW;
            dims.targetHeight = fbH;
          }
        }
      } else {
        // Standard PNG compression: apply color quantization according to user's quality
        const pngCvs = document.createElement('canvas');
        pngCvs.width = canvas.width;
        pngCvs.height = canvas.height;
        const pCtx = pngCvs.getContext('2d')!;
        pCtx.drawImage(canvas, 0, 0);

        const q = settings.quality || 85;
        if (q < 98) {
          try {
            const imgData = pCtx.getImageData(0, 0, pngCvs.width, pngCvs.height);
            quantizeImageData(imgData, q);
            pCtx.putImageData(imgData, 0, 0);
          } catch {
            // ignore if secure canvas
          }
        }

        let initialPngBlob = await encodeCanvas(pngCvs, 'image/png');

        // Compression Audit: If PNG output exceeds original size and format was not explicitly converted to PNG from a lossy format
        if (initialPngBlob.size >= fileOrBlob.size && fileOrBlob.size > 0) {
          // Attempt deeper quantization steps down to quality 40 to achieve size reduction
          for (const testQ of [70, 55, 40]) {
            if (testQ >= q) continue;
            const testCvs = document.createElement('canvas');
            testCvs.width = canvas.width;
            testCvs.height = canvas.height;
            const tCtx = testCvs.getContext('2d')!;
            tCtx.drawImage(canvas, 0, 0);
            try {
              const imgData = tCtx.getImageData(0, 0, testCvs.width, testCvs.height);
              quantizeImageData(imgData, testQ);
              tCtx.putImageData(imgData, 0, 0);
              const testBlob = await encodeCanvas(testCvs, 'image/png');
              if (testBlob.size < fileOrBlob.size) {
                initialPngBlob = testBlob;
                break;
              }
            } catch {
              break;
            }
          }
        }

        finalBlob = initialPngBlob;
      }
    } else {
      // LOSSY PROCESSING (JPEG, WebP, AVIF)
      if (isTargetSizeActive) {
        const targetBytes = (settings.targetSizeKB || 200) * 1024;
        let lowQ = 0.08;
        let highQ = 0.98;
        let bestBlob: Blob | null = null;

        // Binary search quality
        for (let iter = 0; iter < 8; iter++) {
          const testQ = (lowQ + highQ) / 2;
          const currentBlob = await encodeCanvas(canvas, outputMime, testQ);

          if (currentBlob.size <= targetBytes) {
            bestBlob = currentBlob;
            lowQ = testQ; // try higher quality
          } else {
            highQ = testQ; // too big, lower quality
          }
        }

        if (bestBlob) {
          finalBlob = bestBlob;
        } else {
          // If lowest quality still exceeds targetBytes (e.g. huge megapixel image targeting 50KB),
          // dynamically scale down resolution so it strictly satisfies target limit!
          const minBlob = await encodeCanvas(canvas, outputMime, 0.12);
          let scaleFactor = Math.min(0.9, Math.sqrt(targetBytes / minBlob.size) * 0.92);
          let curW = Math.max(48, Math.round(dims.targetWidth * scaleFactor));
          let curH = Math.max(48, Math.round(dims.targetHeight * scaleFactor));

          for (let pass = 0; pass < 5; pass++) {
            const downCvs = document.createElement('canvas');
            downCvs.width = curW;
            downCvs.height = curH;
            const dCtx = downCvs.getContext('2d')!;
            dCtx.imageSmoothingEnabled = true;
            dCtx.imageSmoothingQuality = 'high';
            dCtx.drawImage(canvas, 0, 0, curW, curH);

            const testBlob = await encodeCanvas(downCvs, outputMime, 0.75);

            if (testBlob.size <= targetBytes) {
              bestBlob = testBlob;
              dims.targetWidth = curW;
              dims.targetHeight = curH;
              break;
            } else {
              const nextFactor = Math.sqrt(targetBytes / testBlob.size) * 0.92;
              curW = Math.max(48, Math.round(curW * nextFactor));
              curH = Math.max(48, Math.round(curH * nextFactor));
            }
          }

          finalBlob = bestBlob || (await encodeCanvas(canvas, outputMime, 0.10));
        }
      } else {
        // Standard lossy compression
        const qSetting = settings.quality || 80;
        const initialQualityDecimal = Math.max(0.1, Math.min(1.0, qSetting / 100));
        let candidateBlob = await encodeCanvas(canvas, outputMime, initialQualityDecimal);

        // Smart Compressor Guard:
        // When compression output is not smaller than original, step down quality iteratively
        if (candidateBlob.size >= fileOrBlob.size && fileOrBlob.size > 0) {
          let low = 0.20;
          let high = initialQualityDecimal;
          let smallerBlob: Blob | null = null;

          for (let i = 0; i < 6; i++) {
            const testQ = (low + high) / 2;
            const testBlob = await encodeCanvas(canvas, outputMime, testQ);
            if (testBlob.size < fileOrBlob.size) {
              smallerBlob = testBlob;
              low = testQ; // Try to keep quality higher while staying smaller
            } else {
              high = testQ;
            }
          }

          if (smallerBlob) {
            candidateBlob = smallerBlob;
          }
        }

        finalBlob = candidateBlob;
      }
    }

    // Comprehensive Fallback Audit Check:
    // If the compressed output failed to reduce the file size, and the user did NOT
    // explicitly request format conversion, geometry resizing, rotation, or visual filters,
    // revert cleanly to the original input file so file size never inflates.
    const isSameFormat = outputMime === resolveOutputMime('original', originalMime);
    const hasVisualTransforms =
      settings.rotation !== 0 ||
      settings.flipHorizontal ||
      settings.flipVertical ||
      (settings.filters && hasActiveFilters(settings.filters)) ||
      (settings.resizeEnabled && (settings.width || settings.height)) ||
      (settings.maxDimensionsEnabled && (dims.targetWidth < rawW || dims.targetHeight < rawH));

    let isFallbackToOriginal = false;
    if (finalBlob.size >= fileOrBlob.size && fileOrBlob.size > 0) {
      if (isSameFormat && !hasVisualTransforms && !isTargetSizeActive) {
        finalBlob = fileOrBlob;
        dims.targetWidth = rawW;
        dims.targetHeight = rawH;
        isFallbackToOriginal = true;
      }
    }

    return {
      blob: finalBlob,
      width: dims.targetWidth,
      height: dims.targetHeight,
      mimeType: isFallbackToOriginal ? originalMime : outputMime,
      isFallbackToOriginal,
    };
  } finally {
    cleanup();
  }
}
