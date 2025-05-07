import { useEffect, useState, useRef } from "react";
import { useAdSense } from "@/hooks/use-adsense";

interface AdSenseProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  contentSelector?: string; // Seletor para verificar se há conteúdo suficiente
  minContentHeight?: number; // Altura mínima do conteúdo para exibir o anúncio
  position?: "top" | "middle" | "bottom"; // Posição do anúncio na página
  placeholderContent?: boolean; // Se deve exibir conteúdo placeholder antes do anúncio
}

export default function AdSense({
  slot,
  format = "auto",
  responsive = true,
  style = {},
  className = "",
  contentSelector = "#root",
  minContentHeight = 800, // Aumentamos o mínimo para garantir conteúdo suficiente
  position = "middle",
  placeholderContent = true
}: AdSenseProps) {
  const { initAd, adsLoaded } = useAdSense();
  const [shouldRender, setShouldRender] = useState(false);
  const [verifiedContent, setVerifiedContent] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const [pageLoadComplete, setPageLoadComplete] = useState(false);
  
  // Verificar se a página está completamente carregada
  useEffect(() => {
    if (document.readyState === 'complete') {
      setPageLoadComplete(true);
    } else {
      const handleLoad = () => setPageLoadComplete(true);
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  
  // Verificar se há conteúdo significativo ao redor do anúncio
  useEffect(() => {
    // Verifica se o usuário aceitou cookies antes de inicializar o anúncio
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) return;
    
    // Função para verificar se há conteúdo suficiente na página
    const checkContent = () => {
      try {
        // Verificar altura da página
        const contentElement = document.querySelector(contentSelector);
        if (!contentElement) return false;
        
        const contentHeight = contentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        
        // Verificar quantidade de texto na página
        const textContent = contentElement.textContent || '';
        const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
        
        // Verificar se existem elementos de conteúdo significativos
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
        const paragraphs = document.querySelectorAll('p').length;
        const lists = document.querySelectorAll('ul, ol').length;
        const images = document.querySelectorAll('img').length;
        
        // Critérios mínimos para considerar conteúdo suficiente
        const hasMinimumHeight = contentHeight > minContentHeight;
        const hasMinimumText = wordCount > 300; // Mínimo de 300 palavras
        const hasMinimumElements = (headings + paragraphs + lists + images) > 5;
        
        console.log('Verificação de conteúdo para AdSense:', {
          contentHeight,
          viewportHeight,
          wordCount,
          headings,
          paragraphs,
          lists,
          images,
          hasMinimumHeight,
          hasMinimumText,
          hasMinimumElements
        });
        
        return hasMinimumHeight && (hasMinimumText || hasMinimumElements);
      } catch (error) {
        console.error('Erro ao verificar conteúdo para AdSense:', error);
        return false;
      }
    };
    
    // Atrasa a verificação para garantir que o conteúdo esteja carregado
    const timer = setTimeout(() => {
      const hasEnoughContent = checkContent();
      setVerifiedContent(hasEnoughContent);
      
      if (hasEnoughContent && pageLoadComplete) {
        setShouldRender(true);
      }
    }, 1500); // Aguardamos mais tempo para garantir que o conteúdo esteja carregado
    
    return () => clearTimeout(timer);
  }, [contentSelector, minContentHeight, pageLoadComplete]);
  
  // Inicializar o anúncio quando estiver pronto para renderizar
  useEffect(() => {
    if (shouldRender && adsLoaded && adRef.current) {
      // Pequeno atraso para garantir que o DOM esteja estável
      const timer = setTimeout(() => {
        try {
          console.log('Inicializando anúncio AdSense:', { slot, format });
          initAd();
        } catch (error) {
          console.error('Erro ao inicializar anúncio:', error);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [shouldRender, adsLoaded, initAd, slot, format]);

  // Não renderiza nada se não houver conteúdo suficiente
  if (!shouldRender) return null;
  
  // Conteúdo placeholder para garantir que há texto ao redor do anúncio
  const renderPlaceholder = () => {
    if (!placeholderContent) return null;
    
    return (
      <div className="ad-content-placeholder mb-3">
        <div className="ad-notice text-xs text-gray-400 mb-2">Publicidade</div>
        <div className="text-sm text-gray-600 mb-2">
          <p>
            Nossos simuladores ajudam você a tomar as melhores decisões financeiras. 
            Você pode simular parcelas, juros, amortização e muito mais em nossos diversos calculadores.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={adRef}
      className={`ad-container relative overflow-hidden border border-gray-100 rounded-lg p-3 my-6 bg-white ${className}`}
      data-ad-position={position}
    >
      {renderPlaceholder()}
      
      <ins
        className="adsbygoogle bg-gray-50"
        style={{
          display: "block",
          minHeight: format === "rectangle" ? "250px" : "100px",
          ...style
        }}
        data-ad-client="ca-pub-3062941348671879"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      
      <div className="ad-footer text-[10px] text-gray-300 text-right mt-1">
        Anúncios ajudam a manter esta ferramenta gratuita
      </div>
    </div>
  );
}