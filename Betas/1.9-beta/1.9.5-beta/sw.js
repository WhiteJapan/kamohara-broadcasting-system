const VERSION = 'v1.9.5'; // 設定メニューとオフライン対応強化
const CACHE_NAME = `kamohara-${VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './l_w.png',
  './d_w.png'
];

// フェッチ時にキャッシュから返し、なければネットワーク
self.addEventListener('fetch', (event) => {
  // 【最重要】httpかhttps以外の通信（拡張機能など）は、エラーの原因になるので一切無視する
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. キャッシュがあればそれを返す
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. なければネットワークから取得
      return fetch(event.request).then((networkResponse) => {
        // 取得失敗、または正常な応答（200）以外、または外部サイト（basic以外）はキャッシュしない
        // ※ただしオーディオファイルなどは例外的に扱う今のロジックを継承
        if (!networkResponse || networkResponse.status !== 200 || 
            (networkResponse.type !== 'basic' && !event.request.url.includes('audio/'))) {
          return networkResponse;
        }

        // 3. 正常な応答なら、クローンを作ってキャッシュに保存
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // ここでエラーが出ないようにガードレールが効いている状態
          cache.put(event.request, responseToCache).catch((err) => {
            console.warn('Cache put failed (ignored):', err);
          });
        });

        return networkResponse;
      }).catch((err) => {
        // ネットワーク自体が死んでいる（オフライン）時の処理
        console.error('Fetch failed; returning offline page if available.', err);
      });
    })
  );
});

// インストール時に即座に有効化
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 有効化時に古いキャッシュを削除し、即座に制御を開始
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

// フェッチ時にキャッシュから返し、なければネットワーク
self.addEventListener('fetch', (event) => {
  // オーディオファイルなどはキャッシュ優先、かつ取得時にキャッシュに保存
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !event.request.url.includes('audio/')) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
