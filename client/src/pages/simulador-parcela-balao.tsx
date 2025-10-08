import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Helmet } from 'react-helmet-async';
import { Link } from "wouter";
import SimulatorCard from "@/components/simulators/simulator-card";
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

export default function SimuladorParcelaBalao() {
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
      maxAttempts: 15,
      timeWindowMs: 60000
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
    let taxaBase = 1.59;
    if (tipo === "moto") {
      taxaBase = 1.85;
    } else if (tipo === "caminhao") {
      taxaBase = 1.58;
    }
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
    secureSubmit((secureValues) => {
      try {
        const valorFinanciado = validateNumberRange(Number(secureValues.valorFinanciado), 20000, 1000000, 80000);
        const taxaJuros = validateNumberRange(Number(secureValues.taxaJuros), 0.1, 5.0, 1.59);
        let numParcelas = 36;
        if (typeof secureValues.numParcelas === 'string' && ['24', '36', '48', '60'].includes(secureValues.numParcelas)) {
          numParcelas = parseInt(secureValues.numParcelas);
        }
        const percentualBalao = validateNumberRange(Number(secureValues.percentualBalao), 10, 50, 30);
        
        const simulacao = simularFinanciamentoBalao(
          valorFinanciado,
          taxaJuros,
          numParcelas,
          percentualBalao,
          Boolean(secureValues.incluirIOF)
        );
        
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
      <Helmet>
        <title>Simulador de Parcela Balão | Financiamento com VFG Online</title>
        <meta name="description" content="Simulador de financiamento com parcela balão (VFG) gratuito. Calcule parcelas menores para carros, motos e caminhões com valor futuro garantido." />
        <meta name="keywords" content="simulador parcela balão, VFG, valor futuro garantido, financiamento balão, parcela final, simulador VFG, financiamento veículo balão" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/simulador-parcela-balao" />
        <meta property="og:title" content="Simulador de Parcela Balão | Financiamento com VFG Online" />
        <meta property="og:description" content="Use nosso simulador de parcela balão gratuito para calcular financiamentos com VFG. Parcelas menores e flexibilidade no final do contrato." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/simulador-parcela-balao" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Parcela Balão",
              "url": "https://simuladorfinanciamento.com/simulador-parcela-balao",
              "description": "Simulador online gratuito para financiamento com parcela balão (VFG) com cálculo de parcelas reduzidas.",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "operatingSystem": "Web",
              "featureList": [
                "Cálculo de parcela balão",
                "Simulação VFG",
                "Parcelas reduzidas",
                "Diferentes tipos de veículos",
                "Comparação com financiamento tradicional"
              ]
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Início",
                  "item": "https://simuladorfinanciamento.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Simulador de Parcela Balão",
                  "item": "https://simuladorfinanciamento.com/simulador-parcela-balao"
                }
              ]
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "O que é financiamento com parcela balão?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O financiamento com parcela balão, também conhecido como VFG (Valor Futuro Garantido), é uma modalidade que permite parcelas mensais menores durante o contrato, com uma parcela final maior. Ideal para quem planeja trocar de veículo em alguns anos."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quais as vantagens da parcela balão?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As principais vantagens são: parcelas mensais até 30% menores, possibilidade de adquirir veículos de maior valor, flexibilidade no final do contrato e alívio no orçamento mensal durante o financiamento."
                  }
                },
                {
                  "@type": "Question",
                  "name": "O que posso fazer no final do contrato com parcela balão?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No final do contrato você tem três opções: pagar a parcela balão e ficar com o veículo, refinanciar apenas o valor da parcela balão, ou devolver o veículo para a financeira (quando previsto em contrato)."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <section className="mb-12 bg-white rounded-lg shadow-md p-6">
          <h1 className="font-heading text-3xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Simulador de Parcela Balão</h1>
          
          <div className="mb-8">
            <p className="mb-4">O <strong>simulador de parcela balão</strong> é uma ferramenta especializada para calcular financiamentos com <strong>VFG (Valor Futuro Garantido)</strong>, modalidade que permite parcelas mensais menores mediante o pagamento de uma parcela final maior. Esta opção é ideal para quem deseja economizar nas prestações mensais e tem flexibilidade para lidar com o valor residual no final do contrato.</p>
            
            <h2 id="o-que-e-parcela-balao" className="text-xl font-semibold text-primary mt-6 mb-3">O que é Financiamento com Parcela Balão?</h2>
            
            <p className="mb-4">O <strong>financiamento com parcela balão</strong>, também conhecido como <strong>VFG (Valor Futuro Garantido)</strong>, é uma modalidade de crédito onde uma parte significativa do valor financiado (geralmente entre 10% e 50%) é postergada para o final do contrato. Isso resulta em parcelas mensais substancialmente menores durante todo o período de financiamento.</p>
            
            <p className="mb-4">Esta modalidade funciona da seguinte forma:</p>
            
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li><strong>Parcelas mensais reduzidas:</strong> Você paga apenas uma parte do valor total mensalmente</li>
              <li><strong>Parcela balão final:</strong> No último mês, há uma parcela maior correspondente ao valor residual</li>
              <li><strong>Flexibilidade no final:</strong> Você pode pagar, refinanciar ou devolver o veículo</li>
              <li><strong>Propriedade imediata:</strong> Diferente do leasing, você é proprietário desde o início</li>
            </ul>
            
            <div className="my-8 p-5 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-lg mb-3">Vantagens da Parcela Balão</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-primary mb-2">Benefícios Financeiros</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Parcelas até 30% menores</li>
                    <li>• Maior poder de compra</li>
                    <li>• Alívio no orçamento mensal</li>
                    <li>• Possibilidade de investir a diferença</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-primary mb-2">Flexibilidade</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Opção de trocar de veículo facilmente</li>
                    <li>• Refinanciamento do valor residual</li>
                    <li>• Adequado para uso comercial</li>
                    <li>• Ideal para quem troca de carro frequentemente</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h2 id="como-funciona" className="text-xl font-semibold text-primary mt-6 mb-3">Como Funciona o Cálculo da Parcela Balão</h2>
            
            <p className="mb-4">O cálculo do financiamento com parcela balão segue uma lógica específica que difere do financiamento tradicional:</p>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="px-4 py-2 border text-left">Componente</th>
                    <th className="px-4 py-2 border text-center">Financiamento Tradicional</th>
                    <th className="px-4 py-2 border text-center">Financiamento com Parcela Balão</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Valor financiado</td>
                    <td className="px-4 py-2 border">100% do valor</td>
                    <td className="px-4 py-2 border">Valor total menos a parcela balão</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-medium">Parcelas mensais</td>
                    <td className="px-4 py-2 border">Fixas e maiores</td>
                    <td className="px-4 py-2 border">Fixas e menores</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border font-medium">Parcela final</td>
                    <td className="px-4 py-2 border">Igual às demais</td>
                    <td className="px-4 py-2 border">Valor da parcela balão (10% a 50%)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-medium">Flexibilidade</td>
                    <td className="px-4 py-2 border">Limitada</td>
                    <td className="px-4 py-2 border">Alta (pagar, refinanciar ou devolver)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h2 id="opcoes-final-contrato" className="text-xl font-semibold text-primary mt-8 mb-3">Opções no Final do Contrato</h2>
            
            <p className="mb-4">Uma das principais vantagens do financiamento com parcela balão é a flexibilidade oferecida no final do contrato. Você terá três opções principais:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">1. Pagar a Parcela Balão</h4>
                <p className="text-sm text-green-700">
                  Quite o valor residual e torne-se proprietário definitivo do veículo. 
                  Ideal se você se adaptou bem ao veículo e deseja mantê-lo.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">2. Refinanciar o Valor</h4>
                <p className="text-sm text-blue-700">
                  Financie apenas o valor da parcela balão em um novo contrato. 
                  Útil quando você não tem o valor total disponível.
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-bold text-orange-800 mb-2">3. Devolver o Veículo</h4>
                <p className="text-sm text-orange-700">
                  Entregue o veículo para a financeira como pagamento da parcela balão. 
                  Disponível apenas quando previsto em contrato.
                </p>
              </div>
            </div>
            
            <h2 id="perfil-ideal" className="text-xl font-semibold text-primary mt-8 mb-3">Perfil Ideal para Parcela Balão</h2>
            
            <p className="mb-4">O financiamento com parcela balão é mais adequado para determinados perfis de consumidores:</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Ideal para você se:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Troca de veículo a cada 2-4 anos</li>
                <li>• Precisa de parcelas menores no momento</li>
                <li>• Usa o veículo para trabalho e precisa renová-lo frequentemente</li>
                <li>• Tem capacidade de planejamento financeiro para o futuro</li>
                <li>• Prefere dirigir carros mais novos</li>
                <li>• Tem renda variável e precisa de flexibilidade</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <h4 className="font-medium text-red-800 mb-2">Não recomendado se:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Pretende usar o veículo por muitos anos</li>
                <li>• Não tem planejamento para a parcela final</li>
                <li>• Prefere a segurança de parcelas iguais</li>
                <li>• Tem dificuldades com planejamento financeiro</li>
                <li>• Busca o menor custo total possível</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
              <p className="text-sm italic text-yellow-800">Este simulador é uma ferramenta de cálculo para fins educativos e informativos. As condições reais do seu financiamento com parcela balão podem variar conforme a política da instituição financeira, seu perfil de crédito e outros fatores. Consulte sempre um especialista antes de tomar decisões financeiras.</p>
            </div>
          </div>
          
          <h2 className="font-heading text-2xl font-bold text-primary mb-6">Simule seu Financiamento com Parcela Balão</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
              <CsrfInput />
              
              {isLimited && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-start">
                  <ShieldAlert className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Detectamos muitas solicitações em um curto período. Por favor, aguarde alguns instantes antes de tentar novamente.</p>
                </div>
              )}
              
              {/* Dados do Financiamento com Parcela Balão */}
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Dados do Financiamento com Parcela Balão
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <FormField
                    control={form.control}
                    name="valorFinanciado"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-yellow-700">Valor a financiar (R$)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                            <Input
                              type="number"
                              placeholder="80000"
                              className="pl-10 pr-4 py-3 bg-white border-yellow-200"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-yellow-600">Valor mínimo: R$ 20.000,00</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxaJuros"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-yellow-700">Taxa de juros (% ao mês)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="1.59"
                              className="pl-4 pr-10 py-3 bg-white border-yellow-200"
                              {...field}
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                          </div>
                        </FormControl>
                        <p className="text-xs text-yellow-600">Taxa média para parcela balão: {taxaAjustada}% a.m.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="numParcelas"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-yellow-700">Número de parcelas mensais</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="pl-4 pr-10 py-3 bg-white border-yellow-200">
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
                        <p className="text-xs text-yellow-600">Prazo comum para parcela balão: 36 a 48 meses</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Configurações Adicionais
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="percentualBalao"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-yellow-700">Percentual da parcela balão (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="10"
                              max="50"
                              step="5"
                              placeholder="30"
                              className="pl-4 pr-10 py-3 bg-white border-yellow-200"
                              {...field}
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                          </div>
                        </FormControl>
                        <div className="space-y-2">
                          <p className="text-xs text-yellow-600">Percentual do valor financiado a ser pago na parcela final</p>
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
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="tipoVeiculo"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-yellow-700">Tipo de veículo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="pl-4 pr-10 py-3 bg-white border-yellow-200">
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white rounded-md border border-yellow-200 p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium text-yellow-700">Incluir IOF no cálculo</FormLabel>
                            <p className="text-xs text-yellow-600">IOF para financiamento de veículos: 0,0082% ao dia (até 365 dias) + 0,38% fixo</p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
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
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Evolução do Saldo Devedor</h3>
                        <div className="h-64">
                          <DebtChart data={result.tabelaAmortizacao.slice(1)} />
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
                          </Button>
                        </div>
                        <PriceTable data={result.tabelaAmortizacao.slice(1)} expanded={isTableExpanded} />
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
                        numParcelas: parseInt(form.getValues().numParcelas) + 1,
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
          
          <h2 className="font-heading text-2xl font-bold text-primary mb-6 mt-12">Simuladores Relacionados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

            
            <SimulatorCard
              title="Comparativo: Balão vs Tradicional"
              description="Compare financiamento com parcela balão versus financiamento tradicional."
              path="/comparativo-amortizacao"
              imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Gráficos comparativos"
            />
            
            <SimulatorCard
              title="Calculadora de Entrada Ideal"
              description="Descubra o valor ideal de entrada para equilibrar parcelas e parcela balão."
              path="/calculadora-entrada-ideal"
              imageSrc="https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Dinheiro e calculadora"
            />
            
            <SimulatorCard
              title="Leasing vs Financiamento"
              description="Compare leasing, financiamento com parcela balão e financiamento tradicional."
              path="/leasing-vs-financiamento"
              imageSrc="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Contrato e caneta"
            />
            
            <SimulatorCard
              title="Financiamento de Veículos"
              description="Simulador tradicional para financiamento de carros e motos."
              path="/simulador-financiamento-veiculos"
              imageSrc="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Carro em exposição"
            />
            
            <SimulatorCard
              title="Simulador de Refinanciamento"
              description="Calcule a economia ao refinanciar seu veículo com parcela balão."
              path="/simulador-refinanciamento"
              imageSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Pessoa analisando contrato"
            />
          </div>
          
          <h2 id="perguntas-frequentes" className="text-xl font-semibold text-primary mt-8 mb-3">Perguntas Frequentes sobre Parcela Balão</h2>
          
          <div className="space-y-5 mb-6">
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">Qual a diferença entre parcela balão e leasing?</h3>
              <p className="text-neutral-700">No financiamento com parcela balão, você é proprietário do veículo desde o início (com alienação fiduciária), enquanto no leasing você é apenas arrendatário. Na parcela balão há incidência de IOF e juros, no leasing não há IOF e a remuneração é através de taxa de arrendamento.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">Posso antecipar o pagamento da parcela balão?</h3>
              <p className="text-neutral-700">Sim, geralmente é possível antecipar o pagamento da parcela balão, o que pode resultar em desconto nos juros. Consulte as condições específicas do seu contrato, pois cada instituição financeira tem suas próprias regras para antecipação.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">O que acontece se eu não conseguir pagar a parcela balão?</h3>
              <p className="text-neutral-700">Se não conseguir pagar a parcela balão, você pode: refinanciar apenas esse valor em um novo contrato, vender o veículo e usar o valor para quitar, ou negociar com a financeira. É importante não deixar para resolver na última hora.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">A parcela balão tem limite mínimo e máximo?</h3>
              <p className="text-neutral-700">Sim, geralmente a parcela balão varia entre 10% e 50% do valor financiado, dependendo da política da instituição financeira e do tipo de veículo. Percentuais muito altos podem não ser aprovados devido ao risco de inadimplência.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Vale a pena escolher parcela balão para economizar?</h3>
              <p className="text-neutral-700">Depende do seu perfil e objetivos. Se você troca de veículo frequentemente e precisa de parcelas menores, pode ser vantajoso. Porém, se pretende ficar com o veículo por muitos anos, o financiamento tradicional pode ter custo total menor. Use nosso <Link href="/comparativo-amortizacao" className="text-primary hover:underline">simulador comparativo</Link> para analisar.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}