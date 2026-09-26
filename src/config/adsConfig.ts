/**
 * Google AdSense Configuration
 * 
 * To activate live ads:
 * 1. Obtain your Publisher ID from Google AdSense (e.g. ca-pub-1234567890123456)
 * 2. Set VITE_GOOGLE_ADSENSE_CLIENT_ID in your .env or Vercel environment variables
 * 3. Update public/ads.txt with your 16-digit publisher ID
 */

export interface AdSlotConfig {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'leaderboard';
  responsive?: boolean;
}

export const ADSENSE_CONFIG = {
  // Configured with your Publisher ID (pub-6284694302866330)
  defaultClientId: 'ca-pub-6284694302866330',
  
  // Dedicated Ad Slot IDs (created in Google AdSense Console > Ads > By ad unit)
  slots: {
    // 1. Responsive Display Ad (Homepage, Tool pages, Header, Footer)
    displayResponsive: import.meta.env.VITE_ADSENSE_SLOT_DISPLAY || '2097335205',
    homeHorizontal: import.meta.env.VITE_ADSENSE_SLOT_HOME || '2097335205',
    toolBottomHorizontal: import.meta.env.VITE_ADSENSE_SLOT_TOOL || '2097335205',
    sidebarRectangle: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR || '2097335205',

    // 2. In-Article / Fluid Content Ad
    inArticleFluid: import.meta.env.VITE_ADSENSE_SLOT_IN_ARTICLE || '7892587364',
    guidesInArticle: import.meta.env.VITE_ADSENSE_SLOT_GUIDES || '7892587364',

    // 3. In-Feed Fluid Ad (Within card feeds, tool lists, and article directories)
    inFeedFluid: import.meta.env.VITE_ADSENSE_SLOT_IN_FEED || '4847796632',
    inFeedLayoutKey: '-fb+5w+4e-db+86',

    // 4. Multiplex / Autorelaxed Ad (End of articles, bottom recommendations)
    multiplexAutorelaxed: import.meta.env.VITE_ADSENSE_SLOT_MULTIPLEX || '1327179013',
  },

  // Test mode flag: if client ID is placeholder or local dev, show styled ad preview
  testMode: import.meta.env.DEV || !import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID,
};

/**
 * Returns the effective Google AdSense Client ID
 */
export function getAdSenseClientId(): string {
  const envId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID;
  if (envId && envId.trim() !== '' && !envId.includes('XXXX')) {
    return envId.trim();
  }
  return ADSENSE_CONFIG.defaultClientId;
}

/**
 * Checks whether a legitimate production AdSense Client ID has been configured
 */
export function isAdSenseConfigured(): boolean {
  const clientId = getAdSenseClientId();
  return (
    Boolean(clientId) &&
    clientId.startsWith('ca-pub-') &&
    clientId !== 'ca-pub-0000000000000000' &&
    !clientId.includes('XXXX')
  );
}

/**
 * Dynamically loads the Google AdSense script into the head if not already loaded
 */
export function loadAdSenseScript(clientId: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!clientId || clientId.includes('XXXX')) return;

  const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
  if (existingScript) {
    // If the script already has the same client ID, do nothing
    if (existingScript.getAttribute('src')?.includes(clientId)) {
      return;
    }
  }

  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

