var cacheStorageKey = 'pwa-1';

var cacheList = [
    '/',
    'manifest.json',
    'index.html',
    'main.css',
    'app1.png',
    'app2.png',
];

// 预缓存静态资源并立即激活 Service Worker
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheStorageKey).then(cache => {
            cache.addAll(cacheList);
        }).then(() => self.skipWaiting())
    )
});

// 监听activate事件, 激活后通过cache的key来判断是否更新cache中的静态资源
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== cacheStorageKey) {
                        return caches.delete(name);
                    }
                })
            )
        }).then(() => self.clients.claim())
    )
})

// 缓存策略 -- 在IOS 11.3.1 上有bug, 缓存后的音乐不能播放, 歌手图片不显示 --
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(e.request.url);
        })
    )
});

