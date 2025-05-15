/**
 * Web Vitals - Script para monitoramento de métricas de desempenho
 * 
 * Este script implementa monitoramento de Core Web Vitals, um fator importante
 * para o ranking do Google. Ele coleta métricas como LCP, FID, CLS e as envia
 * para o Google Analytics.
 */

(function() {
  // Monitorar apenas uma amostra de usuários (25%)
  const shouldMonitor = Math.random() < 0.25;
  if (!shouldMonitor) return;
  
  // Verificar se temos o Google Analytics disponível
  const hasGoogleAnalytics = typeof gtag === 'function';
  
  let metrics = {
    lcp: 0,   // Largest Contentful Paint
    fid: 0,   // First Input Delay
    cls: 0,   // Cumulative Layout Shift
    ttfb: 0,  // Time to First Byte
    fcp: 0    // First Contentful Paint
  };
  
  // Função para enviar métricas para o Google Analytics
  function sendToAnalytics(metric, value, eventName = 'web-vitals') {
    if (!hasGoogleAnalytics) return;
    
    const payload = {
      event_category: 'Web Vitals',
      event_label: metric,
      value: Math.round(value),
      non_interaction: true,
      page_path: location.pathname
    };
    
    try {
      gtag('event', eventName, payload);
      console.debug(`[Web Vitals] Sent ${metric}: ${value}`);
    } catch (e) {
      console.error(`[Web Vitals] Error sending ${metric}`, e);
    }
  }
  
  // Monitorar Largest Contentful Paint (LCP)
  function monitorLCP() {
    let lcpEntries = [];
    
    new PerformanceObserver((entries) => {
      entries = entries.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        metrics.lcp = lastEntry.startTime;
        sendToAnalytics('LCP', metrics.lcp);
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }
  
  // Monitorar First Input Delay (FID)
  function monitorFID() {
    new PerformanceObserver((entries) => {
      entries = entries.getEntries();
      const firstInput = entries[0];
      
      if (firstInput) {
        metrics.fid = firstInput.processingStart - firstInput.startTime;
        sendToAnalytics('FID', metrics.fid);
      }
    }).observe({ type: 'first-input', buffered: true });
  }
  
  // Monitorar Cumulative Layout Shift (CLS)
  function monitorCLS() {
    let clsValue = 0;
    let clsEntries = [];
    
    new PerformanceObserver((entries) => {
      entries = entries.getEntries();
      
      entries.forEach(entry => {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      metrics.cls = clsValue;
      sendToAnalytics('CLS', metrics.cls);
    }).observe({ type: 'layout-shift', buffered: true });
  }
  
  // Monitorar Time to First Byte (TTFB)
  function monitorTTFB() {
    if (performance && performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart;
        sendToAnalytics('TTFB', metrics.ttfb);
      }
    }
  }
  
  // Monitorar First Contentful Paint (FCP)
  function monitorFCP() {
    new PerformanceObserver((entries) => {
      entries = entries.getEntries();
      const firstPaint = entries[0];
      
      if (firstPaint) {
        metrics.fcp = firstPaint.startTime;
        sendToAnalytics('FCP', metrics.fcp);
      }
    }).observe({ type: 'paint', buffered: true });
  }
  
  // Iniciar monitoramento quando a página estiver carregada
  window.addEventListener('load', function() {
    try {
      if ('PerformanceObserver' in window) {
        monitorLCP();
        monitorFID();
        monitorCLS();
        monitorFCP();
      }
      
      setTimeout(monitorTTFB, 500);
    } catch (e) {
      console.error('[Web Vitals] Error initializing metrics', e);
    }
  });
})();