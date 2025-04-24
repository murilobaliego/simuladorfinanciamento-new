import { useCallback } from 'react';
import { useLocation } from 'wouter';

export function useScrollLink() {
  const [, navigate] = useLocation();

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Verifica se o link contém uma âncora (#)
    const hasHash = href.includes('#');
    
    if (hasHash) {
      const [path, hash] = href.split('#');
      const currentPath = window.location.pathname;
      
      // Se o caminho base for o mesmo da página atual, apenas scrolle para a âncora
      if (path === '' || path === '/' + currentPath || currentPath === path) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Se estamos indo para outra página, primeiro navegue
        navigate(path);
        
        // Depois dê um pequeno delay para garantir que a página carregou e então scrolle
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      // Navegação normal sem âncora
      navigate(href);
      window.scrollTo(0, 0);
    }
  }, [navigate]);

  return { handleClick };
}