import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { simularFinanciamento } from "@/utils/finance";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const leasingSchema = z.object({
  valorVeiculo: z.coerce
    .number()
    .min(20000, "O valor mínimo é R$ 20.000,00")
    .max(500000, "O valor máximo é R$ 500.000,00"),
  porcentagemEntrada: z.coerce
    .number()
    .min(0, "A entrada mínima é 0%")
    .max(70, "A entrada máxima é 70%"),
  taxaJurosFinanciamento: z.coerce
    .number()
    .min(0.5, "A taxa mínima é 0,5%")
    .max(3.5, "A taxa máxima é 3,5%"),
  taxaJurosLeasing: z.coerce
    .number()
    .min(0.5, "A taxa mínima é 0,5%")
    .max(3.5, "A taxa máxima é 3,5%"),
  numParcelas: z.coerce
    .number()
    .min(12, "O número mínimo de parcelas é 12")
    .max(60, "O número máximo de parcelas é 60"),
  valorResidualLeasing: z.coerce
    .number()
    .min(10, "O valor mínimo é 10%")
    .max(50, "O valor máximo é 50%"),
  isPessoaJuridica: z.boolean().default(false)
});

interface LeasingResult {
  parcelaLeasing: number;
  parcelaFinanciamento: number;
  totalPagarLeasing: number;
  totalPagarFinanciamento: number;
  valorResidual: number;
  totalJurosLeasing: number;
  totalJurosFinanciamento: number;
  economiaIRPJ: number; // Economia com IR para PJ
  custoEfetivoLeasing: number;
  custoEfetivoFinanciamento: number;
  vencedorCustoBruto: "leasing" | "financiamento" | "empate";
  vencedorCustoLiquido: "leasing" | "financiamento" | "empate";
  diferencaPercentual: number;
  comparisonData: any[];
  vantagens: {
    criterio: string;
    leasing: number;
    financiamento: number;
  }[];
}

