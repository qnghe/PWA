var cacheStorageKey = 'pwa-1';

var cacheList = [
    '/',
    'index.html',
    'main.css',
    'app1.png',
    '//cdn.repository.webfont.com/webfonts/nomal/115685/45807/5d6ce9dff629d813c0d4984b.gif?r=115812447414',
];
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheStorageKey).then(cache => {
            cache.addAll(cacheList);
        }).then(() => self.skipWaiting())
    )
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if (response != null) {
                return response;
            }
            return fetch(e.request.url);
        })
    )
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys.then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== cacheStorageKey) {
                        return caches.delete(name);
                    }
                })
            )
        })
    )
    return self.clients.claim();
})