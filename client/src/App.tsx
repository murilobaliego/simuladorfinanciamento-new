import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
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
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import CookieConsent from "@/components/ui/cookie-consent";

function Router() {
  return (
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
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
