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
import DebtChart from "@/components/simulators/debt-chart";
import { useSecureForm } from "@/hooks/use-secure-form";
import { validateNumberRange } from "@/utils/security";
import type { TableData, SimulationResult } from "@/components/simulators/vehicle-form";

const formSchema = z.object({
  valorCaminhao: z.coerce.number().min(50000, "O valor mínimo é R$ 50.000,00"),
  valorEntrada: z.coerce.number().min(0, "O valor da entrada não pode ser negativo"),
  taxaJuros: z.coerce.number().min(0.1, "A taxa mínima é 0,1%").max(4, "A taxa máxima é 4%"),
  numParcelas: z.coerce.number().min(6, "O número mínimo de parcelas é 6").max(120, "O número máximo de parcelas é 120"),
  incluirIOF: z.boolean().default(false),
  tipoVeiculo: z.string().min(1, "Selecione o tipo de caminhão")
});

function calcularCET(valorLiquidoRecebido: number, valorParcela: number, numParcelas: number): number {
  let cet = 0.02;
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
      return cet * 100;
    }
    
    cet = cet - f / dvp;
    if (cet < 0) cet = 0.001;
  }
  
  return cet * 100;
}

function calcularTaxaPorTipo(tipoVeiculo: string): number {
  const TAXA_PADRAO = 1.58;
  
  switch (tipoVeiculo) {
    case "leve": return TAXA_PADRAO - 0.03;
    case "medio": return TAXA_PADRAO - 0.01;
    case "pesado": return TAXA_PADRAO;
    case "extra-pesado": return TAXA_PADRAO + 0.05;
    case "implemento": return TAXA_PADRAO + 0.02;
    default: return TAXA_PADRAO;
  }
}

function calcularFinanciamentoCaminhao(
  valorCaminhao: number,
  valorEntrada: number,
  taxaJuros: number,
  numParcelas: number,
  incluirIOF: boolean
): SimulationResult {
  const valorFinanciadoBase = valorCaminhao - valorEntrada;
  let valorFinanciadoTotal = valorFinanciadoBase;
  
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

export default function TruckForm2025() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const { toast } = useToast();
  
  const { secureSubmit, isSubmitting, isLimited, CsrfInput } = useSecureForm({
    formId: 'truck-finance-2025-form',
    rateLimiterOptions: { maxAttempts: 15, timeWindowMs: 60000 }
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorCaminhao: 300000,
      valorEntrada: 60000,
      taxaJuros: 1.58,
      numParcelas: 60,
      incluirIOF: false,
      tipoVeiculo: "pesado",
    },
  });

  const tipoVeiculo = form.watch("tipoVeiculo");
  const taxaAjustada = calcularTaxaPorTipo(tipoVeiculo);

  function onSubmit(values: z.infer<typeof formSchema>) {
    secureSubmit((secureValues) => {
      try {
        const valorCaminhao = validateNumberRange(Number(secureValues.valorCaminhao), 50000, 10000000, 300000);
        const valorEntrada = validateNumberRange(Number(secureValues.valorEntrada), 0, valorCaminhao, 0);
        const numParcelas = validateNumberRange(Number(secureValues.numParcelas), 6, 120, 60);
        
        if (valorEntrada >= valorCaminhao) {
          toast({
            title: "Valor inválido",
            description: "O valor da entrada deve ser menor que o valor do caminhão.",
            variant: "destructive",
          });
          return;
        }
        
        const resultado = calcularFinanciamentoCaminhao(
          valorCaminhao,
          valorEntrada,
          taxaAjustada,
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
          
          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-orange-800 mb-4">Dados do Financiamento de Caminhões</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <FormField
                control={form.control}
                name="valorCaminhao"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-orange-700">Valor do Caminhão (R$)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                        <Input
                          type="number"
                          placeholder="300000"
                          className="pl-10 pr-4 py-3 bg-white border-orange-200"
                          min="50000"
                          step="10000"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-orange-600">Valor total do caminhão</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="valorEntrada"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-orange-700">Valor de Entrada (R$)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                        <Input
                          type="number"
                          placeholder="60000"
                          className="pl-10 pr-4 py-3 bg-white border-orange-200"
                          min="0"
                          step="5000"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-orange-600">Recomendado: 20% do valor do caminhão</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipoVeiculo"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-orange-700">Tipo de Caminhão</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="pl-4 pr-10 py-3 bg-white border-orange-200">
                          <SelectValue placeholder="Selecione o tipo de caminhão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="leve">Leve (até 10 ton.)</SelectItem>
                        <SelectItem value="medio">Médio (10-15 ton.)</SelectItem>
                        <SelectItem value="pesado">Pesado (15-40 ton.)</SelectItem>
                        <SelectItem value="extra-pesado">Extra-pesado (acima de 40 ton.)</SelectItem>
                        <SelectItem value="implemento">Implemento rodoviário/Semirreboque</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-orange-600">Taxa ajustada: {taxaAjustada}% a.m.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numParcelas"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-orange-700">Número de Parcelas</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger className="pl-4 pr-10 py-3 bg-white border-orange-200">
                          <SelectValue placeholder="Selecione o número de parcelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="24">24 meses (2 anos)</SelectItem>
                        <SelectItem value="36">36 meses (3 anos)</SelectItem>
                        <SelectItem value="48">48 meses (4 anos)</SelectItem>
                        <SelectItem value="60">60 meses (5 anos)</SelectItem>
                        <SelectItem value="72">72 meses (6 anos)</SelectItem>
                        <SelectItem value="84">84 meses (7 anos)</SelectItem>
                        <SelectItem value="96">96 meses (8 anos)</SelectItem>
                        <SelectItem value="120">120 meses (10 anos)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-orange-600">Prazo comum: 60 a 120 meses</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <h4 className="font-semibold text-orange-800 mb-3">Configurações Adicionais</h4>
            
            <FormField
              control={form.control}
              name="incluirIOF"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white rounded-md border border-orange-200 p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-orange-700">
                      Incluir IOF no cálculo
                    </FormLabel>
                    <p className="text-xs text-orange-600">
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
              className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : null}
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
              </div>
            )}
            
            {result.taxaCET !== undefined && (
              <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">CET (Custo Efetivo Total)</p>
                <p className="text-2xl font-bold text-purple-600">
                  {result.taxaCET.toFixed(2)}% a.m.
                </p>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="font-heading font-semibold mb-4">Evolução do Saldo Devedor</h4>
            <div className="h-64 md:h-80">
              <DebtChart data={result.tabelaAmortizacao} />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-heading font-semibold">Tabela de Amortização</h4>
              <Button 
                variant="ghost" 
                className="text-sm text-primary"
                onClick={() => setIsTableExpanded(!isTableExpanded)}
              >
                {isTableExpanded ? "Mostrar menos" : "Ver tabela completa"}
              </Button>
            </div>
            
            <PriceTable data={result.tabelaAmortizacao} expanded={isTableExpanded} />
          </div>
          
          <div className="mt-6">
            <ExportButtons 
              data={result.tabelaAmortizacao} 
              fileName="simulacao-financiamento-caminhao" 
              title="Simulação de Financiamento de Caminhão"
              summary={{
                valorCaminhao: form.getValues().valorCaminhao,
                valorEntrada: form.getValues().valorEntrada,
                taxaJuros: taxaAjustada,
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
      )}
    </>
  );
}
