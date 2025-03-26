import { useEffect } from "react";

export function useAdSense() {
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
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);

  const initAd = () => {
    try {
      if ((window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (error) {
      console.error("Erro ao inicializar anúncio:", error);
    }
  };

  return { initAd };
}