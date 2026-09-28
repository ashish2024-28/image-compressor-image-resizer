/**
 * Genuine live hardware & browser diagnostics utility
 * Queries real browser APIs without hardcoded or fabricated numbers
 */

export interface SystemDiagnostics {
  browser: string;
  os: string;
  screenResolution: string;
  viewport: string;
  dpr: number;
  cpuCores: string;
  deviceMemory: string;
  canvas2d: string;
  offscreenCanvas: string;
  webCodecs: string;
  webAudio: string;
  touchSupport: string;
  networkStatus: string;
  pwaStandalone: string;
  userAgent: string;
  timestamp: string;
}

export function detectBrowser(ua: string): string {
  if (/SamsungBrowser\/([0-9.]+)/i.test(ua)) {
    const match = ua.match(/SamsungBrowser\/([0-9.]+)/i);
    return `Samsung Internet ${match ? match[1] : ''}`;
  }
  if (/Edg\/([0-9.]+)/i.test(ua)) {
    const match = ua.match(/Edg\/([0-9.]+)/i);
    return `Microsoft Edge ${match ? match[1] : ''}`;
  }
  if (/OPR\/([0-9.]+)/i.test(ua) || /Opera/i.test(ua)) {
    const match = ua.match(/OPR\/([0-9.]+)/i);
    return `Opera ${match ? match[1] : ''}`;
  }
  if (/Chrome\/([0-9.]+)/i.test(ua) && !/Edg/i.test(ua)) {
    const isMobile = /Android|Mobile/i.test(ua);
    const match = ua.match(/Chrome\/([0-9.]+)/i);
    return isMobile ? `Google Chrome Mobile ${match ? match[1] : ''}` : `Google Chrome ${match ? match[1] : ''}`;
  }
  if (/Firefox\/([0-9.]+)/i.test(ua)) {
    const match = ua.match(/Firefox\/([0-9.]+)/i);
    return `Mozilla Firefox ${match ? match[1] : ''}`;
  }
  if (/Version\/([0-9.]+).*Safari/i.test(ua)) {
    const match = ua.match(/Version\/([0-9.]+)/i);
    return `Apple Safari ${match ? match[1] : ''}`;
  }
  return 'Modern Web Browser';
}

export function detectOS(ua: string): string {
  if (/Android/i.test(ua)) {
    const versionMatch = ua.match(/Android\s([0-9.]+)/i);
    const modelMatch = ua.match(/;\s([^;)]+)\sBuild/i) || ua.match(/\(([^;)]+);\sAndroid/i);
    const version = versionMatch ? `Android ${versionMatch[1]}` : 'Android';
    const model = modelMatch ? ` (${modelMatch[1].trim()})` : '';
    return `${version}${model}`;
  }
  if (/iPhone/i.test(ua)) {
    const match = ua.match(/OS\s([0-9_]+)/i);
    return match ? `iOS ${match[1].replace(/_/g, '.')} (iPhone)` : 'iOS (iPhone)';
  }
  if (/iPad/i.test(ua)) {
    const match = ua.match(/OS\s([0-9_]+)/i);
    return match ? `iPadOS ${match[1].replace(/_/g, '.')} (iPad)` : 'iPadOS';
  }
  if (/Macintosh|Mac OS X/i.test(ua)) {
    const match = ua.match(/Mac OS X\s([0-9_]+)/i);
    return match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
  }
  if (/Windows NT 10.0/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT/i.test(ua)) return 'Windows';
  if (/Linux/i.test(ua)) return 'Linux';
  if (/CrOS/i.test(ua)) return 'ChromeOS';
  return 'Unknown OS';
}

export function getLiveSystemDiagnostics(): SystemDiagnostics {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  
  // Real CPU Cores
  const concurrency = typeof navigator !== 'undefined' ? (navigator as any).hardwareConcurrency : undefined;
  const cpuCores = concurrency !== undefined && concurrency > 0 
    ? `${concurrency}` 
    : 'Not exposed by browser';

  // Real Device Memory
  const memory = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : undefined;
  const deviceMemory = memory !== undefined 
    ? `${memory} GB` 
    : 'Not exposed (iOS / Safari policy)';

  // Real Canvas 2D check
  let canvas2d = 'Unavailable';
  try {
    const canvas = document.createElement('canvas');
    if (canvas && canvas.getContext('2d')) {
      canvas2d = 'Available';
    }
  } catch {
    canvas2d = 'Unavailable';
  }

  // OffscreenCanvas
  const offscreenCanvas = typeof window !== 'undefined' && 'OffscreenCanvas' in window 
    ? 'Supported' 
    : 'Unavailable';

  // WebCodecs
  const webCodecs = typeof window !== 'undefined' && 'VideoEncoder' in window 
    ? 'Available' 
    : 'Not supported';

  // Web Audio
  const webAudio = typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)
    ? 'Available' 
    : 'Not supported';

  // Touch Support
  const touchPoints = typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0;
  const touchSupport = touchPoints > 0 ? `Yes (${touchPoints} points)` : 'No (Mouse/Keyboard)';

  // Network Status
  let networkStatus = typeof navigator !== 'undefined' && navigator.onLine ? 'Online' : 'Offline';
  if (typeof navigator !== 'undefined' && (navigator as any).connection?.effectiveType) {
    networkStatus += ` (${(navigator as any).connection.effectiveType.toUpperCase()})`;
  }

  // PWA Standalone
  const pwaStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches 
    ? 'Yes' 
    : 'No';

  const screenWidth = typeof window !== 'undefined' ? window.screen.width : 0;
  const screenHeight = typeof window !== 'undefined' ? window.screen.height : 0;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  return {
    browser: detectBrowser(ua),
    os: detectOS(ua),
    screenResolution: `${screenWidth}x${screenHeight}`,
    viewport: `${viewportWidth}x${viewportHeight}`,
    dpr,
    cpuCores,
    deviceMemory,
    canvas2d,
    offscreenCanvas,
    webCodecs,
    webAudio,
    touchSupport,
    networkStatus,
    pwaStandalone,
    userAgent: ua,
    timestamp: new Date().toISOString(),
  };
}
