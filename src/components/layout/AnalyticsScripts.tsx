import Script from "next/script";
import { analyticsConfig, isGa4Enabled, isMetaPixelEnabled } from "@/lib/analytics/config";

/**
 * Renders GA4 and/or Meta Pixel loaders only when their environment
 * variables are set. Safe to leave in the tree permanently — with no env
 * vars configured this component renders nothing and adds zero scripts.
 */
export function AnalyticsScripts() {
  return (
    <>
      {isGa4Enabled && (
        <>
          <Script
            id="ga4-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4MeasurementId}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsConfig.ga4MeasurementId}');
            `}
          </Script>
        </>
      )}
      {isMetaPixelEnabled && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${analyticsConfig.metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
