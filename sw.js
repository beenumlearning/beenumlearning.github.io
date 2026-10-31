/* ============================================================
   BEENUM LEARNING — Service Worker (offline support + installable app)

   You normally DON'T need to touch this file:
   pages, CSS, JS and JSON are fetched "network-first", so visitors
   always get your latest edits when they're online.

   Only bump CACHE_VERSION if you rename/remove one of the files in
   PRECACHE below (or add a new core file you want available offline).

   Strategies
   • Pages, CSS, JS, JSON ... network first → cache when offline
   • Images, fonts, PDFs .... cache first, refreshed in the background
   • Other websites (YouTube, Udemy, Google…) are never touched
   ============================================================ */
const CACHE_VERSION = 'v10';
const CORE = `beenum-core-${CACHE_VERSION}`;
const RUNTIME = `beenum-runtime-${CACHE_VERSION}`;
const SAVED = 'beenum-saved'; // guides saved with "Save offline" — kept across updates
const OFFLINE_URL = '/offline.html';
const RUNTIME_LIMIT = 80;

const PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/js/theme.js',
  '/js/site.js',
  '/js/blogs.js',
  '/js/offers.js',
  '/fonts/sora.woff2',
  '/fonts/inter.woff2',
  '/fonts/jetbrains-mono.woff2',
  '/manifest.json',
  '/resources/logo/logos.jpg',
  '/resources/logo/icon-192.png',
  '/resources/logo/favicon-32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CORE);
    await Promise.all(PRECACHE.map((url) => cache.add(new Request(url, { cache: 'reload' })).catch(() => {})));
    // First visit: activate straight away. Later updates wait for the "Refresh" button.
    if (!self.registration.active) await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = [CORE, RUNTIME, SAVED];
    for (const key of await caches.keys()) {
      if (key.startsWith('beenum-') && !keep.includes(key)) await caches.delete(key);
    }
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(page(event));
  } else if (/\.(css|js|json|svg|xml|webmanifest)$/.test(url.pathname)) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request, event));
  }
});

async function page(event) {
  const { request } = event;
  try {
    const response = (await event.preloadResponse) || (await timeout(fetch(request), 4000));
    if (response.ok) save(request, response.clone());
    return response;
  } catch (e) {
    return (await caches.match(request)) ||
      (await caches.match(request, { ignoreSearch: true })) ||
      (await caches.match(OFFLINE_URL));
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) save(request, response.clone());
    return response;
  } catch (e) {
    return (await caches.match(request)) || (await caches.match(request, { ignoreSearch: true })) || Response.error();
  }
}

async function cacheFirst(request, event) {
  const cached = await caches.match(request);
  const network = fetch(request).then((response) => {
    if (response.ok) save(request, response.clone());
    return response;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network.catch(() => Response.error());
}

async function save(request, response) {
  const cache = await caches.open(RUNTIME);
  await cache.put(request, response);
  const keys = await cache.keys();
  if (keys.length > RUNTIME_LIMIT) {
    for (const key of keys.slice(0, keys.length - RUNTIME_LIMIT)) await cache.delete(key);
  }
}

function timeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}
