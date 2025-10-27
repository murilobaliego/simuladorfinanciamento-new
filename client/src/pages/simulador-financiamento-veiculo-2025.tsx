import { Helmet } from 'react-helmet-async';
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import PriceTable from "@/components/simulators/price-table";
import ExportButtons from "@/components/simulators/export-buttons";
import { useSecureForm } from "@/hooks/use-secure-form";
import { validateNumberRange } from "@/utils/security";
import type { TableData, SimulationResult } from "@/components/simulators/vehicle-form";

const formSchema = z.object({
  valorVeiculo: z.coerce.number().min(5000, "O valor mínimo é R$ 5.000,00"),
  valorEntrada: z.coerce.number().min(0, "O valor da entrada não pode ser negativo"),
  taxaAbertura: z.coerce.number().min(0, "A taxa de abertura não pode ser negativa"),
  taxaJuros: z.coerce.number().min(0.1, "A taxa mínima é 0,1%").max(5, "A taxa máxima é 5%"),
  numParcelas: z.coerce.number().min(6, "O número mínimo de parcelas é 6").max(120, "O número máximo de parcelas é 120"),
  incluirIOF: z.boolean().default(false)
});

function calcularCET(
  valorLiquidoRecebido: number,
  valorParcela: number,
  numParcelas: number
): number {
  // Método de Newton-Raphson para encontrar a taxa CET
  let cet = 0.02; // Chute inicial de 2% ao mês
  const maxIteracoes = 100;
  const tolerancia = 0.0001;
  
  for (let i = 0; i < maxIteracoes; i++) {
    let vp = 0;
    let dvp = 0;
    
    for (let n = 1; n <= numParcelas; n++) {
      const fator = Math.pow(1 + cet, n);
      vp += valorParcela / fator;
      dvp -= n * valorParcela / (fator * (1 + cet));
    }
    
    const f = vp - valorLiquidoRecebido;
    
    if (Math.abs(f) < tolerancia) {
      return cet * 100; // Retorna em percentual
    }
    
    cet = cet - f / dvp;
    
    // Garantir que CET não fique negativo
    if (cet < 0) cet = 0.001;
  }
  
  return cet * 100;
}

function calcularFinanciamento2025(
  valorVeiculo: number,
  valorEntrada: number,
  taxaAbertura: number,
  taxaJuros: number,
  numParcelas: number,
  incluirIOF: boolean
): SimulationResult {
  const valorFinanciadoBase = valorVeiculo - valorEntrada;
  let valorFinanciadoTotal = valorFinanciadoBase + taxaAbertura;
  
  let valorIOF = 0;
  if (incluirIOF) {
    const diasFinanciamento = Math.min(numParcelas * 30, 365);
    const iofDiario = valorFinanciadoTotal * (0.0082 / 100) * diasFinanciamento;
    const iofFixo = valorFinanciadoTotal * (0.38 / 100);
    valorIOF = iofDiario + iofFixo;
    valorFinanciadoTotal += valorIOF;
  }
  
  const taxaMensal = taxaJuros / 100;
  const valorParcela = valorFinanciadoTotal * (taxaMensal * Math.pow(1 + taxaMensal, numParcelas)) / (Math.pow(1 + taxaMensal, numParcelas) - 1);
  const totalPagar = valorParcela * numParcelas;
  const totalJuros = totalPagar - valorFinanciadoTotal;
  
  const tabelaAmortizacao: TableData[] = [];
  let saldoDevedor = valorFinanciadoTotal;
  
  for (let i = 1; i <= numParcelas; i++) {
    const juros = saldoDevedor * taxaMensal;
    const amortizacao = valorParcela - juros;
    saldoDevedor -= amortizacao;
    
    tabelaAmortizacao.push({
      parcela: i,
      valorParcela,
      amortizacao,
      juros,
      saldoDevedor: Math.max(0, saldoDevedor)
    });
  }
  
  // CET correto: taxa que iguala o VP das parcelas ao valor líquido recebido
  const taxaCET = calcularCET(valorFinanciadoBase, valorParcela, numParcelas);
  
  return {
    valorParcela,
    totalPagar,
    totalJuros,
    tabelaAmortizacao,
    ...(incluirIOF && { valorIOF }),
    taxaCET
  };
}

