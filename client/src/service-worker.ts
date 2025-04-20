// service-worker.ts

export default null; // évite une erreur TS à l'import

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event) => {
  console.log("Service Worker installé !");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activé !");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});