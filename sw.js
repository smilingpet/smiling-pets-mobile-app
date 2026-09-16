// Smiling Pets — Service Worker
//
// CACHE_VERSION was bumped as part of fixing a real class of bug: this
// worker previously used cache-first (stale-while-revalidate) for CSS and
// JS bundles too, not just images/fonts. Next.js renames its JS/CSS chunk
// filenames on every deploy, so that should have been safe in theory — but
// serving a stale cached HTML shell (from before a deploy) alongside fresh
// JS chunks (or vice versa) can produce exactly the kind of broken,
// duplicated-looking UI that mismatched app-shell versions cause. HTML,
// CSS and JS are now all network-first, so a rendered page and the code
// that hydrates it always come from the same deploy. Bump CACHE_VERSION
// again any time you want to force every installed client to fully purge
// its old cache on next launch.
const CACHE_VERSION = "smilingpets-v2";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = "/offline";

const APP_SHELL = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            // Delete every cache from a previous CACHE_VERSION — this is
            // what actually clears out stale HTML/CSS/JS left over from
            // before a deploy, not just the app's own current cache.
            .filter((key) => key.startsWith("smilingpets-") && key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Allow the page to tell a waiting worker to activate immediately
// (used by the "Update available" toast).
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isApiCartOrCheckout(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("myshopify.com") ||
    url.hostname.includes("shopify.com") ||
    url.pathname.includes("/cart") ||
    url.pathname.includes("checkout")
  );
}

function isStableStaticAsset(request, url) {
  // Only genuinely stable, content-hashed or rarely-changing assets are
  // safe to cache-first: images, fonts, and Next's immutable build assets.
  // Anything Shopify-hosted (product photos, collection images) is also
  // safe here — Shopify serves those from a CDN with content-addressed URLs.
  return (
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.startsWith("/_next/static/") ||
    url.hostname.includes("cdn.shopify.com")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept API calls, cart operations, or Shopify checkout —
  // those must always hit the network so orders/payments stay live and
  // accurate, and are never served from a cache.
  if (isApiCartOrCheckout(url)) return;

  // Stable static assets (images, fonts, Shopify CDN images, Next's
  // hashed /_next/static/ build output): cache-first with a background
  // network refresh, since these URLs only change when their content does.
  if (isStableStaticAsset(request, url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Everything else — HTML pages (navigations), CSS, and non-hashed JS —
  // is network-first. The network response is cached as a fallback for
  // when the person is offline, but a fresh deploy is always preferred
  // over anything previously cached, so the HTML shell and its scripts
  // and styles never end up out of sync with each other.
  if (
    request.mode === "navigate" ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "document"
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          if (request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
          return Response.error();
        })
    );
  }
});
