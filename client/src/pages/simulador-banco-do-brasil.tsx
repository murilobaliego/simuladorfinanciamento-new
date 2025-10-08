import VehicleForm from "@/components/simulators/vehicle-form";
import { Helmet } from 'react-helmet-async';

export default function SimuladorBancoDoBrasil() {
  return (
    <>
      <Helmet>
        <title>Simulador Banco do Brasil | Financiamento de Veículos e Imóveis 2025</title>
        <meta name="description" content="Simulador Banco do Brasil oficial para financiamento de veículos e imóveis. Compare taxas BB, calcule parcelas e IOF. Condições especiais para correntistas e funcionários públicos." />
        <meta name="keywords" content="simulador banco do brasil, financiamento banco do brasil, simulador bb, taxa banco do brasil, financiamento bb veiculos, simulador bb financiamento" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-banco-do-brasil" />
        <meta property="og:title" content="Simulador Banco do Brasil | Financiamento de Veículos e Imóveis 2025" />
        <meta property="og:description" content="Simulador Banco do Brasil oficial para financiamento de veículos e imóveis. Compare taxas BB, calcule parcelas e IOF com condições especiais." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/simulador-banco-do-brasil" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Simulador Banco do Brasil | Financiamento BB 2025" />
        <meta name="twitter:description" content="Simulador Banco do Brasil oficial para financiamento de veículos e imóveis. Compare taxas BB, calcule parcelas e IOF com condições especiais." />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador Banco do Brasil",
              "url": "https://simuladorfinanciamento.com/simulador-banco-do-brasil",
              "description": "Simulador oficial para financiamentos do Banco do Brasil com taxas atualizadas e condições especiais.",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "operatingSystem": "Web",
              "featureList": [
                "Simulação com taxas BB atualizadas",
                "Condições especiais para correntistas",
                "Cálculo de IOF automático",
                "Tabela Price e SAC",
                "Financiamento de veículos e imóveis",
                "Exportação de relatórios"
              ],
              "provider": {
                "@type": "Organization",
                "name": "Simulador de Financiamento",
                "url": "https://simuladorfinanciamento.com/"
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
                  "name": "Quais são as taxas do Banco do Brasil para financiamento?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As taxas do Banco do Brasil para financiamento de veículos variam de 0,99% a 1,89% ao mês, dependendo do relacionamento com o banco, valor financiado e prazo. Para imóveis, as taxas ficam entre 9,5% e 11,5% ao ano."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Como funciona o financiamento do Banco do Brasil?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O financiamento do Banco do Brasil utiliza principalmente o sistema Tabela Price para veículos e oferece SAC e Price para imóveis. Correntistas têm condições especiais e funcionários públicos podem ter taxas diferenciadas."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual a entrada mínima no Banco do Brasil?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Para veículos, o Banco do Brasil geralmente exige entrada mínima de 20% do valor do bem. Para imóveis, a entrada pode variar de 20% a 30%, dependendo do programa de financiamento utilizado."
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
                  "name": "Simulador Banco do Brasil",
                  "item": "https://simuladorfinanciamento.com/simulador-banco-do-brasil"
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
              "name": "Financiamento Banco do Brasil",
              "description": "Produtos de financiamento do Banco do Brasil para veículos e imóveis",
              "provider": {
                "@type": "BankOrCreditUnion",
                "name": "Banco do Brasil",
                "url": "https://www.bb.com.br"
              },
              "interestRate": {
                "@type": "QuantitativeValue",
                "minValue": 0.99,
                "maxValue": 1.89,
                "unitText": "PERCENT_PER_MONTH"
              },
              "feesAndCommissionsSpecification": "Inclui IOF, TAC e outras taxas conforme tabela do banco"
            }
          `}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <section id="simulador-bb" className="mb-12 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">BB</span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-primary">Simulador Banco do Brasil</h1>
          </div>
          
          <div className="mb-8">
            <p className="mb-4">O <strong>Simulador Banco do Brasil</strong> permite calcular financiamentos com as condições reais praticadas pelo BB, um dos maiores bancos do país. Compare taxas, prazos e condições especiais para correntistas e funcionários públicos.</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">🏦 Vantagens do Banco do Brasil</h2>
              <ul className="text-yellow-700 space-y-1">
                <li>• Taxas competitivas a partir de 0,99% a.m.</li>
                <li>• Condições especiais para correntistas</li>
                <li>• Atendimento em todo território nacional</li>
                <li>• Financiamento de até 100% para alguns perfis</li>
              </ul>
            </div>
            
            <h2 id="taxas-bb" className="text-xl font-semibold text-primary mt-6 mb-3">Taxas do Banco do Brasil 2025</h2>
            
            <p className="mb-4">O <strong>Banco do Brasil</strong> oferece algumas das melhores taxas do mercado, especialmente para clientes com relacionamento bancário. As condições variam conforme o perfil do cliente e o tipo de financiamento.</p>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-yellow-100">
                    <th className="px-4 py-3 border text-left font-semibold">Produto</th>
                    <th className="px-4 py-3 border text-center font-semibold">Taxa Mínima</th>
                    <th className="px-4 py-3 border text-center font-semibold">Taxa Máxima</th>
                    <th className="px-4 py-3 border text-center font-semibold">Prazo Máximo</th>
                    <th className="px-4 py-3 border text-center font-semibold">Entrada Mínima</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 border font-medium">Veículos Novos</td>
                    <td className="px-4 py-3 border text-center text-green-600 font-bold">0,99% a.m.</td>
                    <td className="px-4 py-3 border text-center">1,69% a.m.</td>
                    <td className="px-4 py-3 border text-center">60 meses</td>
                    <td className="px-4 py-3 border text-center">20%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 border font-medium">Veículos Usados</td>
                    <td className="px-4 py-3 border text-center text-green-600 font-bold">1,19% a.m.</td>
                    <td className="px-4 py-3 border text-center">1,89% a.m.</td>
                    <td className="px-4 py-3 border text-center">48 meses</td>
                    <td className="px-4 py-3 border text-center">30%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border font-medium">Imóveis (SBPE)</td>
                    <td className="px-4 py-3 border text-center text-green-600 font-bold">9,5% a.a.</td>
                    <td className="px-4 py-3 border text-center">11,5% a.a.</td>
                    <td className="px-4 py-3 border text-center">35 anos</td>
                    <td className="px-4 py-3 border text-center">20%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 border font-medium">Casa Verde Amarela</td>
                    <td className="px-4 py-3 border text-center text-green-600 font-bold">4,25% a.a.</td>
                    <td className="px-4 py-3 border text-center">7,66% a.a.</td>
                    <td className="px-4 py-3 border text-center">30 anos</td>
                    <td className="px-4 py-3 border text-center">5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-sm text-gray-600 italic mb-6">* Taxas de referência sujeitas a alteração. Consulte o banco para condições atualizadas.</p>
            
            <h2 id="vantagens-correntistas" className="text-xl font-semibold text-primary mt-6 mb-3">Condições Especiais para Correntistas BB</h2>
            
            <p className="mb-4">Clientes do <strong>Banco do Brasil</strong> têm acesso a condições diferenciadas:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">👥 Relacionamento Ouro</h3>
                <p className="text-blue-700 text-sm">Desconto de até 0,3% na taxa de juros para clientes com relacionamento premium.</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">🏛️ Funcionários Públicos</h3>
                <p className="text-green-700 text-sm">Taxas especiais e condições facilitadas para servidores públicos federais, estaduais e municipais.</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">💳 Conta Salário</h3>
                <p className="text-purple-700 text-sm">Vantagens para quem recebe salário no BB, incluindo aprovação mais rápida.</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">🎯 Seguro Prestamista</h3>
                <p className="text-orange-700 text-sm">Proteção opcional com cobertura para morte, invalidez e desemprego.</p>
              </div>
            </div>
            
            <h2 id="como-simular-bb" className="text-xl font-semibold text-primary mt-6 mb-3">Como usar o Simulador BB</h2>
            
            <p className="mb-4">Para simular seu <strong>financiamento Banco do Brasil</strong>, siga estes passos:</p>
            
            <ol className="list-decimal pl-5 mb-4 space-y-2">
              <li><strong>Valor a financiar:</strong> Digite o valor que precisa financiar (mínimo R$ 10.000 para veículos)</li>
              <li><strong>Taxa de juros:</strong> Use as taxas de referência da tabela acima conforme seu perfil</li>
              <li><strong>Prazo:</strong> Escolha o número de parcelas (até 60 meses para veículos)</li>
              <li><strong>IOF:</strong> Marque para incluir o imposto no cálculo</li>
              <li><strong>Calcular:</strong> Veja o resultado com parcelas, juros e tabela de amortização</li>
            </ol>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Dica do Especialista</h3>
              <p className="text-blue-700">Se você é correntista do BB há mais de 12 meses, negocie um desconto na taxa. O relacionamento bancário é um forte diferencial para conseguir melhores condições!</p>
            </div>
            
            <h2 id="documentos-bb" className="text-xl font-semibold text-primary mt-6 mb-3">Documentos Necessários - Banco do Brasil</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">📋 Documentos Pessoais</h3>
                <ul className="text-sm space-y-1">
                  <li>• RG e CPF</li>
                  <li>• Comprovante de residência</li>
                  <li>• Comprovante de renda</li>
                  <li>• Extrato bancário (3 meses)</li>
                  <li>• Declaração de IR (se houver)</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">🚗 Documentos do Veículo</h3>
                <ul className="text-sm space-y-1">
                  <li>• CRLV (Certificado de Registro)</li>
                  <li>• Nota fiscal ou fatura (veículo novo)</li>
                  <li>• Laudo de avaliação (usado)</li>
                  <li>• Proposta da concessionária</li>
                  <li>• Seguro do veículo</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
              <p className="text-sm italic text-yellow-800">Este simulador utiliza taxas de referência do Banco do Brasil. Para condições oficiais e aprovação, consulte uma agência BB ou o site oficial do banco. Os valores calculados são aproximações para fins de planejamento financeiro.</p>
            </div>
          </div>
          
          <VehicleForm />
          
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-primary mt-6 mb-3">Perguntas Frequentes - Banco do Brasil</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Quais são as taxas do Banco do Brasil para financiamento?</h3>
                <p className="text-neutral-700">As taxas do Banco do Brasil para financiamento de veículos variam de 0,99% a 1,89% ao mês, dependendo do relacionamento com o banco, valor financiado e prazo. Para imóveis, as taxas ficam entre 9,5% e 11,5% ao ano.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Como funciona o financiamento do Banco do Brasil?</h3>
                <p className="text-neutral-700">O financiamento do Banco do Brasil utiliza principalmente o sistema Tabela Price para veículos e oferece SAC e Price para imóveis. Correntistas têm condições especiais e funcionários públicos podem ter taxas diferenciadas.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Qual a entrada mínima no Banco do Brasil?</h3>
                <p className="text-neutral-700">Para veículos, o Banco do Brasil geralmente exige entrada mínima de 20% do valor do bem. Para imóveis, a entrada pode variar de 20% a 30%, dependendo do programa de financiamento utilizado.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Posso financiar 100% do veículo no BB?</h3>
                <p className="text-neutral-700">Em casos especiais, o Banco do Brasil pode financiar até 100% do valor do veículo para clientes com excelente relacionamento bancário e alta renda comprovada, mas isso não é a regra geral.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Quanto tempo demora a aprovação no Banco do Brasil?</h3>
                <p className="text-neutral-700">A aprovação do financiamento no BB pode levar de 2 a 7 dias úteis, dependendo da complexidade da análise e da documentação apresentada. Correntistas têm processo mais rápido.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">O BB financia veículos usados?</h3>
                <p className="text-neutral-700">Sim, o Banco do Brasil financia veículos usados com até 8 anos de fabricação, com taxas que variam de 1,19% a 1,89% ao mês e prazo de até 48 meses.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}