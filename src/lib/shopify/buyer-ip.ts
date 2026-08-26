import "server-only";
import type { NextRequest } from "next/server";

/**
 * Safely extracts the buyer's real IP address from trusted, platform-set
 * request headers — for forwarding to Shopify via the
 * `Shopify-Storefront-Buyer-IP` header on buyer-initiated requests (cart
 * creation, add/update/remove line items, discount codes).
 *
 * SECURITY: this deliberately never reads an IP from anything the client
 * controls directly (a query string parameter, a JSON body field, or a
 * client-settable header name) — a malicious client could put any value
 * there to spoof another buyer or dodge Shopify's bot/fraud throttling.
 * Instead it only trusts headers that Vercel's edge network sets itself
 * from the real TCP connection, overwriting/stripping anything a client
 * tried to inject with the same header name before the request reaches
 * this app. Per Vercel's own docs: "we currently overwrite the
 * X-Forwarded-For header and do not forward external IPs. This
 * restriction is in place to prevent IP spoofing."
 * See: https://vercel.com/docs/headers/request-headers
 *
 * Caveat: if you later put an external proxy/WAF (e.g. Cloudflare) in
 * front of Vercel, this guarantee no longer holds automatically — you'd
 * see that proxy's IP instead of the real visitor's, and would need
 * Vercel's Enterprise "trusted proxy" feature to restore it. Not a
 * concern for a standard Vercel deployment, which is what this project
 * targets.
 *
 * `x-forwarded-for` may contain a comma-separated chain of proxy hops
 * (`client, proxy1, proxy2`); the first entry is the original client.
 */
export function getTrustedBuyerIp(request: NextRequest): string | undefined {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  // Fallback used by some platforms/proxies (including Vercel in certain
  // configurations) that set a single-value real-IP header instead.
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return undefined;
}
