import InsuranceForm from "@/components/simulators/insurance-form";
import { Helmet } from 'react-helmet-async';

export default function SimuladorSeguroAutomovel() {
  return (
    <>
      <Helmet>
        <title>Simulador de Seguro de Automóvel | Calcule o Preço do Seu Seguro 2025</title>
        <meta name="description" content="Simulador de seguro de automóvel gratuito e completo. Calcule o preço do seguro do seu carro, compare coberturas e encontre a melhor opção. Inclui todas as seguradoras do Brasil." />
        <meta name="keywords" content="simulador de seguro de automóvel, seguro de carro, preço seguro auto, calculadora seguro veículo, seguro auto online, cotação seguro carro" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-seguro-automovel" />
        <meta property="og:title" content="Simulador de Seguro de Automóvel | Calcule o Preço do Seu Seguro" />
        <meta property="og:description" content="Simulador de seguro de automóvel gratuito. Calcule o preço do seguro do seu carro, compare coberturas e encontre a melhor opção para seu perfil." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/simulador-seguro-automovel" />
        <meta property="og:image" content="https://simuladorfinanciamento.com/images/simulador-seguro-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Simulador de Seguro de Automóvel | Calcule o Preço do Seu Seguro" />
        <meta name="twitter:description" content="Simulador de seguro de automóvel gratuito. Calcule o preço do seguro do seu carro e compare coberturas das principais seguradoras." />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Seguro de Automóvel",
              "alternateName": "Calculadora de Seguro de Carro",
              "url": "https://simuladorfinanciamento.com/simulador-seguro-automovel",
              "description": "Simulador completo para calcular o preço do seguro de automóvel com base no perfil do condutor, características do veículo e coberturas desejadas.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "isAccessibleForFree": true,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "featureList": [
                "Cálculo baseado em fatores reais de risco",
                "Múltiplas opções de cobertura",
                "Análise de perfil do condutor",
                "Comparação de franquias",
                "Descontos por itens de segurança",
                "Cálculo por região (CEP)",
                "Exportação de resultados"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Proprietários de veículos interessados em seguro auto"
              },
              "provider": {
                "@type": "Organization",
                "name": "Simulador de Financiamento",
                "url": "https://simuladorfinanciamento.com"
              }
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
                  "name": "Como funciona o simulador de seguro de automóvel?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O simulador de seguro de automóvel calcula o preço baseado em fatores como valor do veículo, perfil do condutor, região, uso do veículo e coberturas desejadas. O cálculo considera estatísticas reais de sinistralidade do mercado brasileiro."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quais fatores influenciam o preço do seguro auto?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Os principais fatores são: idade e sexo do condutor, tempo de habilitação, valor e tipo do veículo, região (CEP), uso do veículo, itens de segurança (alarme, rastreador, garagem) e coberturas escolhidas."
                  }
                },
                {
                  "@type": "Question",
                  "name": "O simulador considera descontos por segurança?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim, o simulador aplica descontos para garagem fechada (-5%), alarme (-3%) e rastreador (-8%). Estes descontos são baseados na redução real de risco que estes itens proporcionam."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual a diferença entre as franquias?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Franquia baixa (0,5% do valor do veículo) tem prêmio 20% maior, franquia média (1%) é o padrão, e franquia alta (2%) reduz o prêmio em 15%. Quanto maior a franquia, menor o prêmio anual."
                  }
                },
                {
                  "@type": "Question",
                  "name": "O simulador é preciso?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O simulador usa metodologia baseada em dados reais do mercado segurador brasileiro, mas é uma estimativa. O valor final pode variar conforme análise detalhada de cada seguradora e histórico do condutor."
                  }
                }
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
                  "name": "Simulador de Seguro de Automóvel",
                  "item": "https://simuladorfinanciamento.com/simulador-seguro-automovel"
                }
              ]
            }
          `}
        </script>
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "InsuranceAgency",
              "name": "Simulador de Seguro de Automóvel",
              "description": "Ferramenta online para simulação de seguro automotivo",
              "url": "https://simuladorfinanciamento.com/simulador-seguro-automovel",
              "areaServed": "BR",
              "serviceType": "Simulação de Seguro Automotivo",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Tipos de Seguro Automotivo",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Seguro Compreensivo",
                      "description": "Cobertura completa incluindo terceiros, roubo, colisão e incêndio"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Seguro Básico",
                      "description": "Cobertura essencial para responsabilidade civil"
                    }
                  }
                ]
              }
            }
          `}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">Simulador de Seguro de Automóvel</h1>
            <p className="text-xl text-gray-700 mb-4">Calcule o preço do seguro do seu carro de forma gratuita e precisa</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ Gratuito</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Cálculo Preciso</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ Todas as Coberturas</span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">✓ Descontos Incluídos</span>
            </div>
          </div>
        </section>
        
        <section id="simulador-seguro" className="mb-12 bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <p className="mb-4 text-lg">Nosso <strong>simulador de seguro de automóvel</strong> é a ferramenta mais completa do Brasil para calcular o preço do seguro do seu carro. Com base em fatores reais de risco, perfil do condutor e características do veículo, oferecemos uma estimativa precisa do valor do seu seguro auto.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🚗</div>
                <h3 className="font-semibold text-blue-800 mb-2">Todos os Veículos</h3>
                <p className="text-blue-700 text-sm">Carros, SUVs, pickups e veículos de luxo</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="font-semibold text-green-800 mb-2">Perfil Completo</h3>
                <p className="text-green-700 text-sm">Idade, sexo, tempo de habilitação</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold text-orange-800 mb-2">Múltiplas Coberturas</h3>
                <p className="text-orange-700 text-sm">Terceiros, roubo, colisão, assistência</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold text-purple-800 mb-2">Descontos</h3>
                <p className="text-purple-700 text-sm">Garagem, alarme, rastreador</p>
              </div>
            </div>
            
            <h2 id="como-usar-simulador" className="text-2xl font-semibold text-primary mt-8 mb-4">Como usar o Simulador de Seguro de Automóvel</h2>
            
            <p className="mb-4">Usar nosso <strong>simulador de seguro de automóvel</strong> é simples e rápido. Siga estes passos para obter sua cotação personalizada:</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Por que usar nosso Simulador de Seguro de Automóvel?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-yellow-700">
                  <li>✓ Cálculo baseado em dados reais do mercado</li>
                  <li>✓ Considera todos os fatores de risco</li>
                  <li>✓ Múltiplas opções de cobertura</li>
                </ul>
                <ul className="space-y-2 text-yellow-700">
                  <li>✓ Descontos por itens de segurança</li>
                  <li>✓ Análise por região (CEP)</li>
                  <li>✓ Gratuito e sem cadastro</li>
                </ul>
              </div>
            </div>
            
            <ol className="list-decimal pl-5 mb-6 space-y-3">
              <li><strong>Dados do veículo:</strong> Informe valor, ano e tipo do seu carro</li>
              <li><strong>Perfil do condutor:</strong> Idade, sexo, tempo de habilitação e CEP</li>
              <li><strong>Uso e segurança:</strong> Como usa o veículo e quais itens de segurança possui</li>
              <li><strong>Coberturas:</strong> Escolha as proteções que deseja incluir no seguro</li>
              <li><strong>Franquia:</strong> Selecione o valor da franquia (baixa, média ou alta)</li>
              <li><strong>Resultado:</strong> Visualize o preço anual, mensal e detalhes das coberturas</li>
            </ol>
            
            <h2 id="fatores-preco-seguro" className="text-2xl font-semibold text-primary mt-8 mb-4">Fatores que Influenciam o Preço do Seguro Auto</h2>
            
            <p className="mb-4">O <strong>preço do seguro de automóvel</strong> é calculado com base em diversos fatores de risco. Nosso simulador considera todos estes elementos para fornecer uma cotação precisa:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">Fatores do Condutor</h4>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• <strong>Idade:</strong> Condutores jovens (18-25) pagam mais</li>
                  <li>• <strong>Sexo:</strong> Estatísticas de sinistralidade por gênero</li>
                  <li>• <strong>Tempo de habilitação:</strong> Mais experiência = menor risco</li>
                  <li>• <strong>Histórico de sinistros:</strong> Influencia diretamente o preço</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Fatores do Veículo</h4>
                <ul className="space-y-2 text-blue-700 text-sm">
                  <li>• <strong>Valor:</strong> Veículos mais caros têm prêmios maiores</li>
                  <li>• <strong>Tipo:</strong> SUVs e esportivos custam mais para segurar</li>
                  <li>• <strong>Ano:</strong> Veículos mais novos têm seguro mais caro</li>
                  <li>• <strong>Índice de roubo:</strong> Modelos mais visados custam mais</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Fatores Regionais</h4>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>• <strong>CEP:</strong> Regiões com mais violência custam mais</li>
                  <li>• <strong>Trânsito:</strong> Cidades com mais acidentes</li>
                  <li>• <strong>Índices de criminalidade:</strong> Roubo e furto por região</li>
                  <li>• <strong>Densidade populacional:</strong> Áreas urbanas vs rurais</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-3">Itens de Segurança</h4>
                <ul className="space-y-2 text-purple-700 text-sm">
                  <li>• <strong>Garagem fechada:</strong> Desconto de até 5%</li>
                  <li>• <strong>Alarme:</strong> Redução de 3% no prêmio</li>
                  <li>• <strong>Rastreador:</strong> Maior desconto, até 8%</li>
                  <li>• <strong>Bloqueador:</strong> Proteção adicional contra roubo</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <p className="text-sm italic">Este <strong>simulador de seguro de automóvel</strong> é uma ferramenta gratuita para fins educativos. Os valores são estimativas baseadas em dados do mercado segurador brasileiro. Para cotações oficiais, consulte diretamente as seguradoras.</p>
            </div>
          </div>
          
          <InsuranceForm />
          
          <div id="tipos-cobertura" className="bg-gray-50 p-6 rounded-lg border border-gray-200 my-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Tipos de Cobertura do Seguro Auto</h2>
            <p className="mb-4">Entenda as principais <strong>coberturas do seguro de automóvel</strong> disponíveis no mercado brasileiro:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold text-green-600 mb-2">Coberturas Básicas</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Responsabilidade Civil:</strong> Danos a terceiros (obrigatório)</li>
                  <li><strong>Roubo e Furto:</strong> Proteção contra crimes</li>
                  <li><strong>Colisão:</strong> Acidentes de trânsito</li>
                  <li><strong>Incêndio:</strong> Danos por fogo e raio</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold text-blue-600 mb-2">Coberturas Adicionais</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Assistência 24h:</strong> Guincho, pane seca, chaveiro</li>
                  <li><strong>Carro Reserva:</strong> Veículo substituto</li>
                  <li><strong>Vidros:</strong> Quebra de para-brisa e vidros</li>
                  <li><strong>Acessórios:</strong> Som, rodas, equipamentos</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-100 p-4 rounded border border-yellow-300">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Dica Importante sobre Franquia</h4>
              <p className="text-yellow-700 text-sm">A franquia é o valor que você paga em caso de sinistro. Franquias mais altas reduzem o prêmio anual, mas aumentam seu custo em caso de acidente. Escolha baseado no seu perfil de risco e capacidade financeira.</p>
            </div>
          </div>
          
          <div id="seguradoras-brasil" className="bg-gray-50 p-6 rounded-lg border border-gray-200 my-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Principais Seguradoras de Auto no Brasil 2025</h2>
            <p className="mb-4">Compare as <strong>melhores seguradoras de automóvel</strong> do mercado brasileiro:</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="px-4 py-2 border text-left">Seguradora</th>
                    <th className="px-4 py-2 border text-center">Market Share</th>
                    <th className="px-4 py-2 border text-center">Nota SUSEP</th>
                    <th className="px-4 py-2 border text-center">Especialidade</th>
                    <th className="px-4 py-2 border text-center">Destaque</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Porto Seguro</td>
                    <td className="px-4 py-2 border text-center">18,5%</td>
                    <td className="px-4 py-2 border text-center text-green-600">A+</td>
                    <td className="px-4 py-2 border text-center">Geral</td>
                    <td className="px-4 py-2 border text-center">Líder de mercado</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-medium">Bradesco Seguros</td>
                    <td className="px-4 py-2 border text-center">16,2%</td>
                    <td className="px-4 py-2 border text-center text-green-600">A</td>
                    <td className="px-4 py-2 border text-center">Bancassurance</td>
                    <td className="px-4 py-2 border text-center">Rede bancária</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Allianz</td>
                    <td className="px-4 py-2 border text-center">12,8%</td>
                    <td className="px-4 py-2 border text-center text-green-600">A+</td>
                    <td className="px-4 py-2 border text-center">Premium</td>
                    <td className="px-4 py-2 border text-center">Veículos de luxo</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-medium">SulAmérica</td>
                    <td className="px-4 py-2 border text-center">11,4%</td>
                    <td className="px-4 py-2 border text-center text-green-600">A</td>
                    <td className="px-4 py-2 border text-center">Corporativo</td>
                    <td className="px-4 py-2 border text-center">Frotas</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Itaú Seguros</td>
                    <td className="px-4 py-2 border text-center">9,7%</td>
                    <td className="px-4 py-2 border text-center text-green-600">A</td>
                    <td className="px-4 py-2 border text-center">Bancassurance</td>
                    <td className="px-4 py-2 border text-center">Clientes Itaú</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mt-4 text-sm text-neutral-600 italic">* Dados baseados em participação de mercado e avaliações da SUSEP. Use nosso <strong>simulador de seguro de automóvel</strong> para comparar preços entre diferentes perfis.</p>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-primary mb-6">Perguntas Frequentes - Simulador de Seguro de Automóvel</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Como funciona o simulador de seguro de automóvel?</h3>
                <p className="text-neutral-700">Nosso <strong>simulador de seguro de automóvel</strong> calcula o preço baseado em fatores como valor do veículo, perfil do condutor, região, uso do veículo e coberturas desejadas. O cálculo considera estatísticas reais de sinistralidade do mercado brasileiro.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Quais fatores influenciam o preço do seguro auto?</h3>
                <p className="text-neutral-700">Os principais fatores são: <strong>idade e sexo do condutor</strong>, tempo de habilitação, valor e tipo do veículo, região (CEP), uso do veículo, itens de segurança (alarme, rastreador, garagem) e coberturas escolhidas.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">O simulador considera descontos por segurança?</h3>
                <p className="text-neutral-700">Sim, o simulador aplica descontos para <strong>garagem fechada (-5%)</strong>, alarme (-3%) e rastreador (-8%). Estes descontos são baseados na redução real de risco que estes itens proporcionam.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Qual a diferença entre as franquias?</h3>
                <p className="text-neutral-700"><strong>Franquia baixa</strong> (0,5% do valor do veículo) tem prêmio 20% maior, franquia média (1%) é o padrão, e franquia alta (2%) reduz o prêmio em 15%. Quanto maior a franquia, menor o prêmio anual.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Por que condutores jovens pagam mais?</h3>
                <p className="text-neutral-700">Condutores entre 18-25 anos têm <strong>estatisticamente mais acidentes</strong> devido à inexperiência. O simulador aplica um fator de risco maior para esta faixa etária, seguindo padrões do mercado segurador.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">O simulador é preciso?</h3>
                <p className="text-neutral-700">O simulador usa <strong>metodologia baseada em dados reais</strong> do mercado segurador brasileiro, mas é uma estimativa. O valor final pode variar conforme análise detalhada de cada seguradora e histórico do condutor.</p>
              </div>
            </div>
          </div>
          
          {/* Additional SEO Content */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">Vantagens do Nosso Simulador de Seguro de Automóvel</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Precisão</h3>
                <p className="text-sm text-gray-600">Cálculos baseados em dados reais do mercado</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🆓</div>
                <h3 className="font-semibold mb-1">Gratuito</h3>
                <p className="text-sm text-gray-600">100% gratuito, sem cadastro ou limites</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold mb-1">Completo</h3>
                <p className="text-sm text-gray-600">Todas as coberturas e fatores de risco</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold mb-1">Seguro</h3>
                <p className="text-sm text-gray-600">Seus dados não são armazenados</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}