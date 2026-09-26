export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

export const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

export const MAX_SINGLE_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB hard limit for browser canvas stability
export const WARN_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB warning
export const WARN_BATCH_COUNT = 20; // 20 images batch warning

/**
 * Validates an uploaded File
 */
export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size === 0) {
    return { valid: false, error: `"${file.name}" is empty (0 bytes).` };
  }

  if (file.size > MAX_SINGLE_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the 50 MB browser safety limit. Please choose a smaller image.`,
    };
  }

  // Check MIME type or extension
  const mime = file.type.toLowerCase();
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  const isMimeValid = ACCEPTED_MIME_TYPES.includes(mime);
  const isExtValid = ACCEPTED_EXTENSIONS.includes(ext);

  if (!isMimeValid && !isExtValid) {
    return {
      valid: false,
      error: `Unsupported image format (${mime || ext}). Please upload JPG, PNG, WebP or AVIF.`,
    };
  }

  if (file.size > WARN_FILE_SIZE_BYTES) {
    return {
      valid: true,
      warning: `"${file.name}" is large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Processing might take a few moments.`,
    };
  }

  return { valid: true };
}
