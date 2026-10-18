/* Service worker de Paris à 5 balles.
   Change VERSION à chaque mise en ligne pour que les téléphones récupèrent la nouvelle version. */
const VERSION = "p5b-v1";
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const TILES = `${VERSION}-tiles`;
const MAX_TILES = 400;

const SHELL_FILES = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max){
  const c = await caches.open(cacheName); const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Pages : réseau d'abord (pour avoir les nouvelles adresses), cache si hors ligne
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(r => { const copy = r.clone(); caches.open(SHELL).then(c => c.put("./index.html", copy)); return r; })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Tuiles de carte : réseau d'abord, gardées en cache (limité) pour une utilisation hors ligne
  if (/tile\.openstreetmap\.(fr|org)$/.test(url.hostname)) {
    e.respondWith(
      fetch(req).then(r => {
        if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(TILES).then(c => c.put(req, copy)).then(() => trim(TILES, MAX_TILES)); }
        return r;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Géocodage : jamais en cache
  if (url.hostname.includes("nominatim")) return;

  // Le reste (photos, Leaflet, polices) : cache d'abord, mis à jour en arrière-plan
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(r => {
        if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(RUNTIME).then(c => c.put(req, copy)); }
        return r;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
