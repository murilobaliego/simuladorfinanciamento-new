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
      {/* Hero Banner - Otimizado para SEO */}
      <section className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 md:p-8 md:w-3/5">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">Simulador de Financiamento 2024</h1>
            <p className="text-neutral-700 mb-4">Com o melhor <strong>simulador de financiamento</strong> online, você calcula quanto vai pagar por mês no financiamento do seu veículo ou imóvel. Compare condições semelhantes às da <Link href="/simulador-caixa-financiamento" className="text-primary hover:underline">Caixa</Link> e outros bancos.</p>
            <p className="text-neutral-700 mb-6">Nosso <strong>simulador de financiamento de veículos</strong> inclui cálculo de IOF, tabela price completa e sistema de amortização detalhado.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/simulador-de-financiamento" className="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors">Simulador de Financiamento</Link>
              <Link href="/simulador-financiamento-veiculos" className="inline-block bg-white border border-primary hover:bg-primary/10 text-primary font-medium py-3 px-6 rounded-md shadow-sm transition-colors">Financiamento de Veículos</Link>
              <Link href="/simulador-caixa-financiamento" className="inline-block bg-white border border-primary hover:bg-primary/10 text-primary font-medium py-3 px-6 rounded-md shadow-sm transition-colors">Simulador Caixa</Link>
            </div>
          </div>
          <div className="md:w-2/5 bg-neutral-200 h-40 md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
              alt="Pessoa usando simulador de financiamento" 
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
      
      {/* Simulador Caixa Section - Otimizado para SEO */}
      <section id="simulador-caixa" className="mb-12 bg-primary/5 rounded-lg shadow-md p-6">
        <h2 className="font-heading text-2xl font-bold text-primary mb-4">Simulador Caixa de Financiamento</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 space-y-4">
            <p className="text-neutral-700">Nosso <strong>simulador Caixa de financiamento</strong> permite comparar condições similares às oferecidas pela Caixa Econômica Federal, um dos bancos mais populares para financiamento de imóveis e veículos no Brasil.</p>
            
            <p className="text-neutral-700">Com nossa calculadora, você pode simular:</p>
            
            <ul className="list-disc pl-5 space-y-2 text-neutral-700">
              <li>Financiamento de veículos com taxas competitivas (a partir de 1,09% a.m.)</li>
              <li>Financiamento imobiliário com prazos de até 35 anos</li>
              <li>Comparativo entre sistemas de amortização SAC e PRICE</li>
              <li>Cálculo completo com inclusão de IOF e outras taxas</li>
            </ul>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/simulador-caixa-financiamento" className="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors text-sm">
                Acessar Simulador Caixa
              </Link>
              <Link href="/comparativo-amortizacao" className="inline-block bg-white border border-primary hover:bg-primary/10 text-primary font-medium py-2 px-4 rounded-md shadow-sm transition-colors text-sm">
                Comparar SAC e PRICE
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-lg text-primary mb-3">Taxas médias de referência - Caixa</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span>Veículos novos:</span>
                <span className="font-medium text-green-600">1,09% a 1,89% a.m.</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Veículos usados:</span>
                <span className="font-medium text-green-600">1,29% a 1,99% a.m.</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Imóveis (SBPE):</span>
                <span className="font-medium text-green-600">9,99% a 11,5% a.a.</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Imóveis (MCMV):</span>
                <span className="font-medium text-green-600">7,66% a 8,16% a.a.</span>
              </div>
              <p className="text-xs text-neutral-500 italic mt-2">* Taxas aproximadas para referência.</p>
            </div>
          </div>
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
          
          <p>Os cálculos são baseados em métodos financeiros amplamente utilizados, como a <strong>Tabela Price</strong> (Sistema Francês de Amortização) e o <strong>SAC</strong> (Sistema de Amortização Constante).</p>
          
          <div className="bg-neutral-100 border-l-4 border-secondary p-4 mt-6">
            <p className="text-sm font-medium">AVISO IMPORTANTE:</p>
            <p className="text-sm">Não somos uma instituição financeira e não oferecemos empréstimos ou financiamentos. Este site fornece apenas ferramentas de simulação para cálculos e pesquisa. Os resultados são aproximados e podem variar conforme as condições reais oferecidas pelas instituições financeiras. Recomendamos sempre consultar um banco ou financeira para obter condições oficiais antes de tomar qualquer decisão.</p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section com termos-chave para SEO */}
      <section id="perguntas-frequentes" className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6">Perguntas Frequentes sobre Simuladores de Financiamento</h2>
        
        <div className="space-y-5">
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg">O que é um simulador de financiamento?</h3>
            <p className="text-neutral-700">Um simulador de financiamento é uma ferramenta online que permite calcular antecipadamente o valor das parcelas, juros, amortização e custo total de um financiamento, seja de veículos, imóveis ou empréstimos pessoais. O objetivo é ajudar o consumidor a planejar melhor antes de assumir um compromisso financeiro.</p>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg">O simulador da Caixa é preciso?</h3>
            <p className="text-neutral-700">O simulador da Caixa Econômica Federal, assim como outros simuladores de bancos, fornece estimativas baseadas em condições padrão. Nossa ferramenta oferece cálculos similares, permitindo comparar diferentes cenários. Para condições exatas, é sempre recomendável consultar diretamente a instituição financeira após a simulação inicial.</p>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg">Como usar o simulador de financiamento de veículos?</h3>
            <p className="text-neutral-700">Para usar nosso simulador de financiamento de veículos, basta inserir o valor que deseja financiar, a taxa de juros mensal, o número de parcelas e se deseja incluir o IOF no cálculo. Nosso sistema calculará automaticamente o valor das parcelas, o total a pagar, o total de juros e gerará a tabela completa de amortização.</p>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg">Qual a diferença entre os sistemas SAC e PRICE?</h3>
            <p className="text-neutral-700">No sistema PRICE (Tabela Price), as parcelas são fixas do início ao fim do financiamento. Já no sistema SAC (Sistema de Amortização Constante), a amortização é fixa e os juros decrescentes, fazendo com que o valor das parcelas diminua ao longo do tempo. Nosso simulador permite comparar ambos os sistemas para você escolher o mais vantajoso.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">O simulador de financiamento inclui o IOF?</h3>
            <p className="text-neutral-700">Sim, nosso simulador de financiamento de veículos permite incluir o cálculo do IOF (Imposto sobre Operações Financeiras), composto por uma alíquota diária de 0,0082% e uma alíquota adicional de 0,38% sobre o valor total financiado, conforme a legislação brasileira.</p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
