// service-worker.ts
import {precacheAndRoute} from 'workbox-precaching';

export default null; // évite une erreur TS à l'import

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

// Additional code goes here.
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