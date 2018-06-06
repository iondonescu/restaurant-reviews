"use strict";
let cache_name = 'restaurant_reviews_static_cache';

// Install the service worker
self.addEventListener("install", function(event) {
  console.log('WORKER: install event in progress.');
  event.waitUntil(
    caches.open(cache_name)
    .then(function(cache) {
      console.log('Catch in cache');
      return cache.addAll([
        '/',
        'css/styles.css',
        'data/restaurants.json',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'index.html',
        'restaurant.html'
      ]);
    })
    .then(function(){console.log('Service Worker:Install completed');
  })
  );
});

// Activate the service worker and implementation for multiple service worker (maybe for future work)
self.addEventListener("activate", function(event){
  console.log('Activated');
  event.waitUntil(
  caches.keys().then(function(cacheNames){
    return Promise.all(
    cacheNames.filter(function(cacheNames){
      return cacheNames.startsWith('restaurant-') &&
        cacheName != cache_name;
    }).map(function(cacheName){
      return cache.delete(cacheName);
        })
      )
    })
  )
});

// Get data from the caches
//source https://css-tricks.com/serviceworker-for-offline/ as a Udacity review suggestion
self.addEventListener("fetch", function(event) {
  console.log('WORKER: fetch event in progress.');
  //ignore other method than "get"
  if (event.request.method !== 'GET'){
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }

  event.respondWith(
    caches
    .match(event.request)
    .then(function(cached){
      var networked = fetch(event.request)
      .then(fetchedFromNetwork,unableToResolve)
      .catch(unableToResolve);
      console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
        return cached || networked;

      function fetchedFromNetwork(response) {
        var cacheCopy = response.clone();
        console.log('WORKER: fetch response from network.', event.request.url);
        caches
        .open(cache_name +'v1') // put in another cache
        .then(function add(cache) {
          return cache.put(event.request, cacheCopy);
        })
        .then(function() {
              console.log('WORKER: fetch response stored in cache.', event.request.url);
            });

        return response;
      }
      //unable to produce a response from either the cache or the network.
      function unableToResolve () {
          console.log('WORKER: fetch request failed in both cache and network.');
        return new Response('<h1>Service Unavailable</h1>', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/html'
        })
      });
      }
    })
  );
});
