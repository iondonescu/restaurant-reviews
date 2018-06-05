let cache_name = 'restaurant_reviews_static_cache_v4';

// Install the service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cache_name).then(function(cache) {
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
  );
});

// Activate the service worker and implementation for multiple service worker
self.addEventListener('activate', function(event){
  console.log('Activated');
  /*event.waitUntil(
  caches.keys().then(function(cacheNames){
    return Promise.all(
    cacheNames.filter(function(cacheNames){
      return cacheName.startsWith('restaurant-') &&
        cacheName != cache_name;
    }).map(function(cacheName){
      return cache.delete(cacheName);
    })
  )
})
)*/
});

// Get data from the caches
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response){
      if(response) {return response;}
      return fetch(event.request);
    })
  );
});
