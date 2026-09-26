import React, { useEffect, useRef, useState } from 'react';
import { AdContainer } from './AdContainer';
import { getAdSenseClientId, isAdSenseConfigured, loadAdSenseScript } from '../../config/adsConfig';
import { Info, Sparkles, CheckCircle2 } from 'lucide-react';

export interface AdBannerProps {
  format?: 'horizontal' | 'rectangle' | 'leaderboard' | 'responsive' | 'auto';
  slotId?: string;
  className?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'horizontal',
  slotId,
  className = '',
  responsive = true,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const [showGuideTip, setShowGuideTip] = useState(false);

  const configured = isAdSenseConfigured();
  const clientId = getAdSenseClientId();

  useEffect(() => {
    if (configured && adRef.current) {
      try {
        loadAdSenseScript(clientId);
        // Prevent duplicate push to the same element if re-rendered
        const isStatusSet = adRef.current.getAttribute('data-adsbygoogle-status');
        if (!isStatusSet) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        // Suppress benign AdSense adblock / layout shift errors
        console.debug('AdSense push caught:', err);
      }
    }
  }, [configured, clientId, slotId]);

  // Dimension classes to reserve layout space and prevent Cumulative Layout Shift (CLS)
  const formatClasses = {
    horizontal: 'w-full min-h-[90px] max-w-4xl',
    rectangle: 'w-full max-w-[300px] min-h-[250px]',
    leaderboard: 'w-full max-w-[728px] min-h-[90px]',
    responsive: 'w-full min-h-[90px] sm:min-h-[100px] max-w-4xl',
    auto: 'w-full min-h-[90px] max-w-4xl',
  }[format];

  return (
    <AdContainer className={className}>
      <div className={`relative flex items-center justify-center ${formatClasses}`}>
        {configured ? (
          /* Live Google AdSense Ins Element */
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={clientId}
            data-ad-slot={slotId || undefined}
            data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
            data-full-width-responsive={responsive ? 'true' : 'false'}
          />
        ) : (
          /* Clean, compliant AdSense Preview & Verification Container */
          <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-xl bg-gradient-to-r from-slate-50 via-slate-100/70 to-slate-50 dark:from-slate-900/60 dark:via-slate-800/40 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 transition-all">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                Google AdSense Ready
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono hidden sm:inline">
                format: {format}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
              Interactive Responsive Ad Slot
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-md mt-0.5 line-clamp-1 sm:line-clamp-none">
              Client ID: <code className="bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px] text-slate-700 dark:text-slate-300 font-mono">{clientId}</code>
            </p>

            <button
              type="button"
              onClick={() => setShowGuideTip(!showGuideTip)}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Info className="w-3 h-3" />
              <span>{showGuideTip ? 'Hide setup note' : 'How to show real ads?'}</span>
            </button>

            {showGuideTip && (
              <div className="mt-3 p-2.5 rounded-lg bg-white dark:bg-slate-900 text-left text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg space-y-1 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Activation Steps:</span>
                </div>
                <p>1. Set your Publisher ID in Vercel / <code>.env</code> as <code className="font-mono text-blue-600 dark:text-blue-400">VITE_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX</code></p>
                <p>2. Update your publisher ID in <code className="font-mono text-slate-800 dark:text-slate-200">public/ads.txt</code></p>
                <p>3. Once your domain is approved by Google AdSense, real targeted ads will render automatically here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdContainer>
  );
};
