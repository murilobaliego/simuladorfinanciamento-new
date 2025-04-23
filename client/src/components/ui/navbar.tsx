import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Calculator, Car, Home, CreditCard, BadgeDollarSign, Info, FileText } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Verificar a página atual para destacar o item do menu correto
  const isVehiclePage = location === '/simulador-financiamento-veiculos' || 
                        location === '/financiamento-veiculo' || 
                        location === '/vehicle-finance';

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0 justify-between w-full sm:w-auto">
          <Link href="/" className="flex items-center">
            <Calculator className="h-8 w-8 mr-2" aria-hidden="true" />
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

        <nav className={`${isMenuOpen ? 'block' : 'hidden'} sm:block w-full sm:w-auto`} aria-label="Menu principal">
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-sm sm:text-base">
            <li>
              <Link 
                href="/" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${location === '/' ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors flex items-center`}
              >
                <Home className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Início</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/simulador-financiamento-veiculos" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${isVehiclePage ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors flex items-center`}
                aria-current={isVehiclePage ? "page" : undefined}
              >
                <Car className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Simulador de Veículos</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/financiamento-imobiliario" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${location === '/financiamento-imobiliario' ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors flex items-center`}
              >
                <Home className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Imobiliário</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/emprestimo-pessoal" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${location === '/emprestimo-pessoal' ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors flex items-center`}
              >
                <CreditCard className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Pessoal</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/credito-consignado" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${location === '/credito-consignado' ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors flex items-center`}
              >
                <BadgeDollarSign className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Consignado</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Breadcrumbs para SEO */}
      {location !== '/' && (
        <div className="bg-primary-dark text-sm">
          <div className="container mx-auto px-4 py-2">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1">
                <li>
                  <Link href="/" className="text-white/70 hover:text-white">Início</Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-1 text-white/50">/</span>
                  {isVehiclePage && <span className="text-white">Simulador de Financiamento de Veículos</span>}
                  {location === '/financiamento-imobiliario' && <span className="text-white">Financiamento Imobiliário</span>}
                  {location === '/emprestimo-pessoal' && <span className="text-white">Empréstimo Pessoal</span>}
                  {location === '/credito-consignado' && <span className="text-white">Crédito Consignado</span>}
                  {location === '/termos-de-uso' && <span className="text-white">Termos de Uso</span>}
                  {location === '/politica-privacidade' && <span className="text-white">Política de Privacidade</span>}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
