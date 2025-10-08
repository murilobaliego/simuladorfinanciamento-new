import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Calculator, Car, Home, CreditCard, BadgeDollarSign, ChevronDown, Settings, RefreshCw, BarChart2, PiggyBank, DollarSign, Truck, Bike, Banknote, Sun, GraduationCap } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [location] = useLocation();
  const toolsMenuRef = useRef<HTMLLIElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleToolsMenu = () => {
    setIsToolsMenuOpen(!isToolsMenuOpen);
  };

  // Fechar menu de ferramentas ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setIsToolsMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fechar menu de ferramentas ao mudar de página
  useEffect(() => {
    setIsToolsMenuOpen(false);
  }, [location]);

  // Verificar a página atual para destacar o item do menu correto
  const isVehiclePage = location === '/simulador-financiamento-veiculos' || 
                        location === '/financiamento-veiculo' || 
                        location === '/vehicle-finance';
                        
  const isGratisPage = location === '/simulador-financiamento-online-gratis' ||
                       location === '/simulador-financiamento-gratis' ||
                       location === '/calculadora-financiamento-gratis' ||
                       location === '/simulador-gratis';
  
  const isTruckPage = location === '/financiamento-caminhao' ||
                      location === '/financiamento-caminhoes';
                      
  const isBikePage = location === '/financiamento-moto' ||
                     location === '/financiamento-motos';
                     
  const isCaixaPage = location === '/simulador-caixa-financiamento' ||
                     location === '/simulador-da-caixa' ||
                     location === '/caixa-simulador-financiamento';
                     
  const isPaineisSolaresPage = location === '/financiamento-paineis-solares' ||
                     location === '/simulador-energia-solar' ||
                     location === '/calculadora-painel-solar' ||
                     location === '/energia-solar-financiamento';
                     
  const isFIESPage = location === '/simulador-fies' ||
                     location === '/financiamento-estudantil' ||
                     location === '/como-funciona-fies' ||
                     location === '/financiamento-faculdade';
  
  const isToolPage = location === '/simulador-refinanciamento' || 
                    location === '/capacidade-pagamento' || 
                    location === '/comparativo-amortizacao' ||
                    location === '/calculadora-entrada-ideal' ||
                    location === '/leasing-vs-financiamento' ||
                    location === '/simulador-parcela-balao' ||
                    location === '/financiamento-parcela-balao' ||
                    location === '/financiamento-vfg' ||
                    isCaixaPage ||
                    isPaineisSolaresPage ||
                    isFIESPage;

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
                href="/simulador-financiamento-online-gratis" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${isGratisPage ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors flex items-center relative`}
                aria-current={isGratisPage ? "page" : undefined}
              >
                <Calculator className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Simulador Grátis</span>
                <span className="ml-1 bg-green-500 text-white text-xs px-1 rounded font-bold">FREE</span>
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
            {/* Menu dropdown para ferramentas avançadas */}
            <li ref={toolsMenuRef} className="relative">
              <button 
                onClick={toggleToolsMenu}
                className={`flex items-center px-3 py-2 rounded-md ${isToolPage ? 'bg-primary-dark' : 'hover:bg-primary-dark'} transition-colors`}
                aria-expanded={isToolsMenuOpen}
                aria-haspopup="true"
              >
                <Settings className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Ferramentas</span>
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isToolsMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white text-neutral-800 z-50">
                  <div className="py-1 rounded-md bg-white shadow-xs">
                    <Link
                      href="/simulador-refinanciamento"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <RefreshCw className="h-4 w-4 mr-2 text-primary" />
                      <span>Simulador de Refinanciamento</span>
                    </Link>
                    <Link
                      href="/capacidade-pagamento"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <PiggyBank className="h-4 w-4 mr-2 text-primary" />
                      <span>Calculadora de Capacidade</span>
                    </Link>
                    <Link
                      href="/comparativo-amortizacao"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <BarChart2 className="h-4 w-4 mr-2 text-primary" />
                      <span>Price vs. SAC</span>
                    </Link>
                    <Link
                      href="/calculadora-entrada-ideal"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <DollarSign className="h-4 w-4 mr-2 text-primary" />
                      <span>Entrada Ideal</span>
                    </Link>
                    <Link
                      href="/leasing-vs-financiamento"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <Car className="h-4 w-4 mr-2 text-primary" />
                      <span>Leasing vs. Financiamento</span>
                    </Link>
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    <Link
                      href="/financiamento-caminhao"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <Truck className="h-4 w-4 mr-2 text-primary" />
                      <span>Financiamento de Caminhões</span>
                    </Link>
                    
                    <Link
                      href="/financiamento-moto"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <Bike className="h-4 w-4 mr-2 text-primary" />
                      <span>Financiamento de Motos</span>
                    </Link>
                    
                    <Link
                      href="/simulador-parcela-balao"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <Banknote className="h-4 w-4 mr-2 text-primary" />
                      <span>Financiamento com Parcela Balão</span>
                    </Link>
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    <Link
                      href="/financiamento-paineis-solares"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <Sun className="h-4 w-4 mr-2 text-primary" />
                      <span>Financiamento de Painéis Solares</span>
                    </Link>
                    
                    <Link
                      href="/simulador-fies"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                      <span>Financiamento Estudantil (FIES)</span>
                    </Link>
                    
                    <Link
                      href="/simulador-caixa-financiamento"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100 flex items-center"
                      onClick={closeMenu}
                    >
                      <BadgeDollarSign className="h-4 w-4 mr-2 text-primary" />
                      <span>Simulador Caixa de Financiamento</span>
                    </Link>
                  </div>
                </div>
              )}
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
                  {location === '/simulador-refinanciamento' && <span className="text-white">Simulador de Refinanciamento</span>}
                  {location === '/capacidade-pagamento' && <span className="text-white">Calculadora de Capacidade de Pagamento</span>}
                  {location === '/comparativo-amortizacao' && <span className="text-white">Comparativo de Sistemas de Amortização</span>}
                  {location === '/calculadora-entrada-ideal' && <span className="text-white">Calculadora de Entrada Ideal</span>}
                  {location === '/leasing-vs-financiamento' && <span className="text-white">Leasing vs. Financiamento</span>}
                  {isTruckPage && <span className="text-white">Financiamento de Caminhões</span>}
                  {isBikePage && <span className="text-white">Financiamento de Motos</span>}
                  {location === '/simulador-parcela-balao' && <span className="text-white">Financiamento com Parcela Balão</span>}
                  {location === '/financiamento-parcela-balao' && <span className="text-white">Financiamento com Parcela Balão</span>}
                  {location === '/financiamento-vfg' && <span className="text-white">Financiamento com Parcela Balão</span>}
                  {location === '/termos-de-uso' && <span className="text-white">Termos de Uso</span>}
                  {location === '/politica-privacidade' && <span className="text-white">Política de Privacidade</span>}
                  {isCaixaPage && <span className="text-white">Simulador Caixa de Financiamento</span>}
                  {isPaineisSolaresPage && <span className="text-white">Financiamento de Painéis Solares</span>}
                  {isFIESPage && <span className="text-white">Financiamento Estudantil (FIES)</span>}
                  {isGratisPage && <span className="text-white">Simulador de Financiamento Online Grátis</span>}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
