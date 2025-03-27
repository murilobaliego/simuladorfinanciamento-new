import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-white text-lg font-semibold mb-4">Simulador de Financiamento</h3>
            <p className="text-sm">Ferramentas gratuitas para simular seus financiamentos e empréstimos de forma simples e objetiva.</p>
          </div>
          
          <div>
            <h3 className="font-heading text-white text-lg font-semibold mb-4">Simuladores</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/financiamento-veiculo" className="hover:text-white transition-colors">Financiamento de Veículos</Link></li>
              <li><Link href="/financiamento-imobiliario" className="hover:text-white transition-colors">Financiamento Imobiliário</Link></li>
              <li><Link href="/emprestimo-pessoal" className="hover:text-white transition-colors">Empréstimo Pessoal</Link></li>
              <li><Link href="/credito-consignado" className="hover:text-white transition-colors">Crédito Consignado</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-white text-lg font-semibold mb-4">Informações</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#sobre" className="hover:text-white transition-colors">Sobre</a></li>
              <li><Link href="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link href="/politica-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><a href="mailto:contato@simuladordefinanciamento.com.br" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-700 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Simulador de Financiamento. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
