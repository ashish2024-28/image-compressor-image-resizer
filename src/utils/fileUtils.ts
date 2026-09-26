import JSZip from 'jszip';
import type { ImageItem } from '../types';

/**
 * Checks whether the current browser canvas supports encoding to the specified MIME type
 */
export function isMimeTypeSupported(mimeType: string): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const dataUrl = canvas.toDataURL(mimeType);
    return dataUrl.startsWith(`data:${mimeType}`);
  } catch {
    return false;
  }
}

/**
 * Cached check for AVIF encoding support in canvas
 */
let cachedAvifSupport: boolean | null = null;
export function isAvifSupported(): boolean {
  if (cachedAvifSupport !== null) return cachedAvifSupport;
  cachedAvifSupport = isMimeTypeSupported('image/avif');
  return cachedAvifSupport;
}

/**
 * Maps MIME type to safe file extension
 */
export function getExtensionFromMime(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
    default:
      return 'jpg';
  }
}

/**
 * Sanitizes filename to remove path traversal, weird characters, and HTML injection
 */
export function sanitizeFilename(filename: string): string {
  // Strip paths
  const base = filename.replace(/^.*[\\/]/, '');
  // Replace unsafe chars
  return base
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}

/**
 * Generates an output filename based on original name and target mime
 */
export function getOutputFilename(originalName: string, outputMime: string, suffix = '-optimized'): string {
  const sanitized = sanitizeFilename(originalName);
  const dotIndex = sanitized.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? sanitized.substring(0, dotIndex) : sanitized;
  const ext = getExtensionFromMime(outputMime);
  return `${baseName}${suffix}.${ext}`;
}

/**
 * Triggers browser download for a Blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Packages multiple optimized images into a ZIP archive and initiates download
 */
export async function downloadAllAsZip(
  items: ImageItem[],
  zipFilename = 'optimized-images.zip',
  onProgress?: (progressPercent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('images') || zip;
  const nameCounts: Record<string, number> = {};

  const validItems = items.filter((item) => item.outputBlob && item.status === 'done');
  if (validItems.length === 0) return;

  validItems.forEach((item) => {
    if (!item.outputBlob) return;
    const mime = item.outputType || item.file.type || 'image/jpeg';
    let filename = getOutputFilename(item.name, mime);

    // Prevent name collisions in zip
    if (nameCounts[filename]) {
      const ext = getExtensionFromMime(mime);
      const dotIndex = filename.lastIndexOf('.');
      const base = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
      nameCounts[filename]++;
      filename = `${base}-${nameCounts[filename]}.${ext}`;
    } else {
      nameCounts[filename] = 1;
    }

    folder.file(filename, item.outputBlob);
  });

  const content = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  downloadBlob(content, zipFilename);
}
