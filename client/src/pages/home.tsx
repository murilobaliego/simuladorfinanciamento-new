import { Link } from "wouter";
import SimulatorCard from "@/components/simulators/simulator-card";
import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Simulador de Financiamento | Veículos, Imóveis e Empréstimos com Cálculo de IOF</title>
        <meta name="description" content="Simulador de financiamento online e gratuito. Calcule financiamento de veículos, imóveis e empréstimos pessoais. Compare condições como na Caixa, Banco do Brasil e outros bancos." />
        <meta name="keywords" content="simulador de financiamento, simulador de financiamento de veículos, simulador caixa de financiamento, tabela price, simulador de parcelas, cálculo IOF" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/" />
        <meta property="og:title" content="Simulador de Financiamento | Veículos, Imóveis e Empréstimos com Cálculo de IOF" />
        <meta property="og:description" content="Simule gratuitamente financiamentos com o melhor simulador online. Compare condições da Caixa e outros bancos. Inclui IOF, tabela de amortização e sistema Price." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Financiamento",
              "url": "https://simuladorfinanciamento.com/",
              "description": "Simule financiamentos de veículos, imóveis e empréstimos com cálculo de IOF e tabela de amortização completa.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              }
            }
          `}
        </script>
      </Helmet>
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
              src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
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
            imageSrc="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            imageAlt="Carro em exposição"
          />
          
          <SimulatorCard
            title="Financiamento Imobiliário"
            description="Calcule o financiamento da sua casa ou apartamento com prazos de até 35 anos."
            path="/financiamento-imobiliario"
            imageSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            imageAlt="Casa e plantas baixas"
          />
          
          <SimulatorCard
            title="Empréstimo Pessoal"
            description="Simule um empréstimo pessoal para quitar dívidas, viajar ou realizar seus sonhos."
            path="/emprestimo-pessoal"
            imageSrc="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            imageAlt="Pessoa contando dinheiro"
          />
          
          <SimulatorCard
            title="Crédito Consignado"
            description="Taxas mais baixas para aposentados, pensionistas e servidores públicos."
            path="/credito-consignado"
            imageSrc="https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
            imageSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            imageAlt="Pessoa analisando contrato"
          />
          
          <SimulatorCard
            title="Calculadora de Capacidade"
            description="Descubra qual valor de financiamento cabe no seu orçamento mensal."
            path="/capacidade-pagamento"
            imageSrc="https://images.unsplash.com/photo-1554224155-3a58922a22c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            imageAlt="Calculadora e orçamento"
          />
          
          <SimulatorCard
            title="Comparativo Price vs. SAC"
            description="Compare os dois principais sistemas de amortização e veja qual é mais vantajoso."
            path="/comparativo-amortizacao"
            imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            imageAlt="Gráficos comparativos"
          />
          
          <SimulatorCard
            title="Calculadora de Entrada Ideal"
            description="Descubra o valor ideal de entrada para equilibrar parcelas e custo total."
            path="/calculadora-entrada-ideal"
            imageSrc="https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            imageAlt="Dinheiro e calculadora"
          />
          
          <SimulatorCard
            title="Leasing vs. Financiamento"
            description="Compare as duas modalidades para aquisição de veículos e escolha a melhor opção."
            path="/leasing-vs-financiamento"
            imageSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
    </>
  );
}
