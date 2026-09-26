import React, { useEffect, useRef, useState } from 'react';
import { AdContainer } from './AdContainer';
import { ADSENSE_CONFIG, getAdSenseClientId, isAdSenseConfigured, loadAdSenseScript } from '../../config/adsConfig';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export interface AdBannerProps {
  format?: 'horizontal' | 'rectangle' | 'leaderboard' | 'responsive' | 'auto' | 'in-article' | 'autorelaxed' | 'in-feed';
  slotId?: string;
  className?: string;
  responsive?: boolean;
  adLayout?: string;
  layoutKey?: string;
  slotLabel?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'responsive',
  slotId,
  className = '',
  responsive = true,
  adLayout,
  layoutKey,
  slotLabel = 'Advertisement',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const [adBlocked, setAdBlocked] = useState(false);

  const configured = isAdSenseConfigured();
  const clientId = getAdSenseClientId();

  // Resolve target slot ID based on format if not explicitly provided
  const resolvedSlotId =
    slotId ||
    (format === 'in-article'
      ? ADSENSE_CONFIG.slots.inArticleFluid
      : format === 'in-feed'
      ? ADSENSE_CONFIG.slots.inFeedFluid
      : format === 'autorelaxed'
      ? ADSENSE_CONFIG.slots.multiplexAutorelaxed
      : ADSENSE_CONFIG.slots.displayResponsive);

  const isInArticle = format === 'in-article' || adLayout === 'in-article';
  const isInFeed = format === 'in-feed';
  const isAutorelaxed = format === 'autorelaxed';
  const resolvedLayoutKey = layoutKey || (isInFeed ? ADSENSE_CONFIG.slots.inFeedLayoutKey : undefined);

  useEffect(() => {
    if (configured && adRef.current && !pushedRef.current) {
      try {
        loadAdSenseScript(clientId);
        const isStatusSet = adRef.current.getAttribute('data-adsbygoogle-status');
        if (!isStatusSet) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        }
      } catch (err) {
        // Handled silently for ad blockers / network barriers
        console.debug('AdSense push caught:', err);
        setAdBlocked(true);
      }
    }
  }, [configured, clientId, resolvedSlotId]);

  // Dimension classes to reserve layout space and prevent Cumulative Layout Shift (CLS)
  const formatClasses = {
    horizontal: 'w-full min-h-[90px] max-w-4xl',
    rectangle: 'w-full max-w-[300px] min-h-[250px]',
    leaderboard: 'w-full max-w-[728px] min-h-[90px]',
    responsive: 'w-full min-h-[100px] sm:min-h-[120px] max-w-4xl',
    auto: 'w-full min-h-[100px] max-w-4xl',
    'in-article': 'w-full min-h-[100px] max-w-3xl my-2',
    'in-feed': 'w-full min-h-[120px] max-w-4xl my-2',
    autorelaxed: 'w-full min-h-[250px] max-w-4xl',
  }[format] || 'w-full min-h-[90px] max-w-4xl';

  return (
    <AdContainer className={className} slotLabel={slotLabel}>
      <div className={`relative flex items-center justify-center w-full ${formatClasses}`}>
        {configured ? (
          /* Live Google AdSense Ins Element */
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              textAlign: isInArticle ? 'center' : undefined,
            }}
            data-ad-client={clientId}
            data-ad-slot={resolvedSlotId}
            data-ad-layout={isInArticle ? 'in-article' : undefined}
            data-ad-layout-key={resolvedLayoutKey}
            data-ad-format={
              isAutorelaxed
                ? 'autorelaxed'
                : isInArticle || isInFeed
                ? 'fluid'
                : format === 'rectangle'
                ? 'rectangle'
                : 'auto'
            }
            data-full-width-responsive={responsive && !isInArticle && !isInFeed ? 'true' : undefined}
          />
        ) : (
          /* Development / Unconfigured preview */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Google AdSense Slot ({resolvedSlotId})
            </span>
          </div>
        )}
      </div>
    </AdContainer>
  );
};

/**
 * Dedicated Responsive Display Ad (Slot: 2097335205)
 * Suitable for Home, Tool pages, Header, Footer
 */
export const ResponsiveDisplayAd: React.FC<{ className?: string; slotLabel?: string }> = ({
  className,
  slotLabel,
}) => (
  <AdBanner
    format="responsive"
    slotId={ADSENSE_CONFIG.slots.displayResponsive}
    className={className}
    slotLabel={slotLabel}
  />
);

/**
 * Dedicated In-Article Fluid Ad (Slot: 7892587364)
 * Formatted with data-ad-layout="in-article" and data-ad-format="fluid"
 * Designed for guides, articles, and content blocks
 */
export const InArticleAd: React.FC<{ className?: string; slotLabel?: string }> = ({
  className,
  slotLabel,
}) => (
  <AdBanner
    format="in-article"
    slotId={ADSENSE_CONFIG.slots.inArticleFluid}
    className={className}
    slotLabel={slotLabel}
  />
);

/**
 * Dedicated In-Feed Fluid Ad (Slot: 4847796632, Layout Key: -fb+5w+4e-db+86)
 * Formatted with data-ad-format="fluid" and data-ad-layout-key="-fb+5w+4e-db+86"
 * Specifically designed to match cards in feeds, tool grids, and listings
 */
export const InFeedAd: React.FC<{ className?: string; slotLabel?: string }> = ({
  className,
  slotLabel,
}) => (
  <AdBanner
    format="in-feed"
    slotId={ADSENSE_CONFIG.slots.inFeedFluid}
    layoutKey={ADSENSE_CONFIG.slots.inFeedLayoutKey}
    className={className}
    slotLabel={slotLabel}
  />
);

/**
 * Dedicated Multiplex / Autorelaxed Ad (Slot: 1327179013)
 * Formatted with data-ad-format="autorelaxed"
 * Designed for end-of-article, related content, and page footers
 */
export const MultiplexAd: React.FC<{ className?: string; slotLabel?: string }> = ({
  className,
  slotLabel,
}) => (
  <AdBanner
    format="autorelaxed"
    slotId={ADSENSE_CONFIG.slots.multiplexAutorelaxed}
    className={className}
    slotLabel={slotLabel}
  />
);
