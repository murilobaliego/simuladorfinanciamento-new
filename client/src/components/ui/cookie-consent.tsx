import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "wouter";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies
    const hasConsent = localStorage.getItem("cookieConsent");
    
    // Se não tiver aceitado, mostra o banner
    if (!hasConsent) {
      // Pequeno delay para não mostrar imediatamente ao carregar a página
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-800 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm flex-1">
          <p>
            Este site utiliza cookies para melhorar sua experiência e para análise de tráfego. 
            Alguns cookies são essenciais para o funcionamento do site, enquanto outros nos ajudam 
            a melhorar a experiência do usuário e podem ser usados para personalização de conteúdo e anúncios.
          </p>
          <p className="mt-1">
            Ao clicar em "Aceitar", você concorda com o uso de cookies de acordo com nossa{" "}
            <Link href="/politica-privacidade" className="text-primary-light underline">
              política de privacidade
            </Link>.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-white border-white hover:bg-neutral-700"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4 mr-1" />
            Fechar
          </Button>
          <Button 
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary-dark"
            onClick={acceptCookies}
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}