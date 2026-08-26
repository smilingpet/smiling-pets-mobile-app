// Smiling Pets — Service Worker
// Bump CACHE_VERSION whenever you want to force clients to fetch fresh
// assets. The app's UpdateNotification component listens for a new
// service worker and prompts the user to refresh.
const CACHE_VERSION = "smilingpets-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = "/offline";

const APP_SHELL = [
  "/",
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

function isApiOrCheckout(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("myshopify.com") ||
    url.pathname.includes("/cart") ||
    url.pathname.includes("checkout")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept API calls, cart operations, or Shopify checkout —
  // those must always hit the network so orders/payments stay live.
  if (isApiOrCheckout(url)) return;

  // Navigation requests: network-first, falling back to cache, then the
  // offline page if there's no connection at all.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || (await caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // Static assets (images, fonts, CSS/JS, Shopify CDN images): cache-first
  // with a background network update ("stale-while-revalidate").
  if (
    request.destination === "image" ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    url.hostname.includes("cdn.shopify.com")
  ) {
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
  }
});
