import "server-only";

/**
 * Server-only Shopify Storefront API client.
 *
 * IMPORTANT: This file is guarded by the `server-only` package, which makes
 * the build fail if anything in it is ever imported into client-side code.
 * The private Storefront token therefore can never leak to the browser.
 * Every product/collection/cart operation in this app is executed from a
 * React Server Component or a Route Handler (src/app/api/**) that calls
 * the functions exported from this module — never directly from the client.
 *
 * AUTHENTICATION: This app uses a PRIVATE Storefront API access token
 * (from the Shopify Headless sales channel), sent server-side only via the
 * `Shopify-Storefront-Private-Token` header — NOT the public-token header
 * `X-Shopify-Storefront-Access-Token`. Private tokens must never be used
 * in browser JavaScript. See: https://shopify.dev/docs/api/storefront#authentication
 */

// Storefront API version. Bump this in one place when Shopify releases a
// new stable version — see https://shopify.dev/docs/api/usage/versioning
const API_VERSION = "2026-04";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

export class ShopifyConfigError extends Error {}

function endpoint(): string {
  if (!domain) {
    throw new ShopifyConfigError(
      "Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable. Set it in your Vercel project settings."
    );
  }
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!cleanDomain.endsWith(".myshopify.com")) {
    // Not a hard error — some setups may legitimately differ — but this is
    // by far the most common misconfiguration: pasting the storefront's
    // custom domain (e.g. www.smilingpets.in) instead of the required
    // *.myshopify.com domain, which causes every request to fail or return
    // HTML instead of JSON. Logged once per cold start to aid debugging
    // without needing to inspect env vars directly.
    console.warn(
      `[shopify] NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ("${cleanDomain}") doesn't end in ".myshopify.com". ` +
        "Use your store's *.myshopify.com domain (Shopify Admin URL bar), not a custom domain."
    );
  }
  return `https://${cleanDomain}/api/${API_VERSION}/graphql.json`;
}

type ShopifyFetchOptions<TVariables> = {
  query: string;
  variables?: TVariables;
  cache?: RequestCache;
  /** Next.js ISR revalidation window, in seconds. Ignored when `cache` is set. */
  revalidate?: number | false;
  tags?: string[];
  /**
   * The buyer's real IP address, forwarded to Shopify so it can apply
   * accurate per-buyer rate limiting and bot/fraud protection instead of
   * throttling this app's whole server as a single client. ONLY ever pass
   * a value obtained server-side from a trusted platform header (see
   * `src/lib/shopify/buyer-ip.ts`) — never from a client-supplied query
   * parameter or request body field, which a malicious client could spoof
   * to impersonate another buyer or evade throttling.
   */
  buyerIp?: string;
};

type ShopifyGraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
};

export class ShopifyApiError extends Error {
  errors?: Array<{ message: string }>;
  status?: number;
  constructor(message: string, opts?: { errors?: Array<{ message: string }>; status?: number }) {
    super(message);
    this.name = "ShopifyApiError";
    this.errors = opts?.errors;
    this.status = opts?.status;
  }
}

/**
 * Low level fetch wrapper around the Shopify Storefront GraphQL API.
 * Uses Next.js's extended `fetch` so responses are cached and revalidated
 * automatically (Incremental Static Regeneration) — meaning that once a
 * merchant edits a product, price or collection inside Shopify Admin, the
 * storefront picks up the change the next time the cache window elapses,
 * or instantly if the /api/revalidate webhook is configured (see README).
 */
export async function shopifyFetch<T, TVariables = Record<string, unknown>>({
  query,
  variables,
  cache,
  revalidate = 60,
  tags,
  buyerIp,
}: ShopifyFetchOptions<TVariables>): Promise<T> {
  if (!token) {
    throw new ShopifyConfigError(
      "Missing SHOPIFY_STOREFRONT_PRIVATE_TOKEN environment variable. Set it in your Vercel project settings. Never expose it with a NEXT_PUBLIC_ prefix."
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Private Storefront API token header (server-side only). This is
    // intentionally NOT "X-Shopify-Storefront-Access-Token" — that header
    // is for PUBLIC tokens, which are safe to expose in browser JS. Ours
    // is a private token and must use this header instead.
    "Shopify-Storefront-Private-Token": token,
  };

  if (buyerIp) {
    // Case-sensitive per Shopify's docs. Only ever set from a value that
    // was extracted server-side from a trusted request header — see
    // getTrustedBuyerIp() in src/lib/shopify/buyer-ip.ts.
    headers["Shopify-Storefront-Buyer-IP"] = buyerIp;
  }

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  };

  if (cache) {
    fetchOptions.cache = cache;
  } else {
    fetchOptions.next = { revalidate, tags };
  }

  // Logs to the server console (visible in Vercel's Function/Runtime logs)
  // — never includes the token, only the request shape and failure
  // details, so it's always safe to leave this in production.
  function logAndThrow(message: string, opts?: { errors?: Array<{ message: string }>; status?: number }): never {
    console.error("[shopify]", {
      message,
      status: opts?.status,
      graphqlErrors: opts?.errors,
      domainConfigured: Boolean(domain),
      // Never logged: the token value itself.
    });
    throw new ShopifyApiError(message, opts);
  }

  let response: Response;
  try {
    response = await fetch(endpoint(), fetchOptions);
  } catch (err) {
    logAndThrow(
      `Could not reach Shopify. Check NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is your *.myshopify.com domain. (${(err as Error).message})`
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const truncated = text.length > 300 ? `${text.slice(0, 300)}…` : text;
    let hint = "";
    if (response.status === 401 || response.status === 403) {
      hint =
        " This usually means SHOPIFY_STOREFRONT_PRIVATE_TOKEN is missing, wrong, or lacks the required Storefront API scopes — check Shopify Admin → your Headless app → API credentials.";
    } else if (response.status === 404) {
      hint =
        " This usually means NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is wrong — it must be your *.myshopify.com domain, not a custom domain like smilingpets.in.";
    }
    logAndThrow(`Shopify API responded with status ${response.status}.${hint} Response: ${truncated}`, {
      status: response.status,
    });
  }

  let json: ShopifyGraphQLResponse<T>;
  try {
    json = (await response.json()) as ShopifyGraphQLResponse<T>;
  } catch {
    logAndThrow(
      "Shopify returned a response that wasn't valid JSON. This almost always means NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is pointing at the wrong place — double-check it's your *.myshopify.com domain (Shopify Admin URL bar), not smilingpets.in or another custom domain."
    );
  }

  if (json.errors && json.errors.length > 0) {
    logAndThrow(json.errors.map((e) => e.message).join("; "), { errors: json.errors });
  }

  if (!json.data) {
    logAndThrow("Shopify API returned an empty response.");
  }

  return json.data;
}

export const isShopifyConfigured = () => Boolean(domain && token);
