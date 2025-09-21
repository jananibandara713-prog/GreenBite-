// sw.js — GreenBite MPA-friendly service worker

const CACHE_NAME = 'greenbite-v3'; // ⬅ bump version when change this file
const ASSETS = [
  // (optional) add static pre-cache:

  './index.html',
  './recipes.html',
  './calculator.html',
  './workout.html',
  './mindfulness.html',
  './contact.html',
  './css/style.css',
  './js/main.js',
  './images/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // clean old caches
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests.
  if (url.origin !== location.origin) return;

  // ✅ For page navigations (HTML), use NETWORK-FIRST
  // so clicking header links loads the actual .html file.
  const isHTML =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // option: cache a fresh copy
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => {
          // offline fallback: last cached page or index.html
          return caches.match(req).then((cached) => cached || caches.match('./index.html'));
        })
    );
    return;
  }

  // 📦 For static assets: CACHE-FIRST with background update
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      });
    })
  );
});
