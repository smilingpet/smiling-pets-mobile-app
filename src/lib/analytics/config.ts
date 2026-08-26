/**
 * Centralized analytics configuration.
 *
 * Nothing loads unless you set the matching environment variable — no
 * tracking script is added automatically, and each one is only ever
 * injected once (see src/components/layout/AnalyticsScripts.tsx).
 *
 * To enable later:
 *  1. Get your GA4 Measurement ID (starts with "G-") from Google Analytics
 *     and set NEXT_PUBLIC_GA4_MEASUREMENT_ID in Vercel → Project Settings →
 *     Environment Variables.
 *  2. Get your Meta Pixel ID from Meta Events Manager and set
 *     NEXT_PUBLIC_META_PIXEL_ID the same way.
 *  3. Redeploy. That's it — no code changes required.
 */
export const analyticsConfig = {
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
};

export const isGa4Enabled = Boolean(analyticsConfig.ga4MeasurementId);
export const isMetaPixelEnabled = Boolean(analyticsConfig.metaPixelId);
