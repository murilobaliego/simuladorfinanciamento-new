import { useEffect } from "react";
import { useAdSense } from "@/hooks/use-adsense";

interface AdSenseProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({
  slot,
  format = "auto",
  responsive = true,
  style = {},
  className = "",
}: AdSenseProps) {
  const { initAd } = useAdSense();
  
  useEffect(() => {
    // Verifica se o usuário aceitou cookies antes de inicializar o anúncio
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent) {
      initAd();
    }
  }, [slot, initAd]);

  return (
    <div className={`ad-container min-h-[250px] my-4 ${className}`}>
      <div className="content-wrapper min-h-[100px]">
        {/* Ensure there's content around the ad */}
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            minHeight: "250px",
            ...style
          }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}