import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { simularFinanciamento } from "@/utils/finance";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";

const downpaymentSchema = z.object({
  valorVeiculo: z.coerce
    .number()
    .min(10000, "O valor mínimo é R$ 10.000,00")
    .max(500000, "O valor máximo é R$ 500.000,00"),
  rendaMensal: z.coerce
    .number()
    .min(1000, "A renda mínima é R$ 1.000,00")
    .max(50000, "A renda máxima é R$ 50.000,00"),
  taxaJuros: z.coerce
    .number()
    .min(0.5, "A taxa mínima é 0,5%")
    .max(3.5, "A taxa máxima é 3,5%"),
  numParcelas: z.coerce
    .number()
    .min(12, "O número mínimo de parcelas é 12")
    .max(72, "O número máximo de parcelas é 72"),
  porcentagemEntrada: z.coerce
    .number()
    .min(10, "A entrada mínima é 10%")
    .max(90, "A entrada máxima é 90%")
});

interface EntryScenario {
  porcentagemEntrada: number;
  valorEntrada: number;
  valorFinanciado: number;
  valorParcela: number;
  totalPagar: number;
  totalJuros: number;
  valorIOF: number;
  parcelaRenda: number;
}

interface DownpaymentResult {
  cenarios: EntryScenario[];
  rendaMensal: number;
  valorVeiculo: number;
  cenarioIdeal: EntryScenario;
  cenarioInicialSimulado: EntryScenario;
  cenarioRecomendado: EntryScenario;
  chartData: any[];
}