export default function LeasingVsFinancing() {
  const [result, setResult] = useState<LeasingResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof leasingSchema>>({
    resolver: zodResolver(leasingSchema),
    defaultValues: {
      valorVeiculo: 100000,
      porcentagemEntrada: 20,
      taxaJurosFinanciamento: 1.8,
      taxaJurosLeasing: 1.5,
      numParcelas: 36,
      valorResidualLeasing: 20,
      isPessoaJuridica: false
    },
  });

  // Valores observados para cálculos em tempo real
  const valorVeiculo = form.watch("valorVeiculo");
  const porcentagemEntrada = form.watch("porcentagemEntrada");
  const valorResidualLeasing = form.watch("valorResidualLeasing");
  
  // Cálculos em tempo real
  const valorEntrada = valorVeiculo * (porcentagemEntrada / 100);
  const valorResidualCalculado = valorVeiculo * (valorResidualLeasing / 100);

  function onSubmit(values: z.infer<typeof leasingSchema>) {
    setIsSubmitting(true);
    try {
      // Valores iniciais baseados nos inputs
      const valorEntrada = values.valorVeiculo * (values.porcentagemEntrada / 100);
      const valorResidual = values.valorVeiculo * (values.valorResidualLeasing / 100);
      
      // Cálculos para financiamento
      const valorFinanciado = values.valorVeiculo - valorEntrada;
      const resultadoFinanciamento = simularFinanciamento(
        valorFinanciado,
        values.taxaJurosFinanciamento,
        values.numParcelas,
        true // Incluir IOF para veículos
      );
      
      // Cálculos para leasing
      // No leasing, financiamos o valor do veículo menos a entrada e o valor residual
      const valorLeasingFinanciado = values.valorVeiculo - valorEntrada - valorResidual;
      const resultadoLeasing = simularFinanciamento(
        valorLeasingFinanciado,
        values.taxaJurosLeasing,
        values.numParcelas,
        false // Leasing não tem IOF
      );
      
      // Total a pagar inclui entrada + parcelas + valor residual (para leasing)
      const totalPagarLeasing = valorEntrada + resultadoLeasing.totalPagar + valorResidual;
      const totalPagarFinanciamento = valorEntrada + resultadoFinanciamento.totalPagar;
      
      // Cálculo do benefício fiscal para PJ (dedução de IR aproximada)
      const taxaIRPJ = 0.25; // 25% é uma aproximação para IRPJ + CSLL
      const economiaIRPJ = values.isPessoaJuridica ? (resultadoLeasing.totalPagar * taxaIRPJ) : 0;
      
      // Custo efetivo considerando benefícios fiscais
      const custoEfetivoLeasing = totalPagarLeasing - economiaIRPJ;
      const custoEfetivoFinanciamento = totalPagarFinanciamento;
      
      // Determinar qual opção é mais vantajosa
      let vencedorCustoBruto: "leasing" | "financiamento" | "empate" = "empate";
      let vencedorCustoLiquido: "leasing" | "financiamento" | "empate" = "empate";
      
      if (totalPagarLeasing < totalPagarFinanciamento) {
        vencedorCustoBruto = "leasing";
      } else if (totalPagarLeasing > totalPagarFinanciamento) {
        vencedorCustoBruto = "financiamento";
      }
      
      if (custoEfetivoLeasing < custoEfetivoFinanciamento) {
        vencedorCustoLiquido = "leasing";
      } else if (custoEfetivoLeasing > custoEfetivoFinanciamento) {
        vencedorCustoLiquido = "financiamento";
      }
      
      // Diferença percentual entre as duas opções
      const diferencaPercentual = Math.abs((totalPagarLeasing - totalPagarFinanciamento) / totalPagarFinanciamento * 100);
      
      // Dados para comparação em gráficos
      const comparisonData = [
        {
          name: "Entrada",
          leasing: valorEntrada,
          financiamento: valorEntrada
        },
        {
          name: "Parcelas",
          leasing: resultadoLeasing.totalPagar,
          financiamento: resultadoFinanciamento.totalPagar
        },
        {
          name: "Valor Residual",
          leasing: valorResidual,
          financiamento: 0
        },
        {
          name: "Total",
          leasing: totalPagarLeasing,
          financiamento: totalPagarFinanciamento
        }
      ];
      
      // Análise de vantagens comparativas (escala de 0-10)
      const vantagens = [
        {
          criterio: "Custo Total",
          leasing: vencedorCustoBruto === "leasing" ? 8 : 5,
          financiamento: vencedorCustoBruto === "financiamento" ? 8 : 5
        },
        {
          criterio: "Benefício Fiscal",
          leasing: values.isPessoaJuridica ? 9 : 3,
          financiamento: 4
        },
        {
          criterio: "Flexibilidade",
          leasing: 8,
          financiamento: 5
        },
        {
          criterio: "Propriedade",
          leasing: 4,
          financiamento: 9
        },
        {
          criterio: "Custo Inicial",
          leasing: 7,
          financiamento: 6
        }
      ];
      
      // Resultado final
      setResult({
        parcelaLeasing: resultadoLeasing.valorParcela,
        parcelaFinanciamento: resultadoFinanciamento.valorParcela,
        totalPagarLeasing,
        totalPagarFinanciamento,
        valorResidual,
        totalJurosLeasing: resultadoLeasing.totalJuros,
        totalJurosFinanciamento: resultadoFinanciamento.totalJuros,
        economiaIRPJ,
        custoEfetivoLeasing,
        custoEfetivoFinanciamento,
        vencedorCustoBruto,
        vencedorCustoLiquido,
        diferencaPercentual,
        comparisonData,
        vantagens
      });
      
      // Auto scroll to results
      setTimeout(() => {
        const resultElement = document.getElementById("resultado-simulacao");
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      toast({
        title: "Erro ao calcular",
        description: "Ocorreu um erro ao processar sua simulação. Tente novamente.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Cores para os gráficos
  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444'];

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Leasing vs. Financiamento</h2>
        
        <div className="mb-8">
          <p className="mb-4">Ao adquirir um veículo, duas das principais modalidades disponíveis são o leasing e o financiamento tradicional. Cada uma tem características próprias que podem ser mais vantajosas dependendo do seu perfil e necessidades.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">Leasing</h3>
              <p className="text-sm text-neutral-700 mb-2">O leasing é um contrato de arrendamento mercantil onde você "aluga" o veículo por um período determinado, com a opção de comprá-lo ao final pelo valor residual.</p>
              <h4 className="font-medium text-primary mb-1">Principais características:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm text-neutral-700"><strong>Propriedade:</strong> O veículo pertence à instituição financeira durante todo o contrato.</li>
                <li className="text-sm text-neutral-700"><strong>Valor residual:</strong> Percentual do valor do veículo pago ao final do contrato para adquiri-lo.</li>
                <li className="text-sm text-neutral-700"><strong>Taxas:</strong> Geralmente menores que no financiamento tradicional.</li>
                <li className="text-sm text-neutral-700"><strong>Benefícios fiscais:</strong> Para pessoas jurídicas, oferece dedução de até 100% das parcelas no Imposto de Renda.</li>
              </ul>
            </div>
            
            <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">Financiamento</h3>
              <p className="text-sm text-neutral-700 mb-2">No financiamento tradicional, você compra o veículo e paga o valor em parcelas, tornando-se proprietário desde o início da operação.</p>
              <h4 className="font-medium text-primary mb-1">Principais características:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm text-neutral-700"><strong>Propriedade:</strong> O veículo é seu desde o início, embora fique alienado à instituição financeira.</li>
                <li className="text-sm text-neutral-700"><strong>Flexibilidade:</strong> Liberdade para vender, modificar ou transferir o veículo (com autorização da financeira).</li>
                <li className="text-sm text-neutral-700"><strong>Taxas:</strong> Geralmente mais altas que no leasing, e há incidência de IOF.</li>
                <li className="text-sm text-neutral-700"><strong>Simplicidade:</strong> Processo mais familiar e direto para a maioria das pessoas.</li>
              </ul>
            </div>
          </div>
          
          <p className="mb-4">Ao decidir entre leasing e financiamento, considere:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Seu perfil fiscal:</strong> Pessoa física ou jurídica? Os benefícios fiscais do leasing são mais relevantes para empresas.</li>
            <li><strong>Tempo de uso pretendido:</strong> Planeja ficar com o veículo por muito tempo ou pretende trocar em poucos anos?</li>
            <li><strong>Necessidade de personalização:</strong> Precisa fazer modificações significativas no veículo?</li>
            <li><strong>Comparativo de custos:</strong> Analise o custo total em cada modalidade, incluindo entrada, parcelas, valor residual e impostos.</li>
          </ul>
          
          <p>Use nosso simulador comparativo para analisar qual opção é mais vantajosa para o seu caso específico, considerando tanto aspectos financeiros quanto práticos.</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="valorVeiculo"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Valor total do veículo (R$)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                        <Input
                          type="number"
                          placeholder="100000"
                          className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Preço total do veículo</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="porcentagemEntrada"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Entrada (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="20"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <div className="flex justify-between">
                      <p className="text-xs text-neutral-500">Percentual de entrada</p>
                      <p className="text-xs font-medium text-primary">{formatCurrency(valorEntrada)}</p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <FormField
                control={form.control}
                name="taxaJurosFinanciamento"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Taxa de juros - Financiamento (% ao mês)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="1.8"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Taxa para financiamento tradicional</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxaJurosLeasing"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Taxa de juros - Leasing (% ao mês)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="1.5"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Geralmente menor que no financiamento</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numParcelas"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Prazo (em meses)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300">
                          <SelectValue placeholder="Selecione o prazo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="12">12 meses (1 ano)</SelectItem>
                        <SelectItem value="24">24 meses (2 anos)</SelectItem>
                        <SelectItem value="36">36 meses (3 anos)</SelectItem>
                        <SelectItem value="48">48 meses (4 anos)</SelectItem>
                        <SelectItem value="60">60 meses (5 anos)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-neutral-500">Mesmo prazo para ambas opções</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="valorResidualLeasing"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Valor residual do leasing (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="20"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <div className="flex justify-between">
                      <p className="text-xs text-neutral-500">Valor pago ao final do contrato</p>
                      <p className="text-xs font-medium text-primary">{formatCurrency(valorResidualCalculado)}</p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isPessoaJuridica"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-8">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        Pessoa Jurídica
                      </FormLabel>
                      <p className="text-xs text-neutral-500">
                        Considerar benefícios fiscais do leasing para empresas
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
                Comparar Opções
              </Button>
            </div>
          </form>
        </Form>
        
        {result && (
          <div id="resultado-simulacao" className="mb-8">
            <h3 className="font-heading text-xl font-semibold text-primary mb-4">Resultado da comparação</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className={`p-4 rounded-md border ${result.vencedorCustoLiquido === "leasing" ? 'bg-blue-50 border-blue-200' : 'bg-neutral-100 border-neutral-200'}`}>
                <h4 className={`font-heading text-lg font-semibold ${result.vencedorCustoLiquido === "leasing" ? 'text-blue-600' : 'text-primary'} mb-3`}>
                  Leasing
                  {result.vencedorCustoLiquido === "leasing" && (
                    <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-100 py-1 px-2 rounded-full">Mais vantajoso</span>
                  )}
                </h4>
                
                <ul className="space-y-2">
                  <li className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-neutral-600">Valor da parcela:</span>
                    <span className="text-sm font-semibold text-primary text-right">
                      {formatCurrency(result.parcelaLeasing)}
                    </span>
                  </li>
                  <li className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-neutral-600">Entrada:</span>
                    <span className="text-sm font-medium text-right">
                      {formatCurrency(valorEntrada)}
                    </span>
                  </li>
                  <li className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-neutral-600">Valor residual:</span>
                    <span className="text-sm font-medium text-right">
                      {formatCurrency(result.valorResidual)}
                    </span>
                  </li>
                  <li className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-neutral-600">Total de juros:</span>
                    <span className="text-sm font-medium text-right">
                      {formatCurrency(result.totalJurosLeasing)}
                    </span>
                  </li>
                  <li className="grid grid-cols-2 gap-2 border-t border-neutral-200 pt-2 mt-2">
                    <span className="text-sm font-medium text-neutral-700">Total bruto:</span>
                    <span className="text-sm font-semibold text-primary text-right">
                      {formatCurrency(result.totalPagarLeasing)}
                    </span>
                  </li>
                  {form.getValues().isPessoaJuridica && (
                    <>
                      <li className="grid grid-cols-2 gap-2 text-green-600">
                        <span className="text-sm font-medium">Economia fiscal (PJ):</span>
                        <span className="text-sm font-medium text-right">
                          - {formatCurrency(result.economiaIRPJ)}
                        </span>
                      </li>
                      <li className="grid grid-cols-2 gap-2 border-t border-neutral-200 pt-2 mt-2">
                        <span className="text-sm font-medium text-blue-600">Custo efetivo (após IR):</span>
                        <span className="text-sm font-semibold text-blue-600 text-right">
                          {formatCurrency(result.custoEfetivoLeasing)}
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className={`p-4 rounded-md border ${result.vencedorCustoLiquido === "financiamento" ? 'bg-green-50 border-green-200' : 'bg-neutral-100 border-neutral-200'}`}>
                <h4 className={`font-heading text-lg font-semibold ${result.vencedorCustoLiquido === "financiamento" ? 'text-green-600' : 'text-primary'} mb-3`}>
                  Financiamento
                  {result.vencedorCustoLiquido === "financiamento" && (
                    <span className="ml-2 text-xs font-normal text-green-600 bg-green-100 py-1 px-2 rounded-full">Mais vantajoso</span>
                  )}
                </h4>
                
                <ul className="space-y-2">
                  <li className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-neutral-600">Valor da parcela:</span>
                    <span className="text-sm font-semibold text-primary text-right">
                      {formatCurrency(result.parcelaFinanciamento)}
                    </span>
                  </li>
                  <li className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-neutral-600">Entrada:</span>
                    <span className="text-sm font-medium text-right">
                      {formatCurrency(valorEntrada)}
                    </span>
                  </li>
                  <li className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-neutral-600">Valor residual:</span>
                    <span className="text-sm font-medium text-right">
                      {formatCurrency(0)} (Não aplicável)
                    </span>
                  </li>
                  <li className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-neutral-600">Total de juros:</span>
                    <span className="text-sm font-medium text-right">
                      {formatCurrency(result.totalJurosFinanciamento)}
                    </span>
                  </li>
                  <li className="grid grid-cols-2 gap-2 border-t border-neutral-200 pt-2 mt-2">
                    <span className="text-sm font-medium text-neutral-700">Total bruto:</span>
                    <span className="text-sm font-semibold text-primary text-right">
                      {formatCurrency(result.totalPagarFinanciamento)}
                    </span>
                  </li>
                  {form.getValues().isPessoaJuridica && (
                    <>
                      <li className="grid grid-cols-2 gap-2 text-neutral-400">
                        <span className="text-sm font-medium">Economia fiscal (PJ):</span>
                        <span className="text-sm font-medium text-right">
                          {formatCurrency(0)} (Limitada)
                        </span>
                      </li>
                      <li className="grid grid-cols-2 gap-2 border-t border-neutral-200 pt-2 mt-2">
                        <span className="text-sm font-medium text-green-600">Custo efetivo (após IR):</span>
                        <span className="text-sm font-semibold text-green-600 text-right">
                          {formatCurrency(result.custoEfetivoFinanciamento)}
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200 mb-6">
              <h4 className="font-heading font-medium text-primary mb-3">Análise comparativa</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-700 mb-4">
                    {result.vencedorCustoBruto === "leasing" 
                      ? `O leasing tem um custo total ${result.diferencaPercentual.toFixed(1)}% menor que o financiamento tradicional.` 
                      : result.vencedorCustoBruto === "financiamento" 
                        ? `O financiamento tradicional tem um custo total ${result.diferencaPercentual.toFixed(1)}% menor que o leasing.` 
                        : "Os custos totais do leasing e financiamento são praticamente iguais neste cenário."}
                    {form.getValues().isPessoaJuridica && result.vencedorCustoLiquido === "leasing" && 
                      ` Considerando os benefícios fiscais para pessoa jurídica, o leasing torna-se ainda mais vantajoso.`}
                  </p>
                  
                  <h5 className="font-medium text-primary mb-2">Principais diferenças:</h5>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li className="text-sm text-neutral-700">
                      <strong>Parcela mensal:</strong> {result.parcelaLeasing < result.parcelaFinanciamento 
                        ? `O leasing oferece parcela ${formatCurrency(result.parcelaFinanciamento - result.parcelaLeasing)} menor.` 
                        : `O financiamento oferece parcela ${formatCurrency(result.parcelaLeasing - result.parcelaFinanciamento)} menor.`}
                    </li>
                    <li className="text-sm text-neutral-700">
                      <strong>Propriedade:</strong> No financiamento, o veículo é seu desde o início (alienado). No leasing, só ao final do contrato, após pagar o valor residual.
                    </li>
                    {form.getValues().isPessoaJuridica && (
                      <li className="text-sm text-neutral-700">
                        <strong>Benefício fiscal:</strong> No leasing, pessoa jurídica pode deduzir até 100% das parcelas no IR, economizando aproximadamente {formatCurrency(result.economiaIRPJ)}.
                      </li>
                    )}
                    <li className="text-sm text-neutral-700">
                      <strong>Flexibilidade ao final:</strong> No leasing, você pode devolver o veículo ao final sem pagar o valor residual se não quiser ficar com ele.
                    </li>
                  </ul>
                  
                  <h5 className="font-medium text-primary mb-2">Recomendação:</h5>
                  <p className="text-sm text-neutral-700">
                    {form.getValues().isPessoaJuridica 
                      ? `Para pessoa jurídica, o ${result.vencedorCustoLiquido} apresenta melhor custo-benefício considerando os aspectos fiscais.` 
                      : `Para pessoa física, o ${result.vencedorCustoBruto} apresenta melhor custo-benefício neste cenário.`}
                    {result.diferencaPercentual < 5 
                      ? " Como a diferença é pequena, considere também outros fatores como flexibilidade e suas necessidades específicas." 
                      : ""}
                  </p>
                </div>
                
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={result.comparisonData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                      <Tooltip 
                        formatter={(value) => [`R$ ${parseFloat(value as string).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, null]}
                      />
                      <Legend />
                      <Bar dataKey="leasing" name="Leasing" fill="#3b82f6" />
                      <Bar dataKey="financiamento" name="Financiamento" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-md border border-neutral-200">
                <h4 className="font-heading font-medium text-primary mb-3">Análise de vantagens por critério</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={result.vantagens}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="criterio" />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} />
                      <Radar 
                        name="Leasing" 
                        dataKey="leasing" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.6} 
                      />
                      <Radar 
                        name="Financiamento" 
                        dataKey="financiamento" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.6} 
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-neutral-200">
                <h4 className="font-heading font-medium text-primary mb-3">Distribuição de custos</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Entrada', value: valorEntrada },
                          { name: 'Juros', value: result.totalJurosFinanciamento },
                          { name: 'Principal', value: valorVeiculo - valorEntrada - result.totalJurosFinanciamento }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Entrada', value: valorEntrada },
                          { name: 'Juros', value: result.totalJurosFinanciamento },
                          { name: 'Principal', value: valorVeiculo - valorEntrada - result.totalJurosFinanciamento }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => [formatCurrency(parseFloat(value as string)), null]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 italic">* Este é apenas um cálculo aproximado. As condições reais podem variar conforme a instituição financeira e outros fatores específicos. Para benefícios fiscais de pessoa jurídica, consulte seu contador.</p>
            </div>
          </div>
        )}
        
        <div className="bg-neutral-100 border-l-4 border-secondary p-4 mt-6">
          <p className="text-sm font-medium">AVISO IMPORTANTE:</p>
          <p className="text-sm">Não somos uma instituição financeira e não oferecemos empréstimos ou financiamentos. Este site fornece apenas ferramentas de simulação para cálculos e pesquisa. Os resultados são aproximados e podem variar conforme as condições reais oferecidas pelas instituições financeiras. Recomendamos sempre consultar um banco ou financeira para obter condições oficiais antes de tomar qualquer decisão.</p>
        </div>
      </section>
    </div>
  );
}