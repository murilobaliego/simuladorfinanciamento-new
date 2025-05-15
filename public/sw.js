// Nome do cache
const CACHE_NAME = 'simulador-financiamento-v1';

// Arquivos para armazenar em cache durante a instalação
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/images/icon-192x192.svg',
  '/images/icon-512x512.svg'
];

// Instalação do service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Estratégia de cache: Cache First, then Network
self.addEventListener('fetch', event => {
  // Apenas para solicitações GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar solicitações Analytics
  if (event.request.url.includes('google-analytics.com') || 
      event.request.url.includes('googletagmanager.com') ||
      event.request.url.includes('analytics')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Retorna a resposta em cache, se existir
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se não estiver em cache, busca na rede
        return fetch(event.request)
          .then(response => {
            // Verifica se obtivemos uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta pois ela é um stream e só pode ser consumida uma vez
            const responseToCache = response.clone();

            // Adiciona ao cache para uso futuro
            caches.open(CACHE_NAME)
              .then(cache => {
                // Armazena em cache apenas recursos HTML, CSS, JS e imagens
                const url = event.request.url;
                if (url.endsWith('.html') || url.endsWith('.css') || url.endsWith('.js') || 
                    url.includes('.png') || url.includes('.jpg') || url.includes('.svg') ||
                    url.includes('.webp')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          });
      })
  );
});

// Limpeza de caches antigos quando o Service Worker é atualizado
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Deleta caches antigos que não estão na lista de permissões
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});