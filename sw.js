
// adapted from https://developers.google.com/web/ilt/pwa/lab-caching-files-with-service-worker
(function () {
  'use strict';

  var filesToCache = [
    '.',
    '/index.html',
    '/css/styles.css',
    'css/normalize.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
  ];

  var staticCacheName = 'pages-cache';

  self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open(staticCacheName)
        .then(function (cache) {
          return cache.addAll(filesToCache);
        })
    );
  });

  self.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function (response) {
          return caches.open(staticCacheName).then(function (cache) {
            if (event.request.url.indexOf('test') < 0) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          });
        });
      }).catch(function (error) {
        console.log('Error, ', error);
       
      })
    );
  });

  self.addEventListener('activate', function (event) {

    var cacheWhitelist = [staticCacheName];

    event.waitUntil(
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

})();
