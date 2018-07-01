/ static cache versions
let staticCacheName = 'currency-converter-v5';

self.addEventListener('install', event => {
 self.skipWaiting();
 event.waitUntil(
   caches.open(staticCacheName).then(function(cache) {
     return cache.addAll([
         'index.html',
         'style.css',
         'js/main/index.js',
         'js/sw/index.js',

     ]);
   })
 );
});

self.addEventListener('activate', function (event) {
 event.waitUntil(caches.keys().then(function (cacheNames) {
   return Promise.all(cacheNames.filter(function (cacheName) {
     return cacheName.startsWith('currency-converter-') && cacheName != staticCacheName;
   }).map(function (cacheName) {
     return caches['delete'](cacheName);
   }));
 }));
});

self.addEventListener('fetch', function (event) {
 // TODO: respond to requests for the root page with
 // the page skeleton from the cache
 var requestUrl = new URL(event.request.url);
 if (requestUrl.origin === location.origin) {
   if (requestUrl.pathname === "/") {
     event.respondWith(caches.match('/index.html'));
     return;
   }
 }
 event.respondWith(caches.match(event.request).then(function (response) {
   return response || fetch(event.request);
 }));
 
});
