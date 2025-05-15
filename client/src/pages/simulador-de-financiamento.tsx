import { Helmet } from 'react-helmet-async';
import { Link } from "wouter";
import SimulatorCard from "@/components/simulators/simulator-card";

export default function SimuladorFinanciamento() {
  return (
    <>
      <Helmet>
        <title>Simulador de Financiamento | Compare Condições e Taxas Online</title>
        <meta name="description" content="Simulador de financiamento gratuito para veículos, imóveis e empréstimos pessoais. Compare taxas como na Caixa e outros bancos, calcule IOF e veja a tabela price completa." />
        <meta name="keywords" content="simulador de financiamento, calculadora de financiamento, simulador caixa financiamento, tabela price, comparativo de financiamento, simulador online, cálculo juros, melhor financiamento" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-de-financiamento" />
        <meta property="og:title" content="Simulador de Financiamento | Compare Condições e Taxas Online" />
        <meta property="og:description" content="Use nosso simulador de financiamento gratuito para calcular parcelas, juros e amortização. Compare condições semelhantes às da Caixa e outros bancos." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/simulador-de-financiamento" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Financiamento",
              "url": "https://simuladorfinanciamento.com/simulador-de-financiamento",
              "description": "Simulador online gratuito para cálculo de financiamentos com tabela de amortização completa.",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "operatingSystem": "Web",
              "featureList": [
                "Comparação entre bancos",
                "Diferentes sistemas de amortização",
                "Cálculo de IOF",
                "Simulação com diversos prazos",
                "Exportação em PDF e Excel"
              ]
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Início",
                  "item": "https://simuladorfinanciamento.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Simulador de Financiamento",
                  "item": "https://simuladorfinanciamento.com/simulador-de-financiamento"
                }
              ]
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "O que é um simulador de financiamento?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Um simulador de financiamento é uma ferramenta online que permite calcular antecipadamente o valor das parcelas, juros, amortização e custo total de um financiamento, seja de veículos, imóveis ou empréstimos pessoais. O objetivo é ajudar você a planejar melhor antes de assumir um compromisso financeiro."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual a diferença entre os sistemas de amortização?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Os principais sistemas de amortização são: PRICE (parcelas fixas do início ao fim), SAC (amortização constante, com parcelas decrescentes) e SACRE (combinação dos dois sistemas). Cada um tem vantagens e desvantagens dependendo do seu perfil financeiro e objetivos."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quais os benefícios de usar um simulador de financiamento?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ao usar um simulador de financiamento, você pode: comparar diferentes cenários (variando entrada, prazo e taxas), visualizar a evolução do saldo devedor, entender o impacto de impostos como o IOF, verificar o Custo Efetivo Total (CET) e tomar decisões financeiras mais conscientes."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <section className="mb-12 bg-white rounded-lg shadow-md p-6">
          <h1 className="font-heading text-3xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Simulador de Financiamento</h1>
          
          <div className="mb-8">
            <p className="mb-4">O <strong>simulador de financiamento</strong> é uma ferramenta essencial para quem deseja planejar a aquisição de bens a prazo, como veículos, imóveis ou mesmo um empréstimo pessoal. Com nosso simulador completo, você consegue calcular com precisão quanto vai pagar por mês, o total de juros ao longo do contrato e como seu saldo devedor será reduzido com o passar do tempo.</p>
            
            <h2 id="o-que-e" className="text-xl font-semibold text-primary mt-6 mb-3">O que é um simulador de financiamento?</h2>
            
            <p className="mb-4">Um <strong>simulador de financiamento</strong> é uma calculadora online que ajuda você a projetar o valor das prestações e o custo total de um financiamento antes de efetivamente contratar o serviço. Esta ferramenta utiliza fórmulas financeiras complexas, como a Tabela Price e o Sistema de Amortização Constante (SAC), para apresentar resultados precisos e transparentes.</p>
            
            <p className="mb-4">Ao utilizar nosso simulador, você pode testar diferentes cenários, variando valores como:</p>
            
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li><strong>Valor financiado:</strong> Quanto você precisa para adquirir o bem</li>
              <li><strong>Taxa de juros:</strong> O percentual cobrado pela instituição financeira</li>
              <li><strong>Prazo:</strong> Quantidade de meses para pagamento</li>
              <li><strong>Sistema de amortização:</strong> PRICE (parcelas fixas) ou SAC (parcelas decrescentes)</li>
              <li><strong>Inclusão de impostos:</strong> Como o IOF para veículos e empréstimos</li>
            </ul>
            
            <div className="my-8 p-5 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-lg mb-3">Nossos Simuladores Especializados</h3>
              <p className="mb-4">Escolha entre nossas diferentes calculadoras de financiamento para atender às suas necessidades específicas:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md shadow-sm border border-neutral-200">
                  <h4 className="font-medium text-primary mb-2">Financiamento de Veículos</h4>
                  <p className="text-sm mb-3">Simule o financiamento do seu carro, moto ou caminhão com cálculo de IOF e tabela de amortização completa.</p>
                  <Link href="/simulador-financiamento-veiculos" className="text-primary text-sm hover:underline">Acessar simulador →</Link>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-neutral-200">
                  <h4 className="font-medium text-primary mb-2">Simulador Caixa</h4>
                  <p className="text-sm mb-3">Compare condições similares às oferecidas pela Caixa Econômica Federal para diferentes tipos de financiamento.</p>
                  <Link href="/simulador-caixa-financiamento" className="text-primary text-sm hover:underline">Acessar simulador →</Link>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-neutral-200">
                  <h4 className="font-medium text-primary mb-2">Financiamento Imobiliário</h4>
                  <p className="text-sm mb-3">Calcule prestações de financiamento para casa ou apartamento com prazos de até 35 anos.</p>
                  <Link href="/financiamento-imobiliario" className="text-primary text-sm hover:underline">Acessar simulador →</Link>
                </div>
              </div>
            </div>
            
            <h2 id="sistemas-amortizacao" className="text-xl font-semibold text-primary mt-6 mb-3">Sistemas de Amortização: PRICE vs. SAC</h2>
            
            <p className="mb-4">Os sistemas de amortização determinam como o saldo devedor será reduzido ao longo do tempo e como os juros serão calculados em cada parcela. Os dois principais sistemas utilizados no Brasil são:</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 mb-6">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="px-4 py-2 border text-left">Características</th>
                    <th className="px-4 py-2 border text-center">Sistema PRICE (Tabela Price)</th>
                    <th className="px-4 py-2 border text-center">Sistema SAC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Parcelas</td>
                    <td className="px-4 py-2 border">Fixas do início ao fim</td>
                    <td className="px-4 py-2 border">Decrescentes (diminuem com o tempo)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-medium">Amortização</td>
                    <td className="px-4 py-2 border">Crescente (aumenta com o tempo)</td>
                    <td className="px-4 py-2 border">Constante (sempre igual)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Juros</td>
                    <td className="px-4 py-2 border">Decrescentes (diminuem com o tempo)</td>
                    <td className="px-4 py-2 border">Decrescentes mais rapidamente</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-medium">Custo total</td>
                    <td className="px-4 py-2 border">Geralmente maior em longo prazo</td>
                    <td className="px-4 py-2 border">Menor em longo prazo</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Ideal para</td>
                    <td className="px-4 py-2 border">Quem precisa de previsibilidade mensal</td>
                    <td className="px-4 py-2 border">Quem busca pagar menos juros no total</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mb-4">Nosso <Link href="/comparativo-amortizacao" className="text-primary hover:underline">simulador comparativo</Link> permite visualizar lado a lado os dois sistemas para o mesmo financiamento, ajudando você a escolher a opção mais vantajosa para seu perfil.</p>
            
            <h2 id="cet" className="text-xl font-semibold text-primary mt-8 mb-3">Custo Efetivo Total (CET) no Financiamento</h2>
            
            <p className="mb-4">Ao simular um financiamento, é fundamental verificar o Custo Efetivo Total (CET), que inclui não apenas os juros, mas também:</p>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>IOF (Imposto sobre Operações Financeiras)</li>
              <li>Tarifas administrativas</li>
              <li>Seguros obrigatórios</li>
              <li>Taxa de cadastro</li>
              <li>Outras despesas associadas ao contrato</li>
            </ul>
            
            <p className="mb-6">Nossos simuladores apresentam o CET sempre que possível, permitindo uma comparação mais realista entre diferentes ofertas de financiamento.</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <p className="text-sm italic">Este simulador é uma ferramenta de cálculo para fins educativos e informativos. As condições reais do seu financiamento podem variar conforme a política da instituição financeira, seu perfil de crédito e outros fatores. Consulte sempre um especialista antes de tomar decisões financeiras.</p>
            </div>
          </div>
          
          <h2 className="font-heading text-2xl font-bold text-primary mb-6">Escolha seu Simulador de Financiamento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <SimulatorCard
              title="Financiamento de Veículos"
              description="Simule o financiamento do seu carro ou moto com prestações fixas pela Tabela Price."
              path="/simulador-financiamento-veiculos"
              imageSrc="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Carro em exposição"
            />
            
            <SimulatorCard
              title="Simulador Caixa"
              description="Compare condições similares às oferecidas pela Caixa Econômica Federal."
              path="/simulador-caixa-financiamento"
              imageSrc="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Prédio com escritório bancário"
            />
            
            <SimulatorCard
              title="Financiamento Imobiliário"
              description="Calcule o financiamento da sua casa ou apartamento com prazos de até 35 anos."
              path="/financiamento-imobiliario"
              imageSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Casa e plantas baixas"
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
              title="Simulador de Refinanciamento"
              description="Calcule a economia ao refinanciar seu veículo para condições mais vantajosas."
              path="/simulador-refinanciamento"
              imageSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Pessoa analisando contrato"
            />
          </div>
          
          <h2 id="perguntas-frequentes" className="text-xl font-semibold text-primary mt-8 mb-3">Perguntas Frequentes sobre Simulador de Financiamento</h2>
          
          <div className="space-y-5 mb-6">
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">Como usar um simulador de financiamento corretamente?</h3>
              <p className="text-neutral-700">Para obter resultados precisos em um simulador de financiamento, reúna informações como valor do bem, percentual de entrada disponível, taxas de juros praticadas no mercado e prazo desejado. Simule diferentes cenários alterando esses parâmetros para encontrar a configuração que melhor se adapta ao seu orçamento.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">Os simuladores disponíveis online são confiáveis?</h3>
              <p className="text-neutral-700">Simuladores online como o nosso utilizam as mesmas fórmulas financeiras que as instituições. No entanto, os resultados são aproximados, pois o valor final pode incluir taxas específicas de cada banco, como seguros e tarifas administrativas. Nosso simulador permite incluir o IOF, mas recomendamos sempre consultar a instituição financeira para valores definitivos.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">Quais informações devo ter em mãos antes de simular um financiamento?</h3>
              <p className="text-neutral-700">Para uma simulação eficaz, tenha em mãos: valor total do bem, valor da entrada disponível, taxa de juros aproximada (pesquise as taxas praticadas pelo mercado), prazo desejado em meses, e sua capacidade de pagamento mensal (recomenda-se que a prestação não ultrapasse 30% da sua renda).</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">O que é o Custo Efetivo Total (CET) e por que é importante?</h3>
              <p className="text-neutral-700">O CET representa o custo real de um financiamento, incluindo não apenas os juros, mas também tarifas, impostos e seguros. É um percentual padronizado que permite comparar diferentes ofertas de crédito de forma justa. Sempre compare o CET, e não apenas a taxa de juros nominal, ao avaliar propostas de financiamento.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Qual é a melhor opção: SAC ou PRICE?</h3>
              <p className="text-neutral-700">A escolha entre SAC e PRICE depende do seu perfil financeiro. O sistema SAC tem parcelas iniciais maiores que diminuem ao longo do tempo, resultando em menos juros no total. Já o sistema PRICE mantém parcelas fixas, facilitando o planejamento orçamentário, mas geralmente resulta em mais juros pagos. Use nosso <Link href="/comparativo-amortizacao" className="text-primary hover:underline">simulador comparativo</Link> para analisar ambos.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}