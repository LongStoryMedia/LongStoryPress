/* eslint-disable */
const CACHE_NAME = `lsp-prefetch`;

self.addEventListener("install", (event) => {
  const manifest = new URL(location).searchParams.get("manifestPath");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      fetch(manifest).then((response) =>
        response.json().then((assets) => {
          const precachedAssets = Object.keys(assets).map((key) => assets[key]);
          cache.addAll(precachedAssets);
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(CACHE_NAME)
      .then((response) => response || fetch(event.request))
  );
});

/* eslint-enable */
