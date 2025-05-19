import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Info, Loader2, ShieldCheck, Sun, Zap, Battery, Calendar, Leaf, PiggyBank, Home, AlertCircle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { calcularPrestacao, gerarTabelaPrice } from "@/utils/finance";
import PriceTable from "@/components/simulators/price-table";
import DebtChart from "@/components/simulators/debt-chart";
import ExportButtons from "@/components/simulators/export-buttons";
import HeadSEO from "@/components/seo/head-seo";
import { useSecureForm } from "@/hooks/use-secure-form";
import { validateNumberRange } from "@/utils/security";

// Schema de validação do formulário
const formSchema = z.object({
  potenciaInstalada: z.coerce.number()
    .min(1, { message: "Potência mínima: 1 kWp" })
    .max(100, { message: "Potência máxima: 100 kWp" }),
  valorPainel: z.coerce.number()
    .min(5000, { message: "Valor mínimo: R$ 5.000,00" })
    .max(500000, { message: "Valor máximo: R$ 500.000,00" }),
  taxaJuros: z.coerce.number()
    .min(0.5, { message: "Taxa mínima: 0.5%" })
    .max(3.0, { message: "Taxa máxima: 3.0%" }),
  numParcelas: z.enum(["12", "24", "36", "48", "60", "72", "84", "96", "120", "144", "180", "240"], {
    required_error: "Selecione o prazo do financiamento",
  }),
  tipoImovel: z.enum(["residencial", "comercial", "rural"], {
    required_error: "Selecione o tipo de imóvel",
  }),
});

// Interface para resultado da simulação
interface SimulacaoSolar {
  valorParcela: number;
  totalPagar: number;
  totalJuros: number;
  economiaEnergia: number;
  retornoInvestimento: number;
  economiaTotal: number;
  payback: number;
  tabelaAmortizacao: any[];
  potenciaInstalada: number;
  geracaoMensal: number;
}

