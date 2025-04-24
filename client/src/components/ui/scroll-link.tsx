import { Link as WouterLink } from 'wouter';
import { useScrollLink } from '@/hooks/use-scroll-link';

type ScrollLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [x: string]: any; // Para passar outras props para o link subjacente
};

export function ScrollLink({ href, children, className, onClick, ...props }: ScrollLinkProps) {
  const { handleClick } = useScrollLink();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    // Se o link tem href="#alguma-coisa", usamos nosso manipulador personalizado
    if (href.includes('#')) {
      handleClick(e, href);
    }
  };

  return (
    <WouterLink href={href} onClick={handleLinkClick} className={className} {...props}>
      {children}
    </WouterLink>
  );
}