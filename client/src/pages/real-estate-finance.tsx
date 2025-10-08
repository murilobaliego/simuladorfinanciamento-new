import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import PriceTable from "@/components/simulators/price-table";
import { SimulationResult } from "@/components/simulators/vehicle-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { simularFinanciamento } from "@/utils/finance";
import ExportButtons from "@/components/simulators/export-buttons";
import { useSecureForm } from "@/hooks/use-secure-form";
import { validateNumberRange } from "@/utils/security";
import { Helmet } from 'react-helmet-async';

const formSchema = calculatorSchema.extend({
  valorFinanciado: z.coerce
    .number()
    .min(50000, "O valor mínimo para financiamento é R$ 50.000,00"),
  taxaJuros: z.coerce
    .number()
    .min(0.1, "A taxa mínima é 0,1%")
    .max(2, "A taxa máxima é 2%"),
  numParcelas: z.coerce
    .number()
    .min(60, "O número mínimo de parcelas é 60")
    .max(420, "O número máximo de parcelas é 420"),
  sistema: z.enum(["price", "sac"])
});

export default function RealEstateFinance() {
  return (
    <>
      <Helmet>
        <title>Financiamento Imobiliário | Simulador Price e SAC, MCMV 2025</title>
        <meta name="description" content="Simulador de financiamento imobiliário completo com Price e SAC. Calcule parcelas, juros e amortização para casa própria, apartamento e MCMV. Compare taxas dos principais bancos." />
        <meta name="keywords" content="financiamento imobiliário, simulador financiamento casa, tabela price imóveis, sistema sac, mcmv, casa própria, simulador habitação" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/financiamento-imobiliario" />
        <meta property="og:title" content="Financiamento Imobiliário | Simulador Price e SAC 2025" />
        <meta property="og:description" content="Simulador de financiamento imobiliário completo com Price e SAC. Calcule parcelas, juros e amortização para casa própria, apartamento e MCMV." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/financiamento-imobiliario" />
        <meta property="og:image" content="https://simuladorfinanciamento.com/images/financiamento-imobiliario-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Financiamento Imobiliário | Simulador Price e SAC" />
        <meta name="twitter:description" content="Simulador de financiamento imobiliário completo com Price e SAC. Calcule parcelas, juros e amortização para casa própria, apartamento e MCMV." />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Financiamento Imobiliário",
              "alternateName": "Calculadora de Financiamento de Imóveis",
              "url": "https://simuladorfinanciamento.com/financiamento-imobiliario",
              "description": "Simulador completo para financiamento imobiliário com sistemas Price e SAC, incluindo MCMV e programas habitacionais.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "isAccessibleForFree": true,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "featureList": [
                "Sistema Tabela Price",
                "Sistema SAC (Amortização Constante)",
                "Simulação MCMV",
                "Cálculo de parcelas até 35 anos",
                "Tabela de amortização completa",
                "Comparação Price vs SAC",
                "Exportação em PDF e Excel"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Pessoas interessadas em financiamento imobiliário"
              },
              "provider": {
                "@type": "Organization",
                "name": "Simulador de Financiamento",
                "url": "https://simuladorfinanciamento.com"
              }
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
                  "name": "Qual a diferença entre Price e SAC no financiamento imobiliário?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No sistema Price, as parcelas são fixas durante todo o financiamento. No SAC, a amortização é constante e os juros decrescem, resultando em parcelas maiores no início que diminuem ao longo do tempo."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual o prazo máximo para financiamento imobiliário?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O prazo máximo para financiamento imobiliário no Brasil é de 35 anos (420 meses), mas pode variar conforme a idade do mutuário e políticas do banco."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual a taxa de juros média para financiamento imobiliário?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As taxas de financiamento imobiliário variam de 0,7% a 1,2% ao mês, dependendo do banco, relacionamento, valor da entrada e programa utilizado (SBPE, MCMV, etc.)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Como funciona o MCMV no financiamento imobiliário?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O MCMV (Minha Casa Minha Vida) oferece taxas subsidiadas pelo governo, com juros mais baixos para famílias de baixa renda, facilitando o acesso ao financiamento imobiliário."
                  }
                }
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
                  "name": "Financiamento Imobiliário",
                  "item": "https://simuladorfinanciamento.com/financiamento-imobiliario"
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <RealEstateFinanceContent />
    </>
  );
}

