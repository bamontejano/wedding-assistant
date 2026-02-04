const CACHE_NAME = 'wedding-planner-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/index.css',
    './css/components.css',
    './css/chat.css',
    './js/app.js',
    './js/storage.js',
    './js/utils.js',
    './js/templates.js',
    './js/chat.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap',
    'https://cdn-icons-png.flaticon.com/512/1048/1048953.png'
];

// Install event - Cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Try caching, but don't fail installation if some external assets fail
                return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                    console.warn('Some assets failed to cache:', err);
                });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Network first for data, Cache first for assets
self.addEventListener('fetch', (event) => {
    // Ignore non-http requests (like data: or chrome-extension:)
    if (!event.request.url.startsWith('http')) return;

    // For API calls or Firebase, use Network only (let the app handle offline logic)
    if (event.request.url.includes('firestore.googleapis.com') ||
        event.request.url.includes('generativelanguage.googleapis.com')) {
        return;
    }

    // For static assets, try Cache first, then Network
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});
