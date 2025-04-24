import { Link } from "wouter";
import SimulatorCard from "@/components/simulators/simulator-card";

// Imagens otimizadas
import heroCalculator from "@/assets/img/hero-calculator.svg";
import vehicleFinance from "@/assets/img/vehicle-finance.svg";
import realEstateFinance from "@/assets/img/real-estate-finance.svg";
import personalLoan from "@/assets/img/personal-loan.svg";
import payrollLoan from "@/assets/img/payroll-loan.svg";
import refinancing from "@/assets/img/refinancing.svg";
import paymentCapacity from "@/assets/img/payment-capacity.svg";
import amortizationComparison from "@/assets/img/amortization-comparison.svg";
import idealDownpayment from "@/assets/img/ideal-downpayment.svg";
import leasingVsFinancing from "@/assets/img/leasing-vs-financing.svg";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Banner */}
      <section className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 md:p-8 md:w-3/5">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">Simule o financiamento do seu veículo</h2>
            <p className="text-neutral-700 mb-6">Com o nosso simulador, você consegue calcular quanto vai pagar por mês no financiamento do seu carro ou moto. É rápido, fácil e ajuda você a planejar melhor seu orçamento.</p>
            <Link href="/financiamento-veiculo" className="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-md shadow-sm transition-colors">Fazer simulação agora</Link>
          </div>
          <div className="md:w-2/5 bg-neutral-200 h-40 md:h-auto">
            <img 
              src={heroCalculator} 
              alt="Pessoa calculando financiamento" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Other Simulators */}
      <section id="outros-simuladores" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6">Nossos Simuladores de Financiamento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SimulatorCard
            title="Financiamento de Veículos"
            description="Simule o financiamento do seu carro ou moto com prestações fixas pela Tabela Price."
            path="/financiamento-veiculo"
            imageSrc={vehicleFinance}
            imageAlt="Carro em exposição"
          />
          
          <SimulatorCard
            title="Financiamento Imobiliário"
            description="Calcule o financiamento da sua casa ou apartamento com prazos de até 35 anos."
            path="/financiamento-imobiliario"
            imageSrc={realEstateFinance}
            imageAlt="Casa e plantas baixas"
          />
          
          <SimulatorCard
            title="Empréstimo Pessoal"
            description="Simule um empréstimo pessoal para quitar dívidas, viajar ou realizar seus sonhos."
            path="/emprestimo-pessoal"
            imageSrc={personalLoan}
            imageAlt="Pessoa contando dinheiro"
          />
          
          <SimulatorCard
            title="Crédito Consignado"
            description="Taxas mais baixas para aposentados, pensionistas e servidores públicos."
            path="/credito-consignado"
            imageSrc={payrollLoan}
            imageAlt="Aposentado sorrindo"
          />
        </div>
      </section>

      {/* Advanced Tools Section */}
      <section id="ferramentas-avancadas" className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6">Ferramentas Avançadas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SimulatorCard
            title="Simulador de Refinanciamento"
            description="Calcule a economia ao refinanciar seu veículo para condições mais vantajosas."
            path="/simulador-refinanciamento"
            imageSrc={refinancing}
            imageAlt="Pessoa analisando contrato"
          />
          
          <SimulatorCard
            title="Calculadora de Capacidade"
            description="Descubra qual valor de financiamento cabe no seu orçamento mensal."
            path="/capacidade-pagamento"
            imageSrc={paymentCapacity}
            imageAlt="Calculadora e orçamento"
          />
          
          <SimulatorCard
            title="Comparativo Price vs. SAC"
            description="Compare os dois principais sistemas de amortização e veja qual é mais vantajoso."
            path="/comparativo-amortizacao"
            imageSrc={amortizationComparison}
            imageAlt="Gráficos comparativos"
          />
          
          <SimulatorCard
            title="Calculadora de Entrada Ideal"
            description="Descubra o valor ideal de entrada para equilibrar parcelas e custo total."
            path="/calculadora-entrada-ideal"
            imageSrc={idealDownpayment}
            imageAlt="Dinheiro e calculadora"
          />
          
          <SimulatorCard
            title="Leasing vs. Financiamento"
            description="Compare as duas modalidades para aquisição de veículos e escolha a melhor opção."
            path="/leasing-vs-financiamento"
            imageSrc={leasingVsFinancing}
            imageAlt="Pessoa assinando contrato"
          />
        </div>
      </section>
      
      {/* About Section */}
      <section id="sobre" className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="font-heading text-2xl font-bold text-primary mb-4">Sobre o Simulador de Financiamento</h2>
        
        <div className="space-y-4 text-neutral-700">
          <p>Nosso site oferece ferramentas gratuitas para simulação de diferentes tipos de financiamento. Nosso objetivo é ajudar você a entender melhor as opções disponíveis antes de tomar uma decisão importante para o seu bolso.</p>
          
          <p>Com os nossos simuladores, você pode:</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>Calcular o valor das prestações mensais</li>
            <li>Ver como o saldo devedor diminui ao longo do tempo</li>
            <li>Comparar diferentes opções de prazo e taxa de juros</li>
            <li>Entender quanto pagará de juros no total</li>
          </ul>
          
          <p>Os cálculos são baseados em métodos financeiros amplamente utilizados, como a Tabela Price (Sistema Francês de Amortização) e o SAC (Sistema de Amortização Constante).</p>
          
          <div className="bg-neutral-100 border-l-4 border-secondary p-4 mt-6">
            <p className="text-sm font-medium">AVISO IMPORTANTE:</p>
            <p className="text-sm">Não somos uma instituição financeira e não oferecemos empréstimos ou financiamentos. Este site fornece apenas ferramentas de simulação para cálculos e pesquisa. Os resultados são aproximados e podem variar conforme as condições reais oferecidas pelas instituições financeiras. Recomendamos sempre consultar um banco ou financeira para obter condições oficiais antes de tomar qualquer decisão.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
