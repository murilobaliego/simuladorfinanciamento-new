import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verificar inicialmente
    checkIfMobile();
    
    // Adicionar event listener para redimensionamento da janela
    window.addEventListener("resize", checkIfMobile);
    
    // Limpeza
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  return isMobile;
}