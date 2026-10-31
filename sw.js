/* 离线缓存：让第二次打开几乎立刻出现 */
const CACHE = 'love-v4';
const CORE = ['./', './index.html', './map-geo.js', './world-nbr.js'];

self.addEventListener('install', function (e) {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE).then(function (c) {
        return c.addAll(CORE).catch(function () { /* 单个失败不阻断安装 */ });
    }));
});

self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
    var req = e.request;
    if (req.method !== 'GET') return;

    var url;
    try { url = new URL(req.url); } catch (err) { return; }
    if (url.origin !== location.origin) return;

    // 页面导航：先走网络，断网时回退到缓存
    if (req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') >= 0) {
        e.respondWith(
            fetch(req).then(function (res) {
                var copy = res.clone();
                caches.open(CACHE).then(function (c) { c.put(req, copy); });
                return res;
            }).catch(function () {
                return caches.match(req).then(function (hit) {
                    return hit || caches.match('./index.html') || caches.match('./');
                });
            })
        );
        return;
    }

    // 图片、字体、音乐：缓存优先
    if (/\.(png|jpe?g|webp|gif|svg|mp3|woff2?)$/i.test(url.pathname)) {
        e.respondWith(
            caches.match(req).then(function (hit) {
                if (hit) return hit;
                return fetch(req).then(function (res) {
                    if (res && (res.ok || res.type === 'opaque')) {
                        var copy = res.clone();
                        caches.open(CACHE).then(function (c) { c.put(req, copy); });
                    }
                    return res;
                });
            })
        );
        return;
    }

    // 其余：先用缓存，同时后台更新
    e.respondWith(
        caches.match(req).then(function (hit) {
            var net = fetch(req).then(function (res) {
                if (res && res.ok) {
                    var copy = res.clone();
                    caches.open(CACHE).then(function (c) { c.put(req, copy); });
                }
                return res;
            }).catch(function () { return hit; });
            return hit || net;
        })
    );
});
