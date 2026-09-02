'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

interface AnalyticsProps {
  gaId?: string;
  pixelId?: string;
}

/**
 * App-router navigations don't reload the page, so neither gtag's initial
 * config nor the Pixel's init fires again. This reports each client-side route
 * change, skipping the first run because the load-time scripts already counted
 * that view.
 */
function RouteChangeTracker({ gaId, pixelId }: AnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const query = searchParams?.toString();
    const url = `${pathname}${query ? `?${query}` : ''}`;
    const w = window as any;

    if (gaId && typeof w.gtag === 'function') {
      w.gtag('config', gaId, { page_path: url });
    }
    if (pixelId && typeof w.fbq === 'function') {
      w.fbq('track', 'PageView');
    }
  }, [pathname, searchParams, gaId, pixelId]);

  return null;
}

export default function Analytics({ gaId, pixelId }: AnalyticsProps) {
  // Nothing configured in Site Settings — render no tags at all.
  if (!gaId && !pixelId) return null;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {pixelId && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      <Suspense fallback={null}>
        <RouteChangeTracker gaId={gaId} pixelId={pixelId} />
      </Suspense>
    </>
  );
}
