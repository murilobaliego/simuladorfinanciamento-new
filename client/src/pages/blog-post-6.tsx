import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, CheckCircle, AlertTriangle, Calculator } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function SaldoDevedorCalculator() {
  const [valorFinanciado, setValorFinanciado] = useState("");
  const [taxa, setTaxa] = useState("");
  const [totalParcelas, setTotalParcelas] = useState("");
  const [parcelasPagas, setParcelasPagas] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const calcularSaldoDevedor = () => {
    const PV = parseFloat(valorFinanciado.replace(/\./g, "").replace(",", "."));
    const i = parseFloat(taxa.replace(",", ".")) / 100;
    const n = parseInt(totalParcelas);
    const p = parseInt(parcelasPagas);

    if (isNaN(PV) || isNaN(i) || isNaN(n) || isNaN(p) || i <= 0 || n <= 0 || p < 0 || p >= n) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // Cálculo do saldo devedor: SD = PV × [(1+i)^n - (1+i)^p] / [(1+i)^n - 1]
    const fatorN = Math.pow(1 + i, n);
    const fatorP = Math.pow(1 + i, p);
    const saldoDevedor = PV * ((fatorN - fatorP) / (fatorN - 1));

    setResultado(saldoDevedor);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg my-6 border-2 border-blue-200">
      <h4 className="font-bold text-lg mb-4 text-blue-900">Calculadora de Saldo Devedor</h4>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="valorFinanciado" className="text-sm font-semibold">Valor Financiado Original (R$)</Label>
          <Input
            id="valorFinanciado"
            type="text"
            placeholder="40.000,00"
            value={valorFinanciado}
            onChange={(e) => setValorFinanciado(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="taxa" className="text-sm font-semibold">Taxa de Juros Mensal (%)</Label>
          <Input
            id="taxa"
            type="text"
            placeholder="1,8"
            value={taxa}
            onChange={(e) => setTaxa(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="totalParcelas" className="text-sm font-semibold">Total de Parcelas</Label>
          <Input
            id="totalParcelas"
            type="number"
            placeholder="48"
            value={totalParcelas}
            onChange={(e) => setTotalParcelas(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="parcelasPagas" className="text-sm font-semibold">Parcelas Já Pagas</Label>
          <Input
            id="parcelasPagas"
            type="number"
            placeholder="24"
            value={parcelasPagas}
            onChange={(e) => setParcelasPagas(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <Button 
        onClick={calcularSaldoDevedor}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        <Calculator className="mr-2 h-4 w-4" />
        Calcular Saldo Devedor
      </Button>

      {resultado !== null && (
        <div className="mt-6 p-4 bg-white rounded-lg border-2 border-green-500">
          <p className="text-sm text-neutral-600 mb-2">Seu saldo devedor atual é:</p>
          <p className="text-3xl font-bold text-green-700">{formatarMoeda(resultado)}</p>
          <p className="text-xs text-neutral-500 mt-2">
            Este é o valor que você precisa pagar para quitar o financiamento hoje.
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-100 rounded text-xs text-blue-900">
        <p className="font-semibold mb-1">ℹ️ Como usar:</p>
        <ul className="space-y-1 ml-4">
          <li>• Informe o valor que você financiou originalmente</li>
          <li>• Digite a taxa de juros (ex: 1,8 para 1,8% ao mês)</li>
          <li>• Total de parcelas do contrato original</li>
          <li>• Quantas parcelas você já pagou</li>
        </ul>
      </div>
    </div>
  );
}

export default function BlogPost6() {
  return (
    <>
      <Helmet>
        <title>Como Quitar Financiamento Antecipadamente: Guia Completo 2025 | Blog</title>
        <meta name="description" content="Descubra como quitar seu financiamento antecipadamente, calcular o saldo devedor correto, economizar em juros e evitar armadilhas. Guia completo com exemplos práticos." />
        <link rel="canonical" href="https://simuladorfinanciamento.com/blog/como-quitar-financiamento-antecipadamente" />
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
            Como Quitar Financiamento Antecipadamente: Guia Completo 2025
          </h1>
          <div className="flex items-center text-neutral-600">
            <time dateTime="2025-06-18">18 de junho de 2025</time>
            <span className="mx-2">•</span>
            <span>11 min de leitura</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-neutral-700 mb-6">
            Quitar um financiamento antecipadamente pode economizar milhares de reais em juros. Mas é preciso saber calcular o valor correto, entender seus direitos e evitar armadilhas. Veja o guia completo.
          </p>

          <h2>Vantagens de Quitar Antecipadamente</h2>
          <div className="bg-green-50 p-6 rounded-lg my-6">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Economia significativa em juros:</strong> Você deixa de pagar todos os juros das parcelas futuras
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Liberdade financeira:</strong> Elimina uma dívida mensal do orçamento
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Melhora do score de crédito:</strong> Quitação antecipada é vista positivamente pelos bureaus
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Propriedade plena do bem:</strong> Remove alienação e permite vender o veículo/imóvel livremente
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Redução de seguros:</strong> Alguns seguros obrigatórios podem ser cancelados
                </div>
              </li>
            </ul>
          </div>

          <h2>Como Calcular o Valor Correto de Quitação</h2>
          <p>
            O valor de quitação NÃO é a soma das parcelas restantes. É o <strong>saldo devedor atual</strong> mais eventuais taxas. Veja como calcular:
          </p>

          <h3>1. Localize o Saldo Devedor na Tabela Price</h3>
          <p>
            Na tabela de amortização do seu financiamento, procure a coluna "Saldo Devedor". O valor que aparece APÓS a última parcela paga é o que você deve.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h4 className="font-bold mb-3">Exemplo Prático</h4>
            <p className="text-sm mb-3">Financiamento: R$ 40.000 | Taxa: 1,8% a.m. | Prazo: 48 meses | Parcela: R$ 1.245</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-3 py-2 border">Parcela</th>
                    <th className="px-3 py-2 border text-right">Valor</th>
                    <th className="px-3 py-2 border text-right">Juros</th>
                    <th className="px-3 py-2 border text-right">Amortização</th>
                    <th className="px-3 py-2 border text-right">Saldo Devedor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-3 py-2 border text-center">1</td>
                    <td className="px-3 py-2 border text-right">R$ 1.245</td>
                    <td className="px-3 py-2 border text-right">R$ 720</td>
                    <td className="px-3 py-2 border text-right">R$ 525</td>
                    <td className="px-3 py-2 border text-right">R$ 39.475</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-3 py-2 border text-center">12</td>
                    <td className="px-3 py-2 border text-right">R$ 1.245</td>
                    <td className="px-3 py-2 border text-right">R$ 612</td>
                    <td className="px-3 py-2 border text-right">R$ 633</td>
                    <td className="px-3 py-2 border text-right">R$ 33.456</td>
                  </tr>
                  <tr className="border bg-green-50">
                    <td className="px-3 py-2 border text-center font-bold">24</td>
                    <td className="px-3 py-2 border text-right">R$ 1.245</td>
                    <td className="px-3 py-2 border text-right">R$ 436</td>
                    <td className="px-3 py-2 border text-right">R$ 809</td>
                    <td className="px-3 py-2 border text-right font-bold text-green-700">R$ 24.217</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-3 font-semibold text-green-700">
              ✓ Após pagar 24 parcelas, o valor de quitação é R$ 24.217 (não R$ 29.880 que seria 24 × R$ 1.245)
            </p>
            <p className="text-sm mt-2 text-neutral-700">
              <strong>Economia:</strong> R$ 5.663 em relação à soma das parcelas restantes!
            </p>
          </div>

          <h3>2. Calculadora de Saldo Devedor</h3>
          <p>
            Use nossa calculadora para descobrir quanto você ainda deve no seu financiamento:
          </p>
          <SaldoDevedorCalculator />

          <h3>3. Solicite o Boleto de Quitação ao Banco</h3>
          <p>
            Sempre peça ao banco um boleto oficial de quitação. Ele deve conter:
          </p>
          <ul>
            <li>Saldo devedor atualizado</li>
            <li>Juros proporcionais até a data de pagamento</li>
            <li>Eventuais taxas (que você pode contestar)</li>
            <li>Valor total para quitação</li>
            <li>Data de validade do boleto</li>
          </ul>

          <h2>O Que Observar Antes de Quitar</h2>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-800 mb-3">Pontos de Atenção</h3>
                <ul className="space-y-2 text-sm text-yellow-900">
                  <li><strong>1. Multa por quitação antecipada:</strong> Proibida por lei desde 2013 (Lei 12.740/2012)</li>
                  <li><strong>2. Juros proporcionais:</strong> Você paga juros apenas até o dia da quitação</li>
                  <li><strong>3. IOF já pago:</strong> Não é devolvido na quitação</li>
                  <li><strong>4. Seguros contratados:</strong> Podem ser cancelados com devolução proporcional</li>
                  <li><strong>5. TAC e outras taxas:</strong> Já foram pagas no início, não devem ser cobradas novamente</li>
                </ul>
              </div>
            </div>
          </div>

          <h2>Passo a Passo Para Quitar</h2>

          <div className="space-y-4 my-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-blue-900">Passo 1: Verifique Seu Saldo Devedor</h3>
              <p className="text-sm text-neutral-700">
                Consulte a tabela de amortização ou entre em contato com o banco para saber o valor exato.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-blue-900">Passo 2: Solicite o Boleto de Quitação</h3>
              <p className="text-sm text-neutral-700">
                Ligue para o banco ou vá à agência. O boleto geralmente tem validade de 3 a 5 dias.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-blue-900">Passo 3: Confira os Valores</h3>
              <p className="text-sm text-neutral-700">
                Compare o valor do boleto com o saldo devedor da tabela. Questione cobranças extras.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-blue-900">Passo 4: Efetue o Pagamento</h3>
              <p className="text-sm text-neutral-700">
                Pague o boleto dentro da validade. Guarde o comprovante.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-blue-900">Passo 5: Solicite o Termo de Quitação</h3>
              <p className="text-sm text-neutral-700">
                Após 5 dias úteis, peça o documento oficial de quitação do financiamento.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-blue-900">Passo 6: Baixe a Alienação</h3>
              <p className="text-sm text-neutral-700">
                Para veículos: vá ao Detran com o termo de quitação para remover a restrição. Para imóveis: registre a quitação no cartório.
              </p>
            </div>
          </div>

          <h2>Quando Vale a Pena Quitar Antecipadamente?</h2>

          <h3>Vale a Pena Se:</h3>
          <ul>
            <li>Você está no primeiro terço do financiamento (maior parte dos juros ainda não foi paga)</li>
            <li>A taxa de juros do financiamento é alta (acima de 2% a.m.)</li>
            <li>Você não tem investimentos rendendo mais que a taxa do financiamento</li>
            <li>Quer eliminar a dívida para melhorar o orçamento</li>
            <li>Precisa vender o bem e ele está alienado</li>
          </ul>

          <h3>Pode Não Valer a Pena Se:</h3>
          <ul>
            <li>Você está no último terço do financiamento (já pagou a maior parte dos juros)</li>
            <li>Tem investimentos rendendo mais que a taxa do financiamento</li>
            <li>A quitação vai esgotar sua reserva de emergência</li>
            <li>O dinheiro pode ser melhor usado em outra oportunidade</li>
          </ul>

          <h2>Exemplo Real: Quanto Você Economiza</h2>
          <div className="bg-green-50 p-6 rounded-lg my-6">
            <h4 className="font-bold mb-3">Cenário: Financiamento de R$ 50.000</h4>
            <div className="text-sm space-y-2">
              <p><strong>Condições:</strong> Taxa 2% a.m. | Prazo 60 meses | Parcela R$ 1.319</p>
              
              <div className="mt-4 space-y-3">
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">Quitação após 12 meses:</p>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Saldo devedor: R$ 42.856</li>
                    <li>• Parcelas restantes: 48 × R$ 1.319 = R$ 63.312</li>
                    <li>• <span className="text-green-700 font-bold">Economia: R$ 20.456</span></li>
                  </ul>
                </div>

                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">Quitação após 24 meses:</p>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Saldo devedor: R$ 34.128</li>
                    <li>• Parcelas restantes: 36 × R$ 1.319 = R$ 47.484</li>
                    <li>• <span className="text-green-700 font-bold">Economia: R$ 13.356</span></li>
                  </ul>
                </div>

                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">Quitação após 48 meses:</p>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Saldo devedor: R$ 13.245</li>
                    <li>• Parcelas restantes: 12 × R$ 1.319 = R$ 15.828</li>
                    <li>• <span className="text-green-700 font-bold">Economia: R$ 2.583</span></li>
                  </ul>
                </div>
              </div>

              <p className="mt-4 font-semibold text-green-800">
                Conclusão: Quanto mais cedo quitar, maior a economia!
              </p>
            </div>
          </div>

          <h2>Amortização Parcial: Alternativa à Quitação Total</h2>
          <p>
            Se você não tem o valor total, pode fazer amortizações parciais:
          </p>

          <h3>Opção 1: Reduzir o Valor da Parcela</h3>
          <ul>
            <li>Mantém o prazo original</li>
            <li>Diminui o valor mensal</li>
            <li>Alivia o orçamento</li>
          </ul>

          <h3>Opção 2: Reduzir o Prazo</h3>
          <ul>
            <li>Mantém o valor da parcela</li>
            <li>Diminui o número de meses</li>
            <li>Economiza mais em juros</li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg my-6">
            <p className="text-sm text-blue-900">
              <strong>Dica:</strong> Reduzir o prazo geralmente é mais vantajoso financeiramente, pois você paga menos juros no total.
            </p>
          </div>

          <h2>Direitos do Consumidor na Quitação</h2>
          <div className="bg-purple-50 p-6 rounded-lg my-6">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Proibida multa por quitação antecipada</strong> (Lei 12.740/2012)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Redução proporcional dos juros</strong> - você não paga juros futuros</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Devolução de seguros</strong> - valores proporcionais devem ser devolvidos</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Termo de quitação gratuito</strong> - o banco não pode cobrar por esse documento</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Baixa da alienação</strong> - deve ser providenciada pelo banco em até 10 dias</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
            <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
              <Calculator className="mr-2" />
              Simule Sua Economia
            </h3>
            <p className="text-blue-900 mb-4">
              Use nosso simulador para ver quanto você economizaria quitando seu financiamento agora.
            </p>
            <Link href="/simulador-financiamento-veiculos">
              <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Calcular Economia na Quitação
              </a>
            </Link>
          </div>

          <h2>Conclusão</h2>
          <p>
            Quitar um financiamento antecipadamente pode ser uma excelente decisão financeira, especialmente se você está no início do contrato. O segredo é calcular corretamente o saldo devedor, conhecer seus direitos e avaliar se é o melhor momento para você.
          </p>
          <p>
            Lembre-se: o valor de quitação é sempre o saldo devedor (que você encontra na tabela de amortização), nunca a soma das parcelas restantes. Essa diferença pode representar milhares de reais de economia.
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
