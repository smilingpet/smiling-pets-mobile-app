/**
 * Guards against a real class of bug: next/image throws a hard runtime
 * error — caught by the nearest error boundary, showing the user a
 * generic "Something went wrong" page — whenever it's given a src URL
 * whose hostname isn't explicitly allow-listed in next.config.mjs's
 * images.remotePatterns. Shopify normally serves all storefront images
 * from cdn.shopify.com, but a product or collection image can occasionally
 * end up hosted elsewhere — e.g. imported from a dropshipping/print-on-
 * demand app, or set directly via a metafield — and that one unexpected
 * URL would otherwise take down an entire collection or product page.
 *
 * Use this to check any Shopify-sourced image URL before handing it to
 * next/image; if it's not safe, render an icon fallback instead of
 * crashing. Keep this allow-list in sync with next.config.mjs.
 */
const ALLOWED_IMAGE_HOSTS = [/^cdn\.shopify\.com$/, /\.myshopify\.com$/];

export function isSafeImageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const { hostname, protocol } = new URL(url);
    if (protocol !== "https:") return false;
    return ALLOWED_IMAGE_HOSTS.some((pattern) => pattern.test(hostname));
  } catch {
    return false;
  }
}
