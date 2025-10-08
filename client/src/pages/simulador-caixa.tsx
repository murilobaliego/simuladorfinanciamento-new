import { Helmet } from 'react-helmet-async';
import VehicleForm from "@/components/simulators/vehicle-form";
import { Link } from "wouter";

export default function SimuladorCaixa() {
  return (
    <>
      <Helmet>
        <title>Simulador Caixa de Financiamento | Taxas CEF, Veículos e Imóveis 2025</title>
        <meta name="description" content="Simulador Caixa de Financiamento oficial com taxas atualizadas da Caixa Econômica Federal. Calcule parcelas, IOF e amortização para veículos, imóveis e MCMV. Compare condições CEF." />
        <meta name="keywords" content="simulador caixa de financiamento, caixa economica federal, simulador da caixa, financiamento caixa, taxas cef, simulador cef" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-caixa-financiamento" />
        <meta property="og:title" content="Simulador Caixa de Financiamento | Taxas CEF 2025" />
        <meta property="og:description" content="Simulador Caixa de Financiamento com taxas atualizadas da CEF. Calcule parcelas, IOF e amortização para veículos, imóveis e MCMV." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/simulador-caixa-financiamento" />
        <meta property="og:image" content="https://simuladorfinanciamento.com/images/simulador-caixa-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Simulador Caixa de Financiamento | Taxas CEF 2025" />
        <meta name="twitter:description" content="Simulador Caixa de Financiamento com taxas atualizadas da CEF. Calcule parcelas, IOF e amortização para veículos, imóveis e MCMV." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador Caixa de Financiamento",
              "alternateName": "Simulador CEF",
              "url": "https://simuladorfinanciamento.com/simulador-caixa-financiamento",
              "description": "Simulador oficial para financiamentos da Caixa Econômica Federal com taxas atualizadas e cálculo de IOF.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "isAccessibleForFree": true,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "featureList": [
                "Taxas atualizadas da Caixa Econômica Federal",
                "Simulação de financiamento de veículos CEF",
                "Simulação de financiamento imobiliário MCMV",
                "Cálculo automático de IOF",
                "Sistemas Price e SAC",
                "Tabela de amortização completa",
                "Comparação com outros bancos"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Clientes interessados em financiamentos da Caixa Econômica Federal"
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
                  "name": "Simulador Caixa de Financiamento",
                  "item": "https://simuladorfinanciamento.com/simulador-caixa-financiamento"
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
                  "name": "Como funciona o simulador Caixa de financiamento?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O simulador Caixa de financiamento calcula parcelas, juros, IOF e amortização usando as taxas atualizadas da Caixa Econômica Federal. Basta inserir valor, taxa CEF e prazo para obter simulação completa."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quais são as taxas da Caixa para financiamento em 2025?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As taxas da Caixa para financiamento de veículos variam de 1,09% a 1,99% ao mês. Para imóveis SBPE: 9,99% a 11,5% ao ano. MCMV: 7,66% a 8,16% ao ano. Use nosso simulador com estas taxas."
                  }
                },
                {
                  "@type": "Question",
                  "name": "O simulador da Caixa inclui IOF?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim, nosso simulador Caixa de financiamento inclui cálculo automático do IOF (0,0082% ao dia + 0,38% fixo) para simulações precisas de financiamentos CEF."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Posso simular MCMV na Caixa?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim, nosso simulador permite simular financiamentos MCMV (Minha Casa Minha Vida) com as taxas subsidiadas da Caixa, que variam de 7,66% a 8,16% ao ano."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 font-bold text-2xl">CEF</span>
            </div>
            <div>
              <h1 className="font-heading text-4xl font-bold mb-2">Simulador Caixa de Financiamento</h1>
              <p className="text-xl opacity-90">Taxas atualizadas da Caixa Econômica Federal para 2025</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">✓ Taxas CEF Oficiais</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">✓ Veículos e Imóveis</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">✓ MCMV Incluído</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">✓ Com IOF</span>
          </div>
        </section>
        
        <section id="simulador-caixa" className="mb-12 bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <p className="mb-4 text-lg">Nosso <strong>simulador Caixa de financiamento</strong> utiliza as taxas oficiais da <strong>Caixa Econômica Federal</strong> para calcular financiamentos de veículos, imóveis e programas habitacionais como MCMV. Compare condições, calcule parcelas e visualize a tabela de amortização completa.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🏠</div>
                <h3 className="font-semibold text-blue-800 mb-2">Imóveis</h3>
                <p className="text-blue-700 text-sm">SBPE, MCMV, Casa Verde Amarela</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🚗</div>
                <h3 className="font-semibold text-green-800 mb-2">Veículos</h3>
                <p className="text-green-700 text-sm">Carros, motos, caminhões novos e usados</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-orange-800 mb-2">Sistemas</h3>
                <p className="text-orange-700 text-sm">Price, SAC e SACRE</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">🏦 Vantagens do Financiamento Caixa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-700">
                  <li>✓ Taxas competitivas do mercado</li>
                  <li>✓ Líder em financiamento imobiliário</li>
                  <li>✓ Programas habitacionais subsidiados</li>
                </ul>
                <ul className="space-y-2 text-blue-700">
                  <li>✓ Prazos de até 35 anos para imóveis</li>
                  <li>✓ Atendimento em todo o Brasil</li>
                  <li>✓ Relacionamento bancário sólido</li>
                </ul>
              </div>
            </div>
            
            <h2 id="taxas-cef-2025" className="text-2xl font-semibold text-primary mt-8 mb-4">Taxas Caixa Econômica Federal 2025 - Tabela Atualizada</h2>
            
            <p className="mb-4">Use nosso <strong>simulador Caixa de financiamento</strong> com as taxas oficiais atualizadas da CEF. Estas são as condições praticadas pela Caixa Econômica Federal:</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="px-4 py-2 border text-left">Tipo de Financiamento</th>
                    <th className="px-4 py-2 border text-center">Taxa Mínima</th>
                    <th className="px-4 py-2 border text-center">Taxa Máxima</th>
                    <th className="px-4 py-2 border text-center">Entrada Mínima</th>
                    <th className="px-4 py-2 border text-center">Prazo Máximo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border">Veículos novos</td>
                    <td className="px-4 py-2 border text-center text-green-600 font-medium">1,09% a.m.</td>
                    <td className="px-4 py-2 border text-center">1,89% a.m.</td>
                    <td className="px-4 py-2 border text-center">20%</td>
                    <td className="px-4 py-2 border text-center">60 meses</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border">Veículos usados</td>
                    <td className="px-4 py-2 border text-center text-green-600 font-medium">1,29% a.m.</td>
                    <td className="px-4 py-2 border text-center">1,99% a.m.</td>
                    <td className="px-4 py-2 border text-center">20%</td>
                    <td className="px-4 py-2 border text-center">48 meses</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Imóveis (SBPE)</td>
                    <td className="px-4 py-2 border text-center text-green-600 font-medium">9,99% a.a.</td>
                    <td className="px-4 py-2 border text-center">11,5% a.a.</td>
                    <td className="px-4 py-2 border text-center">20%</td>
                    <td className="px-4 py-2 border text-center">35 anos</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border">Imóveis (MCMV)</td>
                    <td className="px-4 py-2 border text-center text-green-600 font-medium">7,66% a.a.</td>
                    <td className="px-4 py-2 border text-center">8,16% a.a.</td>
                    <td className="px-4 py-2 border text-center">Variável</td>
                    <td className="px-4 py-2 border text-center">30 anos</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mt-4 text-sm text-neutral-600 italic">* Taxas de referência da Caixa para 2025. Use nosso <strong>simulador Caixa de financiamento</strong> com estas taxas para cálculos precisos.</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded border text-center">
                <h4 className="font-semibold text-green-600 mb-1">Melhor Taxa Veículos</h4>
                <p className="text-2xl font-bold text-green-600">1,09%</p>
                <p className="text-sm text-gray-600">ao mês</p>
              </div>
              <div className="bg-white p-4 rounded border text-center">
                <h4 className="font-semibold text-blue-600 mb-1">MCMV</h4>
                <p className="text-2xl font-bold text-blue-600">7,66%</p>
                <p className="text-sm text-gray-600">ao ano</p>
              </div>
              <div className="bg-white p-4 rounded border text-center">
                <h4 className="font-semibold text-purple-600 mb-1">SBPE</h4>
                <p className="text-2xl font-bold text-purple-600">9,99%</p>
                <p className="text-sm text-gray-600">ao ano</p>
              </div>
              <div className="bg-white p-4 rounded border text-center">
                <h4 className="font-semibold text-orange-600 mb-1">Prazo Máximo</h4>
                <p className="text-2xl font-bold text-orange-600">35</p>
                <p className="text-sm text-gray-600">anos</p>
              </div>
            </div>
            
            <h2 id="como-usar-simulador-cef" className="text-2xl font-semibold text-primary mt-8 mb-4">Como usar o Simulador Caixa de Financiamento</h2>
            
            <p className="mb-4">Siga estes passos para simular seu <strong>financiamento na Caixa Econômica Federal</strong>:</p>
            
            <ol className="list-decimal pl-5 mb-6 space-y-3">
              <li><strong>Valor a financiar:</strong> Digite o valor que precisa financiar (mínimo R$ 10.000 para veículos)</li>
              <li><strong>Taxa CEF:</strong> Use as taxas da tabela acima conforme seu tipo de financiamento</li>
              <li><strong>Prazo:</strong> Escolha o número de parcelas (até 60 meses veículos, 35 anos imóveis)</li>
              <li><strong>IOF:</strong> Marque para incluir o imposto (obrigatório para veículos)</li>
              <li><strong>Resultado:</strong> Visualize parcelas, juros e tabela de amortização CEF</li>
            </ol>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <p className="text-sm italic">Este <strong>simulador Caixa de financiamento</strong> é uma ferramenta independente com taxas de referência da CEF. Para condições oficiais e contratação, consulte diretamente a Caixa Econômica Federal.</p>
            </div>
            
            <div className="flex flex-wrap gap-4 my-6">
              <Link href="/financiamento-veiculo" className="inline-block bg-primary/90 hover:bg-primary text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors text-sm">
                Simular Financiamento de Veículos
              </Link>
              <Link href="/financiamento-imobiliario" className="inline-block bg-primary/90 hover:bg-primary text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors text-sm">
                Simular Financiamento Imobiliário
              </Link>
              <Link href="/comparativo-amortizacao" className="inline-block bg-primary/90 hover:bg-primary text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors text-sm">
                Comparar Price vs. SAC
              </Link>
            </div>
          </div>
          
          <VehicleForm />
          
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-primary mt-6 mb-3">Financiamento Caixa vs. Outros Bancos</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="px-4 py-2 border text-left">Característica</th>
                    <th className="px-4 py-2 border text-center">Caixa Econômica</th>
                    <th className="px-4 py-2 border text-center">Bancos Privados</th>
                    <th className="px-4 py-2 border text-center">Financeiras</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Taxa de juros</td>
                    <td className="px-4 py-2 border text-center">Geralmente mais baixas</td>
                    <td className="px-4 py-2 border text-center">Moderadas</td>
                    <td className="px-4 py-2 border text-center">Mais altas</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-medium">Processo de aprovação</td>
                    <td className="px-4 py-2 border text-center">Pode ser mais longo</td>
                    <td className="px-4 py-2 border text-center">Moderado</td>
                    <td className="px-4 py-2 border text-center">Geralmente mais rápido</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Flexibilidade de prazos</td>
                    <td className="px-4 py-2 border text-center">Alta (especialmente imóveis)</td>
                    <td className="px-4 py-2 border text-center">Moderada</td>
                    <td className="px-4 py-2 border text-center">Baixa a moderada</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-medium">Financiamento máximo</td>
                    <td className="px-4 py-2 border text-center">Até 80% do valor</td>
                    <td className="px-4 py-2 border text-center">70-80% do valor</td>
                    <td className="px-4 py-2 border text-center">Até 100% em casos especiais</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h2 className="text-xl font-semibold text-primary mt-8 mb-3">Perguntas Frequentes sobre Financiamento da Caixa</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Posso financiar 100% do valor do imóvel pela Caixa?</h3>
                <p className="text-neutral-700">Não, a Caixa Econômica Federal geralmente financia até 80% do valor do imóvel, exigindo uma entrada mínima de 20%. Em alguns casos especiais, como programas habitacionais específicos, essa porcentagem pode variar.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Qual o prazo máximo para financiamento de veículos na Caixa?</h3>
                <p className="text-neutral-700">Para veículos novos, a Caixa oferece financiamentos com prazos de até 60 meses (5 anos). Para veículos usados, o prazo máximo geralmente é de 48 meses (4 anos), dependendo do ano do veículo.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">O simulador online da Caixa é preciso?</h3>
                <p className="text-neutral-700">O simulador oficial da Caixa fornece estimativas baseadas em condições padrão. O valor final das parcelas e condições podem variar após análise de crédito e avaliação do bem. Nosso simulador independente oferece cálculos similares para comparação.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Quais documentos são necessários para financiamento na Caixa?</h3>
                <p className="text-neutral-700">Geralmente são necessários: documento de identificação, CPF, comprovante de renda, comprovante de residência, documentação do bem a ser financiado e, no caso de imóveis, documentação do imóvel e do vendedor.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">A Caixa faz portabilidade de financiamento?</h3>
                <p className="text-neutral-700">Sim, a Caixa aceita portabilidade de financiamentos de outras instituições. Isso permite transferir um financiamento existente para a Caixa, geralmente buscando condições mais vantajosas, como taxas de juros menores.</p>
              </div>
            </div>
            
            <div className="mt-8 bg-neutral-100 p-5 rounded-lg">
              <h3 className="font-medium text-lg text-primary">Simule agora mesmo seu financiamento</h3>
              <p className="mb-4">Use nossa calculadora acima para simular diferentes cenários de financiamento e descobrir o que melhor se adapta ao seu orçamento.</p>
              <p>Para mais informações sobre financiamentos específicos, consulte nossas páginas de:</p>
              <ul className="list-disc pl-5 mt-2">
                <li><Link href="/simulador-financiamento-veiculos" className="text-primary hover:underline">Financiamento de Veículos</Link></li>
                <li><Link href="/financiamento-imobiliario" className="text-primary hover:underline">Financiamento Imobiliário</Link></li>
                <li><Link href="/emprestimo-pessoal" className="text-primary hover:underline">Empréstimo Pessoal</Link></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}