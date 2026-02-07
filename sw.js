// Service Worker - Smart caching strategies
const CACHE_VERSION = 'v6';
const STATIC_CACHE = 'static-' + CACHE_VERSION;
const PHOTO_CACHE = 'photos-' + CACHE_VERSION;
const PAGES_CACHE = 'pages-' + CACHE_VERSION;
const OFFLINE_URL = '/offline.html';

// Core assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/script-deferred.js',
  '/shared.js',
  '/assets/logo.png',
  '/assets/logo-dark.png',
  '/articles/recommended-articles.js',
  '/articles/article-shared.css',
  '/assets/fonts/inter-v20-latin-regular.woff2',
  '/assets/fonts/space-mono-v17-latin-regular.woff2',
  '/assets/fonts/instrument-serif-v5-latin-regular.woff2',
  '/assets/fonts.css'
];

// Install - precache core assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) { return cache.addAll(PRECACHE_ASSETS); })
      .then(function() { return self.skipWaiting(); })
  );
});

// Activate - clean old caches
self.addEventListener('activate', function(event) {
  var validCaches = [STATIC_CACHE, PHOTO_CACHE, PAGES_CACHE];
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function(name) { return validCaches.indexOf(name) === -1; })
            .map(function(name) { return caches.delete(name); })
        );
      })
      .then(function() { return self.clients.claim(); })
  );
});

// Determine caching strategy based on request type
function getStrategy(url) {
  var path = new URL(url).pathname;

  // Fonts - cache first (immutable)
  if (path.match(/\.(woff2?|ttf|otf)$/)) return 'cache-first';

  // Photos/images - stale-while-revalidate
  if (path.match(/\.(jpe?g|png|webp|avif|gif|svg)$/)) return 'stale-while-revalidate';

  // CSS/JS - stale-while-revalidate (versioned via query strings)
  if (path.match(/\.(css|js)$/)) return 'stale-while-revalidate';

  // HTML pages - network first
  return 'network-first';
}

// Choose cache bucket based on content type
function getCacheName(url) {
  var path = new URL(url).pathname;
  if (path.match(/\.(jpe?g|png|webp|avif|gif|svg)$/)) return PHOTO_CACHE;
  if (path.match(/\.(woff2?|ttf|otf|css|js)$/)) return STATIC_CACHE;
  return PAGES_CACHE;
}

// Cache-first: serve from cache, only fetch if not cached
function cacheFirst(request) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (response.status === 200) {
        var clone = response.clone();
        caches.open(getCacheName(request.url)).then(function(cache) {
          cache.put(request, clone);
        });
      }
      return response;
    });
  });
}

// Stale-while-revalidate: serve from cache immediately, update in background
function staleWhileRevalidate(request) {
  return caches.open(getCacheName(request.url)).then(function(cache) {
    return cache.match(request).then(function(cached) {
      var fetchPromise = fetch(request).then(function(response) {
        if (response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(function() {
        return cached;
      });
      return cached || fetchPromise;
    });
  });
}

// Network-first: try network, fall back to cache
function networkFirst(request) {
  return fetch(request).then(function(response) {
    if (response.status === 200) {
      var clone = response.clone();
      caches.open(getCacheName(request.url)).then(function(cache) {
        cache.put(request, clone);
      });
    }
    return response;
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
      }
      return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    });
  });
}

// Fetch handler
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  var strategy = getStrategy(event.request.url);

  if (strategy === 'cache-first') {
    event.respondWith(cacheFirst(event.request));
  } else if (strategy === 'stale-while-revalidate') {
    event.respondWith(staleWhileRevalidate(event.request));
  } else {
    event.respondWith(networkFirst(event.request));
  }
});

// Limit photo cache size to 200 entries
self.addEventListener('message', function(event) {
  if (event.data === 'trim-caches') {
    caches.open(PHOTO_CACHE).then(function(cache) {
      cache.keys().then(function(keys) {
        if (keys.length > 200) {
          var toDelete = keys.slice(0, keys.length - 200);
          toDelete.forEach(function(key) { cache.delete(key); });
        }
      });
    });
  }
});
