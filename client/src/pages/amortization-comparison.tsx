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
import { calculatorSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { SimulationResult } from "@/components/simulators/vehicle-form";
import { gerarTabelaPrice, gerarTabelaSAC, calcularTotalPagar, calcularTotalJuros, calcularIOF } from "@/utils/finance";
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

const formSchema = calculatorSchema.extend({
  valorFinanciado: z.coerce
    .number()
    .min(5000, "O valor mínimo para financiamento é R$ 5.000,00")
    .max(500000, "O valor máximo para financiamento é R$ 500.000,00"),
  taxaJuros: z.coerce
    .number()
    .min(0.5, "A taxa mínima é 0,5%")
    .max(2.5, "A taxa máxima é 2,5%"),
  numParcelas: z.coerce
    .number()
    .min(12, "O número mínimo de parcelas é 12")
    .max(72, "O número máximo de parcelas é 72"),
  incluirIOF: z.boolean().default(true)
});

interface ComparisonResult {
  price: SimulationResult;
  sac: SimulationResult;
  comparisonData: {
    parcela: number;
    parcelaPrice: number;
    parcelaSAC: number;
    saldoDevedorPrice: number;
    saldoDevedorSAC: number;
    jurosPrice: number;
    jurosSAC: number;
  }[];
  resumo: {
    diferencaJuros: number;
    diferencaPrimeiraParcelaPrice: number;
    diferencaPrimeiraParcelaSAC: number;
    diferencaUltimaParcelaPrice: number;
    diferencaUltimaParcelaSAC: number;
  };
}

export default function AmortizationComparison() {
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [activeTab, setActiveTab] = useState("parcelas");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorFinanciado: 50000,
      taxaJuros: 1.5,
      numParcelas: 48,
      incluirIOF: true
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Calcular IOF se necessário
      let valorComIOF = values.valorFinanciado;
      let valorIOF = 0;
      
      if (values.incluirIOF) {
        valorIOF = calcularIOF(values.valorFinanciado, values.numParcelas);
        valorComIOF = values.valorFinanciado + valorIOF;
      }
      
      // Gerar tabelas de amortização para os dois sistemas
      const tabelaPrice = gerarTabelaPrice(valorComIOF, values.taxaJuros, values.numParcelas);
      const tabelaSAC = gerarTabelaSAC(valorComIOF, values.taxaJuros, values.numParcelas);
      
      // Calcular totais para Price
      const valorParcelaPrice = tabelaPrice[0].valorParcela;
      const totalPagarPrice = calcularTotalPagar(valorParcelaPrice, values.numParcelas);
      const totalJurosPrice = calcularTotalJuros(totalPagarPrice, valorComIOF);
      
      // Calcular totais para SAC (soma de todas as parcelas, que são diferentes)
      const totalPagarSAC = tabelaSAC.reduce((sum, item) => sum + item.valorParcela, 0);
      const totalJurosSAC = calcularTotalJuros(totalPagarSAC, valorComIOF);
      
      // Criar dados de comparação para os gráficos
      const comparisonData = [];
      for (let i = 0; i < Math.min(tabelaPrice.length, tabelaSAC.length); i++) {
        comparisonData.push({
          parcela: i + 1,
          parcelaPrice: tabelaPrice[i].valorParcela,
          parcelaSAC: tabelaSAC[i].valorParcela,
          saldoDevedorPrice: tabelaPrice[i].saldoDevedor,
          saldoDevedorSAC: tabelaSAC[i].saldoDevedor,
          jurosPrice: tabelaPrice[i].juros,
          jurosSAC: tabelaSAC[i].juros
        });
      }
      
      // Calcular resumo para comparação rápida
      const resumo = {
        diferencaJuros: totalJurosPrice - totalJurosSAC,
        diferencaPrimeiraParcelaPrice: tabelaPrice[0].valorParcela,
        diferencaPrimeiraParcelaSAC: tabelaSAC[0].valorParcela,
        diferencaUltimaParcelaPrice: tabelaPrice[tabelaPrice.length - 1].valorParcela,
        diferencaUltimaParcelaSAC: tabelaSAC[tabelaSAC.length - 1].valorParcela
      };
      
      // Criar resultados
      const priceResult: SimulationResult = {
        valorParcela: valorParcelaPrice,
        totalPagar: totalPagarPrice,
        totalJuros: totalJurosPrice,
        tabelaAmortizacao: tabelaPrice,
        valorIOF: values.incluirIOF ? valorIOF : undefined
      };
      
      const sacResult: SimulationResult = {
        valorParcela: tabelaSAC[0].valorParcela, // Primeira parcela (maior)
        totalPagar: totalPagarSAC,
        totalJuros: totalJurosSAC,
        tabelaAmortizacao: tabelaSAC,
        valorIOF: values.incluirIOF ? valorIOF : undefined
      };
      
      setResult({
        price: priceResult,
        sac: sacResult,
        comparisonData,
        resumo
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
        <h2 className="font-heading text-2xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Comparativo: Price vs. SAC</h2>
        
        <div className="mb-8">
          <p className="mb-4">O sistema de financiamento que você escolhe pode fazer uma grande diferença no valor total pago e na distribuição das parcelas ao longo do tempo. No Brasil, os dois sistemas mais utilizados são a Tabela Price e o Sistema de Amortização Constante (SAC).</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">Tabela Price</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm text-neutral-700"><strong>Parcelas fixas:</strong> Todas as parcelas têm o mesmo valor do início ao fim.</li>
                <li className="text-sm text-neutral-700"><strong>Juros decrescentes:</strong> A proporção de juros diminui e a de amortização aumenta ao longo do tempo.</li>
                <li className="text-sm text-neutral-700"><strong>Vantagem:</strong> Facilita o planejamento financeiro com um valor fixo mensal.</li>
                <li className="text-sm text-neutral-700"><strong>Desvantagem:</strong> Total de juros geralmente maior que no SAC.</li>
              </ul>
            </div>
            
            <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">Sistema SAC</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm text-neutral-700"><strong>Amortização fixa:</strong> O valor da amortização é constante em todas as parcelas.</li>
                <li className="text-sm text-neutral-700"><strong>Parcelas decrescentes:</strong> As parcelas diminuem ao longo do tempo.</li>
                <li className="text-sm text-neutral-700"><strong>Vantagem:</strong> Total de juros menor e quitação mais rápida do saldo devedor.</li>
                <li className="text-sm text-neutral-700"><strong>Desvantagem:</strong> Parcelas iniciais mais altas, exigindo maior capacidade de pagamento no início.</li>
              </ul>
            </div>
          </div>
          
          <p className="mb-4">Ao decidir entre os dois sistemas, considere:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Seu orçamento atual:</strong> Se sua prioridade é ter parcelas menores no início, a Tabela Price pode ser mais adequada.</li>
            <li><strong>Planejamento de longo prazo:</strong> Se deseja economizar no total de juros e tem capacidade de pagar parcelas maiores no início, o SAC pode ser vantajoso.</li>
            <li><strong>Tempo do financiamento:</strong> Quanto maior o prazo, maior será a diferença do total de juros entre os dois sistemas.</li>
          </ul>
          
          <p>Use nossa ferramenta comparativa para visualizar lado a lado como seria seu financiamento nos dois sistemas, ajudando a tomar a melhor decisão para o seu caso.</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <FormField
                control={form.control}
                name="valorFinanciado"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Valor a financiar (R$)</FormLabel>
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
                    <p className="text-xs text-neutral-500">Valor total do financiamento</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                          placeholder="1.5"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Taxa mensal do financiamento</p>
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
                    <p className="text-xs text-neutral-500">Prazo total do financiamento</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mb-6">
              <FormField
                control={form.control}
                name="incluirIOF"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        Incluir IOF no cálculo (para financiamento de veículos)
                      </FormLabel>
                      <p className="text-xs text-neutral-500">
                        O Imposto sobre Operações Financeiras é obrigatório em financiamentos de veículos
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
                Comparar Sistemas
              </Button>
            </div>
          </form>
        </Form>
        
        {result && (
          <div id="resultado-simulacao" className="mb-8">
            <h3 className="font-heading text-xl font-semibold text-primary mb-4">Comparativo entre os sistemas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="col-span-1 md:col-span-3 bg-neutral-100 p-4 rounded-md border border-neutral-200">
                <h4 className="font-heading font-semibold text-primary mb-3">Resumo comparativo</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-xs text-neutral-600 mb-1">Diferença de juros</p>
                    <p className={`text-lg font-bold ${result.resumo.diferencaJuros > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(Math.abs(result.resumo.diferencaJuros))}
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      {result.resumo.diferencaJuros > 0 ? 'SAC economiza' : 'Price economiza'}
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-xs text-neutral-600 mb-1">Primeira parcela</p>
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="text-xs font-medium text-primary">Price:</p>
                        <p className="text-sm font-bold text-primary">{formatCurrency(result.resumo.diferencaPrimeiraParcelaPrice)}</p>
                      </div>
                      <div className="text-neutral-300">|</div>
                      <div>
                        <p className="text-xs font-medium text-blue-600">SAC:</p>
                        <p className="text-sm font-bold text-blue-600">{formatCurrency(result.resumo.diferencaPrimeiraParcelaSAC)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-xs text-neutral-600 mb-1">Última parcela</p>
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="text-xs font-medium text-primary">Price:</p>
                        <p className="text-sm font-bold text-primary">{formatCurrency(result.resumo.diferencaUltimaParcelaPrice)}</p>
                      </div>
                      <div className="text-neutral-300">|</div>
                      <div>
                        <p className="text-xs font-medium text-blue-600">SAC:</p>
                        <p className="text-sm font-bold text-blue-600">{formatCurrency(result.resumo.diferencaUltimaParcelaSAC)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-xs text-neutral-600 mb-1">Total de juros</p>
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="text-xs font-medium text-primary">Price:</p>
                        <p className="text-sm font-bold text-primary">{formatCurrency(result.price.totalJuros)}</p>
                      </div>
                      <div className="text-neutral-300">|</div>
                      <div>
                        <p className="text-xs font-medium text-blue-600">SAC:</p>
                        <p className="text-sm font-bold text-blue-600">{formatCurrency(result.sac.totalJuros)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-xs text-neutral-600 mb-1">Total pago</p>
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="text-xs font-medium text-primary">Price:</p>
                        <p className="text-sm font-bold text-primary">{formatCurrency(result.price.totalPagar)}</p>
                      </div>
                      <div className="text-neutral-300">|</div>
                      <div>
                        <p className="text-xs font-medium text-blue-600">SAC:</p>
                        <p className="text-sm font-bold text-blue-600">{formatCurrency(result.sac.totalPagar)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs para os diferentes gráficos comparativos */}
            <div className="mb-6">
              <Tabs defaultValue="parcelas" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="parcelas">Evolução das Parcelas</TabsTrigger>
                  <TabsTrigger value="saldo">Saldo Devedor</TabsTrigger>
                  <TabsTrigger value="juros">Juros vs Amortização</TabsTrigger>
                </TabsList>
                
                <TabsContent value="parcelas" className="mt-0">
                  <div className="bg-white rounded-md border border-neutral-200 p-4">
                    <h4 className="font-heading font-medium text-primary mb-3">Evolução do valor das parcelas ao longo do tempo</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={result.comparisonData.filter((_, index) => index % Math.ceil(result.comparisonData.length / 20) === 0)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="parcela" 
                            label={{ value: 'Parcela', position: 'insideBottomRight', offset: -10 }} 
                          />
                          <YAxis 
                            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                            label={{ value: 'Valor da Parcela (R$)', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip 
                            formatter={(value) => [`R$ ${parseFloat(value as string).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, null]}
                            labelFormatter={(label) => `Parcela ${label}`} 
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="parcelaPrice" 
                            name="Tabela Price" 
                            stroke="#3b82f6" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="parcelaSAC" 
                            name="Sistema SAC" 
                            stroke="#10b981" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-neutral-500 italic mt-2">
                      * Na Tabela Price as parcelas são fixas, enquanto no SAC as parcelas são decrescentes.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="saldo" className="mt-0">
                  <div className="bg-white rounded-md border border-neutral-200 p-4">
                    <h4 className="font-heading font-medium text-primary mb-3">Evolução do saldo devedor ao longo do tempo</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={result.comparisonData.filter((_, index) => index % Math.ceil(result.comparisonData.length / 20) === 0)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="parcela" 
                            label={{ value: 'Parcela', position: 'insideBottomRight', offset: -10 }} 
                          />
                          <YAxis 
                            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                            label={{ value: 'Saldo Devedor (R$)', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip 
                            formatter={(value) => [`R$ ${parseFloat(value as string).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, null]}
                            labelFormatter={(label) => `Parcela ${label}`} 
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="saldoDevedorPrice" 
                            name="Tabela Price" 
                            stroke="#3b82f6" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="saldoDevedorSAC" 
                            name="Sistema SAC" 
                            stroke="#10b981" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-neutral-500 italic mt-2">
                      * No SAC o saldo devedor diminui mais rapidamente no início do financiamento.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="juros" className="mt-0">
                  <div className="bg-white rounded-md border border-neutral-200 p-4">
                    <h4 className="font-heading font-medium text-primary mb-3">Comparação de juros pagos ao longo do tempo</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={result.comparisonData.filter((_, index) => index % Math.ceil(result.comparisonData.length / 12) === 0)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="parcela" 
                            label={{ value: 'Parcela', position: 'insideBottomRight', offset: -10 }} 
                          />
                          <YAxis 
                            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                            label={{ value: 'Juros Pagos (R$)', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip 
                            formatter={(value) => [`R$ ${parseFloat(value as string).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, null]}
                            labelFormatter={(label) => `Parcela ${label}`} 
                          />
                          <Legend />
                          <Bar 
                            dataKey="jurosPrice" 
                            name="Juros (Price)" 
                            fill="#3b82f6" 
                          />
                          <Bar 
                            dataKey="jurosSAC" 
                            name="Juros (SAC)" 
                            fill="#10b981" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-neutral-500 italic mt-2">
                      * No sistema SAC, os juros diminuem mais rapidamente a cada parcela paga.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h4 className="font-heading font-semibold text-primary mb-3">Quando escolher a Tabela Price?</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="text-sm text-neutral-700">Se você prefere previsibilidade no orçamento mensal</li>
                  <li className="text-sm text-neutral-700">Se sua prioridade é ter parcelas iniciais menores</li>
                  <li className="text-sm text-neutral-700">Se a diferença total de juros não é tão significativa (prazos curtos)</li>
                  <li className="text-sm text-neutral-700">Se sua renda não deve aumentar substancialmente durante o financiamento</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md border border-green-100">
                <h4 className="font-heading font-semibold text-green-700 mb-3">Quando escolher o Sistema SAC?</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="text-sm text-neutral-700">Se você quer pagar menos juros no total</li>
                  <li className="text-sm text-neutral-700">Se você consegue arcar com parcelas maiores no início</li>
                  <li className="text-sm text-neutral-700">Se você prefere ver o saldo devedor diminuir mais rapidamente</li>
                  <li className="text-sm text-neutral-700">Se sua tendência de renda é crescente nos próximos anos</li>
                </ul>
              </div>
            </div>
            
            {result.price.valorIOF && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 my-6">
                <p className="flex items-center text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>O valor do IOF incluído nesta simulação é de {formatCurrency(result.price.valorIOF)}</span>
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-neutral-600 italic">* Este é apenas um cálculo aproximado. As condições reais podem variar conforme a instituição financeira.</p>
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