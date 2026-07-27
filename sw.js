/* ============================================================
   BEENUM LEARNING — Service Worker
   Enables installability + basic offline support.
   Strategy:
     - HTML pages (navigations): network-first, falling back to
       cache, falling back to the cached homepage shell.
     - Static assets (css/js/images/fonts): stale-while-revalidate
       so repeat visits are fast but stay fresh in the background.
     - Cross-origin requests (YouTube, Buy Me a Coffee, GA, etc.)
       are left completely alone — never intercepted or cached.
   ============================================================ */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `beenum-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/index.html';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/indexpage.css',
  '/js/darkmode.js',
  '/js/include.js',
  '/js/belt.js',
  '/manifest.json',
  '/resources/logo/favicon-32.png',
  '/resources/logo/icon-192.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .catch(() => {}) // never let a missing/renamed asset block install
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // don't touch third-party requests

  // Full page navigations
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Static assets: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