export default function SimuladorFinanciamentoVeiculo2025() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const { toast } = useToast();
  
  const { secureSubmit, isSubmitting, isLimited, CsrfInput } = useSecureForm({
    formId: 'vehicle-finance-2025-form',
    rateLimiterOptions: { maxAttempts: 15, timeWindowMs: 60000 }
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorVeiculo: 50000,
      valorEntrada: 10000,
      taxaAbertura: 800,
      taxaJuros: 1.5,
      numParcelas: 48,
      incluirIOF: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    secureSubmit((secureValues) => {
      try {
        const valorVeiculo = validateNumberRange(Number(secureValues.valorVeiculo), 5000, 10000000, 50000);
        const valorEntrada = validateNumberRange(Number(secureValues.valorEntrada), 0, valorVeiculo, 0);
        const taxaAbertura = validateNumberRange(Number(secureValues.taxaAbertura), 0, 50000, 0);
        const taxaJuros = validateNumberRange(Number(secureValues.taxaJuros), 0.1, 5, 1.5);
        const numParcelas = validateNumberRange(Number(secureValues.numParcelas), 6, 120, 48);
        
        if (valorEntrada >= valorVeiculo) {
          toast({
            title: "Valor inválido",
            description: "O valor da entrada deve ser menor que o valor do veículo.",
            variant: "destructive",
          });
          return;
        }
        
        const resultado = calcularFinanciamento2025(
          valorVeiculo,
          valorEntrada,
          taxaAbertura,
          taxaJuros,
          numParcelas,
          Boolean(secureValues.incluirIOF)
        );
        
        setResult(resultado);
        
        setTimeout(() => {
          const resultElement = document.getElementById("resultado-simulacao");
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } catch (error) {
        console.error("Erro ao calcular simulação:", error);
        toast({
          title: "Erro ao calcular",
          description: "Ocorreu um erro ao processar sua simulação. Tente novamente.",
          variant: "destructive",
        });
      }
    }, values);
  }

  return (
    <>
      <Helmet>
        <title>Simulador de Financiamento de Veículo 2025 | Calcule com Entrada e Taxas</title>
        <meta name="description" content="Simulador de financiamento de veículo atualizado 2025. Calcule parcelas com valor de entrada, taxa de abertura de crédito, IOF e taxa efetiva (CET). Gratuito e completo." />
        <meta name="keywords" content="simulador financiamento veículo 2025, calculadora financiamento carro, entrada financiamento, taxa abertura crédito, CET, IOF, tabela price" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-financiamento-veiculo-2025" />
        <meta property="og:title" content="Simulador de Financiamento de Veículo 2025 | Calcule com Entrada e Taxas" />
        <meta property="og:description" content="Simulador completo de financiamento de veículo 2025. Calcule parcelas considerando entrada, taxa de abertura de crédito e IOF." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/simulador-financiamento-veiculo-2025" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <section className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">Simulador de Financiamento de Veículo [Atualizado 2025]</h1>
            <p className="text-xl text-gray-700 mb-4">Calcule parcelas com entrada, taxa de abertura de crédito e IOF</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ Com Entrada</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Taxa de Abertura</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ CET Real</span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">✓ Atualizado 2025</span>
            </div>
          </div>
        </section>
        
        <section className="mb-12 bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <p className="mb-4 text-lg">Este <strong>simulador de financiamento de veículo 2025</strong> é a versão mais completa e atualizada, permitindo calcular o financiamento considerando o <strong>valor de entrada</strong> e a <strong>taxa de abertura de crédito (TAC)</strong>, além do IOF. O resultado mostra a <strong>taxa efetiva (CET)</strong> real da operação.</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Novidades do Simulador 2025</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-yellow-700">
                  <li>✓ Campo para valor de entrada</li>
                  <li>✓ Taxa de abertura de crédito (TAC)</li>
                  <li>✓ Cálculo do CET real</li>
                </ul>
                <ul className="space-y-2 text-yellow-700">
                  <li>✓ IOF incluído no cálculo</li>
                  <li>✓ Tabela de amortização completa</li>
                  <li>✓ Exportação em PDF e Excel</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
              <CsrfInput />
              
              {isLimited && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-start">
                  <ShieldAlert className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Detectamos muitas solicitações em um curto período. Por favor, aguarde alguns instantes antes de tentar novamente.
                  </p>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-4">Dados do Veículo e Financiamento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <FormField
                    control={form.control}
                    name="valorVeiculo"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-blue-700">Valor do Veículo (R$)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                            <Input
                              type="number"
                              placeholder="50000"
                              className="pl-10 pr-4 py-3 bg-white border-blue-200"
                              min="5000"
                              max="10000000"
                              step="1000"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-blue-600">Valor total do veículo</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="valorEntrada"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-blue-700">Valor de Entrada (R$)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                            <Input
                              type="number"
                              placeholder="10000"
                              className="pl-10 pr-4 py-3 bg-white border-blue-200"
                              min="0"
                              step="1000"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-blue-600">Recomendado: 20% do valor do veículo</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxaAbertura"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-blue-700">Taxa de Abertura de Crédito (R$)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                            <Input
                              type="number"
                              placeholder="800"
                              className="pl-10 pr-4 py-3 bg-white border-blue-200"
                              min="0"
                              step="100"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-blue-600">TAC cobrada pelo banco (média: R$ 500 a R$ 1.500)</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxaJuros"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-blue-700">Taxa de Juros (% ao mês)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.1"
                              min="0.1"
                              max="5.0"
                              placeholder="1.5"
                              className="pl-4 pr-10 py-3 bg-white border-blue-200"
                              {...field}
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                          </div>
                        </FormControl>
                        <p className="text-xs text-blue-600">Taxa média para veículos: 1,5% a.m.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="numParcelas"
                    render={({ field }) => (
                      <FormItem className="space-y-2 md:col-span-2">
                        <FormLabel className="text-sm font-medium text-blue-700">Número de Parcelas</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger className="pl-4 pr-10 py-3 bg-white border-blue-200">
                              <SelectValue placeholder="Selecione o número de parcelas" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="24">24 meses (2 anos)</SelectItem>
                            <SelectItem value="36">36 meses (3 anos)</SelectItem>
                            <SelectItem value="48">48 meses (4 anos)</SelectItem>
                            <SelectItem value="60">60 meses (5 anos)</SelectItem>
                            <SelectItem value="72">72 meses (6 anos)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-blue-600">Prazo comum para veículos: 48 a 60 meses</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <h4 className="font-semibold text-blue-800 mb-3">Configurações Adicionais</h4>
                
                <FormField
                  control={form.control}
                  name="incluirIOF"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white rounded-md border border-blue-200 p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-blue-700">
                          Incluir IOF no cálculo
                        </FormLabel>
                        <p className="text-xs text-blue-600">
                          IOF para financiamento de veículos: 0,0082% ao dia (até 365 dias) + 0,38% fixo
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-md shadow-sm transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                  Calcular Financiamento
                </Button>
              </div>
            </form>
          </Form>
          
          {result && (
            <div id="resultado-simulacao" className="mb-8">
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">Resultado da Simulação</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Valor da Parcela</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valorParcela)}
                  </p>
                </div>
                
                <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalPagar)}
                  </p>
                </div>
                
                <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Total de Juros</p>
                  <p className="text-2xl font-bold text-red-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalJuros)}
                  </p>
                </div>
                
                {result.valorIOF !== undefined && (
                  <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-1">Valor do IOF</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(result.valorIOF))}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Imposto sobre Operações Financeiras</p>
                  </div>
                )}
                
                {result.taxaCET !== undefined && (
                  <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-1">CET (Custo Efetivo Total)</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {result.taxaCET.toFixed(2)}% a.m.
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Taxa efetiva considerando todas as taxas</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-heading font-semibold">Evolução do Saldo Devedor</h4>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-primary hover:text-primary-dark flex items-center"
                    onClick={() => setIsTableExpanded(!isTableExpanded)}
                  >
                    {isTableExpanded ? "Mostrar menos" : "Ver tabela completa"}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ml-1 transform transition-transform ${isTableExpanded ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
                
                <PriceTable data={result.tabelaAmortizacao} expanded={isTableExpanded} />
              </div>
              
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-600 italic">* Este é apenas um cálculo aproximado. As condições reais podem variar conforme a instituição financeira.</p>
                  
                  <ExportButtons 
                    data={result.tabelaAmortizacao} 
                    fileName="simulacao-financiamento-veiculo-2025" 
                    title="Simulação de Financiamento de Veículo 2025"
                    summary={{
                      valorVeiculo: form.getValues().valorVeiculo,
                      valorEntrada: form.getValues().valorEntrada,
                      taxaAbertura: form.getValues().taxaAbertura,
                      taxaJuros: form.getValues().taxaJuros,
                      numParcelas: form.getValues().numParcelas,
                      valorParcela: result.valorParcela,
                      totalPagar: result.totalPagar,
                      totalJuros: result.totalJuros,
                      ...(result.valorIOF !== undefined && { valorIOF: result.valorIOF }),
                      ...(result.taxaCET !== undefined && { taxaCET: result.taxaCET })
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-primary mb-6">Entenda o Simulador de Financiamento 2025</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">O que é a Taxa de Abertura de Crédito (TAC)?</h3>
                <p className="text-neutral-700">A <strong>Taxa de Abertura de Crédito (TAC)</strong> é uma tarifa cobrada pelos bancos para análise e liberação do crédito. Ela varia de R$ 500 a R$ 1.500 e é adicionada ao valor financiado, impactando o CET final.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Como é calculado o CET (Custo Efetivo Total)?</h3>
                <p className="text-neutral-700">O <strong>CET</strong> representa a taxa efetiva real do financiamento, considerando juros, IOF, TAC e outras taxas. É a melhor métrica para comparar ofertas de diferentes bancos.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Qual o valor ideal de entrada?</h3>
                <p className="text-neutral-700">Recomenda-se dar pelo menos <strong>20% do valor do veículo como entrada</strong>. Quanto maior a entrada, menor o valor financiado e menores os juros totais pagos.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-primary mb-6">Como Funciona o Cálculo do Financiamento de Veículo</h2>
            
            <div className="prose prose-lg max-w-none text-neutral-700">
              <p className="mb-4">
                Nosso <strong>simulador de financiamento de veículo 2025</strong> utiliza a metodologia da <strong>Tabela Price</strong>, o sistema mais comum no Brasil para financiamentos de veículos. Entenda cada etapa do cálculo:
              </p>
              
              <h3 className="text-xl font-semibold text-primary mt-6 mb-3">1. Cálculo do Valor Financiado</h3>
              <p className="mb-4">
                O primeiro passo é determinar quanto você realmente vai financiar:
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-mono text-sm">
                  <strong>Valor Financiado Base</strong> = Valor do Veículo - Valor de Entrada<br/>
                  <strong>Valor Financiado Total</strong> = Valor Financiado Base + Taxa de Abertura de Crédito + IOF (se aplicável)
                </p>
              </div>
              <p className="mb-4">
                Por exemplo, em um veículo de R$ 50.000 com entrada de R$ 10.000 e TAC de R$ 800:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Valor Financiado Base: R$ 40.000</li>
                <li>Com TAC: R$ 40.800</li>
                <li>Com IOF (aproximadamente R$ 550): R$ 41.350</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-primary mt-6 mb-3">2. Cálculo do IOF (Imposto sobre Operações Financeiras)</h3>
              <p className="mb-4">
                O <strong>IOF</strong> é um imposto federal obrigatório em operações de crédito. Para financiamentos de veículos, ele é composto por duas partes:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-gray-200 rounded p-4">
                  <h4 className="font-semibold text-blue-700 mb-2">IOF Diário</h4>
                  <p className="text-sm mb-2">0,0082% ao dia sobre o valor financiado</p>
                  <p className="text-xs text-gray-600">Limitado a 365 dias (máximo 2,99%)</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-4">
                  <h4 className="font-semibold text-blue-700 mb-2">IOF Adicional</h4>
                  <p className="text-sm mb-2">0,38% fixo sobre o valor financiado</p>
                  <p className="text-xs text-gray-600">Cobrado uma única vez</p>
                </div>
              </div>
              <p className="mb-4">
                <strong>Exemplo de cálculo do IOF:</strong> Para um financiamento de R$ 40.800 em 48 meses:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>IOF Diário: R$ 40.800 × 0,0082% × 365 dias = R$ 122,20</li>
                <li>IOF Adicional: R$ 40.800 × 0,38% = R$ 155,04</li>
                <li><strong>IOF Total: R$ 277,24</strong></li>
              </ul>
              
              <h3 className="text-xl font-semibold text-primary mt-6 mb-3">3. Cálculo da Parcela (Sistema Tabela Price)</h3>
              <p className="mb-4">
                A <strong>Tabela Price</strong> é um sistema de amortização onde as parcelas são fixas durante todo o período. A fórmula utilizada é:
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-mono text-sm">
                  <strong>Parcela</strong> = Valor Financiado × [i × (1 + i)^n] / [(1 + i)^n - 1]
                </p>
                <p className="text-xs mt-2 text-gray-700">
                  Onde: i = taxa de juros mensal (em decimal), n = número de parcelas
                </p>
              </div>
              <p className="mb-4">
                <strong>Exemplo prático:</strong> Financiamento de R$ 41.350 a 1,5% a.m. em 48 meses:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Taxa mensal (i): 1,5% = 0,015</li>
                <li>Número de parcelas (n): 48</li>
                <li><strong>Valor da parcela: R$ 1.088,45</strong></li>
              </ul>
              
              <h3 className="text-xl font-semibold text-primary mt-6 mb-3">4. Cálculo do CET (Custo Efetivo Total)</h3>
              <p className="mb-4">
                O <strong>CET</strong> é a taxa que realmente importa, pois mostra o custo total da operação. Ele é calculado usando o método de Newton-Raphson para encontrar a taxa que iguala:
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="font-mono text-sm mb-2">
                  <strong>Valor Líquido Recebido</strong> = Soma do Valor Presente de todas as Parcelas
                </p>
                <p className="text-xs text-gray-700">
                  O CET considera que você recebe R$ 40.000 (valor líquido), mas paga parcelas calculadas sobre R$ 41.350 (com taxas e IOF)
                </p>
              </div>
              <p className="mb-4">
                <strong>Por que o CET é maior que a taxa nominal?</strong>
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Você recebe menos dinheiro do que o valor sobre o qual paga juros</li>
                <li>A TAC e o IOF aumentam o custo efetivo da operação</li>
                <li>No exemplo acima, com taxa nominal de 1,5% a.m., o CET fica em torno de 1,65% a.m.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-primary mt-6 mb-3">5. Tabela de Amortização</h3>
              <p className="mb-4">
                A <strong>tabela de amortização</strong> mostra a evolução do saldo devedor mês a mês. Em cada parcela:
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left border">Componente</th>
                      <th className="px-4 py-2 text-left border">Cálculo</th>
                      <th className="px-4 py-2 text-left border">Observação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border">
                      <td className="px-4 py-2 border font-semibold">Juros</td>
                      <td className="px-4 py-2 border">Saldo Devedor × Taxa Mensal</td>
                      <td className="px-4 py-2 border text-xs">Diminui ao longo do tempo</td>
                    </tr>
                    <tr className="border bg-gray-50">
                      <td className="px-4 py-2 border font-semibold">Amortização</td>
                      <td className="px-4 py-2 border">Parcela - Juros</td>
                      <td className="px-4 py-2 border text-xs">Aumenta ao longo do tempo</td>
                    </tr>
                    <tr className="border">
                      <td className="px-4 py-2 border font-semibold">Saldo Devedor</td>
                      <td className="px-4 py-2 border">Saldo Anterior - Amortização</td>
                      <td className="px-4 py-2 border text-xs">Reduz até chegar a zero</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
                <h4 className="font-semibold text-green-800 mb-2">💡 Dica Importante</h4>
                <p className="text-sm text-green-900">
                  Nas primeiras parcelas, você paga mais juros e menos amortização. Nas últimas parcelas, isso se inverte. Por isso, quitar antecipadamente no início do financiamento gera mais economia.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-primary mb-6">Comparação: Com e Sem Taxas Adicionais</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="px-4 py-3 border text-left">Cenário</th>
                    <th className="px-4 py-3 border text-center">Valor Financiado</th>
                    <th className="px-4 py-3 border text-center">Parcela (48x)</th>
                    <th className="px-4 py-3 border text-center">Total Pago</th>
                    <th className="px-4 py-3 border text-center">CET</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 border font-semibold">Sem TAC e IOF</td>
                    <td className="px-4 py-3 border text-center">R$ 40.000</td>
                    <td className="px-4 py-3 border text-center">R$ 1.053,22</td>
                    <td className="px-4 py-3 border text-center">R$ 50.554,56</td>
                    <td className="px-4 py-3 border text-center text-green-600 font-semibold">1,50%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 border font-semibold">Com TAC (R$ 800)</td>
                    <td className="px-4 py-3 border text-center">R$ 40.800</td>
                    <td className="px-4 py-3 border text-center">R$ 1.074,23</td>
                    <td className="px-4 py-3 border text-center">R$ 51.563,04</td>
                    <td className="px-4 py-3 border text-center text-orange-600 font-semibold">1,58%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border font-semibold">Com TAC + IOF</td>
                    <td className="px-4 py-3 border text-center">R$ 41.350</td>
                    <td className="px-4 py-3 border text-center">R$ 1.088,45</td>
                    <td className="px-4 py-3 border text-center">R$ 52.245,60</td>
                    <td className="px-4 py-3 border text-center text-red-600 font-semibold">1,65%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-red-50 border border-red-200 rounded p-4">
              <p className="text-sm text-red-900">
                <strong>Atenção:</strong> No exemplo acima, mesmo com a taxa nominal de 1,5% a.m., o custo efetivo (CET) sobe para 1,65% a.m. quando incluímos TAC e IOF. Isso representa uma diferença de R$ 1.691,04 no total pago!
              </p>
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-primary mb-6">Dicas para Economizar no Financiamento de Veículo</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center">
                  <span className="text-2xl mr-2">💰</span>
                  Aumente a Entrada
                </h3>
                <p className="text-sm text-neutral-700 mb-2">
                  Cada R$ 1.000 a mais na entrada reduz aproximadamente R$ 26 na parcela (em 48 meses a 1,5% a.m.).
                </p>
                <p className="text-xs text-neutral-600">
                  Entrada de 30% em vez de 20% pode economizar mais de R$ 2.000 em juros.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center">
                  <span className="text-2xl mr-2">📉</span>
                  Negocie a TAC
                </h3>
                <p className="text-sm text-neutral-700 mb-2">
                  A Taxa de Abertura de Crédito é negociável. Alguns bancos isentam clientes com bom relacionamento.
                </p>
                <p className="text-xs text-neutral-600">
                  Reduzir a TAC de R$ 1.500 para R$ 500 economiza cerca de R$ 1.300 no total.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center">
                  <span className="text-2xl mr-2">⏱️</span>
                  Reduza o Prazo
                </h3>
                <p className="text-sm text-neutral-700 mb-2">
                  Financiar em 36 meses em vez de 48 pode economizar 20% em juros, mesmo com parcelas maiores.
                </p>
                <p className="text-xs text-neutral-600">
                  Use nosso simulador para comparar diferentes prazos e encontrar o equilíbrio ideal.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🔍</span>
                  Compare o CET
                </h3>
                <p className="text-sm text-neutral-700 mb-2">
                  Sempre compare ofertas pelo CET, não apenas pela taxa de juros nominal. O CET mostra o custo real.
                </p>
                <p className="text-xs text-neutral-600">
                  Uma oferta com juros de 1,4% e TAC alta pode custar mais que 1,5% sem TAC.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-primary mb-6">Perguntas Frequentes sobre Financiamento de Veículo 2025</h2>
            
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Por que o CET é diferente da taxa de juros?</h3>
                <p className="text-neutral-700">O CET (Custo Efetivo Total) inclui todos os custos da operação: juros, IOF, TAC e outras tarifas. A taxa de juros nominal considera apenas os juros. Por isso, o CET sempre será igual ou maior que a taxa nominal.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Posso financiar sem dar entrada?</h3>
                <p className="text-neutral-700">Alguns bancos oferecem financiamento de 100% do valor do veículo, mas as taxas são significativamente mais altas. Recomendamos dar pelo menos 20% de entrada para obter melhores condições e evitar ficar com dívida maior que o valor do carro.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">O IOF é obrigatório em todo financiamento?</h3>
                <p className="text-neutral-700">Sim, o IOF é um imposto federal obrigatório em todas as operações de crédito no Brasil. Não há como evitá-lo, mas você pode minimizar seu impacto dando uma entrada maior ou escolhendo prazos menores.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Vale a pena quitar o financiamento antecipadamente?</h3>
                <p className="text-neutral-700">Sim, especialmente no início do financiamento quando a maior parte da parcela é composta por juros. Use nosso simulador para ver quanto você economizaria quitando antecipadamente. Lembre-se de verificar se há taxa de quitação antecipada no seu contrato.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-primary mb-2">Como posso reduzir o CET do meu financiamento?</h3>
                <p className="text-neutral-700">Para reduzir o CET: (1) Aumente a entrada, (2) Negocie a isenção ou redução da TAC, (3) Escolha prazos menores, (4) Compare ofertas de diferentes bancos, (5) Melhore seu score de crédito antes de solicitar o financiamento.</p>
              </div>
            </div>
          </div>
        </section>
        
        <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h2 className="text-2xl font-bold text-primary mb-4">Pronto para Simular seu Financiamento?</h2>
          <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
            Use nosso <strong>simulador de financiamento de veículo 2025</strong> gratuitamente e descubra o valor real das parcelas, incluindo todas as taxas e o CET. Tome decisões financeiras mais inteligentes!
          </p>
          <Button
            onClick={() => {
              const simulador = document.querySelector('form');
              if (simulador) {
                simulador.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-md shadow-sm"
          >
            Simular Agora
          </Button>
        </div>
      </div>
    </>
  );
}
