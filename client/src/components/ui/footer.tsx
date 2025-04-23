import { Link } from "wouter";
import { Calculator, Car, Home, CreditCard, BadgeDollarSign, Info, Mail, FileText, Coffee } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-3">
              <Calculator className="h-6 w-6 mr-2 text-primary" aria-hidden="true" />
              <h3 className="font-heading text-white text-lg font-semibold">Simulador de Financiamento</h3>
            </div>
            <p className="text-sm mb-4">Ferramentas gratuitas para simular seus financiamentos e empréstimos de forma simples e objetiva.</p>
            <p className="text-sm">Use nossos simuladores para tomar decisões financeiras mais informadas, comparando diferentes cenários de financiamento.</p>
          </div>
          
          <div>
            <h3 className="font-heading text-white text-lg font-semibold mb-4">Calculadoras</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/simulador-financiamento-veiculos" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Car className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Simulador de Financiamento de Veículos</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/financiamento-imobiliario" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Home className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Financiamento Imobiliário</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/emprestimo-pessoal" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <CreditCard className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Empréstimo Pessoal</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/credito-consignado" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <BadgeDollarSign className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Crédito Consignado</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-white text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/simulador-financiamento-veiculos#como-funciona" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Info className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Como Funciona a Tabela Price</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/simulador-financiamento-veiculos#iof-calculadora" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Calculator className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Cálculo do IOF</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/simulador-financiamento-veiculos#melhores-taxas" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <BadgeDollarSign className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Melhores Taxas de Financiamento</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/simulador-financiamento-veiculos#dicas-financiamento"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Coffee className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Dicas para Financiar Veículos</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-white text-lg font-semibold mb-4">Informações</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Info className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Sobre o Simulador</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/termos-de-uso" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Termos de Uso</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/politica-privacidade" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Política de Privacidade</span>
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contato@simuladorfinanciamento.com.br" 
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Mail className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span>Contato</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm">
              <p>&copy; {currentYear} Simulador de Financiamento. Todos os direitos reservados.</p>
            </div>
            
            <div className="text-sm text-right">
              <p className="text-neutral-500">
                Esta é uma ferramenta de simulação para fins educacionais e não constitui oferta de crédito.
                As condições de financiamento podem variar conforme cada instituição financeira.
              </p>
            </div>
          </div>
        </div>
        
        {/* Enlaces para SEO - links adicionais com palavras-chave */}
        <div className="mt-6 pt-4 border-t border-neutral-700 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Link href="/simulador-financiamento-veiculos" className="text-neutral-500 hover:text-neutral-400">Simulador de Financiamento de Carros</Link>
            <Link href="/simulador-financiamento-veiculos" className="text-neutral-500 hover:text-neutral-400">Calculadora de Financiamento de Veículos</Link>
            <Link href="/simulador-financiamento-veiculos" className="text-neutral-500 hover:text-neutral-400">Tabela Price para Veículos</Link>
            <Link href="/simulador-financiamento-veiculos" className="text-neutral-500 hover:text-neutral-400">Cálculo de Financiamento com IOF</Link>
            <Link href="/simulador-financiamento-veiculos" className="text-neutral-500 hover:text-neutral-400">Simulador de Parcelas para Carros</Link>
            <Link href="/simulador-financiamento-veiculos" className="text-neutral-500 hover:text-neutral-400">Simulação de Financiamento Automotivo</Link>
            <Link href="/simulador-financiamento-veiculos" className="text-neutral-500 hover:text-neutral-400">Amortização de Financiamento</Link>
            <Link href="/simulador-financiamento-veiculos" className="text-neutral-500 hover:text-neutral-400">Comparativo de Financiamento</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
