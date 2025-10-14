import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, XCircle, CheckCircle } from "lucide-react";

export default function BlogPost3() {
  return (
    <>
      <Helmet>
        <title>7 Erros que Encarecem o Financiamento de Carros | Blog</title>
        <meta name="description" content="Descubra os 7 erros mais comuns que fazem você pagar muito mais caro no financiamento do seu carro. Evite armadilhas e economize milhares de reais." />
        <link rel="canonical" href="https://simuladorfinanciamento.com/blog/erros-financiamento-carros" />
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
            Financiamento de Carros: 7 Erros que Encarecem Sua Compra
          </h1>
          <div className="flex items-center text-neutral-600">
            <time dateTime="2025-03-08">8 de março de 2025</time>
            <span className="mx-2">•</span>
            <span>9 min de leitura</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-neutral-700 mb-6">
            Financiar um carro pode custar milhares de reais a mais se você cometer erros comuns. Veja os 7 principais equívocos que fazem você pagar muito mais caro - e como evitá-los.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
              <XCircle className="mr-2" />
              Erro #1: Não Comparar Taxas Entre Bancos
            </h3>
            <p className="text-red-900 mb-3">
              <strong>O erro:</strong> Aceitar a primeira proposta sem pesquisar outras opções.
            </p>
            <p className="text-red-900 mb-3">
              <strong>O impacto:</strong> Diferenças de 0,5% a 1,5% na taxa mensal são comuns entre bancos. Em um financiamento de R$ 40.000 por 48 meses, isso representa de R$ 2.000 a R$ 6.000 de diferença.
            </p>
            <div className="bg-green-50 p-4 rounded mt-3">
              <p className="text-green-900 font-semibold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Como evitar:
              </p>
              <ul className="text-sm text-green-900 mt-2 space-y-1">
                <li>• Consulte no mínimo 3 bancos diferentes</li>
                <li>• Use simuladores online para comparar</li>
                <li>• Peça o CET (Custo Efetivo Total) de cada proposta</li>
                <li>• Considere cooperativas de crédito (taxas geralmente menores)</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
              <XCircle className="mr-2" />
              Erro #2: Aceitar Seguros Obrigatórios Sem Questionar
            </h3>
            <p className="text-red-900 mb-3">
              <strong>O erro:</strong> Acreditar que todos os seguros oferecidos são obrigatórios.
            </p>
            <p className="text-red-900 mb-3">
              <strong>O impacto:</strong> Seguros opcionais podem adicionar R$ 3.000 a R$ 8.000 ao custo total do financiamento.
            </p>
            <div className="bg-green-50 p-4 rounded mt-3">
              <p className="text-green-900 font-semibold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Como evitar:
              </p>
              <ul className="text-sm text-green-900 mt-2 space-y-1">
                <li>• <strong>Obrigatório:</strong> Apenas o seguro do veículo</li>
                <li>• <strong>Opcional:</strong> Seguro prestamista, proteção financeira, etc.</li>
                <li>• Contrate o seguro do veículo fora do banco (geralmente mais barato)</li>
                <li>• Recuse seguros opcionais ou negocie valores menores</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
              <XCircle className="mr-2" />
              Erro #3: Ignorar o CET (Custo Efetivo Total)
            </h3>
            <p className="text-red-900 mb-3">
              <strong>O erro:</strong> Focar apenas na taxa de juros nominal e no valor da parcela.
            </p>
            <p className="text-red-900 mb-3">
              <strong>O impacto:</strong> O CET pode ser 50% a 100% maior que a taxa nominal anunciada. Uma taxa "de 1,99%" pode na verdade custar 3,5% ao mês.
            </p>
            <div className="bg-green-50 p-4 rounded mt-3">
              <p className="text-green-900 font-semibold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Como evitar:
              </p>
              <ul className="text-sm text-green-900 mt-2 space-y-1">
                <li>• Sempre pergunte: "Qual o CET desta proposta?"</li>
                <li>• Compare propostas pelo CET, não pela taxa nominal</li>
                <li>• O CET inclui IOF, TAC, seguros e todas as tarifas</li>
                <li>• Por lei, o banco é obrigado a informar o CET</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
              <XCircle className="mr-2" />
              Erro #4: Prazo Muito Longo = Juros Astronômicos
            </h3>
            <p className="text-red-900 mb-3">
              <strong>O erro:</strong> Escolher o prazo mais longo possível para ter parcelas menores.
            </p>
            <p className="text-red-900 mb-3">
              <strong>O impacto:</strong> Um financiamento de R$ 40.000 a 1,99% a.m. custa R$ 8.640 de juros em 36 meses, mas R$ 15.360 em 60 meses - 78% a mais!
            </p>
            <div className="bg-green-50 p-4 rounded mt-3">
              <p className="text-green-900 font-semibold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Como evitar:
              </p>
              <ul className="text-sm text-green-900 mt-2 space-y-1">
                <li>• Escolha o menor prazo que cabe no seu orçamento</li>
                <li>• Regra de ouro: parcela não deve ultrapassar 30% da renda</li>
                <li>• Considere aumentar a entrada para reduzir o prazo</li>
                <li>• Simule diferentes prazos e compare o custo total</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
              <XCircle className="mr-2" />
              Erro #5: Esquecer de Negociar a Entrada
            </h3>
            <p className="text-red-900 mb-3">
              <strong>O erro:</strong> Dar a menor entrada possível para "sobrar dinheiro".
            </p>
            <p className="text-red-900 mb-3">
              <strong>O impacto:</strong> Cada R$ 5.000 a mais na entrada pode economizar R$ 2.000 a R$ 3.000 em juros ao longo do financiamento.
            </p>
            <div className="bg-green-50 p-4 rounded mt-3">
              <p className="text-green-900 font-semibold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Como evitar:
              </p>
              <ul className="text-sm text-green-900 mt-2 space-y-1">
                <li>• Entrada ideal: 30% a 40% do valor do veículo</li>
                <li>• Quanto maior a entrada, menor a taxa de juros</li>
                <li>• Use FGTS, 13º salário ou economias para aumentar a entrada</li>
                <li>• Considere vender seu carro usado como parte da entrada</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
              <XCircle className="mr-2" />
              Erro #6: Não Verificar Score de Crédito Antes
            </h3>
            <p className="text-red-900 mb-3">
              <strong>O erro:</strong> Solicitar financiamento sem saber seu score de crédito.
            </p>
            <p className="text-red-900 mb-3">
              <strong>O impacto:</strong> Score baixo pode resultar em taxas 1% a 2% maiores, ou até recusa do financiamento.
            </p>
            <div className="bg-green-50 p-4 rounded mt-3">
              <p className="text-green-900 font-semibold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Como evitar:
              </p>
              <ul className="text-sm text-green-900 mt-2 space-y-1">
                <li>• Consulte seu score gratuitamente (Serasa, Boa Vista)</li>
                <li>• Score acima de 700: negocie taxas melhores</li>
                <li>• Score abaixo de 500: trabalhe para melhorá-lo antes de financiar</li>
                <li>• Pague dívidas atrasadas e regularize seu CPF</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
              <XCircle className="mr-2" />
              Erro #7: Pular a Leitura do Contrato
            </h3>
            <p className="text-red-900 mb-3">
              <strong>O erro:</strong> Assinar o contrato sem ler todas as cláusulas.
            </p>
            <p className="text-red-900 mb-3">
              <strong>O impacto:</strong> Cobranças indevidas, multas por amortização antecipada, seguros não solicitados e outras surpresas desagradáveis.
            </p>
            <div className="bg-green-50 p-4 rounded mt-3">
              <p className="text-green-900 font-semibold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Como evitar:
              </p>
              <ul className="text-sm text-green-900 mt-2 space-y-1">
                <li>• Leia TODO o contrato antes de assinar</li>
                <li>• Verifique se os valores batem com a proposta</li>
                <li>• Confirme que não há multa para amortização antecipada</li>
                <li>• Tire fotos ou peça cópia do contrato</li>
                <li>• Se tiver dúvidas, leve para um advogado analisar</li>
              </ul>
            </div>
          </div>

          <h2>Resumo: Checklist Antes de Financiar</h2>
          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Comparei pelo menos 3 bancos diferentes</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Questionei todos os seguros e mantive apenas os necessários</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Pedi e comparei o CET de todas as propostas</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Escolhi o menor prazo possível dentro do meu orçamento</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Dei a maior entrada que consegui</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Verifiquei meu score de crédito</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Li todo o contrato antes de assinar</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              Simule Antes de Decidir
            </h3>
            <p className="text-blue-900 mb-4">
              Use nosso simulador para comparar diferentes cenários e descobrir qual opção é mais vantajosa para você.
            </p>
            <Link href="/simulador-financiamento-veiculos">
              <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Fazer Simulação Gratuita
              </a>
            </Link>
          </div>

          <h2>Conclusão</h2>
          <p>
            Evitar esses 7 erros pode economizar de R$ 5.000 a R$ 15.000 em um financiamento típico de veículo. Não tenha pressa, pesquise, compare e negocie. Seu bolso agradece!
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
