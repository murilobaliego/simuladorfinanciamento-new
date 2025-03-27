import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import VehicleFinance from "@/pages/vehicle-finance";
import RealEstateFinance from "@/pages/real-estate-finance";
import PersonalLoan from "@/pages/personal-loan";
import PayrollLoan from "@/pages/payroll-loan";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfUse from "@/pages/terms-of-use";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import CookieConsent from "@/components/ui/cookie-consent";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/financiamento-veiculo" component={VehicleFinance}/>
      <Route path="/financiamento-imobiliario" component={RealEstateFinance}/>
      <Route path="/emprestimo-pessoal" component={PersonalLoan}/>
      <Route path="/credito-consignado" component={PayrollLoan}/>
      <Route path="/politica-privacidade" component={PrivacyPolicy}/>
      <Route path="/termos-de-uso" component={TermsOfUse}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
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
  );
}

export default App;
