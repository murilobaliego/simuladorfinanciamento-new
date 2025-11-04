import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import VehicleFinance from "@/pages/vehicle-finance";
import RealEstateFinance from "@/pages/real-estate-finance";
import PersonalLoan from "@/pages/personal-loan";
import PayrollLoan from "@/pages/payroll-loan";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfUse from "@/pages/terms-of-use";
import RefinancingSimulator from "@/pages/refinancing-simulator";
import PaymentCapacity from "@/pages/payment-capacity";
import AmortizationComparison from "@/pages/amortization-comparison";
import IdealDownpayment from "@/pages/ideal-downpayment";
import LeasingVsFinancing from "@/pages/leasing-vs-financing";
import TruckFinance from "@/pages/truck-finance";
import MotorcycleFinance from "@/pages/motorcycle-finance";
import SimuladorFinanciamentoMoto from "@/pages/simulador-financiamento-moto";
import BalloonPaymentFinance from "@/pages/balloon-payment-finance";
import SimuladorParcelaBalao from "@/pages/simulador-parcela-balao";
import SimuladorCaixa from "@/pages/simulador-caixa";
import SimuladorFinanciamento from "@/pages/simulador-de-financiamento";
import SimuladorFinanciamentoOnlineGratis from "@/pages/simulador-financiamento-online-gratis";
import SimuladorBancoDoBrasil from "@/pages/simulador-banco-do-brasil";
import PaineisSolares from "@/pages/paineis-solares";
import FinanciamentoFIES from "@/pages/fies";
import SimuladorSeguroAutomovel from "@/pages/simulador-seguro-automovel";
import EmprestimoNegativado from "@/pages/emprestimo-negativado";
import Blog from "@/pages/blog";
import BlogPost1 from "@/pages/blog-post-1";
import BlogPost2 from "@/pages/blog-post-2";
import BlogPost3 from "@/pages/blog-post-3";
import BlogPost4 from "@/pages/blog-post-4";
import BlogPost5 from "@/pages/blog-post-5";
import BlogPost6 from "@/pages/blog-post-6";
import BlogPostCalculadorasInternacionais from "@/pages/blog-post-calculadoras-internacionais";
import TaxasBancos from "@/pages/taxas-bancos";
import CalculadoraPrestamoAutoMX from "@/pages/mx/calculadora-prestamo-auto";
import AutoLoanCalculatorUSA from "@/pages/usa/auto-loan-calculator";
import CalculateurCreditAutoFrance from "@/pages/france/calculateur-credit-auto";
import CalcolatorePrestitoAutoItaly from "@/pages/italy/calcolatore-prestito-auto";
import CalculadoraCreditoAutoChile from "@/pages/chile/calculadora-credito-auto";
import CalculadoraPrestamoAutoArgentina from "@/pages/argentina/calculadora-prestamo-auto";
import CalculadoraCreditoVehiculoColombia from "@/pages/colombia/calculadora-credito-vehiculo";
import CalculadoraFinanciacionCocheSpain from "@/pages/spain/calculadora-financiacion-coche";
import CalculadoraCreditoAutomovelMocambique from "@/pages/mocambique/calculadora-credito-automovel";
import CalculadoraCreditoAutomovelAngola from "@/pages/angola/calculadora-credito-automovel";
import CarLoanCalculatorIndia from "@/pages/india/car-loan-calculator";
import SimuladorFinanciamentoAutomovelPortugal from "@/pages/portugal/simulador-financiamento-automovel";
import AutokreditRechnerDeutschland from "@/pages/deutschland/autokredit-rechner";
import CarLoanCalculatorCanada from "@/pages/canada/car-loan-calculator";
import CarFinanceCalculatorUK from "@/pages/uk/car-finance-calculator";
import CarLoanCalculatorAustralia from "@/pages/australia/car-loan-calculator";
import CalculadoraPrestamoAutoParaguay from "@/pages/paraguay/calculadora-prestamo-auto";
import CalculadoraPrestamoAutoUruguay from "@/pages/uruguay/calculadora-prestamo-auto";
import CalculadoraPrestamoAutoPeru from "@/pages/peru/calculadora-prestamo-auto";
import CalculadoraPrestamoAutoBolivia from "@/pages/bolivia/calculadora-prestamo-auto";
import CalculadoraPrestamoAutoEcuador from "@/pages/ecuador/calculadora-prestamo-auto";
import CalculadoraPrestamoAutoVenezuela from "@/pages/venezuela/calculadora-prestamo-auto";
import CarLoanCalculatorSouthAfrica from "@/pages/south-africa/car-loan-calculator";
import CarLoanCalculatorJapan from "@/pages/japan/car-loan-calculator";
import CarLoanCalculatorSouthKorea from "@/pages/south-korea/car-loan-calculator";
import CarLoanCalculatorChina from "@/pages/china/car-loan-calculator";
import CarLoanCalculatorSweden from "@/pages/sweden/car-loan-calculator";
import CarLoanCalculatorNorway from "@/pages/norway/car-loan-calculator";
import CarLoanCalculatorDenmark from "@/pages/denmark/car-loan-calculator";
import CarLoanCalculatorFinland from "@/pages/finland/car-loan-calculator";
import SimuladorFinanciamentoVeiculo2025 from "@/pages/simulador-financiamento-veiculo-2025";
import SimuladorFinanciamentoCompleto from "@/pages/simulador-financiamento-completo";
import SimuladorTest from "@/pages/simulador-test";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import CookieConsent from "@/components/ui/cookie-consent";

