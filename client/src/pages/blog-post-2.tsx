import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";

export default function BlogPost2() {
  return (
    <>
      <Helmet>
        <title>Tabela Price x SAC: Qual a Melhor Opção? | Blog</title>
        <meta name="description" content="Entenda as diferenças entre Tabela Price e SAC. Descubra qual sistema de amortização é melhor para seu financiamento e economize milhares de reais." />
        <link rel="canonical" href="https://simuladorfinanciamento.com/blog/tabela-price-vs-sac" />
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
            Tabela Price x SAC: Qual a Melhor Opção para Seu Financiamento?
          </h1>
          <div className="flex items-center text-neutral-600">
            <time dateTime="2025-02-12">12 de fevereiro de 2025</time>
            <span className="mx-2">•</span>
            <span>10 min de leitura</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-neutral-700 mb-6">
            Escolher entre Tabela Price e SAC pode fazer você economizar (ou gastar) milhares de reais. Vamos descomplicar esses termos técnicos e mostrar qual sistema é melhor para cada situação.
          </p>

          <h2>O Que É Tabela Price?</h2>
          <p>
            A Tabela Price, também chamada de Sistema Francês de Amortização, é o método mais comum no Brasil. Sua principal característica:
          </p>
          <div className="bg-blue-50 p-4 rounded-lg my-4">
            <p className="font-semibold text-blue-900 mb-2">✓ Parcelas fixas do início ao fim</p>
            <p className="text-sm text-neutral-700">
              Você paga o mesmo valor todos os meses, facilitando o planejamento financeiro.
            </p>
          </div>

          <h3>Como Funciona a Tabela Price</h3>
          <ul>
            <li>Parcelas iguais durante todo o período</li>
            <li>No início, você paga mais juros e menos amortização</li>
            <li>Com o tempo, a proporção se inverte</li>
            <li>Valor total de juros é maior que no SAC</li>
          </ul>

          <div className="bg-neutral-100 p-6 rounded-lg my-6">
            <h4 className="font-bold mb-3">Exemplo Prático - Tabela Price</h4>
            <p className="text-sm mb-2">Financiamento: R$ 50.000 | Taxa: 1,5% a.m. | Prazo: 48 meses</p>
            <ul className="text-sm space-y-1">
              <li>Parcela 1: R$ 1.479 (R$ 750 juros + R$ 729 amortização)</li>
              <li>Parcela 24: R$ 1.479 (R$ 456 juros + R$ 1.023 amortização)</li>
              <li>Parcela 48: R$ 1.479 (R$ 22 juros + R$ 1.457 amortização)</li>
              <li className="font-bold pt-2">Total pago: R$ 70.992</li>
            </ul>
          </div>

          <h2>O Que É SAC (Sistema de Amortização Constante)?</h2>
          <p>
            No SAC, a amortização é sempre a mesma, mas os juros diminuem a cada mês. Resultado:
          </p>
          <div className="bg-green-50 p-4 rounded-lg my-4">
            <p className="font-semibold text-green-900 mb-2 flex items-center">
              <TrendingDown className="mr-2 h-5 w-5" />
              Parcelas decrescentes
            </p>
            <p className="text-sm text-neutral-700">
              As primeiras parcelas são mais altas, mas diminuem mês a mês.
            </p>
          </div>

          <h3>Como Funciona o SAC</h3>
          <ul>
            <li>Amortização fixa em todas as parcelas</li>
            <li>Juros calculados sobre o saldo devedor</li>
            <li>Parcelas diminuem progressivamente</li>
            <li>Valor total de juros é menor que na Price</li>
          </ul>

          <div className="bg-neutral-100 p-6 rounded-lg my-6">
            <h4 className="font-bold mb-3">Exemplo Prático - SAC</h4>
            <p className="text-sm mb-2">Financiamento: R$ 50.000 | Taxa: 1,5% a.m. | Prazo: 48 meses</p>
            <ul className="text-sm space-y-1">
              <li>Parcela 1: R$ 1.792 (R$ 750 juros + R$ 1.042 amortização)</li>
              <li>Parcela 24: R$ 1.406 (R$ 364 juros + R$ 1.042 amortização)</li>
              <li>Parcela 48: R$ 1.058 (R$ 16 juros + R$ 1.042 amortização)</li>
              <li className="font-bold pt-2">Total pago: R$ 68.625</li>
            </ul>
          </div>

          <h2>Comparação Visual: Price vs SAC</h2>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="border-2 border-blue-500 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center">
                <TrendingUp className="mr-2" />
                Tabela Price
              </h3>
              <ul className="text-sm space-y-2">
                <li>✓ Parcelas fixas</li>
                <li>✓ Mais fácil de planejar</li>
                <li>✓ Parcela inicial menor</li>
                <li>✗ Juros totais maiores</li>
                <li>✗ Amortiza devagar no início</li>
              </ul>
              <p className="mt-4 text-xs text-neutral-600">
                <strong>Economia no exemplo:</strong> R$ 0 (base de comparação)
              </p>
            </div>

            <div className="border-2 border-green-500 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center">
                <TrendingDown className="mr-2" />
                SAC
              </h3>
              <ul className="text-sm space-y-2">
                <li>✓ Juros totais menores</li>
                <li>✓ Amortiza mais rápido</li>
                <li>✓ Parcelas diminuem</li>
                <li>✗ Parcela inicial maior</li>
                <li>✗ Exige mais renda no início</li>
              </ul>
              <p className="mt-4 text-xs text-green-700 font-semibold">
                <strong>Economia no exemplo:</strong> R$ 2.367 (3,3% menos)
              </p>
            </div>
          </div>

          <h2>Qual Sistema Escolher?</h2>
          
          <h3>Escolha a Tabela Price se:</h3>
          <ul>
            <li>Você prefere previsibilidade e parcelas fixas</li>
            <li>Sua renda é justa para a parcela inicial</li>
            <li>Não pretende amortizar antecipadamente</li>
            <li>O prazo do financiamento é curto (até 24 meses)</li>
          </ul>

          <h3>Escolha o SAC se:</h3>
          <ul>
            <li>Você tem folga financeira para pagar mais no início</li>
            <li>Quer economizar no total de juros</li>
            <li>Pretende fazer amortizações antecipadas</li>
            <li>O prazo do financiamento é longo (acima de 36 meses)</li>
            <li>Sua renda tende a diminuir no futuro (aposentadoria próxima)</li>
          </ul>

          <h2>Impacto no Valor Total Pago</h2>
          <p>
            Quanto maior o prazo e a taxa de juros, maior a diferença entre os sistemas:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="px-4 py-2 text-left">Prazo</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">SAC</th>
                  <th className="px-4 py-2 text-right">Economia</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">24 meses</td>
                  <td className="px-4 py-2 text-right">R$ 58.450</td>
                  <td className="px-4 py-2 text-right">R$ 57.875</td>
                  <td className="px-4 py-2 text-right text-green-600 font-semibold">R$ 575</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">48 meses</td>
                  <td className="px-4 py-2 text-right">R$ 70.992</td>
                  <td className="px-4 py-2 text-right">R$ 68.625</td>
                  <td className="px-4 py-2 text-right text-green-600 font-semibold">R$ 2.367</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">60 meses</td>
                  <td className="px-4 py-2 text-right">R$ 77.850</td>
                  <td className="px-4 py-2 text-right">R$ 73.875</td>
                  <td className="px-4 py-2 text-right text-green-600 font-semibold">R$ 3.975</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              Compare os Dois Sistemas
            </h3>
            <p className="text-blue-900 mb-4">
              Use nossa calculadora interativa para ver a diferença real entre Price e SAC no seu caso específico.
            </p>
            <Link href="/comparativo-amortizacao">
              <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Comparar Price vs SAC
              </a>
            </Link>
          </div>

          <h2>Conclusão</h2>
          <p>
            Não existe sistema "melhor" em absoluto - existe o melhor para sua situação. O SAC economiza juros, mas exige mais no início. A Price oferece previsibilidade, mas custa mais no total.
          </p>
          <p>
            Faça simulações com ambos os sistemas, compare os valores e escolha aquele que se encaixa melhor no seu orçamento e objetivos financeiros.
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
