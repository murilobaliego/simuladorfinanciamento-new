import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Calculator, TrendingUp, AlertCircle, CheckCircle, RefreshCw, Share2, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SimuladorFinanciamentoCompleto() {
  const [vehiclePrice, setVehiclePrice] = useState("50000");
  const [downPayment, setDownPayment] = useState("10000");
  const [months, setMonths] = useState("48");
  const [interestRate, setInterestRate] = useState("1.5");
  const [tac, setTac] = useState("800");
  const [includeIOF, setIncludeIOF] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [bankRates, setBankRates] = useState<Array<{bank: string; monthlyRate: number; annualRate: number}>>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [showBankComparison, setShowBankComparison] = useState(true);

  const calculateIOF = (financed: number, term: number) => {
    if (!includeIOF) return 0;
    const dailyRate = 0.000082;
    const additionalRate = 0.0038;
    const days = term * 30;
    return financed * (dailyRate * days + additionalRate);
  };

  const calculateCET = (financed: number, payment: number, term: number, tacValue: number, iofValue: number) => {
    // CET correto: taxa que iguala o VP das parcelas ao valor líquido recebido
    // Valor líquido recebido = valor financiado (sem TAC e IOF)
    // Parcelas são calculadas sobre (valor financiado + TAC + IOF)
    const valorLiquidoRecebido = financed;
    
    // Método de Newton-Raphson para encontrar a taxa CET
    let cet = 0.02; // Chute inicial de 2% ao mês
    const maxIteracoes = 100;
    const tolerancia = 0.0001;
    
    for (let i = 0; i < maxIteracoes; i++) {
      let vp = 0;
      let dvp = 0;
      
      for (let n = 1; n <= term; n++) {
        const fator = Math.pow(1 + cet, n);
        vp += payment / fator;
        dvp -= n * payment / (fator * (1 + cet));
      }
      
      const f = vp - valorLiquidoRecebido;
      
      if (Math.abs(f) < tolerancia) {
        const cetMonthly = cet * 100;
        const cetAnnual = (Math.pow(1 + cet, 12) - 1) * 100;
        return { cetMonthly, cetAnnual };
      }
      
      cet = cet - f / dvp;
      
      // Garantir que CET não fique negativo
      if (cet < 0) cet = 0.001;
    }
    
    const cetMonthly = cet * 100;
    const cetAnnual = (Math.pow(1 + cet, 12) - 1) * 100;
    return { cetMonthly, cetAnnual };
  };

  const calculateFinancing = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment);
    const term = parseInt(months);
    const monthlyRate = parseFloat(interestRate) / 100;
    const tacValue = parseFloat(tac);
    const financedBase = price - down;
    const iofValue = calculateIOF(financedBase, term);
    
    // Valor financiado total = base + TAC + IOF
    const financedTotal = financedBase + tacValue + iofValue;

    // Parcela calculada sobre o valor total (com TAC e IOF)
    const payment = financedTotal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    const total = payment * term;
    const totalInterest = total - financedTotal;
    
    // CET: compara valor líquido recebido (base) com as parcelas calculadas sobre o total
    const cet = calculateCET(financedBase, payment, term, tacValue, iofValue);

    setResult({ financed: financedBase, financedTotal, payment, total, totalInterest, tac: tacValue, iof: iofValue, cet });
  };

  const shareWhatsApp = () => {
    const text = `*Simulação de Financiamento*\n\n` +
      `💰 Valor do Veículo: ${formatBRL(parseFloat(vehiclePrice))}\n` +
      `💵 Entrada: ${formatBRL(parseFloat(downPayment))}\n` +
      `📊 Valor Financiado: ${formatBRL(result.financed)}\n` +
      `📅 Parcelas: ${months}x de ${formatBRL(result.payment)}\n` +
      `💳 Total a Pagar: ${formatBRL(result.total)}\n` +
      `📈 Juros: ${formatBRL(result.totalInterest)}\n` +
      `🏦 TAC: ${formatBRL(result.tac)}\n` +
      `📋 IOF: ${formatBRL(result.iof)}\n` +
      `⚡ CET Mensal: ${result.cet.cetMonthly.toFixed(2)}%\n` +
      `⚡ CET Anual: ${result.cet.cetAnnual.toFixed(2)}%\n\n` +
      `Simule você também: ${window.location.href}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareWhatsAppBank = (bank: any, payment: number, total: number, financedBase: number, cet: any) => {
    const text = `*Simulação de Financiamento - ${bank.bank}*\n\n` +
      `💰 Valor do Veículo: ${formatBRL(parseFloat(vehiclePrice))}\n` +
      `💵 Entrada: ${formatBRL(parseFloat(downPayment))}\n` +
      `📊 Valor Financiado: ${formatBRL(financedBase)}\n` +
      `📅 Parcelas: ${months}x de ${formatBRL(payment)}\n` +
      `💳 Total a Pagar: ${formatBRL(total)}\n` +
      `📈 Taxa: ${bank.monthlyRate.toFixed(2)}% a.m. | ${bank.annualRate.toFixed(2)}% a.a.\n` +
      `⚡ CET: ${cet.cetMonthly.toFixed(2)}% a.m. | ${cet.cetAnnual.toFixed(2)}% a.a.\n\n` +
      `Simule você também: ${window.location.href}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const generatePDF = () => {
    const content = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
            .section { margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #1f2937; font-size: 18px; }
            .highlight { background: #dbeafe; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #2563eb; color: white; }
          </style>
        </head>
        <body>
          <h1>Simulação de Financiamento de Veículo</h1>
          <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          
          <div class="section">
            <h2>Dados do Financiamento</h2>
            <p><span class="label">Valor do Veículo:</span> <span class="value">${formatBRL(parseFloat(vehiclePrice))}</span></p>
            <p><span class="label">Entrada:</span> <span class="value">${formatBRL(parseFloat(downPayment))}</span></p>
            <p><span class="label">Valor Financiado:</span> <span class="value">${formatBRL(result.financed)}</span></p>
            <p><span class="label">Prazo:</span> <span class="value">${months} meses</span></p>
            <p><span class="label">Taxa de Juros:</span> <span class="value">${interestRate}% ao mês</span></p>
          </div>
          
          <div class="highlight">
            <h2>Resultado da Simulação</h2>
            <p><span class="label">Parcela Mensal:</span> <span class="value" style="font-size: 24px; color: #16a34a;">${formatBRL(result.payment)}</span></p>
          </div>
          
          <div class="section">
            <h2>Custos Totais</h2>
            <table>
              <tr><th>Descrição</th><th>Valor</th></tr>
              <tr><td>Total a Pagar</td><td>${formatBRL(result.total)}</td></tr>
              <tr><td>Total de Juros</td><td>${formatBRL(result.totalInterest)}</td></tr>
              <tr><td>TAC (Taxa de Abertura)</td><td>${formatBRL(result.tac)}</td></tr>
              <tr><td>IOF</td><td>${formatBRL(result.iof)}</td></tr>
            </table>
          </div>
          
          <div class="highlight">
            <h2>CET - Custo Efetivo Total</h2>
            <p><span class="label">CET Mensal:</span> <span class="value">${result.cet.cetMonthly.toFixed(2)}%</span></p>
            <p><span class="label">CET Anual:</span> <span class="value">${result.cet.cetAnnual.toFixed(2)}%</span></p>
          </div>
          
          <p style="margin-top: 40px; color: #6b7280; font-size: 12px;">
            <strong>Aviso:</strong> Esta é uma simulação para fins informativos. Os valores reais podem variar conforme as condições oferecidas pela instituição financeira.
          </p>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const setDownPaymentPercent = (percent: number) => {
    const price = parseFloat(vehiclePrice);
    setDownPayment(((price * percent) / 100).toFixed(2));
  };

  const loadBankRates = async () => {
    setLoadingRates(true);
    try {
      const response = await fetch('https://olinda.bcb.gov.br/olinda/servico/taxaJuros/versao/v2/odata/TaxasJurosMensalPorMes?$top=100&$format=json&$filter=Modalidade%20eq%20%27Aquisi%C3%A7%C3%A3o%20de%20ve%C3%ADculos%20automotores%20-%20PF%27');
      const data = await response.json();
      
      const bankMap = new Map();
      const mainBanks = ['BANCO DO BRASIL', 'CAIXA ECONOMICA', 'ITAU', 'BRADESCO', 'SANTANDER', 'SAFRA', 'PAN', 'BMG'];
      
      data.value?.forEach((item: any) => {
        const bank = item.InstituicaoFinanceira?.toUpperCase() || '';
        const monthly = parseFloat(item.TaxaJurosAoMes) || 0;
        const annual = parseFloat(item.TaxaJurosAoAno) || 0;
        
        if (monthly > 0 && mainBanks.some(b => bank.includes(b))) {
          const existing = bankMap.get(bank);
          if (!existing || monthly < existing.monthlyRate) {
            bankMap.set(bank, { bank: formatBankName(bank), monthlyRate: monthly, annualRate: annual });
          }
        }
      });
      
      const rates = Array.from(bankMap.values()).sort((a, b) => a.monthlyRate - b.monthlyRate).slice(0, 8);
      setBankRates(rates.length > 0 ? rates : getDefaultRates());
    } catch (error) {
      setBankRates(getDefaultRates());
    }
    setLoadingRates(false);
  };

  const formatBankName = (name: string): string => {
    const map: Record<string, string> = {
      'BANCO DO BRASIL': 'Banco do Brasil',
      'CAIXA ECONOMICA': 'Caixa Econômica',
      'ITAU': 'Itaú',
      'BRADESCO': 'Bradesco',
      'SANTANDER': 'Santander',
      'SAFRA': 'Safra',
      'PAN': 'Banco Pan',
      'BMG': 'BMG'
    };
    for (const [key, value] of Object.entries(map)) {
      if (name.includes(key)) return value;
    }
    return name;
  };

  const getDefaultRates = () => [
    { bank: 'Banco do Brasil', monthlyRate: 1.49, annualRate: 19.49 },
    { bank: 'Caixa Econômica', monthlyRate: 1.52, annualRate: 19.89 },
    { bank: 'Itaú', monthlyRate: 1.69, annualRate: 22.29 },
    { bank: 'Bradesco', monthlyRate: 1.72, annualRate: 22.69 },
    { bank: 'Santander', monthlyRate: 1.75, annualRate: 23.09 },
    { bank: 'Safra', monthlyRate: 1.79, annualRate: 23.59 },
    { bank: 'Banco Pan', monthlyRate: 1.89, annualRate: 24.99 },
    { bank: 'BMG', monthlyRate: 1.95, annualRate: 25.79 }
  ];

  useEffect(() => {
    if (showBankComparison) {
      loadBankRates();
    }
  }, [showBankComparison]);

  return (
    <>
      <Helmet>
        <title>Simulador de Financiamento de Veículos Completo 2025 | Calcule Parcelas e Juros</title>
        <meta name="description" content="Simulador completo de financiamento de veículos. Calcule parcelas, juros, valor total e compare taxas dos principais bancos. Ferramenta gratuita e atualizada." />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-financiamento-completo" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Simulador de Financiamento de Veículos Completo
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calcule o valor das parcelas, juros e custo total do seu financiamento de forma rápida e precisa
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calcule seu Financiamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vehiclePrice">Valor do Veículo</Label>
                  <Input
                    id="vehiclePrice"
                    type="number"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="downPayment">Valor da Entrada</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {[0, 10, 20, 30, 40, 50].map(percent => (
                      <Button
                        key={percent}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDownPaymentPercent(percent)}
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="months">Número de Parcelas</Label>
                  <Input
                    id="months"
                    type="number"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {[12, 24, 36, 48, 60].map(m => (
                      <Button
                        key={m}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMonths(m.toString())}
                      >
                        {m}x
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="interestRate">Taxa de Juros Mensal (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tac">TAC - Taxa de Abertura de Crédito (R$)</Label>
                  <Input
                    id="tac"
                    type="number"
                    value={tac}
                    onChange={(e) => setTac(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeIOF"
                    checked={includeIOF}
                    onChange={(e) => setIncludeIOF(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="includeIOF" className="text-sm cursor-pointer">
                    Incluir IOF no cálculo
                  </Label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showBankComparison"
                      checked={showBankComparison}
                      onChange={(e) => setShowBankComparison(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="showBankComparison" className="text-sm cursor-pointer">
                      Comparar taxas entre bancos
                    </Label>
                  </div>
                  <Button onClick={calculateFinancing} className="w-full" size="lg">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calcular Financiamento
                  </Button>
                </div>

                {result && !showBankComparison && (
                  <div className="space-y-3 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700 mb-1">Valor Financiado Base</p>
                      <p className="text-2xl font-bold text-blue-900">{formatBRL(result.financed)}</p>
                      <p className="text-xs text-blue-600 mt-1">Total com taxas: {formatBRL(result.financedTotal)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-500">
                      <p className="text-sm text-green-700 mb-1">Parcela Mensal</p>
                      <p className="text-3xl font-bold text-green-700">{formatBRL(result.payment)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-neutral-50 p-3 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                        <p className="text-lg font-bold text-neutral-800">{formatBRL(result.total)}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-xs text-red-600 mb-1">Total de Juros</p>
                        <p className="text-lg font-bold text-red-700">{formatBRL(result.totalInterest)}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-xs text-yellow-700 mb-1">TAC</p>
                        <p className="text-lg font-bold text-yellow-800">{formatBRL(result.tac)}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-700 mb-1">IOF</p>
                        <p className="text-lg font-bold text-purple-800">{formatBRL(result.iof)}</p>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-500">
                      <p className="text-sm text-orange-700 mb-2 font-bold">CET - Custo Efetivo Total</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-orange-600">Mensal</p>
                          <p className="text-xl font-bold text-orange-800">{result.cet.cetMonthly.toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-orange-600">Anual</p>
                          <p className="text-xl font-bold text-orange-800">{result.cet.cetAnnual.toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => shareWhatsApp()}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartilhar
                      </Button>
                      <Button
                        onClick={() => generatePDF()}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        size="sm"
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Gerar PDF
                      </Button>
                    </div>
                  </div>
                )}

                {result && showBankComparison && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-neutral-800">Comparação de Bancos</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadBankRates}
                        disabled={loadingRates}
                      >
                        <RefreshCw className={`h-4 w-4 ${loadingRates ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                    {loadingRates ? (
                      <div className="text-center py-4 text-neutral-600">Carregando taxas...</div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {bankRates.map((bank, idx) => {
                          const price = parseFloat(vehiclePrice);
                          const down = parseFloat(downPayment);
                          const term = parseInt(months);
                          const tacValue = parseFloat(tac);
                          const financedBase = price - down;
                          const iofValue = calculateIOF(financedBase, term);
                          const financedTotal = financedBase + tacValue + iofValue;
                          const payment = financedTotal * (bank.monthlyRate/100 * Math.pow(1 + bank.monthlyRate/100, term)) / (Math.pow(1 + bank.monthlyRate/100, term) - 1);
                          const total = payment * term;
                          const cet = calculateCET(financedBase, payment, term, tacValue, iofValue);
                          
                          return (
                            <div key={idx} className="bg-white border rounded-lg p-3 hover:border-blue-500 transition-colors cursor-pointer">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-bold text-neutral-800">{bank.bank}</p>
                                  <p className="text-xs text-neutral-600">{bank.monthlyRate.toFixed(2)}% a.m. | {bank.annualRate.toFixed(2)}% a.a.</p>
                                  <p className="text-xs text-orange-600 font-semibold mt-1">CET: {cet.cetMonthly.toFixed(2)}% a.m. | {cet.cetAnnual.toFixed(2)}% a.a.</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-green-700">{formatBRL(payment)}</p>
                                  <p className="text-xs text-neutral-600">por mês</p>
                                </div>
                              </div>
                              <div className="flex justify-between text-xs text-neutral-600 mb-2">
                                <span>Total: {formatBRL(total)}</span>
                                <span>Juros: {formatBRL(total - financedTotal)}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  onClick={(e) => { e.stopPropagation(); shareWhatsAppBank(bank, payment, total, financedBase, cet); }}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs h-7"
                                >
                                  <Share2 className="mr-1 h-3 w-3" />
                                  Compartilhar
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <h2>Como Calcular Simulação de Financiamento de Veículos</h2>
              <p>
                Você está pensando em comprar um carro ou uma moto, mas não tem todo o dinheiro para pagar à vista? Uma opção é fazer um financiamento de veículo, que é uma modalidade de crédito em que você pega um empréstimo com uma instituição financeira e paga em parcelas mensais, com juros e encargos.
              </p>

              <h3>Sistema de Amortização (Tabela Price)</h3>
              <p>
                O método do sistema francês de amortização (Tabela Price) é uma fórmula que calcula o valor das prestações fixas de um financiamento de veículo, considerando uma taxa de juros composta. Nesse método, as prestações são iguais, mas a composição delas varia ao longo do tempo: no início, a maior parte é destinada aos juros e, no final, à amortização do saldo devedor.
              </p>

              <h3>Passos para Calcular</h3>
              <ol>
                <li>Calcule o valor que será financiado, subtraindo o valor do veículo pelo valor da entrada</li>
                <li>Consulte a taxa de juros no site do Banco Central</li>
                <li>Divida a taxa de juros anual por 12 para obter a taxa mensal</li>
                <li>Use a fórmula da Tabela Price para calcular a prestação</li>
                <li>Multiplique a prestação pelo número de parcelas para obter o total</li>
              </ol>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-yellow-900 mb-1">Atenção ao CET</p>
                    <p className="text-sm text-yellow-800">
                      Fique sempre atento ao Custo Efetivo Total (CET). O CET é a taxa que reúne todos os itens adicionais do seu financiamento, ou seja, é o quanto você realmente vai pagar de juros.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-900 mb-1">Sobre o CET</p>
                    <p className="text-sm text-blue-800">
                      O CET (Custo Efetivo Total) é a taxa que inclui TODOS os custos do financiamento: juros, TAC, IOF e outras taxas. É o valor real que você pagará.
                    </p>
                  </div>
                </div>
              </div>

              <h2>Quais são as Taxas Inclusas em um Financiamento?</h2>
              <ul>
                <li><strong>Taxa de Juros:</strong> Principal custo do financiamento</li>
                <li><strong>IOF:</strong> Imposto sobre Operações Financeiras</li>
                <li><strong>TAC:</strong> Taxa de Abertura de Crédito</li>
                <li><strong>Seguro:</strong> Proteção financeira (pode ser opcional)</li>
                <li><strong>Registro:</strong> Taxas de documentação</li>
              </ul>

              <h2>Dicas para Escolher o Melhor Financiamento</h2>
              <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Compare Taxas</h4>
                    <p className="text-sm text-green-800">
                      Pesquise e compare as condições oferecidas por diferentes bancos e financeiras
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Analise sua Capacidade</h4>
                    <p className="text-sm text-green-800">
                      Não comprometa mais de 30% da sua renda mensal com o financiamento
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Menor Prazo Possível</h4>
                    <p className="text-sm text-green-800">
                      Quanto menor o prazo, menos juros você pagará no total
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Negocie Condições</h4>
                    <p className="text-sm text-green-800">
                      Use seu histórico de crédito para conseguir melhores taxas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Quais são os requisitos para obter um financiamento de veículo?
              </h3>
              <p className="text-neutral-700">
                Os requisitos podem variar entre instituições financeiras, mas geralmente incluem ter uma idade mínima (18 anos ou mais), comprovar renda suficiente para pagar as parcelas, apresentar documentos pessoais (RG, CPF), comprovante de residência e, em alguns casos, comprovar vínculo empregatício.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Posso antecipar as parcelas do financiamento?
              </h3>
              <p className="text-neutral-700">
                Sim, na maioria dos casos, você pode antecipar as parcelas do financiamento. No entanto, é importante verificar com a instituição financeira se há alguma taxa ou custo adicional associado a essa antecipação. Antecipar parcelas pode reduzir o valor total dos juros pagos.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Qual a diferença entre taxa de juros fixa e variável?
              </h3>
              <p className="text-neutral-700">
                A taxa de juros fixa permanece a mesma ao longo do contrato de financiamento, enquanto a taxa de juros variável pode ser ajustada de acordo com índices econômicos. A escolha entre as duas opções depende da sua preferência e visão sobre as flutuações do mercado.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Como retirar taxas indevidas do meu financiamento?
              </h3>
              <p className="text-neutral-700">
                Se o vendedor alegar que todas as taxas são indispensáveis, tente argumentar. Após contratar o financiamento, ligue para o SAC do banco e exija o cancelamento de seguros alegando venda casada. Caso não consiga, entre em contato com o PROCON do seu estado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
