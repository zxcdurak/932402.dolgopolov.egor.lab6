const CACHE_NAME = 'pwa-version-4';

const assets = [
    '/',
    '/about',
    '/css/style.css',
    '/icons/ico_192.png',
    '/icons/ico_512.png',
    '/js/script.js',
    '/about.html',
    '/index.html',
    '/manifest.json',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(assets))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key.startsWith('pwa-version-') && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (event.request.method !== 'GET' || url.origin !== self.location.origin ||
        url.pathname.startsWith('/api/')) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(event.request);
        if (cached) return cached;

        // Navigation query parameters do not change these static pages.
        if (event.request.mode === 'navigate') {
            const pages = {
                '/': '/index.html',
                '/index.html': '/index.html',
                '/about': '/about.html',
                '/about.html': '/about.html',
            };
            if (pages[url.pathname]) {
                const page = await cache.match(pages[url.pathname]);
                if (page) return page;
            }
        }

        return fetch(event.request);
    })());
});

