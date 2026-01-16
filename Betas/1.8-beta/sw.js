const VERSION = 'v1.8.0'; // テーマ切り替えの完全同期対応
const CACHE_NAME = `kamohara-${VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './Wallpaper.png'
];

// インストール時に即座に有効化
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS);
    })
  );
});

// 有効化時に古いキャッシュを削除し、即座に制御を開始
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              console.log('Deleting old cache:', name);
              return caches.delete(name);
            }
          })
        );
      })
    ])
  );
});

// フェッチ時にキャッシュから返し、なければネットワーク
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});