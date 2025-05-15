import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShieldAlert } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { simularFinanciamentoBalao } from "@/utils/finance";
import PriceTable from "@/components/simulators/price-table";
import DebtChart from "@/components/simulators/debt-chart";
import ExportButtons from "@/components/simulators/export-buttons";
import AdSense from "@/components/ads/ad-sense";
import HeadSEO from "@/components/seo/head-seo";
import { useSecureForm } from "@/hooks/use-secure-form";
import { validateNumberRange } from "@/utils/security";

// Schema de validação do formulário
const formSchema = z.object({
  valorFinanciado: z.coerce
    .number()
    .min(20000, { message: "O valor mínimo é R$ 20.000,00" })
    .max(1000000, { message: "O valor máximo é R$ 1.000.000,00" }),
  taxaJuros: z.coerce
    .number()
    .min(0.1, { message: "A taxa mínima é 0,1%" })
    .max(5.0, { message: "A taxa máxima é 5,0%" }),
  numParcelas: z.string().min(1, { message: "Selecione o número de parcelas" }),
  percentualBalao: z.coerce
    .number()
    .min(10, { message: "O percentual mínimo é 10%" })
    .max(50, { message: "O percentual máximo é 50%" }),
  incluirIOF: z.boolean().default(false),
  tipoVeiculo: z.enum(["carro", "moto", "caminhao"]).default("carro"),
});