export default function PaineisSolares() {
  const [result, setResult] = useState<SimulacaoSolar | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const { toast } = useToast();
  const [taxaPadrao, setTaxaPadrao] = useState<number>(1.29);
  
  // Inicializa o hook de formulário seguro
  const {
    secureSubmit,
    isSubmitting,
    isLimited,
    CsrfInput,
  } = useSecureForm({
    formId: 'painel-solar-form',
    rateLimiterOptions: {
      maxAttempts: 15,
      timeWindowMs: 60000 
    }
  });
  
  // Inicializar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      potenciaInstalada: 5,
      valorPainel: 25000,
      taxaJuros: 1.29,
      numParcelas: "60",
      tipoImovel: "residencial",
    },
  });
  
  // Atualizar taxa com base no tipo de imóvel
  const atualizarTaxa = useCallback((tipo: "residencial" | "comercial" | "rural") => {
    let taxaBase = 1.29; // Taxa padrão para residencial
    
    // Ajustar taxa conforme tipo de imóvel
    if (tipo === "comercial") {
      taxaBase = 1.19;
    } else if (tipo === "rural") {
      taxaBase = 1.39;
    }
    
    console.log("Tipo de imóvel alterado:", { tipo, novaTaxa: taxaBase });
    setTaxaPadrao(taxaBase);
    form.setValue("taxaJuros", taxaBase);
  }, [form]);
  
  // Observar mudanças no tipo de imóvel
  const watchTipoImovel = form.watch("tipoImovel");
  const tipoImovelAtual = form.getValues().tipoImovel;
  
  if (watchTipoImovel !== tipoImovelAtual) {
    atualizarTaxa(watchTipoImovel as "residencial" | "comercial" | "rural");
  }
  
  // Calcular a geração média mensal de energia em kWh com base na potência instalada
  const calcularGeracaoMensal = (potencia: number): number => {
    // Média de geração no Brasil: 4.2 kWh/kWp/dia × 30 dias
    return potencia * 4.2 * 30;
  };
  
  // Calcular a economia mensal em energia (R$)
  const calcularEconomiaEnergia = (geracaoMensal: number): number => {
    // Preço médio do kWh no Brasil: R$ 0.75
    return geracaoMensal * 0.75;
  };
  
  // Calcular o tempo de retorno do investimento (payback)
  const calcularPayback = (valorInvestimento: number, economiaAnual: number): number => {
    return valorInvestimento / economiaAnual;
  };
  
  // Função de submissão do formulário
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Usando o wrapper seguro para a submissão
    secureSubmit((secureValues) => {
      try {
        // Sanitizamos e validamos todos os valores
        const potenciaInstalada = validateNumberRange(
          Number(secureValues.potenciaInstalada), 
          1, 
          100, 
          5
        );
        
        const valorPainel = validateNumberRange(
          Number(secureValues.valorPainel), 
          5000, 
          500000, 
          25000
        );
        
        const taxaJuros = validateNumberRange(
          Number(secureValues.taxaJuros), 
          0.5, 
          3.0, 
          1.29
        );
        
        // Valida a string do número de parcelas para converter para número
        let numParcelas = 60; // Valor padrão seguro
        if (typeof secureValues.numParcelas === 'string' && 
            ['12', '24', '36', '48', '60', '72', '84', '96', '120', '144', '180', '240'].includes(secureValues.numParcelas)) {
          numParcelas = parseInt(secureValues.numParcelas);
        }
        
        // Valida o tipo de imóvel
        let tipoImovelSeguro: "residencial" | "comercial" | "rural" = "residencial";
        if (secureValues.tipoImovel === "comercial" || secureValues.tipoImovel === "rural") {
          tipoImovelSeguro = secureValues.tipoImovel;
        }
        
        // Calcular a prestação do financiamento
        const valorParcela = calcularPrestacao(valorPainel, taxaJuros, numParcelas);
        
        // Calcular o total a pagar
        const totalPagar = valorParcela * numParcelas;
        
        // Calcular o total de juros
        const totalJuros = totalPagar - valorPainel;
        
        // Calcular a geração mensal de energia em kWh
        const geracaoMensal = calcularGeracaoMensal(potenciaInstalada);
        
        // Calcular a economia mensal em energia (R$)
        const economiaEnergia = calcularEconomiaEnergia(geracaoMensal);
        
        // Calcular a economia total ao longo da vida útil (25 anos)
        const economiaTotal = economiaEnergia * 12 * 25;
        
        // Calcular o retorno do investimento (ROI)
        const retornoInvestimento = (economiaTotal / valorPainel) * 100;
        
        // Calcular o payback em anos
        const payback = calcularPayback(valorPainel, economiaEnergia * 12);
        
        // Gerar a tabela de amortização
        const tabelaAmortizacao = gerarTabelaPrice(valorPainel, taxaJuros, numParcelas);
        
        const simulacao: SimulacaoSolar = {
          valorParcela,
          totalPagar,
          totalJuros,
          economiaEnergia,
          retornoInvestimento,
          economiaTotal,
          payback,
          tabelaAmortizacao,
          potenciaInstalada,
          geracaoMensal
        };
        
        // Atrasar um pouco para mostrar o loading state
        setTimeout(() => {
          setResult(simulacao);
        }, 500);
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

  // Dados para o gráfico de comparação de custos
  const prepararDadosGrafico = () => {
    if (!result) return [];
    
    const dadosGrafico = [];
    const custoEnergiaMensal = 300; // Custo mensal médio com energia elétrica sem painel solar
    let economiaAcumulada = 0;
    
    for (let ano = 1; ano <= 25; ano++) {
      economiaAcumulada += (result.economiaEnergia * 12);
      
      dadosGrafico.push({
        ano: ano,
        custoSemPainel: custoEnergiaMensal * 12 * ano,
        custoComPainel: ano <= Math.ceil(result.tabelaAmortizacao.length / 12) 
          ? (result.valorParcela * 12 * ano) + (custoEnergiaMensal - result.economiaEnergia) * 12 * ano
          : (custoEnergiaMensal - result.economiaEnergia) * 12 * ano,
        economiaAcumulada: economiaAcumulada
      });
    }
    
    return dadosGrafico;
  };

  return (
    <>
      <HeadSEO 
        title="Simulador de Financiamento de Painéis Solares | Calculadora Energia Solar"
        description="Calcule o financiamento de painéis solares fotovoltaicos, economia de energia, tempo de retorno do investimento (payback) e veja se vale a pena investir em energia solar."
        keywords={["financiamento painéis solares", "simulador energia solar", "economia energia fotovoltaica", "payback energia solar", "custo sistema fotovoltaico", "financiar energia solar", "calculadora painel solar"]}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sun className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Simulador de Financiamento de Painéis Solares
            </h1>
          </div>
          
          <p className="text-lg text-neutral-600 mb-8">
            Calcule o financiamento do seu sistema de energia solar, veja a economia mensal e descubra em quanto tempo terá o retorno do investimento.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
              {/* Adiciona automaticamente o campo CSRF oculto */}
              <CsrfInput />
              
              {/* Aviso de segurança */}
              {isLimited && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Detectamos muitas solicitações em um curto período. Por favor, aguarde alguns instantes antes de tentar novamente.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="potenciaInstalada"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Potência do sistema (kWp)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="5"
                            className="pl-4 pr-12 py-3 bg-neutral-100 border-neutral-300"
                            min="1"
                            max="100"
                            step="0.5"
                            pattern="[0-9]*[.]?[0-9]{0,2}"
                            inputMode="decimal"
                            aria-describedby="potencia-description"
                            {...field}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">kWp</span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Um sistema de 5 kWp gera aproximadamente {5 * 4.2 * 30} kWh/mês
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valorPainel"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Valor do sistema (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                          <Input
                            type="number"
                            placeholder="25000"
                            className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                            min="5000"
                            max="500000"
                            step="1000"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            aria-describedby="valor-description"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Valor médio: R$ 5.000 por kWp instalado
                      </FormDescription>
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
                            min="0.5"
                            max="3.0"
                            placeholder="1.29"
                            className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                            pattern="[0-9]*[.]?[0-9]{0,2}"
                            inputMode="decimal"
                            aria-describedby="taxaJuros-description"
                            {...field}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Taxa média para financiamento de energia solar: {taxaPadrao}% a.m.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numParcelas"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Prazo do financiamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-4 py-3 bg-neutral-100 border-neutral-300">
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
                          <SelectItem value="84">84 meses (7 anos)</SelectItem>
                          <SelectItem value="96">96 meses (8 anos)</SelectItem>
                          <SelectItem value="120">120 meses (10 anos)</SelectItem>
                          <SelectItem value="144">144 meses (12 anos)</SelectItem>
                          <SelectItem value="180">180 meses (15 anos)</SelectItem>
                          <SelectItem value="240">240 meses (20 anos)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Prazo mais comum para financiamento solar: 60 meses (5 anos)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tipoImovel"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Tipo de imóvel</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-4 py-3 bg-neutral-100 border-neutral-300">
                            <SelectValue placeholder="Selecione o tipo de imóvel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="residencial">Residencial</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                          <SelectItem value="rural">Rural</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Imóveis comerciais geralmente possuem melhores taxas
                      </FormDescription>
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
                    <Zap className="h-5 w-5 mr-2" />
                  )}
                  Calcular Financiamento Solar
                </Button>
              </div>
            </form>
          </Form>
          
          {result && (
            <div className="my-8 animate-in fade-in duration-500">
              <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
                  <CardTitle className="text-2xl font-bold text-gray-900">Resultado da Simulação</CardTitle>
                  <CardDescription>
                    Sistema solar de {result.potenciaInstalada} kWp com geração estimada de {result.geracaoMensal.toFixed(0)} kWh/mês
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <Tabs defaultValue="resumo" className="w-full">
                    <TabsList className="mb-4 grid grid-cols-3 gap-4">
                      <TabsTrigger value="resumo" className="text-sm">Resumo</TabsTrigger>
                      <TabsTrigger value="economia" className="text-sm">Economia</TabsTrigger>
                      <TabsTrigger value="amortizacao" className="text-sm">Amortização</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="resumo" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800">Financiamento</h3>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Valor do Sistema:</span>
                            <span className="font-bold text-gray-900">R$ {form.getValues().valorPainel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Parcela Mensal:</span>
                            <span className="font-bold text-green-700">R$ {result.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Prazo do Financiamento:</span>
                            <span className="font-bold text-gray-900">{form.getValues().numParcelas} meses</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Taxa de Juros:</span>
                            <span className="font-bold text-gray-900">{form.getValues().taxaJuros}% ao mês</span>
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Total a Pagar:</span>
                            <span className="font-bold text-gray-900">R$ {result.totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Total de Juros:</span>
                            <span className="font-bold text-blue-600">R$ {result.totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800">Economia e Retorno</h3>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Potência do Sistema:</span>
                            <span className="font-bold text-gray-900">{result.potenciaInstalada} kWp</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Geração Mensal Estimada:</span>
                            <span className="font-bold text-gray-900">{result.geracaoMensal.toFixed(0)} kWh/mês</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Economia Mensal:</span>
                            <span className="font-bold text-green-700">R$ {result.economiaEnergia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Economia Anual:</span>
                            <span className="font-bold text-green-700">R$ {(result.economiaEnergia * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Tempo de Retorno (Payback):</span>
                            <span className="font-bold text-orange-600">{result.payback.toFixed(1)} anos</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Retorno do Investimento:</span>
                            <span className="font-bold text-green-700">{result.retornoInvestimento.toFixed(0)}%</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Economia Total (25 anos):</span>
                            <span className="font-bold text-green-700">R$ {result.economiaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <div className="flex gap-2">
                          <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Benefício Financeiro</h4>
                            <p className="text-sm text-gray-700">
                              Considerando o financiamento de R$ {form.getValues().valorPainel.toLocaleString('pt-BR')} em {form.getValues().numParcelas} parcelas 
                              mensais de R$ {result.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, você terá uma economia mensal 
                              de R$ {result.economiaEnergia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} na conta de luz.
                              {result.economiaEnergia > result.valorParcela ? (
                                <span className="font-bold text-green-700"> Sua economia já supera o valor da parcela desde o início!</span>
                              ) : (
                                <span> Após quitar o financiamento, a economia será total.</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="economia" className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800">Análise de Economia ao Longo do Tempo</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={prepararDadosGrafico()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ano" label={{ value: "Anos", position: "insideBottomRight", offset: -10 }} />
                            <YAxis label={{ value: "Valor (R$)", angle: -90, position: "insideLeft" }} />
                            <Tooltip formatter={(value) => ["R$ " + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })]} />
                            <Area type="monotone" name="Custo sem painel solar" dataKey="custoSemPainel" stackId="1" stroke="#ef4444" fill="#fca5a5" />
                            <Area type="monotone" name="Custo com painel solar" dataKey="custoComPainel" stackId="2" stroke="#10b981" fill="#6ee7b7" />
                            <Area type="monotone" name="Economia acumulada" dataKey="economiaAcumulada" stackId="3" stroke="#f59e0b" fill="#fcd34d" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <Card className="border border-green-200 bg-green-50">
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center">
                              <Leaf className="h-10 w-10 text-green-600 mb-2" />
                              <h4 className="font-bold text-gray-900">Economia em 5 anos</h4>
                              <p className="text-2xl font-bold text-green-700">
                                R$ {(result.economiaEnergia * 12 * 5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-orange-200 bg-orange-50">
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center">
                              <Calendar className="h-10 w-10 text-orange-600 mb-2" />
                              <h4 className="font-bold text-gray-900">Payback Completo</h4>
                              <p className="text-2xl font-bold text-orange-700">
                                {result.payback.toFixed(1)} anos
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center">
                              <PiggyBank className="h-10 w-10 text-blue-600 mb-2" />
                              <h4 className="font-bold text-gray-900">Economia em 25 anos</h4>
                              <p className="text-2xl font-bold text-blue-700">
                                R$ {result.economiaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Detalhes do Investimento</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-gray-600">Custo do Sistema Solar:</span>
                            <span className="font-medium">R$ {form.getValues().valorPainel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">Valor Total do Financiamento:</span>
                            <span className="font-medium">R$ {result.totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">Economia Mensal na Conta de Luz:</span>
                            <span className="font-medium text-green-700">R$ {result.economiaEnergia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">Vida Útil dos Painéis Solares:</span>
                            <span className="font-medium">25+ anos</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">Economia Líquida (após payback):</span>
                            <span className="font-medium text-green-700">
                              R$ {(result.economiaTotal - result.totalPagar).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="amortizacao">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Evolução do Saldo Devedor</h3>
                        <div className="h-64">
                          <DebtChart 
                            data={result.tabelaAmortizacao.slice(1)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Tabela de Amortização</h3>
                          <Button
                            variant="ghost"
                            className="text-sm text-primary hover:text-primary-dark flex items-center"
                            onClick={() => setIsTableExpanded(!isTableExpanded)}
                          >
                            {isTableExpanded ? "Mostrar menos" : "Mostrar completa"}
                          </Button>
                        </div>
                        
                        <PriceTable 
                          data={isTableExpanded ? result.tabelaAmortizacao : result.tabelaAmortizacao.slice(0, 13)}
                          showAll={isTableExpanded}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                
                <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex justify-end">
                    <ExportButtons 
                      data={result.tabelaAmortizacao.slice(1)} 
                      fileName={`financiamento_paineis_solares_${form.getValues().valorPainel}`}
                      title="Simulação de Financiamento de Painéis Solares"
                      summary={{
                        potenciaInstalada: result.potenciaInstalada,
                        valorPainel: form.getValues().valorPainel,
                        taxaJuros: form.getValues().taxaJuros,
                        numParcelas: parseInt(form.getValues().numParcelas),
                        valorParcela: result.valorParcela,
                        totalPagar: result.totalPagar,
                        totalJuros: result.totalJuros,
                        economiaEnergia: result.economiaEnergia,
                        payback: result.payback
                      }}
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
          
          <section className="mt-12 space-y-10">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sun className="h-7 w-7 text-yellow-500" />
                  Energia Solar Fotovoltaica
                </h2>
                <p className="text-lg text-gray-600 mt-2">
                  Conheça as vantagens, o funcionamento e por que o investimento em energia solar vale a pena
                </p>
              </div>
              
              <div className="p-6">
                <div className="prose prose-neutral max-w-none">
                  <h3>O que é Energia Solar Fotovoltaica?</h3>
                  <p>
                    A energia solar fotovoltaica é uma forma de obter energia elétrica através da conversão direta da luz do sol. 
                    Esse processo ocorre nas células fotovoltaicas que compõem os painéis solares. 
                    Quando a luz solar incide sobre estas células, é gerada uma corrente elétrica que pode ser utilizada para alimentar residências,
                    comércios, indústrias e propriedades rurais.
                  </p>
                  
                  <h3>Como Funciona um Sistema Solar Fotovoltaico</h3>
                  <ol>
                    <li><strong>Captação:</strong> Os painéis solares captam a luz do sol e convertem em energia elétrica (corrente contínua).</li>
                    <li><strong>Conversão:</strong> O inversor transforma a corrente contínua (CC) em corrente alternada (CA), que é o tipo utilizado nos equipamentos elétricos.</li>
                    <li><strong>Distribuição:</strong> A energia é distribuída para o consumo na edificação.</li>
                    <li><strong>Medição:</strong> A energia excedente é injetada na rede elétrica, gerando créditos na conta de luz.</li>
                  </ol>
                  
                  <h3>Vantagens da Energia Solar</h3>
                  <ul>
                    <li><strong>Economia:</strong> Redução significativa na conta de luz, com potencial de economia de até 95%.</li>
                    <li><strong>Sustentabilidade:</strong> Energia limpa e renovável que não emite gases de efeito estufa durante a geração.</li>
                    <li><strong>Valorização Imobiliária:</strong> Imóveis com sistemas de energia solar têm valor de mercado superior.</li>
                    <li><strong>Baixa Manutenção:</strong> Sistemas fotovoltaicos requerem manutenção mínima e têm vida útil de 25 anos ou mais.</li>
                    <li><strong>Independência Energética:</strong> Menor dependência da rede elétrica e das variações de preço da energia.</li>
                  </ul>
                  
                  <h3>O Sistema de Compensação de Energia</h3>
                  <p>
                    O Brasil adota o Sistema de Compensação de Energia Elétrica (net metering), regulamentado pela ANEEL. Nesse modelo, a energia
                    excedente produzida pelo seu sistema solar é injetada na rede elétrica, gerando créditos que podem ser utilizados em até 60 meses.
                    Esses créditos compensam o consumo nos períodos noturnos ou dias com pouca incidência solar.
                  </p>
                  
                  <h3>Financiamento de Painéis Solares</h3>
                  <p>
                    Atualmente, existem diversas opções de financiamento específicas para sistemas de energia solar:
                  </p>
                  <ul>
                    <li><strong>Linhas de Crédito Especiais:</strong> Bancos oferecem financiamentos com taxas reduzidas para energia solar.</li>
                    <li><strong>Financiamento pelo BNDES:</strong> Taxas atrativas e prazos estendidos para sistemas residenciais e empresariais.</li>
                    <li><strong>Programas de Financiamento FNE/FCO/FNO:</strong> Condições especiais para regiões específicas do Brasil.</li>
                    <li><strong>Consórcios Solares:</strong> Permitem adquirir o sistema com parcelas mensais sem juros.</li>
                  </ul>
                  
                  <h3>Dimensionamento do Sistema Solar</h3>
                  <p>
                    O dimensionamento adequado é essencial para garantir o melhor retorno do investimento. O tamanho do sistema solar depende de:
                  </p>
                  <ul>
                    <li>Consumo médio mensal de energia (kWh)</li>
                    <li>Área disponível para instalação dos painéis</li>
                    <li>Incidência solar na localidade</li>
                    <li>Orçamento disponível para investimento</li>
                  </ul>
                  <p>
                    Em média, cada 1 kWp instalado gera aproximadamente 120-150 kWh por mês, dependendo da região do Brasil.
                  </p>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                    <h4 className="font-bold text-gray-900">Tempo de Retorno do Investimento (Payback)</h4>
                    <p className="text-gray-700 mb-0">
                      O tempo médio de retorno do investimento em energia solar no Brasil varia entre 3 e 6 anos, dependendo da região, 
                      do consumo e da tarifa local de energia. Considerando que os painéis solares têm vida útil superior a 25 anos, 
                      o retorno financeiro é extremamente vantajoso.
                    </p>
                  </div>
                  
                  <h3>Requisitos para Instalar Energia Solar</h3>
                  <ol>
                    <li><strong>Avaliação Técnica:</strong> Verificação da estrutura do telhado ou local de instalação.</li>
                    <li><strong>Projeto:</strong> Dimensionamento do sistema conforme consumo e características locais.</li>
                    <li><strong>Solicitação à Distribuidora:</strong> Pedido de conexão do sistema à rede elétrica.</li>
                    <li><strong>Instalação:</strong> Montagem do sistema por empresa especializada.</li>
                    <li><strong>Vistoria e Homologação:</strong> Inspeção pela distribuidora e autorização para funcionamento.</li>
                  </ol>
                  
                  <h3>Mitos e Verdades sobre Energia Solar</h3>
                  <ul>
                    <li><strong>Mito:</strong> "Painéis solares não funcionam em dias nublados." - <strong>Verdade:</strong> Mesmo em dias nublados há geração, embora reduzida.</li>
                    <li><strong>Mito:</strong> "O investimento é muito alto." - <strong>Verdade:</strong> Com as opções de financiamento, o valor da parcela pode ser menor que a economia gerada.</li>
                    <li><strong>Mito:</strong> "A instalação danifica o telhado." - <strong>Verdade:</strong> Instalações profissionais garantem a integridade da estrutura.</li>
                    <li><strong>Mito:</strong> "A manutenção é cara e complexa." - <strong>Verdade:</strong> A manutenção é simples e de baixo custo, geralmente apenas limpezas periódicas.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <Sun className="h-10 w-10 text-yellow-500" />
                  </div>
                  <CardTitle className="text-xl text-center">Energia Limpa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Cada 1kWp instalado evita a emissão de aproximadamente 10,2 toneladas de CO₂ na atmosfera ao longo de 25 anos
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <Battery className="h-10 w-10 text-green-500" />
                  </div>
                  <CardTitle className="text-xl text-center">Autonomia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Reduza sua dependência das concessionárias de energia e proteja-se contra os constantes aumentos nas tarifas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <Home className="h-10 w-10 text-blue-500" />
                  </div>
                  <CardTitle className="text-xl text-center">Valorização</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Imóveis com sistemas solares têm valorização média de 4% a 8% no mercado imobiliário
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <ShieldCheck className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Garantias e Durabilidade</h3>
                  <p className="text-gray-700">
                    Os painéis solares possuem garantia de potência por até 25 anos, garantindo que produzirão pelo menos 80% da capacidade original após esse período.
                    Os inversores geralmente têm garantia de 5 a 10 anos. A vida útil real dos painéis frequentemente ultrapassa 30 anos com manutenção adequada.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes sobre Energia Solar</h2>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-lg">Qual é o valor médio de um sistema de energia solar?</h3>
                <p className="text-gray-700 mt-2">
                  O valor varia conforme a potência instalada, mas atualmente o preço médio está entre R$ 4.000 e R$ 6.000 por kWp instalado. 
                  Um sistema residencial de 5 kWp, por exemplo, tem custo aproximado entre R$ 20.000 e R$ 30.000.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-lg">O que acontece em dias nublados ou chuvosos?</h3>
                <p className="text-gray-700 mt-2">
                  Em dias nublados ou chuvosos, a produção de energia é reduzida, mas não para completamente. Os painéis continuam gerando energia, 
                  embora em quantidade menor. O sistema de compensação permite usar os créditos acumulados em dias ensolarados para compensar 
                  os períodos de menor produção.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-lg">Preciso de baterias no meu sistema solar?</h3>
                <p className="text-gray-700 mt-2">
                  Na maioria dos casos, não. Sistemas conectados à rede (on-grid) não necessitam de baterias, pois utilizam a rede elétrica 
                  como "backup". O sistema de compensação permite injetar o excedente na rede e utilizar créditos quando necessário. 
                  Baterias são recomendadas apenas para sistemas isolados (off-grid) ou para quem deseja independência total da rede.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-lg">Quais são os melhores financiamentos disponíveis?</h3>
                <p className="text-gray-700 mt-2">
                  Atualmente, os bancos com melhores condições para energia solar são o Santander, Banco do Brasil, Caixa Econômica e Sicredi. 
                  As taxas variam entre 0,99% e 1,40% ao mês, com prazos de até 120 meses. Para empresas, o BNDES oferece linhas especiais 
                  com taxas ainda mais competitivas. Sempre compare as condições, pois as ofertas mudam constantemente.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-lg">Quanto tempo dura a instalação?</h3>
                <p className="text-gray-700 mt-2">
                  A instalação física do sistema solar residencial geralmente leva de 1 a 3 dias, dependendo da complexidade e tamanho. 
                  No entanto, o processo completo, incluindo projeto, aprovação na distribuidora e homologação, pode levar de 30 a 90 dias.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">A energia solar funciona em qualquer tipo de telhado?</h3>
                <p className="text-gray-700 mt-2">
                  Os painéis solares podem ser instalados na maioria dos tipos de telhado, incluindo cerâmica, concreto, metálico e fibrocimento. 
                  O ideal é que o telhado tenha uma boa incidência solar (preferencialmente voltado para o norte no Brasil) e não sofra 
                  sombreamento significativo. Quando o telhado não é adequado, existem alternativas como estruturas de solo ou pergolados.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}