export default function IdealDownpayment() {
  const [result, setResult] = useState<DownpaymentResult | null>(null);
  const [activeTab, setActiveTab] = useState("parcelas");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof downpaymentSchema>>({
    resolver: zodResolver(downpaymentSchema),
    defaultValues: {
      valorVeiculo: 50000,
      rendaMensal: 5000,
      taxaJuros: 1.8,
      numParcelas: 48,
      porcentagemEntrada: 20
    },
  });

  // Valores observados para cálculos em tempo real
  const valorVeiculo = form.watch("valorVeiculo");
  const porcentagemEntrada = form.watch("porcentagemEntrada");
  
  // Cálculo de valor da entrada em tempo real
  const valorEntrada = valorVeiculo * (porcentagemEntrada / 100);

  function onSubmit(values: z.infer<typeof downpaymentSchema>) {
    setIsSubmitting(true);
    try {
      const cenarios: EntryScenario[] = [];
      const chartData: any[] = [];
      
      // Simular diferentes cenários de entrada (de 10% a 50% de 5 em 5%)
      for (let percentual = 10; percentual <= 50; percentual += 5) {
        const valorEntrada = values.valorVeiculo * (percentual / 100);
        const valorFinanciado = values.valorVeiculo - valorEntrada;
        
        // Simulação do financiamento para este cenário
        const simulacao = simularFinanciamento(
          valorFinanciado,
          values.taxaJuros,
          values.numParcelas,
          true // Incluir IOF para veículos
        );
        
        const parcelaRenda = (simulacao.valorParcela / values.rendaMensal) * 100;
        
        const cenario: EntryScenario = {
          porcentagemEntrada: percentual,
          valorEntrada,
          valorFinanciado,
          valorParcela: simulacao.valorParcela,
          totalPagar: simulacao.totalPagar,
          totalJuros: simulacao.totalJuros,
          valorIOF: simulacao.valorIOF || 0,
          parcelaRenda
        };
        
        cenarios.push(cenario);
        
        chartData.push({
          percentual,
          valorEntrada,
          valorParcela: simulacao.valorParcela,
          totalJuros: simulacao.totalJuros,
          valorFinanciado,
          parcelaRenda
        });
      }
      
      // Simular o cenário com a entrada informada pelo usuário
      const valorEntradaInformada = values.valorVeiculo * (values.porcentagemEntrada / 100);
      const valorFinanciadoInformado = values.valorVeiculo - valorEntradaInformada;
      const simulacaoInformada = simularFinanciamento(
        valorFinanciadoInformado,
        values.taxaJuros,
        values.numParcelas,
        true
      );
      
      const cenarioInicialSimulado: EntryScenario = {
        porcentagemEntrada: values.porcentagemEntrada,
        valorEntrada: valorEntradaInformada,
        valorFinanciado: valorFinanciadoInformado,
        valorParcela: simulacaoInformada.valorParcela,
        totalPagar: simulacaoInformada.totalPagar,
        totalJuros: simulacaoInformada.totalJuros,
        valorIOF: simulacaoInformada.valorIOF || 0,
        parcelaRenda: (simulacaoInformada.valorParcela / values.rendaMensal) * 100
      };
      
      // Encontrar o cenário ideal (menor parcela com menor entrada)
      // Critério: parcela não compromete mais de 20% da renda e entrada é a mais baixa possível
      let cenarioIdeal = cenarios[0];
      for (const cenario of cenarios) {
        if (cenario.parcelaRenda <= 20) {
          cenarioIdeal = cenario;
          break;
        }
      }
      
      // Encontrar o cenário recomendado (equilibrado entre entrada e juros)
      // Critério: menor parcela que comprometa no máximo 15% da renda
      let cenarioRecomendado = cenarios[0];
      for (const cenario of cenarios) {
        if (cenario.parcelaRenda <= 15) {
          cenarioRecomendado = cenario;
          break;
        }
      }
      
      // Se não encontrou nenhum que esteja abaixo de 15%, usar o que tem menor comprometimento
      if (cenarioRecomendado.parcelaRenda > 15) {
        cenarioRecomendado = cenarios.reduce((prev, curr) => 
          prev.parcelaRenda < curr.parcelaRenda ? prev : curr
        );
      }
      
      setResult({
        cenarios,
        rendaMensal: values.rendaMensal,
        valorVeiculo: values.valorVeiculo,
        cenarioIdeal,
        cenarioInicialSimulado,
        cenarioRecomendado,
        chartData
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

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Calculadora de Entrada Ideal</h2>
        
        <div className="mb-8">
          <p className="mb-4">Decidir quanto dar de entrada em um financiamento de veículo é uma escolha importante que impacta diretamente o valor das parcelas, os juros totais e o seu orçamento mensal.</p>
          
          <p className="mb-4">Uma entrada maior significa:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Menor valor financiado:</strong> Reduzindo o montante sobre o qual incidem os juros.</li>
            <li><strong>Parcelas menores:</strong> Facilitando o encaixe no orçamento mensal.</li>
            <li><strong>Menor custo total:</strong> Com menos juros ao longo do financiamento.</li>
            <li><strong>Possibilidade de taxas melhores:</strong> Muitas instituições oferecem condições mais vantajosas para quem dá uma entrada maior.</li>
          </ul>
          
          <p className="mb-4">Por outro lado, uma entrada menor pode ser vantajosa se:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Você precisa manter reservas financeiras:</strong> Para emergências ou outros objetivos.</li>
            <li><strong>O dinheiro pode render mais em investimentos:</strong> Em cenários de taxas de juros de financiamento baixas.</li>
            <li><strong>Você tem outras dívidas com juros mais altos:</strong> Que poderiam ser quitadas com esse valor.</li>
          </ul>
          
          <p className="mb-4">Especialistas financeiros geralmente recomendam dar uma entrada de pelo menos 20% do valor do veículo. Isso ajuda a evitar a desvalorização inicial e diminui significativamente os juros pagos.</p>
          
          <p>Use nossa calculadora para simular diferentes cenários de entrada e encontrar o equilíbrio ideal entre o valor inicial desembolsado e o impacto das parcelas no seu orçamento mensal.</p>
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
                          placeholder="50000"
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
                name="rendaMensal"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Sua renda mensal (R$)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                        <Input
                          type="number"
                          placeholder="5000"
                          className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Sua renda líquida mensal</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mb-6">
              <FormField
                control={form.control}
                name="porcentagemEntrada"
                render={({ field: { value, onChange, ...fieldProps }}) => (
                  <FormItem className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-sm font-medium text-neutral-700">
                        Percentual de entrada
                      </FormLabel>
                      <span className="text-primary font-medium">{value}% = {formatCurrency(valorEntrada)}</span>
                    </div>
                    <FormControl>
                      <Slider 
                        defaultValue={[value]} 
                        max={90} 
                        min={10} 
                        step={5}
                        onValueChange={(vals) => onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Mínima (10%)</span>
                      <span>Recomendada (20%)</span>
                      <span>Alta (50%+)</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="taxaJuros"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Taxa de juros (% ao mês)</FormLabel>
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
                    <p className="text-xs text-neutral-500">Taxa média para veículos: 1,8% a.m.</p>
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
                        <SelectItem value="72">72 meses (6 anos)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-neutral-500">Prazo comum: 48 a 60 meses</p>
                    <FormMessage />
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
                Calcular Cenários
              </Button>
            </div>
          </form>
        </Form>
        
        {result && (
          <div id="resultado-simulacao" className="mb-8">
            <h3 className="font-heading text-xl font-semibold text-primary mb-4">Análise de entrada ideal</h3>
            
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="bg-neutral-100 p-6 rounded-md border border-neutral-200">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-heading font-semibold text-green-600 mb-3">Cenário com sua entrada de {result.cenarioInicialSimulado.porcentagemEntrada}%</h4>
                    <ul className="space-y-2">
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Valor da entrada:</span>
                        <span className="text-sm font-medium text-right">{formatCurrency(result.cenarioInicialSimulado.valorEntrada)}</span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Valor financiado:</span>
                        <span className="text-sm font-medium text-right">{formatCurrency(result.cenarioInicialSimulado.valorFinanciado)}</span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Valor da parcela:</span>
                        <span className="text-sm font-semibold text-primary text-right">{formatCurrency(result.cenarioInicialSimulado.valorParcela)}</span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Total de juros:</span>
                        <span className="text-sm font-medium text-right">{formatCurrency(result.cenarioInicialSimulado.totalJuros)}</span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Comprometimento da renda:</span>
                        <span className={`text-sm font-semibold text-right ${result.cenarioInicialSimulado.parcelaRenda > 20 ? 'text-red-600' : 'text-green-600'}`}>
                          {result.cenarioInicialSimulado.parcelaRenda.toFixed(1)}%
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-heading font-semibold text-blue-600 mb-3">Cenário recomendado: {result.cenarioRecomendado.porcentagemEntrada}% de entrada</h4>
                    <ul className="space-y-2">
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Valor da entrada:</span>
                        <span className="text-sm font-medium text-right">{formatCurrency(result.cenarioRecomendado.valorEntrada)}</span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Valor financiado:</span>
                        <span className="text-sm font-medium text-right">{formatCurrency(result.cenarioRecomendado.valorFinanciado)}</span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Valor da parcela:</span>
                        <span className="text-sm font-semibold text-primary text-right">{formatCurrency(result.cenarioRecomendado.valorParcela)}</span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Total de juros:</span>
                        <span className="text-sm font-medium text-right">{formatCurrency(result.cenarioRecomendado.totalJuros)}</span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Comprometimento da renda:</span>
                        <span className="text-sm font-semibold text-green-600 text-right">
                          {result.cenarioRecomendado.parcelaRenda.toFixed(1)}%
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-heading font-semibold text-purple-600 mb-3">Comparação dos cenários</h4>
                    <ul className="space-y-2">
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Diferença na entrada:</span>
                        <span className={`text-sm font-medium text-right ${result.cenarioRecomendado.valorEntrada - result.cenarioInicialSimulado.valorEntrada > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(Math.abs(result.cenarioRecomendado.valorEntrada - result.cenarioInicialSimulado.valorEntrada))}
                          {result.cenarioRecomendado.valorEntrada > result.cenarioInicialSimulado.valorEntrada ? ' a mais' : ' a menos'}
                        </span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Diferença na parcela:</span>
                        <span className={`text-sm font-medium text-right ${result.cenarioInicialSimulado.valorParcela - result.cenarioRecomendado.valorParcela > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(Math.abs(result.cenarioInicialSimulado.valorParcela - result.cenarioRecomendado.valorParcela))}
                          {result.cenarioInicialSimulado.valorParcela > result.cenarioRecomendado.valorParcela ? ' menor' : ' maior'}
                        </span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Economia total em juros:</span>
                        <span className={`text-sm font-semibold text-right ${result.cenarioInicialSimulado.totalJuros - result.cenarioRecomendado.totalJuros > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(Math.abs(result.cenarioInicialSimulado.totalJuros - result.cenarioRecomendado.totalJuros))}
                        </span>
                      </li>
                      <li className="grid grid-cols-2 gap-2">
                        <span className="text-sm text-neutral-600">Mudança no comprometimento:</span>
                        <span className={`text-sm font-medium text-right ${result.cenarioInicialSimulado.parcelaRenda - result.cenarioRecomendado.parcelaRenda > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(result.cenarioInicialSimulado.parcelaRenda - result.cenarioRecomendado.parcelaRenda).toFixed(1)}
                          {result.cenarioInicialSimulado.parcelaRenda > result.cenarioRecomendado.parcelaRenda ? ' p.p. menor' : ' p.p. maior'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-md border border-neutral-200 p-4 mb-6">
              <h4 className="font-heading font-medium text-primary mb-3">Impacto da entrada no valor da parcela</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={result.chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="percentual" 
                      label={{ value: 'Percentual de Entrada (%)', position: 'insideBottomRight', offset: -10 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                      label={{ value: 'Valor da Parcela (R$)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip 
                      formatter={(value) => [`R$ ${parseFloat(value as string).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, null]}
                      labelFormatter={(label) => `Entrada de ${label}%`} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="valorParcela" 
                      name="Valor da Parcela" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-neutral-500 italic mt-2">
                * Observe como o valor da parcela diminui à medida que o percentual de entrada aumenta.
              </p>
            </div>
            
            <div className="bg-white rounded-md border border-neutral-200 p-4 mb-6">
              <h4 className="font-heading font-medium text-primary mb-3">Impacto da entrada nos juros totais</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={result.chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="percentual" 
                      label={{ value: 'Percentual de Entrada (%)', position: 'insideBottomRight', offset: -10 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                      label={{ value: 'Total de Juros (R$)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip 
                      formatter={(value) => [`R$ ${parseFloat(value as string).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, null]}
                      labelFormatter={(label) => `Entrada de ${label}%`} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="totalJuros" 
                      name="Total de Juros" 
                      fill="#10b981" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-neutral-500 italic mt-2">
                * Uma entrada maior reduz significativamente o total de juros pagos ao longo do financiamento.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md border border-green-100 mb-6">
              <h4 className="font-heading font-semibold text-green-700 mb-3">Recomendações para sua decisão:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-sm text-neutral-700">
                  {result.cenarioInicialSimulado.parcelaRenda > 20 
                    ? <span>O cenário atual compromete <strong className="text-red-600">{result.cenarioInicialSimulado.parcelaRenda.toFixed(1)}%</strong> da sua renda, acima do recomendado de 20%. Considere aumentar a entrada ou optar por um veículo mais acessível.</span>
                    : <span>Seu cenário atual compromete <strong className="text-green-600">{result.cenarioInicialSimulado.parcelaRenda.toFixed(1)}%</strong> da sua renda, dentro do limite recomendado de 20%.</span>
                  }
                </li>
                <li className="text-sm text-neutral-700">
                  {result.cenarioInicialSimulado.porcentagemEntrada < 20
                    ? <span>Uma entrada menor que 20% pode ser arriscada devido à desvalorização inicial do veículo. Se possível, aumente para pelo menos 20%.</span>
                    : <span>Sua entrada de {result.cenarioInicialSimulado.porcentagemEntrada}% é adequada, ajudando a compensar a desvalorização inicial do veículo.</span>
                  }
                </li>
                <li className="text-sm text-neutral-700">
                  {result.cenarioRecomendado.porcentagemEntrada > result.cenarioInicialSimulado.porcentagemEntrada
                    ? <span>Aumentar sua entrada para {result.cenarioRecomendado.porcentagemEntrada}% reduziria sua parcela em {formatCurrency(result.cenarioInicialSimulado.valorParcela - result.cenarioRecomendado.valorParcela)} por mês e economizaria {formatCurrency(result.cenarioInicialSimulado.totalJuros - result.cenarioRecomendado.totalJuros)} em juros.</span>
                    : <span>Sua entrada atual já está próxima ou superior ao nosso cenário recomendado de {result.cenarioRecomendado.porcentagemEntrada}%.</span>
                  }
                </li>
              </ul>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 italic">* Este é apenas um cálculo aproximado. As condições reais podem variar conforme a instituição financeira e a análise de crédito individual.</p>
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