const CACHE = 'saljapp-v6';
const PRECACHE = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './assets/items/klanning-gron.png',
  './assets/items/jeans-ljusbla.png',
  './assets/items/crop-top-svart.png',
  './assets/items/blus-prickig.png',
  './assets/items/nike-tee.png',
  './assets/items/chloe-parfym.png',
  './assets/items/solglasogon.png',
  './assets/items/linneskjorta.png',
  './assets/items/adidas-samba.png',
  './assets/items/svart-vaska.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first for Google Fonts and CDN scripts; cache-first for everything else
  const url = new URL(e.request.url);
  const isExternal = url.origin !== self.location.origin;
  if (isExternal) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
