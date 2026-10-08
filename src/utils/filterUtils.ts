export interface ImageFilterOptions {
  grayscale: number; // 0 to 100 (%)
  sepia: number; // 0 to 100 (%)
  invert: number; // 0 to 100 (%)
  brightness: number; // 0 to 200 (%, default 100)
  contrast: number; // 0 to 200 (%, default 100)
}

export const DEFAULT_FILTERS: ImageFilterOptions = {
  grayscale: 0,
  sepia: 0,
  invert: 0,
  brightness: 100,
  contrast: 100,
};

export function hasActiveFilters(filters: ImageFilterOptions): boolean {
  return (
    filters.grayscale > 0 ||
    filters.sepia > 0 ||
    filters.invert > 0 ||
    filters.brightness !== 100 ||
    filters.contrast !== 100
  );
}

/**
 * Generates standard CSS filter string from filter settings
 */
export function getCssFilterString(filters: ImageFilterOptions): string {
  const parts: string[] = [];
  if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
  if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
  if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
  if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
  if (filters.invert > 0) parts.push(`invert(${filters.invert}%)`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

/**
 * Applies filters (brightness, contrast, grayscale, sepia, invert) directly to an HTMLCanvasElement
 */
export function applyCanvasFilters(canvas: HTMLCanvasElement, filters: ImageFilterOptions) {
  if (!hasActiveFilters(filters)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Modern browsers support ctx.filter natively:
  const filterStr = getCssFilterString(filters);
  if (typeof ctx.filter === 'string' && filterStr !== 'none') {
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = filterStr;
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.filter = 'none';
        return;
      }
    } catch {
      // Fallback to pixel-level manipulation below
    }
  }

  // Fallback: Direct RGBA pixel manipulation for 100% compatibility
  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const len = data.length;

    const bMult = filters.brightness / 100;
    const cFactor = (259 * (filters.contrast + 255)) / (255 * (259 - (filters.contrast - 100)));
    const grayAmt = filters.grayscale / 100;
    const sepiaAmt = filters.sepia / 100;
    const invertAmt = filters.invert / 100;

    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // 1. Brightness
      if (bMult !== 1) {
        r *= bMult;
        g *= bMult;
        b *= bMult;
      }

      // 2. Contrast
      if (filters.contrast !== 100) {
        r = cFactor * (r - 128) + 128;
        g = cFactor * (g - 128) + 128;
        b = cFactor * (b - 128) + 128;
      }

      // 3. Grayscale
      if (grayAmt > 0) {
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = r * (1 - grayAmt) + lum * grayAmt;
        g = g * (1 - grayAmt) + lum * grayAmt;
        b = b * (1 - grayAmt) + lum * grayAmt;
      }

      // 4. Sepia
      if (sepiaAmt > 0) {
        const sr = 0.393 * r + 0.769 * g + 0.189 * b;
        const sg = 0.349 * r + 0.686 * g + 0.168 * b;
        const sb = 0.272 * r + 0.534 * g + 0.131 * b;
        r = r * (1 - sepiaAmt) + sr * sepiaAmt;
        g = g * (1 - sepiaAmt) + sg * sepiaAmt;
        b = b * (1 - sepiaAmt) + sb * sepiaAmt;
      }

      // 5. Invert
      if (invertAmt > 0) {
        r = r * (1 - invertAmt) + (255 - r) * invertAmt;
        g = g * (1 - invertAmt) + (255 - g) * invertAmt;
        b = b * (1 - invertAmt) + (255 - b) * invertAmt;
      }

      data[i] = Math.min(255, Math.max(0, Math.round(r)));
      data[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
      data[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // If browser security prevents getImageData, skip
  }
}

/**
 * Exports an image URL or Blob with the specified filters applied as a fresh Blob
 */
export async function exportFilteredImageBlob(
  sourceUrlOrBlob: string | Blob,
  filters: ImageFilterOptions,
  mimeType: string = 'image/jpeg',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const url = typeof sourceUrlOrBlob === 'string' 
      ? sourceUrlOrBlob 
      : URL.createObjectURL(sourceUrlOrBlob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        applyCanvasFilters(canvas, filters);

        canvas.toBlob(
          (blob) => {
            if (typeof sourceUrlOrBlob !== 'string') {
              URL.revokeObjectURL(url);
            }
            if (blob) resolve(blob);
            else reject(new Error('Failed to export filtered image'));
          },
          mimeType,
          mimeType === 'image/png' ? undefined : quality
        );
      } catch (err) {
        if (typeof sourceUrlOrBlob !== 'string') {
          URL.revokeObjectURL(url);
        }
        reject(err);
      }
    };

    img.onerror = () => {
      if (typeof sourceUrlOrBlob !== 'string') {
        URL.revokeObjectURL(url);
      }
      reject(new Error('Failed to load image for filter application'));
    };

    img.src = url;
  });
}
