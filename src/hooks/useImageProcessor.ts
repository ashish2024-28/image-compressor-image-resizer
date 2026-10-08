import { useState, useCallback, useRef, useEffect } from 'react';
import type { ImageItem, ImageSettings, BatchProgress } from '../types';
import { validateImageFile, WARN_BATCH_COUNT, WARN_FILE_SIZE_BYTES } from '../utils/validation';
import { loadImageSource, processImageCanvas } from '../utils/imageUtils';
import { calculateSavings } from '../utils/calculateSavings';

export function useImageProcessor() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [batchWarning, setBatchWarning] = useState<string | null>(null);
  const [progress, setProgress] = useState<BatchProgress>({
    total: 0,
    completed: 0,
    currentName: '',
    percentage: 0,
    isProcessing: false,
  });

  // Track all generated URLs for guaranteed cleanup
  const urlsRef = useRef<Set<string>>(new Set());

  const registerUrl = useCallback((url: string) => {
    urlsRef.current.add(url);
    return url;
  }, []);

  const revokeUrl = useCallback((url?: string) => {
    if (url && urlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      urlsRef.current.delete(url);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlsRef.current.clear();
    };
  }, []);

  /**
   * Add new files with validation and metadata extraction
   */
  const addFiles = useCallback(
    async (files: File[]) => {
      const newItems: ImageItem[] = [];
      const warnings: string[] = [];

      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          warnings.push(validation.error || 'Invalid file.');
          continue;
        }
        if (validation.warning) {
          warnings.push(validation.warning);
        }

        try {
          const originalUrl = registerUrl(URL.createObjectURL(file));
          const { width, height, cleanup } = await loadImageSource(file);
          cleanup();

          const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
          newItems.push({
            id,
            file,
            name: file.name,
            originalSize: file.size,
            originalWidth: width,
            originalHeight: height,
            originalType: file.type || 'image/jpeg',
            originalUrl,
            aspectRatio: width / height,
            status: 'idle',
          });
        } catch {
          warnings.push(`Could not read "${file.name}". File might be corrupted.`);
        }
      }

      setImages((prev) => {
        const next = [...prev, ...newItems];
        if (next.length > WARN_BATCH_COUNT) {
          setBatchWarning(
            `You have selected ${next.length} images. Processing them will be batched safely to protect browser memory.`
          );
        } else {
          setBatchWarning(null);
        }
        return next;
      });

      if (warnings.length > 0) {
        setValidationWarnings((prev) => [...prev, ...warnings].slice(-5));
      }

      if (newItems.length > 0 && !activeImageId) {
        setActiveImageId(newItems[0].id);
      }

      return newItems;
    },
    [activeImageId, registerUrl]
  );

  /**
   * Remove single image item and cleanup its URLs
   */
  const removeImage = useCallback(
    (id: string) => {
      setImages((prev) => {
        const itemToRemove = prev.find((i) => i.id === id);
        if (itemToRemove) {
          revokeUrl(itemToRemove.originalUrl);
          revokeUrl(itemToRemove.outputUrl);
        }
        const filtered = prev.filter((i) => i.id !== id);
        if (filtered.length <= WARN_BATCH_COUNT) {
          setBatchWarning(null);
        }
        return filtered;
      });

      if (activeImageId === id) {
        setActiveImageId(null);
      }
    },
    [activeImageId, revokeUrl]
  );

  /**
   * Clear all images and free memory
   */
  const clearAll = useCallback(() => {
    images.forEach((item) => {
      revokeUrl(item.originalUrl);
      revokeUrl(item.outputUrl);
    });
    setImages([]);
    setActiveImageId(null);
    setValidationWarnings([]);
    setBatchWarning(null);
  }, [images, revokeUrl]);

  /**
   * Process a single image
   */
  const processImage = useCallback(
    async (id: string, customSettings?: ImageSettings, globalSettings?: ImageSettings): Promise<boolean> => {
      const targetItem = images.find((i) => i.id === id);
      if (!targetItem) return false;

      const effectiveSettings = customSettings || targetItem.customSettings || globalSettings;
      if (!effectiveSettings) return false;

      setImages((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'processing', errorMessage: undefined } : item))
      );

      const startTime = performance.now();

      try {
        const result = await processImageCanvas(targetItem.file, effectiveSettings, targetItem.originalType);

        const outputUrl = registerUrl(URL.createObjectURL(result.blob));
        const duration = Math.round(performance.now() - startTime);
        const savings = calculateSavings(targetItem.originalSize, result.blob.size);

        // Revoke previous output URL if existed
        if (targetItem.outputUrl) {
          revokeUrl(targetItem.outputUrl);
        }

        setImages((prev) =>
          prev.map((item) => {
            if (item.id !== id) return item;
            return {
              ...item,
              status: 'done',
              outputBlob: result.blob,
              outputUrl,
              outputSize: result.blob.size,
              outputWidth: result.width,
              outputHeight: result.height,
              outputType: result.mimeType,
              savingsBytes: savings.savedBytes,
              reductionPercentage: savings.reductionPercentage,
              processingTimeMs: duration,
              customSettings: effectiveSettings,
              isFallbackToOriginal: result.isFallbackToOriginal,
            };
          })
        );
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Processing failed';
        setImages((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: 'error',
                  errorMessage: message.includes('memory')
                    ? 'Browser ran out of memory. Try a smaller resolution.'
                    : 'This image could not be processed.',
                }
              : item
          )
        );
        return false;
      }
    },
    [images, registerUrl, revokeUrl]
  );

  /**
   * Process all images sequentially with controlled concurrency
   */
  const processAll = useCallback(
    async (settings: ImageSettings) => {
      if (images.length === 0 || progress.isProcessing) return;

      setProgress({
        total: images.length,
        completed: 0,
        currentName: '',
        percentage: 0,
        isProcessing: true,
      });

      let completedCount = 0;

      for (const item of images) {
        setProgress((prev) => ({
          ...prev,
          currentName: item.name,
          percentage: Math.round((completedCount / images.length) * 100),
        }));

        await processImage(item.id, undefined, settings);

        // Allow micro-yield to keep UI responsive
        await new Promise((r) => setTimeout(r, 20));

        completedCount++;
        setProgress((prev) => ({
          ...prev,
          completed: completedCount,
          percentage: Math.round((completedCount / images.length) * 100),
        }));
      }

      setProgress((prev) => ({
        ...prev,
        isProcessing: false,
        percentage: 100,
      }));
    },
    [images, progress.isProcessing, processImage]
  );

  const clearWarnings = useCallback(() => {
    setValidationWarnings([]);
  }, []);

  return {
    images,
    activeImageId,
    setActiveImageId,
    validationWarnings,
    batchWarning,
    progress,
    addFiles,
    removeImage,
    clearAll,
    processImage,
    processAll,
    clearWarnings,
  };
}
