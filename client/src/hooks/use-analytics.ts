import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

// ID do Google Analytics
const ANALYTICS_ID = 'G-5QL68V2WV9';

export function useAnalytics() {
  const [location] = useLocation();

  // Função para carregar o script do Google Analytics
  const initializeGA = useCallback(() => {
    // Verificar se o script já foi carregado
    if (document.getElementById('google-analytics')) {
      return;
    }

    // Criar o script tag para o Google Analytics
    const script = document.createElement('script');
    script.id = 'google-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    document.head.appendChild(script);

    // Configurar o gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', ANALYTICS_ID, {
      send_page_view: false, // Desativamos o envio automático para controlarmos manualmente
    });

    // Adicionar ao window para acessibilidade global
    window.gtag = gtag;
  }, []);

  // Função para enviar evento de pageview
  const sendPageView = useCallback((path: string) => {
    if (!window.gtag) {
      console.warn('Google Analytics não está inicializado');
      return;
    }

    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log('Analytics pageview enviado:', path);
  }, []);

  // Inicializar o Analytics na montagem do componente
  useEffect(() => {
    // Verificar se o usuário aceitou cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      return;
    }

    // Inicializar o Analytics
    initializeGA();
  }, [initializeGA]);

  // Enviar pageview quando a localização mudar
  useEffect(() => {
    // Verificar se o usuário aceitou cookies e se o Analytics está inicializado
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent || !window.gtag) {
      return;
    }

    // Enviar pageview quando a URL mudar
    sendPageView(location);
  }, [location, sendPageView]);

  return { initializeGA, sendPageView };
}

// Tipos para TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}