// Componente que faz a página rolar para o topo quando muda de rota
function ScrollToTop() {
  const [location] = useLocation();
  const { sendPageView } = useAnalytics();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Enviar evento de visualização da página para o Google Analytics
    sendPageView(location);
  }, [location, sendPageView]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home}/>
        {/* URLs otimizadas para SEO em português brasileiro */}
        <Route path="/simulador-financiamento-veiculos" component={VehicleFinance}/>
        <Route path="/financiamento-veiculo" component={VehicleFinance}/>
        <Route path="/vehicle-finance" component={VehicleFinance}/>
        <Route path="/simulador-financiamento-veiculo-2025" component={SimuladorFinanciamentoVeiculo2025}/>
        <Route path="/simulador-financiamento-completo" component={SimuladorFinanciamentoCompleto}/>
        <Route path="/simulador-test" component={SimuladorTest}/>
        <Route path="/financiamento-imobiliario" component={RealEstateFinance}/>
        <Route path="/emprestimo-pessoal" component={PersonalLoan}/>
        <Route path="/credito-consignado" component={PayrollLoan}/>
        <Route path="/politica-privacidade" component={PrivacyPolicy}/>
        <Route path="/termos-de-uso" component={TermsOfUse}/>
        
        {/* Novas calculadoras e simuladores */}
        <Route path="/simulador-refinanciamento" component={RefinancingSimulator}/>
        <Route path="/capacidade-pagamento" component={PaymentCapacity}/>
        <Route path="/comparativo-amortizacao" component={AmortizationComparison}/>
        <Route path="/calculadora-entrada-ideal" component={IdealDownpayment}/>
        <Route path="/leasing-vs-financiamento" component={LeasingVsFinancing}/>
        
        {/* Novos simuladores de veículos específicos */}
        <Route path="/financiamento-caminhao" component={TruckFinance}/>
        <Route path="/financiamento-caminhoes" component={TruckFinance}/>
        <Route path="/financiamento-moto" component={SimuladorFinanciamentoMoto}/>
        <Route path="/financiamento-motos" component={SimuladorFinanciamentoMoto}/>
        
        {/* Simulador de financiamento com parcela balão */}
        <Route path="/simulador-parcela-balao" component={SimuladorParcelaBalao}/>
        <Route path="/financiamento-parcela-balao" component={BalloonPaymentFinance}/>
        <Route path="/financiamento-vfg" component={BalloonPaymentFinance}/>
        
        {/* Simulador Caixa de Financiamento - Rota otimizada para SEO */}
        <Route path="/simulador-caixa-financiamento" component={SimuladorCaixa}/>
        <Route path="/simulador-da-caixa" component={SimuladorCaixa}/>
        <Route path="/caixa-simulador-financiamento" component={SimuladorCaixa}/>
        
        {/* Simulador de Financiamento - Rota principal para SEO */}
        <Route path="/simulador-de-financiamento" component={SimuladorFinanciamento}/>
        <Route path="/simulador-financiamento" component={SimuladorFinanciamento}/>
        <Route path="/calculadora-financiamento" component={SimuladorFinanciamento}/>
        
        {/* Simulador de Financiamento Online Grátis - Rotas otimizadas para SEO */}
        <Route path="/simulador-financiamento-online-gratis" component={SimuladorFinanciamentoOnlineGratis}/>
        <Route path="/simulador-financiamento-gratis" component={SimuladorFinanciamentoOnlineGratis}/>
        <Route path="/calculadora-financiamento-gratis" component={SimuladorFinanciamentoOnlineGratis}/>
        <Route path="/simulador-gratis" component={SimuladorFinanciamentoOnlineGratis}/>
        
        {/* Simulador Banco do Brasil - Rotas otimizadas para SEO */}
        <Route path="/simulador-banco-do-brasil" component={SimuladorBancoDoBrasil}/>
        <Route path="/simulador-bb" component={SimuladorBancoDoBrasil}/>
        <Route path="/financiamento-banco-do-brasil" component={SimuladorBancoDoBrasil}/>
        <Route path="/simulador-bb-financiamento" component={SimuladorBancoDoBrasil}/>
        
        {/* Simulador de Painéis Solares - Rotas otimizadas para SEO */}
        <Route path="/financiamento-paineis-solares" component={PaineisSolares}/>
        <Route path="/simulador-energia-solar" component={PaineisSolares}/>
        <Route path="/calculadora-painel-solar" component={PaineisSolares}/>
        <Route path="/energia-solar-financiamento" component={PaineisSolares}/>
        
        {/* Simulador de Financiamento Estudantil FIES - Rotas otimizadas para SEO */}
        <Route path="/simulador-fies" component={FinanciamentoFIES}/>
        <Route path="/financiamento-estudantil" component={FinanciamentoFIES}/>
        <Route path="/como-funciona-fies" component={FinanciamentoFIES}/>
        <Route path="/financiamento-faculdade" component={FinanciamentoFIES}/>
        
        {/* Simulador de Seguro de Automóvel - Rotas otimizadas para SEO */}
        <Route path="/simulador-seguro-automovel" component={SimuladorSeguroAutomovel}/>
        <Route path="/seguro-de-carro" component={SimuladorSeguroAutomovel}/>
        <Route path="/calculadora-seguro-auto" component={SimuladorSeguroAutomovel}/>
        <Route path="/preco-seguro-carro" component={SimuladorSeguroAutomovel}/>
        
        {/* Empréstimo para Negativado - Rotas otimizadas para SEO */}
        <Route path="/emprestimo-negativado" component={EmprestimoNegativado}/>
        <Route path="/emprestimo-nome-sujo" component={EmprestimoNegativado}/>
        <Route path="/credito-negativado" component={EmprestimoNegativado}/>
        
        {/* Blog sobre Financiamentos */}
        <Route path="/blog" component={Blog}/>
        <Route path="/blog/calcular-taxa-juros-real-financiamento" component={BlogPost1}/>
        <Route path="/blog/tabela-price-vs-sac" component={BlogPost2}/>
        <Route path="/blog/erros-financiamento-carros" component={BlogPost3}/>
        <Route path="/blog/documentacao-financiamento-veiculos-2025" component={BlogPost4}/>
        <Route path="/blog/simulacao-financiamento-interpretar-resultados" component={BlogPost5}/>
        <Route path="/blog/como-quitar-financiamento-antecipadamente" component={BlogPost6}/>
        <Route path="/blog/calculadoras-financiamento-veiculos-mundo" component={BlogPostCalculadorasInternacionais}/>
        
        {/* Taxas de Juros dos Bancos */}
        <Route path="/taxas-bancos" component={TaxasBancos}/>
        <Route path="/taxas-juros-bancos" component={TaxasBancos}/>
        
        {/* México - Calculadora de Préstamos */}
        <Route path="/mx/calculadora-prestamo-auto" component={CalculadoraPrestamoAutoMX}/>
        <Route path="/mx" component={CalculadoraPrestamoAutoMX}/>
        
        {/* USA - Auto Loan Calculator */}
        <Route path="/usa/auto-loan-calculator" component={AutoLoanCalculatorUSA}/>
        <Route path="/usa" component={AutoLoanCalculatorUSA}/>
        
        {/* France - Calculateur Crédit Auto */}
        <Route path="/france/calculateur-credit-auto" component={CalculateurCreditAutoFrance}/>
        <Route path="/france" component={CalculateurCreditAutoFrance}/>
        
        {/* Italy - Calcolatore Prestito Auto */}
        <Route path="/italy/calcolatore-prestito-auto" component={CalcolatorePrestitoAutoItaly}/>
        <Route path="/italy" component={CalcolatorePrestitoAutoItaly}/>
        
        {/* Chile - Calculadora Crédito Auto */}
        <Route path="/chile/calculadora-credito-auto" component={CalculadoraCreditoAutoChile}/>
        <Route path="/chile" component={CalculadoraCreditoAutoChile}/>
        
        {/* Argentina - Calculadora Préstamo Auto */}
        <Route path="/argentina/calculadora-prestamo-auto" component={CalculadoraPrestamoAutoArgentina}/>
        <Route path="/argentina" component={CalculadoraPrestamoAutoArgentina}/>
        
        {/* Colombia - Calculadora Crédito Vehículo */}
        <Route path="/colombia/calculadora-credito-vehiculo" component={CalculadoraCreditoVehiculoColombia}/>
        <Route path="/colombia" component={CalculadoraCreditoVehiculoColombia}/>
        
        {/* Spain - Calculadora Financiación Coche */}
        <Route path="/spain/calculadora-financiacion-coche" component={CalculadoraFinanciacionCocheSpain}/>
        <Route path="/spain" component={CalculadoraFinanciacionCocheSpain}/>
        
        {/* Moçambique - Calculadora Crédito Automóvel */}
        <Route path="/mocambique/calculadora-credito-automovel" component={CalculadoraCreditoAutomovelMocambique}/>
        <Route path="/mocambique" component={CalculadoraCreditoAutomovelMocambique}/>
        
        {/* Angola - Calculadora Crédito Automóvel */}
        <Route path="/angola/calculadora-credito-automovel" component={CalculadoraCreditoAutomovelAngola}/>
        <Route path="/angola" component={CalculadoraCreditoAutomovelAngola}/>
        
        {/* India - Car Loan Calculator */}
        <Route path="/india/car-loan-calculator" component={CarLoanCalculatorIndia}/>
        <Route path="/india" component={CarLoanCalculatorIndia}/>
        
        {/* Portugal - Simulador Financiamento Automóvel */}
        <Route path="/portugal/simulador-financiamento-automovel" component={SimuladorFinanciamentoAutomovelPortugal}/>
        <Route path="/portugal" component={SimuladorFinanciamentoAutomovelPortugal}/>
        
        {/* Deutschland - Autokredit Rechner */}
        <Route path="/deutschland/autokredit-rechner" component={AutokreditRechnerDeutschland}/>
        <Route path="/deutschland" component={AutokreditRechnerDeutschland}/>
        
        {/* Canada - Car Loan Calculator */}
        <Route path="/canada/car-loan-calculator" component={CarLoanCalculatorCanada}/>
        <Route path="/canada" component={CarLoanCalculatorCanada}/>
        
        {/* UK - Car Finance Calculator */}
        <Route path="/uk/car-finance-calculator" component={CarFinanceCalculatorUK}/>
        <Route path="/uk" component={CarFinanceCalculatorUK}/>
        
        {/* Australia - Car Loan Calculator */}
        <Route path="/australia/car-loan-calculator" component={CarLoanCalculatorAustralia}/>
        <Route path="/australia" component={CarLoanCalculatorAustralia}/>
        
        {/* Paraguay - Calculadora Préstamo Auto */}
        <Route path="/paraguay/calculadora-prestamo-auto" component={CalculadoraPrestamoAutoParaguay}/>
        <Route path="/paraguay" component={CalculadoraPrestamoAutoParaguay}/>
        
        {/* Uruguay - Calculadora Préstamo Auto */}
        <Route path="/uruguay/calculadora-prestamo-auto" component={CalculadoraPrestamoAutoUruguay}/>
        <Route path="/uruguay" component={CalculadoraPrestamoAutoUruguay}/>
        
        {/* Peru - Calculadora Préstamo Auto */}
        <Route path="/peru/calculadora-prestamo-auto" component={CalculadoraPrestamoAutoPeru}/>
        <Route path="/peru" component={CalculadoraPrestamoAutoPeru}/>
        
        {/* Bolivia - Calculadora Préstamo Auto */}
        <Route path="/bolivia/calculadora-prestamo-auto" component={CalculadoraPrestamoAutoBolivia}/>
        <Route path="/bolivia" component={CalculadoraPrestamoAutoBolivia}/>
        
        {/* Ecuador - Calculadora Préstamo Auto */}
        <Route path="/ecuador/calculadora-prestamo-auto" component={CalculadoraPrestamoAutoEcuador}/>
        <Route path="/ecuador" component={CalculadoraPrestamoAutoEcuador}/>
        
        {/* Venezuela - Calculadora Préstamo Auto */}
        <Route path="/venezuela/calculadora-prestamo-auto" component={CalculadoraPrestamoAutoVenezuela}/>
        <Route path="/venezuela" component={CalculadoraPrestamoAutoVenezuela}/>
        
        {/* South Africa - Car Loan Calculator */}
        <Route path="/south-africa/car-loan-calculator" component={CarLoanCalculatorSouthAfrica}/>
        <Route path="/south-africa" component={CarLoanCalculatorSouthAfrica}/>
        
        {/* Japan - Car Loan Calculator */}
        <Route path="/japan/car-loan-calculator" component={CarLoanCalculatorJapan}/>
        <Route path="/japan" component={CarLoanCalculatorJapan}/>
        
        {/* South Korea - Car Loan Calculator */}
        <Route path="/south-korea/car-loan-calculator" component={CarLoanCalculatorSouthKorea}/>
        <Route path="/south-korea" component={CarLoanCalculatorSouthKorea}/>
        
        {/* China - Car Loan Calculator */}
        <Route path="/china/car-loan-calculator" component={CarLoanCalculatorChina}/>
        <Route path="/china" component={CarLoanCalculatorChina}/>
        
        {/* Sweden - Car Loan Calculator */}
        <Route path="/sweden/car-loan-calculator" component={CarLoanCalculatorSweden}/>
        <Route path="/sweden" component={CarLoanCalculatorSweden}/>
        
        {/* Norway - Car Loan Calculator */}
        <Route path="/norway/car-loan-calculator" component={CarLoanCalculatorNorway}/>
        <Route path="/norway" component={CarLoanCalculatorNorway}/>
        
        {/* Denmark - Car Loan Calculator */}
        <Route path="/denmark/car-loan-calculator" component={CarLoanCalculatorDenmark}/>
        <Route path="/denmark" component={CarLoanCalculatorDenmark}/>
        
        {/* Finland - Car Loan Calculator */}
        <Route path="/finland/car-loan-calculator" component={CarLoanCalculatorFinland}/>
        <Route path="/finland" component={CarLoanCalculatorFinland}/>
        
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  const [location] = useLocation();
  const hideNavFooter = location.startsWith('/india') || location.startsWith('/france') || 
                        location.startsWith('/usa') || location.startsWith('/italy') ||
                        location.startsWith('/deutschland') || location.startsWith('/canada') ||
                        location.startsWith('/uk') || location.startsWith('/australia') ||
                        location.startsWith('/south-africa') || location.startsWith('/japan') ||
                        location.startsWith('/south-korea') || location.startsWith('/china') ||
                        location.startsWith('/sweden') || location.startsWith('/norway') ||
                        location.startsWith('/denmark') || location.startsWith('/finland');
  
  // Inicializar o Google Analytics
  useAnalytics();
  
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen">
          {!hideNavFooter && <Navbar />}
          <main className="flex-grow">
            <Router />
          </main>
          {!hideNavFooter && <Footer />}
          <CookieConsent />
        </div>
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
