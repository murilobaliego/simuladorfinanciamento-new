import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function SimuladorFinanciamentoAutomovelPortugal() {
  const [valorVeiculo, setValorVeiculo] = useState("18000");
  const [entrada, setEntrada] = useState("3600");
  const [prazo, setPrazo] = useState("60");
  const [taeg, setTaeg] = useState("10.8");
  const [resultado, setResultado] = useState<{
    prestacaoMensal: number;
    totalPagar: number;
    totalJuros: number;
    mtic: number;
    amortizacao: AmortizationRow[];
  } | null>(null);

  const calcularFinanciamento = () => {
    const valor = parseFloat(valorVeiculo);
    const entradaInicial = parseFloat(entrada);
    const meses = parseInt(prazo);
    const taxaAnual = parseFloat(taeg) / 100;
    const taxaMensal = taxaAnual / 12;
    const montanteFinanciar = valor - entradaInicial;

    if (montanteFinanciar <= 0 || meses <= 0 || taxaMensal < 0) return;

    const prestacao = montanteFinanciar * (taxaMensal * Math.pow(1 + taxaMensal, meses)) / (Math.pow(1 + taxaMensal, meses) - 1);
    const totalPagar = prestacao * meses;
    const totalJuros = totalPagar - montanteFinanciar;
    const mtic = totalPagar + entradaInicial;

    const amortizacao: AmortizationRow[] = [];
    let saldo = montanteFinanciar;

    for (let i = 1; i <= meses; i++) {
      const juros = saldo * taxaMensal;
      const amortizacaoCapital = prestacao - juros;
      saldo -= amortizacaoCapital;

      amortizacao.push({
        month: i,
        payment: prestacao,
        principal: amortizacaoCapital,
        interest: juros,
        balance: Math.max(0, saldo)
      });
    }

    setResultado({
      prestacaoMensal: prestacao,
      totalPagar,
      totalJuros,
      mtic,
      amortizacao
    });
  };

  const formatEUR = (valor: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(valor);
  };

  return (
    <>
      <Helmet>
        <title>Simulador de Financiamento Automóvel Portugal 2025 | Calcular Prestação e TAEG</title>
        <meta name="description" content="Simulador de crédito automóvel gratuito para Portugal. Calcule a prestação mensal, TAEG, MTIC e custo total do financiamento. Compare taxas e descubra quanto vai pagar pelo seu carro." />
        <meta name="keywords" content="simulador de financiamento automóvel, simulador de crédito automóvel, financiamento de carros Portugal, crédito automóvel Portugal, calcular prestação automóvel, simulador Tabela Price Portugal, financiamento carro usado, TAEG, MTIC" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/portugal/simulador-financiamento-automovel" />
        <html lang="pt-PT" />
        <meta property="og:title" content="Simulador de Financiamento Automóvel Portugal | Calcule as suas prestações" />
        <meta property="og:description" content="Ferramenta gratuita para simular crédito automóvel em Portugal. Calcule prestações, TAEG e MTIC de forma simples e rápida." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/portugal/simulador-financiamento-automovel" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "Simulador de Financiamento Automóvel Portugal",
          "description": "Calculadora gratuita de crédito automóvel para o mercado português",
          "provider": {
            "@type": "Organization",
            "name": "Simulador Financiamento"
          },
          "featureList": ["Cálculo de prestação mensal", "TAEG", "MTIC", "Tabela de amortização"],
          "areaServed": "PT"
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Calculadora de Crédito Automóvel",
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "operatingSystem": "Web"
        })}
      </script>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Simulador de Financiamento Automóvel – Calcule as suas prestações em Portugal
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Quer comprar um carro novo ou usado e precisa de financiamento? Com o nosso simulador, calcule facilmente o valor das suas prestações mensais, a TAEG e o custo total do crédito.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Como funciona o simulador de crédito automóvel
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              O cálculo segue o modelo <strong>tabela francesa (ou Tabela Price)</strong>, que é o método mais comum utilizado pelos bancos e financeiras em Portugal. A simulação considera:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Valor do veículo e entrada inicial</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Taxa anual de juro (TAEG)</strong> – média em Portugal ronda os 10,8%</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Prazo do financiamento</strong> – de 12 a 84 meses</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Valor total de juros pagos</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Montante Total Imputado ao Consumidor (MTIC)</strong></span>
              </li>
            </ul>

            <p className="mb-6">
              Ao finalizar, verá o plano de amortização completo, com a evolução do saldo em dívida e o custo total do crédito.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                <Info className="inline h-5 w-5 mr-1" />
                Educação Financeira e Transparência
              </p>
              <p className="text-sm text-blue-900">
                Este simulador foi desenvolvido com o objetivo de promover a transparência e a literacia financeira. Compreender os custos reais de um crédito automóvel permite-lhe tomar decisões mais informadas e evitar o sobreendividamento. Recomendamos sempre que compare várias propostas e leia atentamente as condições contratuais antes de assinar qualquer compromisso financeiro.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calcule o Seu Financiamento Automóvel
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="valorVeiculo" className="text-base font-semibold">Valor do Veículo (€)</Label>
              <Input
                id="valorVeiculo"
                type="number"
                value={valorVeiculo}
                onChange={(e) => setValorVeiculo(e.target.value)}
                className="mt-2 text-lg"
                placeholder="18000"
              />
            </div>

            <div>
              <Label htmlFor="entrada" className="text-base font-semibold">Entrada Inicial (€)</Label>
              <Input
                id="entrada"
                type="number"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                className="mt-2 text-lg"
                placeholder="3600"
              />
            </div>

            <div>
              <Label htmlFor="prazo" className="text-base font-semibold">Prazo (meses)</Label>
              <Input
                id="prazo"
                type="number"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                className="mt-2 text-lg"
                placeholder="60"
              />
            </div>

            <div>
              <Label htmlFor="taeg" className="text-base font-semibold">TAEG - Taxa Anual (%)</Label>
              <Input
                id="taeg"
                type="number"
                step="0.1"
                value={taeg}
                onChange={(e) => setTaeg(e.target.value)}
                className="mt-2 text-lg"
                placeholder="10.8"
              />
            </div>
          </div>

          <Button
            onClick={calcularFinanciamento}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calcular Prestação
          </Button>

          {resultado && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Montante a Financiar</p>
                <p className="text-3xl font-bold text-neutral-800">
                  {formatEUR(parseFloat(valorVeiculo) - parseFloat(entrada))}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Prestação Mensal</p>
                <p className="text-4xl font-bold text-green-700">{formatEUR(resultado.prestacaoMensal)}</p>
                <p className="text-xs text-green-600 mt-1">Durante {prazo} meses</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-xl font-bold text-neutral-800">{formatEUR(resultado.totalPagar)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total de Juros</p>
                  <p className="text-xl font-bold text-red-600">{formatEUR(resultado.totalJuros)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">MTIC</p>
                  <p className="text-xl font-bold text-blue-600">{formatEUR(resultado.mtic)}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Nota:</strong> Esta simulação é indicativa. Os valores reais podem variar conforme as condições específicas de cada instituição financeira.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {resultado && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Plano de Amortização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Prestação</TableHead>
                      <TableHead>Capital</TableHead>
                      <TableHead>Juros</TableHead>
                      <TableHead>Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultado.amortizacao.slice(0, 12).map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{formatEUR(row.payment)}</TableCell>
                        <TableCell>{formatEUR(row.principal)}</TableCell>
                        <TableCell>{formatEUR(row.interest)}</TableCell>
                        <TableCell>{formatEUR(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {resultado.amortizacao.length > 12 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  A mostrar os primeiros 12 meses de {resultado.amortizacao.length} meses
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Vantagens de usar o simulador de financiamento automóvel
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare diferentes taxas e prazos</h3>
                <p className="text-sm text-neutral-600">
                  Antes de pedir o crédito, experimente várias combinações para encontrar a melhor solução.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Entenda o impacto da entrada inicial</h3>
                <p className="text-sm text-neutral-600">
                  Veja como uma entrada maior reduz significativamente o valor da prestação mensal.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Calcule o custo total do financiamento</h3>
                <p className="text-sm text-neutral-600">
                  Baseado em dados reais do mercado português, com TAEG média de 10,8%.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Tudo online, sem compromisso</h3>
                <p className="text-sm text-neutral-600">
                  Faça simulações ilimitadas sem partilhar dados pessoais ou contactos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Financiamento automóvel em Portugal – o que deve saber
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              Em Portugal, mais de metade dos compradores de carros recorrem a <strong>crédito automóvel</strong>. Os contratos podem ser feitos diretamente com bancos, financeiras ou através dos stands de automóveis (leasing, ALD, crédito direto ao consumidor).
            </p>

            <p className="mb-4">
              A <strong>TAEG média</strong> situa-se entre <strong>9% e 11%</strong>, variando conforme o perfil do cliente, tipo de veículo e prazo. O valor médio financiado ronda <strong>€15.000 a €20.000</strong>, com prazos entre <strong>48 e 72 meses</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Antes de assinar um contrato, confirme sempre:
            </h3>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>A <strong>TAEG e TAN</strong> (taxas de juro aplicadas)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>O <strong>MTIC</strong> (Montante Total Imputado ao Consumidor)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>As <strong>comissões e seguros</strong> associados</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>As condições de <strong>reembolso antecipado</strong></span>
              </li>
            </ul>

            <div className="bg-neutral-50 p-6 rounded-lg my-6">
              <h4 className="font-bold text-neutral-800 mb-3">💡 Dica Importante</h4>
              <p className="text-sm text-neutral-700">
                Experimente alterar o valor da entrada ou o prazo no simulador e veja como isso afeta a prestação mensal. Uma entrada de 20% a 30% do valor do veículo pode reduzir significativamente os juros totais pagos.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Use o simulador e descubra quanto vai pagar pelo seu carro
          </h2>
          
          <p className="text-neutral-700 mb-4">
            O nosso simulador foi criado para ajudar os consumidores portugueses a tomar decisões mais informadas. Não precisa de ser especialista em finanças — basta preencher os campos e deixar que o simulador faça as contas por si.
          </p>

          <p className="text-neutral-700">
            Esta ferramenta é totalmente gratuita, não requer registo e respeita a sua privacidade. Utilize-a quantas vezes precisar para encontrar a melhor solução de financiamento para o seu próximo automóvel.
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            Este simulador é uma ferramenta informativa. Os resultados são aproximados e podem variar conforme as condições específicas de cada instituição financeira. Consulte sempre um profissional antes de tomar decisões financeiras.
          </p>
        </div>
      </div>
    </>
  );
}
