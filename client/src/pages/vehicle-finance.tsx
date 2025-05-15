import VehicleForm from "@/components/simulators/vehicle-form";
import { Helmet } from 'react-helmet-async';

export default function VehicleFinance() {
  return (
    <>
      <Helmet>
        <title>Simulador de Financiamento de Veículos 2025 | Calcule Parcelas com IOF</title>
        <meta name="description" content="Use o melhor simulador de financiamento de veículos. Calcule prestações, juros, IOF e tabela de amortização completa. Compare como na Caixa e veja quanto vai pagar por mês no financiamento do seu carro, moto ou caminhão." />
        <meta name="keywords" content="simulador de financiamento de veículos, simulador de financiamento, financiamento de carros, simulador caixa de financiamento, tabela price, simulador de parcelas, cálculo IOF, financiamento de automóveis" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-financiamento-veiculos" />
        <meta property="og:title" content="Simulador de Financiamento de Veículos 2025 | Calcule Parcelas com IOF" />
        <meta property="og:description" content="Use o melhor simulador de financiamento de veículos. Calcule parcelas, juros, IOF e amortização. Compare condições como na Caixa e veja quanto pagará mensalmente." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/simulador-financiamento-veiculos" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Simulador de Financiamento de Veículos 2025 | Cálculo com IOF" />
        <meta name="twitter:description" content="Use o melhor simulador de financiamento de veículos. Calcule parcelas, juros, IOF e amortização. Compare condições como na Caixa e veja quanto pagará mensalmente." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Financiamento de Veículos",
              "url": "https://simuladorfinanciamento.com/simulador-financiamento-veiculos",
              "description": "Simule financiamentos de veículos com cálculo de IOF e tabela de amortização completa.",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "operatingSystem": "Web",
              "featureList": [
                "Cálculo de IOF",
                "Tabela Price",
                "Amortização detalhada",
                "Exportação em PDF e Excel",
                "Comparação entre bancos",
                "Simulação com diferentes prazos"
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
                  "name": "Qual é a melhor taxa de juros para financiamento de veículos?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Atualmente, as melhores taxas para financiamento de veículos no Brasil estão entre 0,99% e 1,99% ao mês, mas isso pode variar conforme seu histórico de crédito, relacionamento bancário e as condições de mercado."
                  }
                },
                {
                  "@type": "Question",
                  "name": "É possível financiar 100% do valor do veículo?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A maioria das instituições financeiras exige uma entrada mínima de 10% a 20% do valor do veículo, mas algumas podem oferecer financiamento de 100% em condições especiais, geralmente com taxas mais altas."
                  }
                },
                {
                  "@type": "Question",
                  "name": "O simulador de financiamento mostra o valor real que vou pagar?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Nosso simulador calcula valores aproximados baseados nas informações fornecidas. O valor final pode incluir outros custos como seguros, tarifas bancárias e impostos específicos que variam conforme a instituição financeira e suas políticas."
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
        <section id="simulador-veiculo" className="mb-12 bg-white rounded-lg shadow-md p-6">
          <h1 className="font-heading text-3xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Simulador de Financiamento de Veículos</h1>
          
          <div className="mb-8">
            <p className="mb-4">O <strong>simulador de financiamento de veículos</strong> é uma ferramenta essencial para quem planeja comprar um carro, moto ou caminhão sem ter o valor total disponível. Com nossa calculadora completa, você pode simular o valor exato das prestações mensais, incluindo o <strong>cálculo de IOF</strong> (Imposto sobre Operações Financeiras) e visualizar toda a evolução do seu saldo devedor através da <strong>Tabela Price</strong>.</p>
            
            <h2 id="como-funciona" className="text-xl font-semibold text-primary mt-6 mb-3">Como funciona o financiamento de veículos no Brasil?</h2>
            
            <p className="mb-4">No Brasil, o financiamento de veículos geralmente utiliza o <strong>sistema de Tabela Price</strong>, também conhecido como Sistema Francês de Amortização. Este método calcula prestações fixas, onde em cada pagamento mensal, uma parte vai para os juros e outra para reduzir o valor principal financiado (amortização).</p>
            
            <p className="mb-4">Quando você financia um veículo, a instituição financeira paga o valor total ao vendedor e você se compromete a pagar este valor em parcelas mensais, acrescidas de juros e impostos como o IOF. O veículo normalmente fica alienado à instituição financeira até que todas as parcelas sejam quitadas.</p>
            
            <h2 id="iof-calculadora" className="text-xl font-semibold text-primary mt-6 mb-3">Entenda o que é o IOF no financiamento de veículos</h2>
            
            <p className="mb-4">O <strong>IOF (Imposto sobre Operações Financeiras)</strong> é um tributo federal que incide sobre operações de crédito, incluindo financiamentos de veículos. Para financiamentos de veículos, o IOF é composto por duas alíquotas:</p>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li><strong>IOF diário:</strong> 0,0082% ao dia, calculado sobre o valor financiado e limitado a 365 dias</li>
              <li><strong>IOF adicional:</strong> 0,38% fixo sobre o valor da operação, independente do prazo</li>
            </ul>
            
            <p className="mb-4">Nosso simulador permite incluir ou excluir o IOF do cálculo, mostrando com transparência quanto este imposto representa no valor total do seu financiamento de veículo.</p>
            
            <h2 className="text-xl font-semibold text-primary mt-6 mb-3">Como usar nosso simulador de financiamento de veículos</h2>
            
            <p className="mb-4">Para simular seu financiamento, preencha o formulário abaixo com:</p>
            
            <ol className="list-decimal pl-5 mb-4 space-y-2">
              <li><strong>Valor a financiar:</strong> O montante que você precisa para adquirir o veículo (descontando a entrada, se houver)</li>
              <li><strong>Taxa de juros mensal:</strong> A taxa aplicada pela instituição financeira (geralmente entre 0,99% e 2,5% para veículos)</li>
              <li><strong>Número de parcelas:</strong> O prazo de pagamento (tipicamente de 24 a 72 meses para veículos)</li>
              <li><strong>Inclusão do IOF:</strong> Marque esta opção para incluir o imposto no cálculo</li>
            </ol>
            
            <p className="mb-4">Após preencher os campos, clique em "Calcular" para visualizar:</p>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Valor da parcela mensal</li>
              <li>Total a pagar ao final do contrato</li>
              <li>Total de juros pagos</li>
              <li>Valor do IOF (quando incluído)</li>
              <li>Tabela completa de amortização, mostrando a evolução do saldo devedor mês a mês</li>
            </ul>
            
            <h2 id="dicas-financiamento" className="text-xl font-semibold text-primary mt-6 mb-3">Dicas para conseguir o melhor financiamento de veículos</h2>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li><strong>Compare taxas:</strong> Pesquise as taxas de juros em diferentes bancos e financeiras</li>
              <li><strong>Aumente a entrada:</strong> Quanto maior a entrada, menor o valor financiado e os juros totais</li>
              <li><strong>Negocie o prazo:</strong> Prazos menores geralmente têm taxas mais baixas</li>
              <li><strong>Verifique o CET:</strong> O Custo Efetivo Total mostra todos os encargos e despesas do financiamento</li>
              <li><strong>Atenção às tarifas:</strong> Considere custos adicionais como TAC, registro de contrato e seguros</li>
              <li><strong>Simule diferentes cenários:</strong> Use nosso simulador para comparar diferentes configurações e encontrar a mais vantajosa</li>
            </ul>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <p className="text-sm italic">Este simulador é uma ferramenta de cálculo para fins educativos e informativos. As condições reais do seu financiamento podem variar conforme a política da instituição financeira, seu perfil de crédito e outros fatores. Consulte sempre um especialista antes de tomar decisões financeiras.</p>
            </div>
          </div>
          
          <VehicleForm />
          
          <div id="melhores-taxas" className="bg-gray-50 p-5 rounded-lg border border-gray-200 my-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Melhores Taxas de Financiamento de Veículos em 2024/2025</h2>
            <p className="mb-3">As taxas de juros para financiamento de veículos variam conforme o banco, o perfil do cliente e as condições de mercado. Abaixo comparamos as taxas médias praticadas pelos principais bancos:</p>
            
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
            
            <p className="mt-4 text-sm text-neutral-500 italic">* As taxas são referências aproximadas e podem variar conforme o perfil do cliente, valor financiado e condições de mercado.</p>
          </div>
          
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-primary mt-6 mb-3">Perguntas Frequentes sobre Financiamento de Veículos</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Qual é a melhor taxa de juros para financiamento de veículos?</h3>
                <p className="text-neutral-700">Atualmente, as melhores taxas para financiamento de veículos no Brasil estão entre 0,99% e 1,99% ao mês, mas isso pode variar conforme seu histórico de crédito, relacionamento bancário e as condições de mercado.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">É possível financiar 100% do valor do veículo?</h3>
                <p className="text-neutral-700">A maioria das instituições financeiras exige uma entrada mínima de 10% a 20% do valor do veículo, mas algumas podem oferecer financiamento de 100% em condições especiais, geralmente com taxas mais altas.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">O que acontece se eu atrasar o pagamento das parcelas?</h3>
                <p className="text-neutral-700">Atrasos geram multa (geralmente 2%), juros de mora diários e podem afetar seu score de crédito. Em caso de atrasos prolongados, o veículo pode ser retomado pela instituição financeira, já que fica alienado durante o período do financiamento.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">Posso quitar meu financiamento de veículo antecipadamente?</h3>
                <p className="text-neutral-700">Sim, a quitação antecipada é permitida por lei no Brasil. Você tem direito a um desconto proporcional nos juros, mas algumas instituições podem cobrar uma taxa de até 2% sobre o valor quitado.</p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium text-lg">O simulador de financiamento mostra o valor real que vou pagar?</h3>
                <p className="text-neutral-700">Nosso simulador calcula valores aproximados baseados nas informações fornecidas. O valor final pode incluir outros custos como seguros, tarifas bancárias e impostos específicos que variam conforme a instituição financeira e suas políticas.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
