// Minimal offline service worker for the cook app.
// - Precaches the app shell.
// - Serves the menu's downloaded assets (images/voice notes) and any
//   navigations from cache when offline (network-first, cache fallback).
const SHELL_CACHE = "cook-shell-v1";
const ASSET_CACHE = "cook-assets-v1"; // shared with lib/offline.ts
const SHELL_URLS = ["/", "/manifest.json", "/data/menus.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== ASSET_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Navigations: try network, fall back to the cached shell ("/").
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/").then((r) => r || caches.match(request))
      )
    );
    return;
  }

  // Everything else: cache-first across both caches, then network.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(request, copy)).catch(() => {});
          return res;
        })
        .catch(() => cached);
    })
  );
});
