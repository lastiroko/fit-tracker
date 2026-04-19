const CACHE = 'fittracker-v2';
const PRECACHE = ['/', '/icon.svg', '/manifest.webmanifest', '/pixel-portrait.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Never cache API / auth / push endpoints — always hit the network.
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/oauth2/') ||
    url.pathname.startsWith('/login/') ||
    url.pathname === '/logout'
  ) return;

  e.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/'))),
  );
});

// ─── Push notifications (meal reminders) ────────────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'Fit Tracker', body: '', url: '/' };
  try {
    if (event.data) data = Object.assign(data, event.data.json());
  } catch {
    if (event.data) data.body = event.data.text();
  }

  const opts = {
    body: data.body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: 'meal-reminder',
    renotify: true,
    data: { url: data.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(data.title || 'Fit Tracker', opts));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((winList) => {
      for (const w of winList) {
        if ('focus' in w) return w.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    }),
  );
});
