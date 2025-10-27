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

export default function VehicleForm2025() {
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
                fileName="simulacao-financiamento-veiculo" 
                title="Simulação de Financiamento de Veículo"
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
    </>
  );
}
