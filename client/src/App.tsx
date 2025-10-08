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
import BalloonPaymentFinance from "@/pages/balloon-payment-finance";
import SimuladorCaixa from "@/pages/simulador-caixa";
import SimuladorFinanciamento from "@/pages/simulador-de-financiamento";
import SimuladorFinanciamentoOnlineGratis from "@/pages/simulador-financiamento-online-gratis";
import PaineisSolares from "@/pages/paineis-solares";
import FinanciamentoFIES from "@/pages/fies";
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
        <Route path="/financiamento-moto" component={MotorcycleFinance}/>
        <Route path="/financiamento-motos" component={MotorcycleFinance}/>
        
        {/* Simulador de financiamento com parcela balão */}
        <Route path="/simulador-parcela-balao" component={BalloonPaymentFinance}/>
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
        
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  // Inicializar o Google Analytics
  useAnalytics();
  
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <CookieConsent />
        </div>
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