export default function BalloonPaymentFinance() {
  const [result, setResult] = useState<any>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const { toast } = useToast();
  const [tipoVeiculo, setTipoVeiculo] = useState<"carro" | "moto" | "caminhao">("carro");
  const [taxaAjustada, setTaxaAjustada] = useState<number>(1.59);
  
  // Inicializa o hook de formulário seguro
  const {
    secureSubmit,
    isSubmitting,
    isLimited,
    CsrfInput,
  } = useSecureForm({
    formId: 'balloon-payment-form',
    rateLimiterOptions: {
      maxAttempts: 15, // Permitimos mais submissões para esse formulário
      timeWindowMs: 60000 // 1 minuto
    }
  });
  
  // Inicializar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorFinanciado: 80000,
      taxaJuros: 1.59,
      numParcelas: "36",
      percentualBalao: 30,
      incluirIOF: true,
      tipoVeiculo: "carro",
    },
  });
  
  // Atualizar taxa com base no tipo de veículo
  const atualizarTaxa = useCallback((tipo: "carro" | "moto" | "caminhao") => {
    let taxaBase = 1.59; // Taxa padrão para carros
    
    // Ajustar taxa conforme tipo de veículo
    if (tipo === "moto") {
      taxaBase = 1.85;
    } else if (tipo === "caminhao") {
      taxaBase = 1.58;
    }
    
    console.log("Tipo de veículo alterado:", { tipo, novaTaxa: taxaBase });
    setTaxaAjustada(taxaBase);
    form.setValue("taxaJuros", taxaBase);
  }, [form]);
  
  // Observar mudanças no tipo de veículo
  const watchTipoVeiculo = form.watch("tipoVeiculo");
  
  if (watchTipoVeiculo !== tipoVeiculo) {
    setTipoVeiculo(watchTipoVeiculo);
    atualizarTaxa(watchTipoVeiculo);
  }
  
  // Função de submissão do formulário
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Usando o wrapper seguro para a submissão
    secureSubmit((secureValues) => {
      try {
        // Sanitizamos e validamos todos os valores
        const valorFinanciado = validateNumberRange(
          Number(secureValues.valorFinanciado), 
          20000, 
          1000000, 
          80000
        );
        
        const taxaJuros = validateNumberRange(
          Number(secureValues.taxaJuros), 
          0.1, 
          5.0, 
          1.59
        );
        
        // Valida a string do número de parcelas para converter para número
        let numParcelas = 36; // Valor padrão seguro
        if (typeof secureValues.numParcelas === 'string' && 
            ['24', '36', '48', '60'].includes(secureValues.numParcelas)) {
          numParcelas = parseInt(secureValues.numParcelas);
        }
        
        const percentualBalao = validateNumberRange(
          Number(secureValues.percentualBalao), 
          10, 
          50, 
          30
        );
        
        // Valida o tipo de veículo
        let tipoVeiculoSeguro: "carro" | "moto" | "caminhao" = "carro";
        if (secureValues.tipoVeiculo === "moto" || secureValues.tipoVeiculo === "caminhao") {
          tipoVeiculoSeguro = secureValues.tipoVeiculo;
        }
        
        // Simular financiamento com parcela balão usando valores sanitizados
        const simulacao = simularFinanciamentoBalao(
          valorFinanciado,
          taxaJuros,
          numParcelas,
          percentualBalao,
          Boolean(secureValues.incluirIOF)
        );
        
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

  return (
    <>
      <HeadSEO 
        title="Simulador de Financiamento com Parcela Balão | Calcule suas Parcelas"
        description="Simule financiamento com parcela balão (VFG) para carros, motos e caminhões. Calcule parcelas menores e veja quanto economizar com esta modalidade."
        keywords={["financiamento parcela balão", "VFG", "valor futuro garantido", "financiamento veículo", "parcelas reduzidas"]}
      />
    
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold text-primary mb-4">
          Simulador de Financiamento com Parcela Balão
        </h1>
        
        <section className="mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Calcule financiamento com parcelas menores e valor residual
            </h2>
            <p className="text-lg text-neutral-600 mb-4">
              O financiamento com parcela balão (ou VFG - Valor Futuro Garantido) permite parcelas mensais menores 
              mediante o pagamento de uma parcela final maior. Ideal para quem deseja trocar de veículo em alguns anos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <h3 className="font-bold text-primary mb-2">Parcelas Menores</h3>
                <p className="text-sm text-gray-600">
                  Pague parcelas mensais reduzidas durante todo o financiamento.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <h3 className="font-bold text-primary mb-2">Parcela Balão Final</h3>
                <p className="text-sm text-gray-600">
                  Uma parcela final maior (10% a 50% do valor do veículo) no fim do contrato.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <h3 className="font-bold text-primary mb-2">Opções Flexíveis</h3>
                <p className="text-sm text-gray-600">
                  No fim do contrato: pague a parcela balão, refinancie-a ou devolva o veículo.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <p className="text-lg text-neutral-600 mb-8">
          Preencha os dados abaixo para simular seu financiamento com parcela balão:
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            {/* Adiciona automaticamente o campo CSRF oculto */}
            <CsrfInput />
            
            {/* Aviso de segurança */}
            {isLimited && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-start">
                <ShieldAlert className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  Detectamos muitas solicitações em um curto período. Por favor, aguarde alguns instantes antes de tentar novamente.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          placeholder="80000"
                          className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                          min="20000"
                          max="1000000"
                          step="10000"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          aria-describedby="valorFinanciado-description"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Valor mínimo: R$ 20.000,00</p>
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
                          min="0.1"
                          max="5.0"
                          placeholder="1.59"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          pattern="[0-9]*[.]?[0-9]{0,2}"
                          inputMode="decimal"
                          aria-describedby="taxaJuros-description"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">
                      Taxa média para financiamento com parcela balão: {taxaAjustada}% a.m.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numParcelas"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Número de parcelas mensais</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300">
                          <SelectValue placeholder="Selecione o número de parcelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="24">24 meses (2 anos)</SelectItem>
                        <SelectItem value="36">36 meses (3 anos)</SelectItem>
                        <SelectItem value="48">48 meses (4 anos)</SelectItem>
                        <SelectItem value="60">60 meses (5 anos)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-neutral-500">Prazo comum para parcela balão: 36 a 48 meses</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="percentualBalao"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      Percentual da parcela balão (%)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min="10"
                          max="50"
                          step="5"
                          placeholder="30"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          aria-describedby="percentualBalao-description"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <div className="space-y-2">
                      <p className="text-xs text-neutral-500">
                        Percentual do valor financiado a ser pago na parcela final
                      </p>
                      <div className="w-full">
                        <Progress value={field.value || 30} max={50} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>10%</span>
                          <span>30%</span>
                          <span>50%</span>
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="tipoVeiculo"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Tipo de veículo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300">
                            <SelectValue placeholder="Selecione o tipo de veículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="carro">Automóvel</SelectItem>
                          <SelectItem value="moto">Motocicleta</SelectItem>
                          <SelectItem value="caminhao">Caminhão</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="incluirIOF"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-neutral-700">
                          Incluir IOF no cálculo
                        </FormLabel>
                        <p className="text-xs text-neutral-500">
                          IOF para financiamento de veículos: 0,0082% ao dia (até 365 dias) + 0,38% fixo
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
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
                Calcular
              </Button>
            </div>
          </form>
        </Form>
        
        <AdSense slot="3450512625" format="auto" className="my-8" />
        
        {result && (
          <div className="my-8 animate-in fade-in duration-500">
            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-6">Resultado da Simulação</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Valor Financiado:</span>
                          <span className="font-bold text-gray-900">R$ {form.getValues().valorFinanciado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Parcela Mensal:</span>
                          <span className="font-bold text-green-700">R$ {result.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Parcela Balão Final:</span>
                          <span className="font-bold text-red-600">R$ {result.valorParcelaBalao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Prazo do Financiamento:</span>
                          <span className="font-bold text-gray-900">{parseInt(form.getValues().numParcelas) + 1} meses</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Percentual da Parcela Balão:</span>
                          <span className="font-bold text-gray-900">{result.percentualBalao}% do valor financiado</span>
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
                        
                        {result.valorIOF && (
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">IOF:</span>
                            <span className="font-bold text-blue-600">R$ {result.valorIOF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">CET (Custo Efetivo Total):</span>
                          <span className="font-bold text-gray-900">{result.taxaCET.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}% ao mês</span>
                        </div>
                      </div>
                    </div>
                    
                    <Tabs defaultValue="resumo" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="resumo">Resumo</TabsTrigger>
                        <TabsTrigger value="comparacao">Comparação</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="resumo" className="p-4 border rounded-md mt-2">
                        <h3 className="text-lg font-semibold mb-3">Economia Nas Parcelas Mensais</h3>
                        
                        <p className="text-sm text-gray-600 mb-4">
                          Com a parcela balão de {result.percentualBalao}%, suas parcelas mensais são menores em comparação 
                          com um financiamento tradicional. Veja a diferença:
                        </p>
                        
                        {/* Cálculo aproximado da diferença de parcela */}
                        {(() => {
                          const taxa = form.getValues().taxaJuros / 100;
                          const parcelaTradicional = (form.getValues().valorFinanciado * ((taxa * Math.pow(1 + taxa, parseInt(form.getValues().numParcelas))) / (Math.pow(1 + taxa, parseInt(form.getValues().numParcelas)) - 1)));
                          const economiaPercentual = ((parcelaTradicional - result.valorParcela) / parcelaTradicional) * 100;
                          
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-gray-50 p-4 rounded-lg border">
                                <p className="text-sm font-medium text-gray-700">Parcela em financiamento tradicional:</p>
                                <p className="text-lg font-bold text-gray-700">
                                  R$ {parcelaTradicional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                              
                              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <p className="text-sm font-medium text-green-700">Economia mensal com parcela balão:</p>
                                <p className="text-lg font-bold text-green-700">
                                  R$ {(parcelaTradicional - result.valorParcela).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  <span className="ml-2 text-sm">({economiaPercentual.toFixed(1)}%)</span>
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                        
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Pontos importantes:</h4>
                          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                            <li>Você terá uma parcela final maior de R$ {result.valorParcelaBalao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
                            <li>Ideal para quem planeja trocar de veículo após {form.getValues().numParcelas} meses</li>
                            <li>No final do contrato, você pode: pagar a parcela balão, refinanciá-la ou devolver o veículo</li>
                          </ul>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="comparacao" className="p-4 border rounded-md mt-2">
                        <h3 className="text-lg font-semibold mb-4">Comparação com Financiamento Tradicional</h3>
                        
                        {/* Gráfico de barras simples para comparação */}
                        <div className="h-64 mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                {
                                  name: "Financiamento com Parcela Balão",
                                  parcela: result.valorParcela,
                                  balao: result.valorParcelaBalao,
                                },
                                {
                                  name: "Financiamento Tradicional",
                                  parcela: (form.getValues().valorFinanciado * (((form.getValues().taxaJuros / 100) * Math.pow(1 + (form.getValues().taxaJuros / 100), parseInt(form.getValues().numParcelas))) / (Math.pow(1 + (form.getValues().taxaJuros / 100), parseInt(form.getValues().numParcelas)) - 1))),
                                  balao: 0,
                                },
                              ]}
                              margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                              <YAxis 
                                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`}
                                fontSize={12}
                              />
                              <Tooltip 
                                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Valor"]}
                              />
                              <Area type="monotone" dataKey="parcela" stackId="1" stroke="#4f46e5" fill="#4f46e5" name="Parcela Mensal" />
                              <Area type="monotone" dataKey="balao" stackId="1" stroke="#ef4444" fill="#ef4444" name="Parcela Balão" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p className="mb-3">
                            No financiamento com parcela balão, você tem parcelas mensais reduzidas, porém uma parcela final maior.
                            Esta modalidade é especialmente interessante para:
                          </p>
                          
                          <ul className="list-disc pl-5 space-y-1 mb-3">
                            <li>Quem deseja economizar mensalmente durante o período do financiamento</li>
                            <li>Quem planeja trocar de veículo ao final do período</li>
                            <li>Quem prefere ter prestações menores agora e dispor da opção de refinanciar o valor residual no futuro</li>
                          </ul>
                          
                          <p className="font-medium">
                            É importante planejar como você lidará com a parcela balão de R$ {result.valorParcelaBalao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
                            ao final dos {form.getValues().numParcelas} meses.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div>
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
                      
                      <PriceTable 
                        data={result.tabelaAmortizacao.slice(1)} 
                        expanded={isTableExpanded} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <ExportButtons 
                    data={result.tabelaAmortizacao.slice(1)} 
                    fileName={`financiamento_parcela_balao_${form.getValues().valorFinanciado}`}
                    title="Simulação de Financiamento com Parcela Balão"
                    summary={{
                      valorFinanciado: form.getValues().valorFinanciado,
                      taxaJuros: form.getValues().taxaJuros,
                      numParcelas: parseInt(form.getValues().numParcelas) + 1, // +1 para incluir a parcela balão
                      valorParcela: result.valorParcela,
                      totalPagar: result.totalPagar,
                      totalJuros: result.totalJuros,
                      ...(result.valorIOF !== undefined && { valorIOF: result.valorIOF }),
                      ...(result.taxaCET !== undefined && { taxaCET: result.taxaCET })
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Seção informativa sobre financiamento com parcela balão */}
        <section className="mt-12 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">
              O que é Financiamento com Parcela Balão?
            </h2>
            
            <div className="prose prose-neutral max-w-none">
              <p>
                O financiamento com parcela balão, também conhecido como VFG (Valor Futuro Garantido), é uma modalidade de crédito que permite 
                ao consumidor pagar parcelas mensais menores durante o contrato, com uma parcela final (balão) mais elevada. 
                Esta parcela final geralmente corresponde a uma porcentagem significativa do valor do bem financiado.
              </p>
              
              <h3>Como Funciona o Financiamento com Parcela Balão</h3>
              <p>
                Neste tipo de financiamento, o valor correspondente à parcela balão é postergado para o final do contrato. 
                Isso significa que as parcelas mensais são calculadas sobre um valor menor, resultando em prestações mais acessíveis 
                durante a maior parte do financiamento.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Vantagens</h4>
                  <ul className="space-y-2">
                    <li>Parcelas mensais até 30% menores</li>
                    <li>Possibilidade de adquirir veículos de maior valor</li>
                    <li>Flexibilidade no final do contrato</li>
                    <li>Ideal para quem quer trocar de veículo em poucos anos</li>
                    <li>Alívio no orçamento mensal</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Desvantagens</h4>
                  <ul className="space-y-2">
                    <li>Parcela final de valor elevado</li>
                    <li>Custo total do financiamento pode ser maior</li>
                    <li>Necessidade de planejamento para a parcela final</li>
                    <li>Nem todas as instituições oferecem esta modalidade</li>
                    <li>Maiores exigências de aprovação de crédito</li>
                  </ul>
                </div>
              </div>
              
              <h3>Opções no Final do Contrato</h3>
              <p>
                Ao chegar ao final do contrato de financiamento com parcela balão, o consumidor geralmente tem três opções:
              </p>
              <ol>
                <li><strong>Pagar a parcela balão:</strong> Quitar o valor residual e ficar com o veículo</li>
                <li><strong>Refinanciar:</strong> Refinanciar apenas o valor da parcela balão em um novo contrato</li>
                <li><strong>Devolver o veículo:</strong> Entregar o veículo para a financeira como forma de pagamento da parcela balão (desde que previsto em contrato)</li>
              </ol>
              
              <h3>Perfil Ideal para esta Modalidade</h3>
              <p>
                O financiamento com parcela balão é mais adequado para:
              </p>
              <ul>
                <li>Pessoas que trocam de veículo com frequência (a cada 2-4 anos)</li>
                <li>Quem precisa de parcelas mensais mais baixas no momento</li>
                <li>Profissionais que utilizam o veículo para trabalho e precisam renová-lo constantemente</li>
                <li>Quem prefere dirigir carros mais novos, mesmo que não seja o proprietário definitivo</li>
                <li>Pessoas com capacidade de fazer um bom planejamento financeiro para o futuro</li>
              </ul>
              
              <h3>Diferenças para Leasing e Consórcio</h3>
              <p>
                É importante não confundir o financiamento com parcela balão com outras modalidades:
              </p>
              <ul>
                <li><strong>Leasing:</strong> No leasing, o cliente é arrendatário (não proprietário) durante todo o contrato. No financiamento com parcela balão, o cliente é proprietário desde o início, ainda que com alienação fiduciária.</li>
                <li><strong>Consórcio:</strong> No consórcio não há incidência de juros, apenas taxa de administração, e a contemplação depende de sorteio ou lance. No financiamento com parcela balão, a aprovação é imediata (sujeita à análise de crédito) e há cobrança de juros.</li>
              </ul>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-blue-800 font-medium">
                  Nossa simulação fornece uma estimativa das condições de financiamento com parcela balão. As condições reais 
                  podem variar conforme a instituição financeira, seu perfil de crédito e políticas específicas de cada banco ou 
                  financeira. Consulte sempre um especialista antes de tomar decisões financeiras importantes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}