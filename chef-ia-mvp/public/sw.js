// Service worker minimo do Chef IA para habilitar instalacao como PWA.
// Estrategia network-first: sempre tenta a rede primeiro (dados sempre
// atualizados) e so usa o cache quando o usuario esta offline.

const CACHE_NAME = "chef-ia-cache-v1";
const PRECACHE_URLS = [
    "/manifest.webmanifest",
    "/icons/icon.svg",
    "/icons/icon-maskable.svg",
  ];

self.addEventListener("install", (event) => {
    event.waitUntil(
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .catch(() => {})
        );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
          caches
            .keys()
            .then((keys) =>
                      Promise.all(
                                  keys
                                    .filter((key) => key !== CACHE_NAME)
                                    .map((key) => caches.delete(key))
                                )
                        )
        );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

                        event.respondWith(
                              fetch(event.request)
                                .then((response) => {
                                          const copy = response.clone();
                                          if (response.ok && event.request.url.startsWith(self.location.origin)) {
                                                      caches
                                                        .open(CACHE_NAME)
                                                        .then((cache) => cache.put(event.request, copy))
                                                        .catch(() => {});
                                          }
                                          return response;
                                })
                                .catch(() => caches.match(event.request))
                            );
});
