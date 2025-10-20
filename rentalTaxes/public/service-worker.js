//TODO: STUDY THIS TO UNDERSTAND SERVICE WORKERS
//TODO: SUBSTITUTE ICON PATHS
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("static-cache").then((cache) => {
      return cache.addAll(["/", "/icon-512.png"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
