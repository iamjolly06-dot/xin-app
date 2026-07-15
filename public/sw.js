// Minimal service worker — just needs to exist and control fetch events
// for the browser to treat this as an installable PWA.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
self.addEventListener("fetch", () => {});
