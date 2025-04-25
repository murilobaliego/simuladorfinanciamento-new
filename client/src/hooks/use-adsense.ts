import { useCallback, useEffect, useState } from "react";

export function useAdSense() {
  const [adsLoaded, setAdsLoaded] = useState(false);

  // Carrega o script do AdSense apenas uma vez na montagem do componente
  useEffect(() => {
    // Verifica se o usuário aceitou cookies para anúncios
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) return;

    // Carrega o script do AdSense se ainda não estiver carregado
    const existingScript = document.getElementById("google-adsense");
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-adsense";
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3062941348671879";
      script.crossOrigin = "anonymous";
      
      // Ouvir evento de carregamento do script
      script.onload = () => {
        console.log("Script do AdSense carregado com sucesso");
        setAdsLoaded(true);
      };
      
      // Ouvir erros de carregamento
      script.onerror = (error) => {
        console.error("Erro ao carregar script do AdSense:", error);
      };
      
      document.head.appendChild(script);
    } else {
      // Script já existe, considerar como carregado
      setAdsLoaded(true);
    }
  }, []);

  // Inicializa anúncios de forma segura
  const initAd = useCallback(() => {
    try {
      // Verificar se o conteúdo da página foi carregado completamente
      if (document.readyState === 'complete' && (window as any).adsbygoogle) {
        console.log("Inicializando anúncio");
        (window as any).adsbygoogle.push({});
      } else if ((window as any).adsbygoogle) {
        // Se a página ainda não estiver completamente carregada, aguarde
        console.log("Aguardando carregamento completo da página");
        setTimeout(() => {
          console.log("Tentando inicializar anúncio novamente");
          (window as any).adsbygoogle.push({});
        }, 1500);
      } else {
        console.log("AdSense ainda não está disponível");
      }
    } catch (error) {
      console.error("Erro ao inicializar anúncio:", error);
    }
  }, []);

  return { initAd, adsLoaded };
}