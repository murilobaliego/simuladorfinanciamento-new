import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, AlertTriangle, Calculator } from "lucide-react";

export default function BlogPost1() {
  return (
    <>
      <Helmet>
        <title>Como Calcular a Taxa de Juros Real do Financiamento | Blog</title>
        <meta name="description" content="Aprenda a calcular a taxa de juros real do financiamento do seu carro. Descubra como os bancos escondem os juros reais e negocie melhores condições." />
        <link rel="canonical" href="https://simuladorfinanciamento.com/blog/calcular-taxa-juros-real-financiamento" />
      </Helmet>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/blog">
          <a className="inline-flex items-center text-primary hover:text-primary-dark mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o blog
          </a>
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">
            Como Calcular a Taxa de Juros Real do Financiamento do Seu Carro
          </h1>
          <div className="flex items-center text-neutral-600">
            <time dateTime="2025-01-10">10 de janeiro de 2025</time>
            <span className="mx-2">•</span>
            <span>12 min de leitura</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-neutral-700 mb-6">
            "Taxa de 1,99% ao mês!" - Você já viu essa propaganda, mas será que é isso mesmo que você vai pagar? Descubra como calcular a taxa real e não caia em armadilhas que podem custar milhares de reais.
          </p>

          <h2>Diferença Entre Taxa Nominal e Taxa Efetiva</h2>
          <p>
            Essa é a primeira pegadinha dos bancos. Existem dois tipos de taxa:
          </p>

          <h3>Taxa Nominal</h3>
          <p>
            É a taxa "de propaganda", aquela que aparece em letras grandes. Ela não considera:
          </p>
          <ul>
            <li>IOF (Imposto sobre Operações Financeiras)</li>
            <li>TAC (Taxa de Abertura de Crédito)</li>
            <li>Seguros obrigatórios</li>
            <li>Tarifas administrativas</li>
          </ul>

          <h3>Taxa Efetiva (CET - Custo Efetivo Total)</h3>
          <p>
            É a taxa REAL que você paga, incluindo TODOS os custos. Por lei, o banco é obrigado a informar o CET, mas geralmente ele aparece em letras pequenas.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-800 mb-2">Exemplo Real</h4>
                <p className="text-sm text-yellow-900">
                  Taxa nominal: 1,99% a.m.<br />
                  CET (taxa efetiva): 3,45% a.m.<br />
                  <strong>Diferença: 73% mais caro do que anunciado!</strong>
                </p>
              </div>
            </div>
          </div>

          <h2>Como os Bancos "Escondem" os Juros Reais</h2>
          
          <h3>1. Anunciam Apenas a Taxa Nominal</h3>
          <p>
            A propaganda mostra "a partir de 1,99% a.m.", mas essa taxa só vale para clientes com score perfeito, entrada de 50% e prazo curto. Para 99% das pessoas, a taxa real é muito maior.
          </p>

          <h3>2. Diluem Custos em Tarifas</h3>
          <p>
            Em vez de aumentar a taxa de juros, cobram:
          </p>
          <ul>
            <li>TAC: R$ 800 a R$ 1.500</li>
            <li>Registro de contrato: R$ 300 a R$ 600</li>
            <li>Avaliação do bem: R$ 200 a R$ 400</li>
            <li>Seguro prestamista: 2% a 5% do valor financiado</li>
          </ul>

          <h3>3. Empurram Seguros "Obrigatórios"</h3>
          <p>
            O único seguro realmente obrigatório é o do veículo. Seguro prestamista, proteção financeira e outros são OPCIONAIS, mas o vendedor raramente deixa isso claro.
          </p>

          <h2>Fórmulas Simplificadas para Cálculo</h2>

          <h3>Método 1: Cálculo Rápido do CET</h3>
          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <p className="font-mono text-sm mb-4">
              CET = [(Valor Total Pago ÷ Valor Financiado) - 1] ÷ Número de Meses × 100
            </p>
            <div className="text-sm text-neutral-700">
              <p className="font-semibold mb-2">Exemplo:</p>
              <ul className="space-y-1">
                <li>Valor financiado: R$ 40.000</li>
                <li>Parcela: R$ 1.200 × 48 meses = R$ 57.600</li>
                <li>Custos iniciais: R$ 2.400</li>
                <li>Total pago: R$ 60.000</li>
              </ul>
              <p className="mt-3 font-semibold">
                CET = [(60.000 ÷ 40.000) - 1] ÷ 48 × 100 = <span className="text-red-600">1,04% a.m.</span>
              </p>
            </div>
          </div>

          <h3>Método 2: Calculando Juros Totais</h3>
          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <p className="font-mono text-sm mb-4">
              Juros Totais = (Parcela × Número de Parcelas + Custos) - Valor Financiado
            </p>
            <div className="text-sm text-neutral-700">
              <p className="font-semibold mb-2">Usando o exemplo anterior:</p>
              <p>
                Juros = (1.200 × 48 + 2.400) - 40.000 = <span className="text-red-600 font-semibold">R$ 20.000</span>
              </p>
              <p className="mt-2">
                Você pagará <strong>50% a mais</strong> do que o valor do carro!
              </p>
            </div>
          </div>

          <h2>Exemplo Prático com Nosso Simulador</h2>
          <p>
            Vamos simular um financiamento real e calcular a taxa efetiva:
          </p>

          <div className="bg-neutral-100 p-6 rounded-lg my-6">
            <h4 className="font-bold mb-3">Cenário: Financiamento de Carro Popular</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-2">Dados do Financiamento:</p>
                <ul className="space-y-1">
                  <li>Valor do carro: R$ 50.000</li>
                  <li>Entrada: R$ 10.000 (20%)</li>
                  <li>Valor financiado: R$ 40.000</li>
                  <li>Prazo: 48 meses</li>
                  <li>Taxa nominal: 1,89% a.m.</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Custos Adicionais:</p>
                <ul className="space-y-1">
                  <li>IOF: R$ 1.352 (3,38%)</li>
                  <li>TAC: R$ 890</li>
                  <li>Seguro prestamista: R$ 2.400</li>
                  <li>Registro: R$ 450</li>
                  <li><strong>Total custos: R$ 5.092</strong></li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-300">
              <p className="font-semibold mb-2">Resultado:</p>
              <ul className="space-y-1 text-sm">
                <li>Parcela mensal: R$ 1.285</li>
                <li>Total das parcelas: R$ 61.680</li>
                <li>Total pago: R$ 66.772 (parcelas + custos)</li>
                <li className="text-red-600 font-bold text-base pt-2">
                  Taxa efetiva (CET): 2,79% a.m. (39,2% a.a.)
                </li>
              </ul>
            </div>
          </div>

          <p>
            Percebeu? A taxa "de 1,89%" na verdade é <strong>2,79%</strong> - quase 50% maior!
          </p>

          <h2>Dicas Para Negociar Taxas Menores</h2>

          <h3>1. Compare Pelo Menos 3 Bancos</h3>
          <p>
            Não aceite a primeira proposta. Bancos diferentes têm taxas muito diferentes para o mesmo perfil.
          </p>

          <h3>2. Aumente a Entrada</h3>
          <p>
            Quanto maior a entrada, menor o risco para o banco e menor a taxa de juros. Uma entrada de 30% pode reduzir a taxa em até 0,5% a.m.
          </p>

          <h3>3. Reduza o Prazo</h3>
          <p>
            Prazos mais curtos têm taxas menores. Se conseguir pagar em 36 meses em vez de 48, pode economizar milhares.
          </p>

          <h3>4. Negocie os Seguros</h3>
          <p>
            Você pode contratar seguros fora do banco. Compare preços e negocie a retirada de seguros opcionais.
          </p>

          <h3>5. Use Seu Score a Favor</h3>
          <p>
            Se seu score é acima de 700, exija taxas melhores. Mostre que você é um bom pagador.
          </p>

          <h3>6. Peça Desconto na TAC</h3>
          <p>
            A TAC é negociável. Muitos bancos reduzem ou até isentam essa taxa para fechar negócio.
          </p>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
            <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center">
              <Calculator className="mr-2" />
              Calcule Sua Taxa Real
            </h3>
            <p className="text-green-900 mb-4">
              Use nosso simulador para descobrir a taxa efetiva real do seu financiamento, incluindo todos os custos.
            </p>
            <Link href="/simulador-financiamento-veiculos">
              <a className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Calcular Taxa Real Agora
              </a>
            </Link>
          </div>

          <h2>Conclusão</h2>
          <p>
            A taxa de juros que aparece na propaganda raramente é a taxa real que você pagará. Sempre peça o CET, calcule o valor total do financiamento e compare diferentes propostas.
          </p>
          <p>
            Lembre-se: cada 0,5% de diferença na taxa pode significar milhares de reais de economia ao longo do financiamento. Vale a pena dedicar tempo para entender e negociar.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link href="/blog">
            <a className="inline-flex items-center text-primary hover:text-primary-dark">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o blog
            </a>
          </Link>
        </div>
      </article>
    </>
  );
}
