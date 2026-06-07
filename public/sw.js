const CACHE = 'garopabasurf-v1'
self.addEventListener('install', function(e) {
  self.skipWaiting()
})
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(ks) {
    return Promise.all(ks.filter(function(k){ return k !== CACHE }).map(function(k){ return caches.delete(k) }))
  }))
  self.clients.claim()
})
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  // nunca cachear chamadas de API (previsao em tempo real / supabase)
  if (url.hostname.indexOf('open-meteo') !== -1 || url.hostname.indexOf('supabase') !== -1) return
  e.respondWith(
    fetch(e.request).catch(function() { return caches.match(e.request) })
  )
})
