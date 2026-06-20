const CACHE_NAME = "light-timer-v1";

const FILES_TO_CACHE = [

    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./profiles.js",
    "./patterns.js",
    "./manifest.json"

];

// Install → cache fresh files
self.addEventListener("install", event => {

    self.skipWaiting(); // forces immediate activation

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

});

// Activate → delete old caches
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(
                keys.map(key => {

                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }

                })
            );

        })

    );

    self.clients.claim(); // take control immediately

});

// Fetch → network first, fallback to cache
self.addEventListener("fetch", event => {

    event.respondWith(

        fetch(event.request)
            .then(response => {

                // update cache with fresh version
                const clone = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, clone);
                });

                return response;

            })
            .catch(() => {

                return caches.match(event.request);

            })

    );

});
