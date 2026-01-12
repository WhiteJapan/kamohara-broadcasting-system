const CACHE_NAME = 'kamohara-v2'; // バージョンを上げると古いキャッシュが捨てられやすくなる
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// インストール時にファイルをキャッシュする
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  // 新しいサービスワーカーをすぐに有効化する
  self.skipWaiting();
});

// ★ここを修正：Network First (先にネットを見に行く) 戦略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // ネットから取得できたらキャッシュを更新して返す
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // オフラインなどでネットがダメな時だけキャッシュを返す
        return caches.match(event.request);
      })
  );
});
