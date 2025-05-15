// Service Worker Simples para PWA
const CACHE_NAME = 'simulador-financiamento-v1';

// Lista de recursos para cache imediato
const urlsToCache = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/images/icon-192x192.svg',
  '/images/icon-512x512.svg'
];

// Instalação - Armazena recursos básicos em cache
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação - Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Intercepta requisições - Estratégia simples (network first)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            
            // Se o recurso não estiver em cache, tenta responder com a página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Retorna erro 404 para outros recursos
            return new Response('Not found', {
              status: 404,
              statusText: 'Not found'
            });
          });
      })
  );
});