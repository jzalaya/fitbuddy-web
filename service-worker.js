const CACHE_NAME = 'fitbuddy-v2';
const urlsToCache = [
  './index.html',
  './css/styles.css',
  './js/config.js',
  './js/sheets.js',
  './js/exercises.js',
  './js/app.js',
  './manifest.json'
];

// Install event - cache resources with error handling
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Cache files individually using fetch + put for better control
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url)
              .then(response => {
                // Check if we received a valid response
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status} for ${url}`);
                }
                // Clone the response before caching
                return cache.put(url, response.clone());
              })
              .catch(err => {
                console.error(`Failed to cache ${url}:`, err);
                // Continue even if one file fails
              });
          })
        );
      })
      .then(() => {
        console.log('Service worker installation completed');
      })
      .catch(err => {
        console.error('Cache installation failed:', err);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch event - serve from cache when offline, network when online
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - try network
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200) {
              return response;
            }

            // Don't cache non-GET requests or non-http(s) requests
            if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.error('Failed to cache response:', err);
              });

            return response;
          }
        ).catch(err => {
          console.error('Fetch failed:', err);
          // Could return a custom offline page here
          throw err;
        });
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});
