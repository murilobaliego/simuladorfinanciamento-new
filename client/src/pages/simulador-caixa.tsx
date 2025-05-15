import { Helmet } from 'react-helmet-async';
import VehicleForm from "@/components/simulators/vehicle-form";
import { Link } from "wouter";

export default function SimuladorCaixa() {
  return (
    <>
      <Helmet>
        <title>Simulador Caixa de Financiamento | Compare com Taxas da Caixa</title>
        <meta name="description" content="Simule e compare financiamentos com condições semelhantes às da Caixa Econômica Federal. Calcule parcelas, juros e amortização para carros, motos e imóveis." />
        <meta name="keywords" content="simulador caixa de financiamento, caixa econômica federal, financiamento caixa, simulador da caixa, financiamento imobiliário caixa, financiamento de veículos caixa" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-caixa-financiamento" />
        <meta property="og:title" content="Simulador Caixa de Financiamento | Compare com Taxas da Caixa" />
        <meta property="og:description" content="Use nosso simulador para comparar condições de financiamento similares às da Caixa Econômica Federal. Veja parcelas, juros e amortização para diversos tipos de financiamento." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/simulador-caixa-financiamento" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Simulador Caixa de Financiamento | Compare com Taxas da Caixa" />
        <meta name="twitter:description" content="Use nosso simulador para comparar condições de financiamento similares às da Caixa Econômica Federal. Veja parcelas, juros e amortização para diversos tipos de financiamento." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador Caixa de Financiamento",
              "url": "https://simuladorfinanciamento.com/simulador-caixa-financiamento",
              "description": "Simule e compare financiamentos com condições semelhantes às da Caixa Econômica Federal.",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "operatingSystem": "Web"
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
                  "name": "Como funciona o financiamento da Caixa Econômica Federal?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A Caixa Econômica Federal oferece diversas linhas de financiamento para veículos e imóveis. O processo geralmente envolve análise de crédito, comprovação de renda e avaliação do bem. As taxas de juros variam conforme o tipo de financiamento, perfil do cliente e condições de mercado."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quais são as taxas atuais de financiamento da Caixa?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As taxas de juros da Caixa Econômica Federal para financiamento de veículos geralmente variam entre 1,09% e 1,99% ao mês. Para financiamento imobiliário, as taxas podem variar entre 7% e 11% ao ano, dependendo do perfil do cliente e da modalidade escolhida (PRICE, SAC, SACRE)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Como posso simular um financiamento da Caixa?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Com nosso simulador online, você pode inserir o valor do financiamento, prazo, taxa de juros e verificar o valor das parcelas, custo total e a evolução do saldo devedor, com condições semelhantes às praticadas pela Caixa Econômica Federal."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <section id="simulador-caixa" className="mb-12 bg-white rounded-lg shadow-md p-6">
          <h1 className="font-heading text-3xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Simulador Caixa de Financiamento</h1>
          
          <div className="mb-8">
            <p className="mb-4">O <strong>simulador Caixa de financiamento</strong> é uma ferramenta que permite comparar condições de financiamento similares às oferecidas pela <strong>Caixa Econômica Federal</strong>, uma das maiores instituições financeiras do Brasil. Com nossa calculadora, você pode simular financiamentos de veículos e imóveis, visualizando prestações, juros e amortização de forma clara e detalhada.</p>
            
            <h2 id="caixa-financiamento" className="text-xl font-semibold text-primary mt-6 mb-3">Como funciona o financiamento da Caixa Econômica Federal</h2>
            
            <p className="mb-4">A Caixa Econômica Federal é reconhecida como uma das principais instituições para financiamento no Brasil, especialmente para imóveis, mas também oferece linhas competitivas para outros bens. Os financiamentos da Caixa possuem características específicas:</p>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li><strong>Taxas de juros competitivas:</strong> Geralmente entre as mais baixas do mercado, especialmente para imóveis</li>
              <li><strong>Sistemas de amortização variados:</strong> Tanto sistema Price (parcelas fixas) quanto SAC (amortização constante)</li>
              <li><strong>Prazos longos:</strong> Principalmente para financiamento imobiliário, com opções de até 35 anos</li>
              <li><strong>Entrada flexível:</strong> Geralmente a partir de 20% do valor do bem, podendo variar conforme a linha de crédito</li>
              <li><strong>Simulação online:</strong> Disponibilidade de simulador no site oficial da instituição</li>
            </ul>
            
            <h2 id="taxas-caixa" className="text-xl font-semibold text-primary mt-6 mb-3">Taxas de Financiamento da Caixa Econômica Federal (2024/2025)</h2>
            
            <p className="mb-4">Nossa ferramenta permite simular financiamentos com taxas próximas às praticadas pela Caixa Econômica Federal. Abaixo, uma tabela comparativa das taxas médias atuais:</p>
            
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
            
            <p className="mt-4 text-sm text-neutral-500 italic">* As taxas são referências aproximadas e podem variar conforme o perfil do cliente, valor financiado e condições de mercado. Para taxas oficiais e atualizadas, consulte diretamente a Caixa Econômica Federal.</p>
            
            <h2 className="text-xl font-semibold text-primary mt-6 mb-3">Como usar nosso simulador para comparar com a Caixa</h2>
            
            <p className="mb-4">Para simular um financiamento com condições similares às da Caixa Econômica Federal, preencha o formulário abaixo com:</p>
            
            <ol className="list-decimal pl-5 mb-4 space-y-2">
              <li><strong>Valor a financiar:</strong> O montante que você precisa para adquirir o bem</li>
              <li><strong>Taxa de juros mensal:</strong> Use as referências da tabela acima para inserir taxas realistas</li>
              <li><strong>Número de parcelas:</strong> Conforme o prazo desejado (observe os prazos máximos de cada modalidade)</li>
              <li><strong>Inclusão do IOF:</strong> Para financiamentos de veículos, marque esta opção</li>
            </ol>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <p className="text-sm italic">Este simulador não é oficial da Caixa Econômica Federal. Trata-se de uma ferramenta independente para cálculos aproximados e comparativos. Para informações oficiais e condições personalizadas, consulte diretamente a Caixa Econômica Federal ou outras instituições financeiras.</p>
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