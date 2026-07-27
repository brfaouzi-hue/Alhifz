// v2 — l'ancienne stratégie (cache-first pour TOUT, y compris '/' et
// '/index.html') gelait l'app pour toujours dès la première visite : une fois
// ces URLs en cache, le SW ne les re-demandait plus jamais au réseau, donc les
// visiteurs qui avaient déjà installé l'app AVANT un déploiement ne recevaient
// plus aucune mise à jour (JS, tajwid, corrections…) — silencieusement, sans
// erreur visible, juste figés sur l'ancienne version. C'est le SW lui-même
// (son script, pas les pages qu'il sert) que le navigateur revérifie
// périodiquement en direct sur le réseau, donc CE fichier est le seul endroit
// d'où un correctif peut réellement atteindre un client déjà bloqué.
const CACHE = 'alhifz-v2';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  if (url.includes('everyayah') || url.includes('qurancdn') || url.includes('supabase')) return;

  // Page HTML et bundle JS/CSS : réseau en priorité (le nom des fichiers
  // change à chaque build, mais '/' et '/index.html' eux ne changent jamais
  // d'URL — sans ça ils restent figés sur la première version mise en cache
  // pour toujours). Le cache ne sert que de secours hors-ligne.
  if (e.request.mode === 'navigate' || url.endsWith('.js') || url.endsWith('.css')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Le reste (images, polices…) : cache d'abord, réseau en secours — ces
  // fichiers ne changent pas de contenu pour une même URL.
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
        return res;
      }).catch(() => cached);
    })
  );
});

// Notifications push quotidiennes
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
