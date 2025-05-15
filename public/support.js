// support.js - Arquivo para suporte a ferramentas de webmaster e melhoria de SEO

// Função para verificar se o navegador suporta recursos modernos
function checkBrowserSupport() {
  const support = {
    serviceWorker: 'serviceWorker' in navigator,
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
    webp: false,
    es6: false
  };

  // Verificar se o browser suporta imagens webp
  const webp = new Image();
  webp.onload = function() { support.webp = (webp.width > 0) && (webp.height > 0); };
  webp.onerror = function() { support.webp = false; };
  webp.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';

  // Tenta usar funcionalidades de ES6 para detectar suporte
  try {
    eval('let test = () => {}; const obj = { a: 1 }; const { a } = obj;');
    support.es6 = true;
  } catch (e) {
    support.es6 = false;
  }

  return support;
}

// Script para suporte a compartilhamento via Web Share API
function setupWebShare() {
  if (navigator.share) {
    // Adiciona botões de compartilhamento no futuro
    document.querySelectorAll('.share-button').forEach(button => {
      button.style.display = 'inline-flex';
      
      button.addEventListener('click', async () => {
        try {
          const title = document.querySelector('title').textContent;
          const url = window.location.href;
          
          await navigator.share({
            title: title,
            url: url
          });
          
          console.log('Conteúdo compartilhado com sucesso!');
        } catch (err) {
          console.error('Erro ao compartilhar:', err);
        }
      });
    });
  }
}

// Script de suporte a Google Discover
function setupGoogleDiscover() {
  // Adiciona dados estruturados para artigos
  if (document.querySelector('article')) {
    const articleData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': document.querySelector('h1')?.textContent || document.title,
      'image': document.querySelector('meta[property="og:image"]')?.content || '',
      'datePublished': document.querySelector('meta[property="article:published_time"]')?.content || new Date().toISOString(),
      'dateModified': document.querySelector('meta[property="article:modified_time"]')?.content || new Date().toISOString(),
      'author': {
        '@type': 'Organization',
        'name': 'Simulador de Financiamento'
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(articleData);
    document.head.appendChild(script);
  }
}

// Executa as verificações quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  const browserSupport = checkBrowserSupport();
  
  // Adiciona classe ao html baseado no suporte do navegador
  if (browserSupport.webp) {
    document.documentElement.classList.add('webp-support');
  }
  
  if (browserSupport.serviceWorker) {
    document.documentElement.classList.add('sw-support');
  }
  
  setupWebShare();
  setupGoogleDiscover();
  
  // Registra dados para ferramenta Search Console (não afeta usuários)
  if (window.console && console.info) {
    console.info('SEO-SUPPORT: RUNNING');
    console.info('BROWSER-CAPABILITIES:', browserSupport);
  }
});