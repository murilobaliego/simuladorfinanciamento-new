import VehicleForm2025 from "@/components/simulators/vehicle-form-2025";
import { Helmet } from 'react-helmet-async';

export default function VehicleFinance() {
  return (
    <>
      <Helmet>
        <title>Simulador de Financiamento de Veículos | Calcule Parcelas, IOF e Juros 2025</title>
        <meta name="description" content="Simulador de financiamento de veículos gratuito e completo. Calcule parcelas, IOF, juros e tabela de amortização para carros, motos e caminhões. Compare taxas dos principais bancos do Brasil." />
        <meta name="keywords" content="simulador de financiamento de veículos, financiamento de carros, calculadora financiamento veículos, simulador parcelas carro, tabela price veículos, IOF financiamento" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-financiamento-veiculos" />
        <meta property="og:title" content="Simulador de Financiamento de Veículos | Calcule Parcelas e IOF" />
        <meta property="og:description" content="Simulador de financiamento de veículos gratuito. Calcule parcelas, IOF, juros e tabela de amortização para carros, motos e caminhões. Compare taxas dos principais bancos." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/simulador-financiamento-veiculos" />
        <meta property="og:image" content="https://simuladorfinanciamento.com/images/simulador-veiculos-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Simulador de Financiamento de Veículos | Calcule Parcelas e IOF" />
        <meta name="twitter:description" content="Simulador de financiamento de veículos gratuito. Calcule parcelas, IOF, juros e tabela de amortização para carros, motos e caminhões." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Financiamento de Veículos",
              "alternateName": "Calculadora de Financiamento de Carros",
              "url": "https://simuladorfinanciamento.com/simulador-financiamento-veiculos",
              "description": "Simulador completo para financiamento de veículos com cálculo de IOF, tabela Price e comparação de taxas bancárias.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "isAccessibleForFree": true,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "featureList": [
                "Cálculo automático de IOF",
                "Sistema Tabela Price",
                "Tabela de amortização completa",
                "Comparação de taxas bancárias",
                "Exportação em PDF e Excel",
                "Simulação para carros, motos e caminhões",
                "Cálculo de CET (Custo Efetivo Total)"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Consumidores interessados em financiamento de veículos"
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
                  "name": "Como funciona o simulador de financiamento de veículos?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O simulador de financiamento de veículos calcula automaticamente o valor das parcelas, juros, IOF e tabela de amortização. Basta inserir o valor a financiar, taxa de juros e prazo desejado para obter uma simulação completa."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quais veículos posso simular no financiamento?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Nosso simulador de financiamento de veículos funciona para carros novos e usados, motos, caminhões, ônibus e outros veículos automotores. As taxas podem variar conforme o tipo e idade do veículo."
                  }
                },
                {
                  "@type": "Question",
                  "name": "O simulador inclui o cálculo do IOF?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim, nosso simulador de financiamento de veículos inclui o cálculo automático do IOF (0,0082% ao dia + 0,38% fixo), permitindo uma simulação mais precisa do custo total do financiamento."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual a melhor taxa para financiamento de veículos em 2025?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As melhores taxas para financiamento de veículos em 2025 estão entre 0,99% e 1,89% ao mês nos principais bancos como Banco do Brasil e Caixa, variando conforme relacionamento bancário e perfil de crédito."
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
                  "name": "Simulador de Financiamento de Veículos",
                  "item": "https://simuladorfinanciamento.com/simulador-financiamento-veiculos"
                }
              ]
            }
          `}
        </script>
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              "name": "Financiamento de Veículos",
              "description": "Financiamento para aquisição de carros, motos e caminhões com taxas competitivas",
              "category": "Financiamento Automotivo",
              "interestRate": {
                "@type": "QuantitativeValue",
                "minValue": 0.99,
                "maxValue": 2.5,
                "unitText": "PERCENT_PER_MONTH"
              },
              "feesAndCommissionsSpecification": "Inclui IOF de 0,0082% ao dia mais 0,38% fixo sobre o valor da operação",
              "termsOfService": "https://simuladorfinanciamento.com/termos-de-uso"
            }
          `}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">Simulador de Financiamento de Veículos</h1>
            <p className="text-xl text-gray-700 mb-4">Calcule parcelas, IOF e juros do seu financiamento de forma gratuita e precisa</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ Gratuito</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Com IOF</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ Tabela Completa</span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">✓ Todos os Veículos</span>
            </div>
          </div>
        </section>
        
        <section id="simulador-veiculo" className="mb-12 bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <p className="mb-4 text-lg">Nosso <strong>simulador de financiamento de veículos</strong> é a ferramenta mais completa do Brasil para calcular financiamentos de carros, motos e caminhões. Com cálculo automático de <strong>IOF</strong>, tabela de amortização detalhada e comparação de taxas dos principais bancos.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🚗</div>
                <h3 className="font-semibold text-blue-800 mb-2">Carros</h3>
                <p className="text-blue-700 text-sm">Novos e usados, nacionais e importados</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🏍️</div>
                <h3 className="font-semibold text-green-800 mb-2">Motos</h3>
                <p className="text-green-700 text-sm">Todas as cilindradas e marcas</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🚛</div>
                <h3 className="font-semibold text-orange-800 mb-2">Caminhões</h3>
                <p className="text-orange-700 text-sm">Veículos comerciais e pesados</p>
              </div>
            </div>
            
            <h2 id="como-usar-simulador" className="text-2xl font-semibold text-primary mt-8 mb-4">Como usar o Simulador de Financiamento de Veículos</h2>
            
            <p className="mb-4">Usar nosso <strong>simulador de financiamento de veículos</strong> é simples e rápido. Siga estes passos para obter sua simulação completa:</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Por que usar nosso Simulador de Financiamento de Veículos?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-yellow-700">
                  <li>✓ Cálculo preciso com IOF incluído</li>
                  <li>✓ Tabela de amortização completa</li>
                  <li>✓ Comparação de taxas bancárias</li>
                </ul>
                <ul className="space-y-2 text-yellow-700">
                  <li>✓ Exportação em PDF e Excel</li>
                  <li>✓ Gratuito e sem cadastro</li>
                  <li>✓ Atualizado com taxas 2025</li>
                </ul>
              </div>
            </div>
            
            <ol className="list-decimal pl-5 mb-6 space-y-3">
              <li><strong>Valor a financiar:</strong> Digite o valor do veículo que deseja financiar (mínimo R$ 5.000)</li>
              <li><strong>Taxa de juros:</strong> Informe a taxa mensal oferecida pelo banco (use nossa tabela de referência abaixo)</li>
              <li><strong>Prazo:</strong> Escolha o número de parcelas (recomendamos de 24 a 60 meses)</li>
              <li><strong>IOF:</strong> Marque para incluir o Imposto sobre Operações Financeiras no cálculo</li>
              <li><strong>Resultado:</strong> Visualize parcelas, juros totais e tabela de amortização completa</li>
            </ol>
            
            <h2 id="iof-financiamento" className="text-2xl font-semibold text-primary mt-8 mb-4">IOF no Financiamento de Veículos</h2>
            
            <p className="mb-4">O <strong>IOF (Imposto sobre Operações Financeiras)</strong> é obrigatório em financiamentos de veículos e nosso simulador calcula automaticamente:</p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">IOF Diário</h4>
                  <p className="text-red-700 text-sm">0,0082% ao dia sobre o valor financiado (limitado a 365 dias)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">IOF Adicional</h4>
                  <p className="text-red-700 text-sm">0,38% fixo sobre o valor total da operação</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <p className="text-sm italic">Este <strong>simulador de financiamento de veículos</strong> é uma ferramenta gratuita para fins educativos. Os valores são aproximações baseadas nos dados informados. Para condições oficiais, consulte diretamente as instituições financeiras.</p>
            </div>
          </div>
          
          <VehicleForm2025 />
          
          <div id="melhores-taxas" className="bg-gray-50 p-6 rounded-lg border border-gray-200 my-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Taxas de Financiamento de Veículos 2025 - Principais Bancos</h2>
            <p className="mb-4">Compare as <strong>melhores taxas para financiamento de veículos</strong> dos principais bancos brasileiros. Use estas informações em nosso simulador para obter cálculos mais precisos:</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="px-4 py-2 border text-left">Banco/Financeira</th>
                    <th className="px-4 py-2 border text-center">Taxa Mínima (a.m.)</th>
                    <th className="px-4 py-2 border text-center">Taxa Máxima (a.m.)</th>
                    <th className="px-4 py-2 border text-center">Entrada Mínima</th>
                    <th className="px-4 py-2 border text-center">Prazo Máximo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border">Banco do Brasil</td>
                    <td className="px-4 py-2 border text-center text-green-600 font-medium">0,99%</td>
                    <td className="px-4 py-2 border text-center">1,89%</td>
                    <td className="px-4 py-2 border text-center">20%</td>
                    <td className="px-4 py-2 border text-center">60 meses</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border">Caixa Econômica</td>
                    <td className="px-4 py-2 border text-center text-green-600 font-medium">1,09%</td>
                    <td className="px-4 py-2 border text-center">1,99%</td>
                    <td className="px-4 py-2 border text-center">20%</td>
                    <td className="px-4 py-2 border text-center">60 meses</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Itaú</td>
                    <td className="px-4 py-2 border text-center text-green-600 font-medium">1,19%</td>
                    <td className="px-4 py-2 border text-center">1,99%</td>
                    <td className="px-4 py-2 border text-center">10%</td>
                    <td className="px-4 py-2 border text-center">60 meses</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border">Bradesco</td>
                    <td className="px-4 py-2 border text-center text-green-600 font-medium">1,29%</td>
                    <td className="px-4 py-2 border text-center">2,19%</td>
                    <td className="px-4 py-2 border text-center">20%</td>
                    <td className="px-4 py-2 border text-center">60 meses</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Santander</td>
                    <td className="px-4 py-2 border text-center text-green-600 font-medium">1,39%</td>
                    <td className="px-4 py-2 border text-center">2,39%</td>
                    <td className="px-4 py-2 border text-center">20%</td>
                    <td className="px-4 py-2 border text-center">60 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mt-4 text-sm text-neutral-600 italic">* Taxas de referência para 2025. Use nosso <strong>simulador de financiamento de veículos</strong> com estas taxas para obter cálculos precisos.</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border text-center">
                <h4 className="font-semibold text-green-600 mb-1">Melhor Taxa</h4>
                <p className="text-2xl font-bold text-green-600">0,99%</p>
                <p className="text-sm text-gray-600">Banco do Brasil</p>
              </div>
              <div className="bg-white p-4 rounded border text-center">
                <h4 className="font-semibold text-blue-600 mb-1">Taxa Média</h4>
                <p className="text-2xl font-bold text-blue-600">1,49%</p>
                <p className="text-sm text-gray-600">Mercado geral</p>
              </div>
              <div className="bg-white p-4 rounded border text-center">
                <h4 className="font-semibold text-orange-600 mb-1">Prazo Máximo</h4>
                <p className="text-2xl font-bold text-orange-600">60</p>
                <p className="text-sm text-gray-600">meses</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-primary mb-6">Perguntas Frequentes - Simulador de Financiamento de Veículos</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Como funciona o simulador de financiamento de veículos?</h3>
                <p className="text-neutral-700">Nosso <strong>simulador de financiamento de veículos</strong> calcula automaticamente parcelas, juros, IOF e tabela de amortização. Basta inserir valor, taxa e prazo para obter uma simulação completa e gratuita.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Quais veículos posso simular?</h3>
                <p className="text-neutral-700">O simulador funciona para <strong>carros novos e usados, motos, caminhões</strong> e outros veículos. As taxas variam conforme tipo, idade e valor do veículo.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">O simulador inclui o IOF?</h3>
                <p className="text-neutral-700">Sim, nosso <strong>simulador de financiamento de veículos</strong> inclui cálculo automático do IOF (0,0082% ao dia + 0,38% fixo) para simulações mais precisas.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Qual a melhor taxa em 2025?</h3>
                <p className="text-neutral-700">As <strong>melhores taxas para financiamento de veículos</strong> estão entre 0,99% (Banco do Brasil) e 1,89% ao mês, variando conforme relacionamento bancário e perfil de crédito.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Posso financiar 100% do veículo?</h3>
                <p className="text-neutral-700">A maioria dos bancos exige entrada de 20-30%. Alguns oferecem 100% do financiamento para clientes especiais, mas com taxas mais altas.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">O simulador é confiável?</h3>
                <p className="text-neutral-700">Nosso <strong>simulador de financiamento de veículos</strong> usa fórmulas oficiais da Tabela Price e cálculos precisos de IOF, fornecendo resultados confiáveis para planejamento financeiro.</p>
              </div>
            </div>
          </div>
          
          {/* Additional SEO Content */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">Vantagens do Nosso Simulador de Financiamento de Veículos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Precisão</h3>
                <p className="text-sm text-gray-600">Cálculos exatos com IOF e juros compostos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🆓</div>
                <h3 className="font-semibold mb-1">Gratuito</h3>
                <p className="text-sm text-gray-600">100% gratuito, sem cadastro ou limites</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold mb-1">Completo</h3>
                <p className="text-sm text-gray-600">Tabela de amortização detalhada</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold mb-1">Atualizado</h3>
                <p className="text-sm text-gray-600">Taxas e informações de 2025</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
