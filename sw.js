const CACHE = 'poolcheck-v11';
const ASSETS = ['/', '/index.html', '/manifest.json',
  '/icons/icon-192x192.png', '/icons/icon-512x512.png'];

// Install: cache core assets
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.allSettled(ASSETS.map(a => c.add(a).catch(() => {})))
  ));
  // Don't skipWaiting here — wait for app to trigger update consciously
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Message: app sends SKIP_WAITING to trigger update
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch: network-first for HTML, cache-first for assets
self.addEventListener('fetch', e => {
  if (e.request.url.endsWith('.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached ||
      fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/index.html'))
    )
  );
});
