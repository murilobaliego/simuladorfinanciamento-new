/**
 * Index Checker - Script para verificar a indexação do site nos motores de busca
 * 
 * Este script verifica se o site está sendo indexado corretamente pelos motores de busca
 * e fornece informações úteis para depuração de SEO.
 * 
 * NÃO é necessário incluir este script nas páginas - ele deve ser carregado apenas quando necessário
 * para diagnóstico via console do desenvolvedor.
 */

(function() {
  // Versão do checker
  const VERSION = '1.0.0';
  
  // Função para verificar metadados da página
  function checkMetadata() {
    const metadata = {
      title: document.title || null,
      description: document.querySelector('meta[name="description"]')?.content || null,
      keywords: document.querySelector('meta[name="keywords"]')?.content || null,
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content || null,
      ogDescription: document.querySelector('meta[property="og:description"]')?.content || null,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content || null,
      ogType: document.querySelector('meta[property="og:type"]')?.content || null,
      robots: document.querySelector('meta[name="robots"]')?.content || null,
      viewport: document.querySelector('meta[name="viewport"]')?.content || null,
      structuredData: getStructuredData(),
      h1Count: document.querySelectorAll('h1').length,
      h1Text: Array.from(document.querySelectorAll('h1')).map(h1 => h1.textContent.trim()),
      h2Count: document.querySelectorAll('h2').length
    };
    
    return metadata;
  }
  
  // Função para obter dados estruturados
  function getStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const data = [];
    
    scripts.forEach(script => {
      try {
        const parsed = JSON.parse(script.textContent);
        data.push({
          type: parsed['@type'] || 'Unknown',
          content: parsed
        });
      } catch (e) {
        data.push({
          type: 'Error',
          error: e.message
        });
      }
    });
    
    return data;
  }
  
  // Função para verificar links
  function checkLinks() {
    const links = document.querySelectorAll('a');
    const internalLinks = [];
    const externalLinks = [];
    const brokenLinks = [];
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      if (!href) {
        brokenLinks.push({
          text: link.textContent.trim(),
          reason: 'No href attribute'
        });
        return;
      }
      
      if (href.startsWith('#')) {
        // Link de ancoragem
        const target = document.getElementById(href.substring(1));
        if (!target) {
          brokenLinks.push({
            href,
            text: link.textContent.trim(),
            reason: 'Anchor target not found'
          });
        }
        return;
      }
      
      if (href.startsWith('/') || href.includes(window.location.hostname)) {
        internalLinks.push({
          href,
          text: link.textContent.trim(),
          nofollow: link.rel.includes('nofollow')
        });
      } else {
        externalLinks.push({
          href,
          text: link.textContent.trim(),
          nofollow: link.rel.includes('nofollow')
        });
      }
    });
    
    return {
      total: links.length,
      internal: internalLinks,
      external: externalLinks,
      broken: brokenLinks,
      internalCount: internalLinks.length,
      externalCount: externalLinks.length,
      brokenCount: brokenLinks.length
    };
  }
  
  // Função para verificar imagens
  function checkImages() {
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = [];
    
    images.forEach(img => {
      if (!img.alt) {
        imagesWithoutAlt.push({
          src: img.src,
          parent: img.parentNode.nodeName
        });
      }
    });
    
    return {
      total: images.length,
      withoutAlt: imagesWithoutAlt,
      withoutAltCount: imagesWithoutAlt.length
    };
  }
  
  // Função para verificar performance
  function checkPerformance() {
    if (!window.performance || !window.performance.timing) {
      return { error: 'Performance API not supported' };
    }
    
    const timing = window.performance.timing;
    
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domComplete - timing.domLoading,
      firstPaint: timing.responseEnd - timing.navigationStart,
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      connectionTime: timing.connectEnd - timing.connectStart,
      ttfb: timing.responseStart - timing.requestStart,
      downloadTime: timing.responseEnd - timing.responseStart,
      redirectTime: timing.redirectEnd - timing.redirectStart
    };
  }
  
  // Executar verificação e exibir resultados
  function runCheck() {
    const results = {
      version: VERSION,
      url: window.location.href,
      date: new Date().toISOString(),
      metadata: checkMetadata(),
      links: checkLinks(),
      images: checkImages(),
      performance: checkPerformance()
    };
    
    console.log('%c SEO Index Checker - Results ', 'background: #3B82F6; color: white; padding: 4px 8px; font-weight: bold;');
    console.log(results);
    
    // Análise básica dos resultados
    const issues = [];
    
    // Verificar title
    if (!results.metadata.title) {
      issues.push('Missing title tag');
    } else if (results.metadata.title.length < 10) {
      issues.push('Title tag is too short (< 10 chars)');
    } else if (results.metadata.title.length > 60) {
      issues.push('Title tag is too long (> 60 chars)');
    }
    
    // Verificar meta description
    if (!results.metadata.description) {
      issues.push('Missing meta description');
    } else if (results.metadata.description.length < 50) {
      issues.push('Meta description is too short (< 50 chars)');
    } else if (results.metadata.description.length > 160) {
      issues.push('Meta description is too long (> 160 chars)');
    }
    
    // Verificar canonical
    if (!results.metadata.canonical) {
      issues.push('Missing canonical URL');
    }
    
    // Verificar Open Graph
    if (!results.metadata.ogTitle || !results.metadata.ogDescription || !results.metadata.ogUrl) {
      issues.push('Incomplete Open Graph tags');
    }
    
    // Verificar headers
    if (results.metadata.h1Count === 0) {
      issues.push('No H1 heading found');
    } else if (results.metadata.h1Count > 1) {
      issues.push(`Multiple H1 headings found (${results.metadata.h1Count})`);
    }
    
    // Verificar imagens
    if (results.images.withoutAltCount > 0) {
      issues.push(`${results.images.withoutAltCount} images without alt text`);
    }
    
    // Verificar links
    if (results.links.brokenCount > 0) {
      issues.push(`${results.links.brokenCount} broken links found`);
    }
    
    // Exibir problemas encontrados
    if (issues.length > 0) {
      console.log('%c Issues Found ', 'background: #EF4444; color: white; padding: 4px 8px; font-weight: bold;');
      issues.forEach(issue => console.log('- ' + issue));
    } else {
      console.log('%c No major issues found ', 'background: #10B981; color: white; padding: 4px 8px; font-weight: bold;');
    }
    
    return results;
  }
  
  // Expõe a função para uso externo
  window.checkSEO = runCheck;
  
  console.log('%c SEO Index Checker loaded ', 'background: #3B82F6; color: white; padding: 4px 8px; font-weight: bold;');
  console.log('Use window.checkSEO() to run a check');
})();