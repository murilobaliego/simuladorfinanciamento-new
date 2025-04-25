import { useEffect, useState } from "react";
import { useAdSense } from "@/hooks/use-adsense";

interface AdSenseProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  contentSelector?: string; // Seletor para verificar se há conteúdo suficiente
  minContentHeight?: number; // Altura mínima do conteúdo para exibir o anúncio
}

export default function AdSense({
  slot,
  format = "auto",
  responsive = true,
  style = {},
  className = "",
  contentSelector = "#root",
  minContentHeight = 500
}: AdSenseProps) {
  const { initAd } = useAdSense();
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    // Verifica se o usuário aceitou cookies antes de inicializar o anúncio
    const cookieConsent = localStorage.getItem("cookieConsent");
    
    // Função para verificar se há conteúdo suficiente na página
    const checkContent = () => {
      const contentElement = document.querySelector(contentSelector);
      if (!contentElement) return false;
      
      const contentHeight = contentElement.scrollHeight;
      return contentHeight > minContentHeight;
    };
    
    // Atrasa a renderização do anúncio para garantir que o conteúdo seja carregado primeiro
    const timer = setTimeout(() => {
      if (cookieConsent && checkContent()) {
        setShouldRender(true);
        // Inicializa o anúncio após um curto delay para garantir que o componente foi montado
        setTimeout(() => {
          initAd();
        }, 100);
      }
    }, 1000); // Aguarda 1 segundo para verificar o conteúdo
    
    return () => clearTimeout(timer);
  }, [slot, initAd, contentSelector, minContentHeight]);

  // Não renderiza nada se não houver conteúdo suficiente
  if (!shouldRender) return null;

  return (
    <div className={`ad-container min-h-[250px] my-4 ${className}`}>
      <div className="content-wrapper min-h-[100px]">
        {/* Texto placeholder para garantir que há conteúdo ao redor do anúncio */}
        <div className="ad-notice text-xs text-gray-400 mb-1">Publicidade</div>
        
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            minHeight: "250px",
            ...style
          }}
          data-ad-client="ca-pub-3062941348671879"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}