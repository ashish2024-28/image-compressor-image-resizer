import { useState, useCallback } from 'react';
import type { ImageSettings, OutputFormat, QualityPreset, ResizeMode } from '../types';

export const DEFAULT_SETTINGS: ImageSettings = {
  format: 'original',
  qualityPreset: 'medium',
  quality: 80,
  targetSizeEnabled: false,
  targetSizeKB: 200,
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
  backgroundColor: '#ffffff',
  resizeEnabled: false,
  resizeMode: 'fit',
  maintainAspectRatio: true,
  width: null,
  height: null,
  maxDimensionsEnabled: false,
  maxWidth: 1920,
  maxHeight: 1080,
  doNotEnlarge: true,
  stripMetadata: true,
};

export function useImageSettings(initialSettings: Partial<ImageSettings> = {}) {
  const [settings, setSettings] = useState<ImageSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });

  const setQualityPreset = useCallback((preset: QualityPreset) => {
    setSettings((prev) => {
      let quality = prev.quality;
      if (preset === 'low') quality = 50;
      else if (preset === 'medium') quality = 75;
      else if (preset === 'high') quality = 85;
      return { ...prev, qualityPreset: preset, quality };
    });
  }, []);

  const setQuality = useCallback((quality: number) => {
    setSettings((prev) => ({
      ...prev,
      quality,
      qualityPreset: 'custom',
    }));
  }, []);

  const setFormat = useCallback((format: OutputFormat) => {
    setSettings((prev) => ({ ...prev, format }));
  }, []);

  const setResizeDimensions = useCallback((width: number | null, height: number | null, referenceAspect?: number) => {
    setSettings((prev) => {
      let newW = width;
      let newH = height;

      if (prev.maintainAspectRatio && referenceAspect) {
        if (width !== null && width !== prev.width) {
          newH = Math.round(width / referenceAspect);
        } else if (height !== null && height !== prev.height) {
          newW = Math.round(height * referenceAspect);
        }
      }

      return {
        ...prev,
        width: newW,
        height: newH,
      };
    });
  }, []);

  const updateSetting = useCallback(<K extends keyof ImageSettings>(key: K, value: ImageSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    setSettings,
    setQualityPreset,
    setQuality,
    setFormat,
    setResizeDimensions,
    updateSetting,
    resetSettings,
  };
}
