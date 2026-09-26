/**
 * Privacy-focused analytics utility.
 * Logs events locally and dispatches to standard event hooks (e.g., Google Analytics 4, Plausible)
 * without ever tracking personal identifying information or uploading file contents.
 */

export type AnalyticsEventName =
  | 'page_view'
  | 'file_upload'
  | 'compression_start'
  | 'compression_success'
  | 'compression_error'
  | 'download_single'
  | 'download_all_zip'
  | 'preset_selected'
  | 'format_converted'
  | 'dimensions_resized'
  | 'passport_photo_generated'
  | 'comparison_viewed';

export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsService {
  private enabled = true;

  constructor() {
    // Analytics is client-side only and passive
    if (typeof window !== 'undefined') {
      const dnt = navigator.doNotTrack === '1' || (window as unknown as { doNotTrack?: string }).doNotTrack === '1';
      if (dnt) {
        this.enabled = false;
      }
    }
  }

  public track(eventName: AnalyticsEventName, params?: AnalyticsEventParams): void {
    if (!this.enabled || typeof window === 'undefined') return;

    // Dispatches standard CustomEvent so host pages, Google Tag Manager, or privacy tools can listen
    try {
      const event = new CustomEvent('app_analytics', {
        detail: {
          event: eventName,
          timestamp: Date.now(),
          path: window.location.pathname,
          ...params,
        },
      });
      window.dispatchEvent(event);

      // Support for Google Analytics gtag if installed by webmaster
      const win = window as unknown as { gtag?: (...args: unknown[]) => void };
      if (typeof win.gtag === 'function') {
        win.gtag('event', eventName, params);
      }
    } catch {
      // Non-blocking fail-safe
    }
  }

  public trackPageView(path: string, title?: string): void {
    this.track('page_view', {
      page_path: path,
      page_title: title || (typeof document !== 'undefined' ? document.title : ''),
    });
  }
}

export const analytics = new AnalyticsService();
