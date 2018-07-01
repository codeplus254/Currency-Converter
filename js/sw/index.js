/ static cache versions
let staticCacheName = 'currency-converter-v2';

self.addEventListener('install', event => {
 self.skipWaiting();
 event.waitUntil(
   caches.open(staticCacheName).then(function(cache) {
     return cache.addAll([
         './index.html',
         '/css/index.css',
         '/js/app/loadCurrency.js',
         '/js/app/convertCurrency.js',
         '/images/andela.png',
         '/images/udacity.png',
         '/images/google.png',
         '/images/dir.png',
         '/images/cc.png',
         'https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra',
         '/https://free.currencyconverterapi.com',
         '/https://free.currencyconverterapi.com/api/v5/currencies'
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
 console.log("hello world");
});