function RealEstateFinanceContent() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const { toast } = useToast();
  
  // Inicializa o hook de formulário seguro
  const {
    secureSubmit,
    isSubmitting,
    isLimited,
    CsrfInput,
  } = useSecureForm({
    formId: 'real-estate-finance-form',
    rateLimiterOptions: {
      maxAttempts: 15, // Permitimos mais submissões para esse formulário
      timeWindowMs: 60000 // 1 minuto
    }
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorFinanciado: 300000,
      taxaJuros: 0.8,
      numParcelas: 360,
      sistema: "price"
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Usando o wrapper seguro para a submissão
    secureSubmit((secureValues) => {
      try {
        // Validamos e sanitizamos os valores para proteção adicional
        const valorFinanciado = validateNumberRange(
          Number(secureValues.valorFinanciado), 
          50000, 
          10000000, 
          300000
        );
        
        const taxaJuros = validateNumberRange(
          Number(secureValues.taxaJuros), 
          0.1, 
          2, 
          0.8
        );
        
        const numParcelas = validateNumberRange(
          Number(secureValues.numParcelas), 
          60, 
          420, 
          360
        );
        
        // Verificamos se o sistema é válido
        const sistema = (secureValues.sistema === "price" || secureValues.sistema === "sac") 
          ? secureValues.sistema 
          : "price";
        
        // Usar a função simularFinanciamento com valores sanitizados
        const data = simularFinanciamento(
          valorFinanciado, 
          taxaJuros, 
          numParcelas, 
          false, // não incluir IOF para financiamento imobiliário
          sistema
        );
        
        setResult(data);
        
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
      }
    }, values);
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Simulador de Financiamento Imobiliário</h2>
        
        <div className="mb-8">
          <p className="mb-4">O financiamento imobiliário é uma forma de adquirir um imóvel pagando-o em parcelas ao longo de vários anos. É uma das principais maneiras de realizar o sonho da casa própria para muitas famílias brasileiras.</p>
          
          <p className="mb-4">No Brasil, os financiamentos imobiliários podem ser calculados por dois sistemas principais: a Tabela Price e o Sistema de Amortização Constante (SAC). Cada um tem suas características e benefícios:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Tabela Price:</strong> Parcelas fixas do início ao fim do contrato, facilitando o planejamento financeiro.</li>
            <li><strong>Sistema SAC:</strong> Amortização constante e juros decrescentes, resultando em parcelas maiores no início que vão diminuindo com o tempo.</li>
          </ul>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">🏠 Tipos de Imóveis para Financiamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🏠</div>
                <h4 className="font-semibold text-yellow-800">Casas</h4>
                <p className="text-yellow-700 text-sm">Novas e usadas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏢</div>
                <h4 className="font-semibold text-yellow-800">Apartamentos</h4>
                <p className="text-yellow-700 text-sm">Na planta ou prontos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏗️</div>
                <h4 className="font-semibold text-yellow-800">Terrenos</h4>
                <p className="text-yellow-700 text-sm">Para construção</p>
              </div>
            </div>
          </div>
          
          <h2 id="taxas-financiamento-2025" className="text-2xl font-semibold text-primary mt-8 mb-4">Taxas de Financiamento Imobiliário 2025</h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead>
                <tr className="bg-primary/10">
                  <th className="px-4 py-3 border text-left font-semibold">Modalidade</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Mínima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Máxima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Entrada Mínima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Prazo Máximo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border font-medium">SBPE (Tradicional)</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">0,70% a.m.</td>
                  <td className="px-4 py-3 border text-center">1,20% a.m.</td>
                  <td className="px-4 py-3 border text-center">20%</td>
                  <td className="px-4 py-3 border text-center">35 anos</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 border font-medium">MCMV (Minha Casa Minha Vida)</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">0,50% a.m.</td>
                  <td className="px-4 py-3 border text-center">0,70% a.m.</td>
                  <td className="px-4 py-3 border text-center">5%</td>
                  <td className="px-4 py-3 border text-center">30 anos</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border font-medium">Casa Verde Amarela</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">0,50% a.m.</td>
                  <td className="px-4 py-3 border text-center">0,68% a.m.</td>
                  <td className="px-4 py-3 border text-center">5%</td>
                  <td className="px-4 py-3 border text-center">30 anos</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <p className="text-sm italic">Use nosso <strong>simulador de financiamento imobiliário</strong> com as taxas acima para obter cálculos precisos. Lembre-se: não comprometa mais de 30% da sua renda familiar com a parcela do financiamento.</p>
          </div>
        </div>
        
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
          
            <Tabs defaultValue="price" onValueChange={(value) => form.setValue("sistema", value as "price" | "sac")}>
              <TabsList className="mb-6">
                <TabsTrigger value="price">Tabela Price</TabsTrigger>
                <TabsTrigger value="sac">Sistema SAC</TabsTrigger>
              </TabsList>
            </Tabs>
            
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
                          placeholder="300000"
                          className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                          min="50000"
                          max="10000000"
                          step="10000"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          aria-describedby="valorFinanciado-description"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Valor mínimo: R$ 50.000,00</p>
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
                          max="2.0"
                          placeholder="0.8"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          pattern="[0-9]*\.?[0-9]*"
                          inputMode="decimal"
                          aria-describedby="taxaJuros-description"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Taxa média para imóveis: 0,8% a.m.</p>
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
                        <SelectItem value="120">120 meses (10 anos)</SelectItem>
                        <SelectItem value="180">180 meses (15 anos)</SelectItem>
                        <SelectItem value="240">240 meses (20 anos)</SelectItem>
                        <SelectItem value="300">300 meses (25 anos)</SelectItem>
                        <SelectItem value="360">360 meses (30 anos)</SelectItem>
                        <SelectItem value="420">420 meses (35 anos)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-neutral-500">Prazo comum: 20 a 30 anos</p>
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
                Calcular
              </Button>
            </div>
          </form>
        </Form>
        
        {result && (
          <div id="resultado-simulacao" className="mb-8">
            <h3 className="font-heading text-xl font-semibold text-primary mb-4">
              Resultado da simulação 
              <span className="ml-2 text-sm bg-primary/20 text-primary px-2 py-1 rounded-md">
                {form.getValues("sistema") === "price" ? "Tabela Price" : "Sistema SAC"}
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">
                  {form.getValues("sistema") === "sac" ? 
                    "Valor da primeira parcela" : 
                    "Valor da parcela (fixa)"}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valorParcela)}
                </p>
                {form.getValues("sistema") === "sac" && (
                  <p className="text-xs text-neutral-500 mt-1">
                    *No SAC, o valor da parcela diminui a cada mês
                  </p>
                )}
              </div>
              
              <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Total a pagar</p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalPagar)}
                </p>
              </div>
              
              <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Total de juros</p>
                <p className="text-2xl font-bold text-accent-dark">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalJuros)}
                </p>
                {form.getValues("sistema") === "sac" && (
                  <p className="text-xs text-green-600 mt-1">
                    *Geralmente menor no sistema SAC
                  </p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-semibold">Evolução do saldo devedor</h4>
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
                data={result.tabelaAmortizacao} 
                expanded={isTableExpanded} 
              />
            </div>
            
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600 italic">* Este é apenas um cálculo aproximado. As condições reais podem variar conforme a instituição financeira.</p>
                
                <ExportButtons 
                  data={result.tabelaAmortizacao} 
                  fileName={`simulacao-financiamento-imobiliario-${form.getValues("sistema")}`} 
                  title={`Simulação de Financiamento Imobiliário - ${form.getValues("sistema") === "price" ? "Tabela Price" : "Sistema SAC"}`}
                  summary={{
                    valorFinanciado: form.getValues().valorFinanciado,
                    taxaJuros: form.getValues().taxaJuros,
                    numParcelas: form.getValues().numParcelas,
                    valorParcela: result.valorParcela,
                    totalPagar: result.totalPagar,
                    totalJuros: result.totalJuros
                  }}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Perguntas Frequentes - Financiamento Imobiliário</h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual a diferença entre Price e SAC no financiamento imobiliário?</h3>
              <p className="text-neutral-700">No sistema <strong>Price</strong>, as parcelas são fixas durante todo o financiamento. No <strong>SAC</strong>, a amortização é constante e os juros decrescem, resultando em parcelas maiores no início que diminuem ao longo do tempo.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual o prazo máximo para financiamento imobiliário?</h3>
              <p className="text-neutral-700">O prazo máximo para <strong>financiamento imobiliário</strong> no Brasil é de 35 anos (420 meses), mas pode variar conforme a idade do mutuário e políticas do banco.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual a taxa de juros média para financiamento imobiliário?</h3>
              <p className="text-neutral-700">As taxas de <strong>financiamento imobiliário</strong> variam de 0,7% a 1,2% ao mês, dependendo do banco, relacionamento, valor da entrada e programa utilizado (SBPE, MCMV, etc.).</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Como funciona o MCMV no financiamento imobiliário?</h3>
              <p className="text-neutral-700">O <strong>MCMV</strong> (Minha Casa Minha Vida) oferece taxas subsidiadas pelo governo, com juros mais baixos para famílias de baixa renda, facilitando o acesso ao financiamento imobiliário.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual a entrada mínima para financiar um imóvel?</h3>
              <p className="text-neutral-700">A entrada mínima varia: SBPE tradicional exige 20%, enquanto programas como MCMV podem aceitar apenas 5% de entrada, facilitando o acesso à casa própria.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Posso usar FGTS no financiamento imobiliário?</h3>
              <p className="text-neutral-700">Sim, o FGTS pode ser usado como entrada, para amortização de parcelas ou quitação do <strong>financiamento imobiliário</strong>, desde que atenda aos requisitos legais.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Vantagens do Nosso Simulador de Financiamento Imobiliário</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-semibold mb-1">Price e SAC</h3>
              <p className="text-sm text-gray-600">Compare os dois sistemas de amortização</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold mb-1">Até 35 Anos</h3>
              <p className="text-sm text-gray-600">Simule prazos longos para menor parcela</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏠</div>
              <h3 className="font-semibold mb-1">MCMV</h3>
              <p className="text-sm text-gray-600">Inclui programas habitacionais</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Detalhado</h3>
              <p className="text-sm text-gray-600">Tabela completa de amortização</p>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-100 border-l-4 border-secondary p-4 mt-6">
          <p className="text-sm font-medium">AVISO IMPORTANTE:</p>
          <p className="text-sm">Este <strong>simulador de financiamento imobiliário</strong> é uma ferramenta educativa. Os valores são aproximações para planejamento. Para condições oficiais, consulte bancos e financeiras autorizadas.</p>
        </div>
      </section>
    </div>
  );
}
