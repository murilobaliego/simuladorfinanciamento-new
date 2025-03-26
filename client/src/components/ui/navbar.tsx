import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0 justify-between w-full sm:w-auto">
          <Link href="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <h1 className="font-heading font-bold text-xl sm:text-2xl">Simulador de Financiamento</h1>
          </Link>
          <button 
            className="sm:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <nav className={`${isMenuOpen ? 'block' : 'hidden'} sm:block w-full sm:w-auto`}>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-sm sm:text-base">
            <li>
              <Link 
                href="/" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${location === '/' ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors`}
              >
                Início
              </Link>
            </li>
            <li>
              <Link 
                href="/financiamento-veiculo" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${location === '/financiamento-veiculo' ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors`}
              >
                Veículos
              </Link>
            </li>
            <li>
              <Link 
                href="/financiamento-imobiliario" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${location === '/financiamento-imobiliario' ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors`}
              >
                Imobiliário
              </Link>
            </li>
            <li>
              <Link 
                href="/emprestimo-pessoal" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${location === '/emprestimo-pessoal' ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors`}
              >
                Pessoal
              </Link>
            </li>
            <li>
              <Link 
                href="/credito-consignado" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${location === '/credito-consignado' ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors`}
              >
                Consignado
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
