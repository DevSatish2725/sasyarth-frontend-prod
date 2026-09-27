const CACHE_VERSION = "sasyarth-v1";

const STATIC_CACHE = `${CACHE_VERSION}-static`;

const PAGE_CACHE = `${CACHE_VERSION}-pages`;

const OFFLINE_URL = "/offline";

const PRECACHE_URLS = [
  OFFLINE_URL,

  "/icons/icon-192x192.png",

  "/icons/icon-512x512.png",

  "/icons/icon-512x512-maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) => ![STATIC_CACHE, PAGE_CACHE].includes(cacheName),
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));

    return;
  }

  if (
    url.pathname.startsWith("/icons") ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then(async (cached) => {
        if (cached) {
          return cached;
        }

        const response = await fetch(request);

        const cache = await caches.open(STATIC_CACHE);

        cache.put(request, response.clone());

        return response;
      }),
    );

    return;
  }

  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(fetch(request));

    return;
  }
});

async function networkFirstPage(request) {
  try {
    const response = await fetch(request);

    if (response && response.ok) {
      const cache = await caches.open(PAGE_CACHE);

      cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return caches.match(OFFLINE_URL);
  }
}
