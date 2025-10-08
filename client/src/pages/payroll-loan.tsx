import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculatorSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import PriceTable from "@/components/simulators/price-table";
import { SimulationResult } from "@/components/simulators/vehicle-form";
import { simularFinanciamento } from "@/utils/finance";
import ExportButtons from "@/components/simulators/export-buttons";
import { Helmet } from 'react-helmet-async';

const formSchema = calculatorSchema.extend({
  valorFinanciado: z.coerce
    .number()
    .min(1000, "O valor mínimo para empréstimo é R$ 1.000,00")
    .max(150000, "O valor máximo para empréstimo é R$ 150.000,00"),
  taxaJuros: z.coerce
    .number()
    .min(0.8, "A taxa mínima é 0,8%")
    .max(2.5, "A taxa máxima é 2,5%"),
  numParcelas: z.coerce
    .number()
    .min(6, "O número mínimo de parcelas é 6")
    .max(96, "O número máximo de parcelas é 96"),
  tipoConsignado: z.enum(["inss", "servidor", "militar"])
});

export default function PayrollLoan() {
  return (
    <>
      <Helmet>
        <title>Crédito Consignado | Simulador INSS, Servidor Público e Militar 2025</title>
        <meta name="description" content="Simulador de crédito consignado para aposentados INSS, servidores públicos e militares. Melhores taxas, até 96 meses e desconto em folha. Compare condições dos principais bancos." />
        <meta name="keywords" content="crédito consignado, emprestimo consignado inss, consignado servidor publico, consignado militar, simulador consignado, margem consignavel" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/credito-consignado" />
        <meta property="og:title" content="Crédito Consignado | Simulador INSS, Servidor e Militar 2025" />
        <meta property="og:description" content="Simulador de crédito consignado para aposentados INSS, servidores públicos e militares. Melhores taxas, até 96 meses e desconto em folha." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/credito-consignado" />
        <meta property="og:image" content="https://simuladorfinanciamento.com/images/credito-consignado-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crédito Consignado | Simulador INSS, Servidor e Militar" />
        <meta name="twitter:description" content="Simulador de crédito consignado para aposentados INSS, servidores públicos e militares. Melhores taxas, até 96 meses." />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Crédito Consignado",
              "alternateName": "Calculadora de Empréstimo Consignado",
              "url": "https://simuladorfinanciamento.com/credito-consignado",
              "description": "Simulador completo para crédito consignado INSS, servidor público e militar com cálculo de margem consignável.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "isAccessibleForFree": true,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "featureList": [
                "Simulação para INSS",
                "Simulação para servidores públicos",
                "Simulação para militares",
                "Cálculo de margem consignável",
                "Taxas diferenciadas por categoria",
                "Prazos de até 96 meses",
                "Tabela de amortização completa"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Aposentados, pensionistas, servidores públicos e militares"
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
                  "name": "Quem pode contratar crédito consignado?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Podem contratar crédito consignado: aposentados e pensionistas do INSS, servidores públicos federais, estaduais e municipais, e militares das Forças Armadas."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual a margem consignável do INSS?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A margem consignável do INSS é de até 45% do benefício: 35% para empréstimo consignado e 10% para cartão de crédito consignado ou saque-aniversario FGTS."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quais são as taxas do crédito consignado?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As taxas do crédito consignado variam: INSS 1,7% a.m., servidores públicos 1,5% a.m., militares 1,3% a.m. São as menores taxas do mercado de crédito."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual o prazo máximo do consignado?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O prazo máximo varia: INSS até 84 meses, servidores públicos até 96 meses, militares até 84 meses, dependendo da instituição e regulamentação específica."
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
                  "name": "Crédito Consignado",
                  "item": "https://simuladorfinanciamento.com/credito-consignado"
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <PayrollLoanContent />
    </>
  );
}

function PayrollLoanContent() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taxaChanged, setTaxaChanged] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorFinanciado: 10000,
      taxaJuros: 1.7,
      numParcelas: 60,
      tipoConsignado: "inss"
    },
  });

  const tipoConsignado = form.watch("tipoConsignado");

  // Atualiza a taxa de juros automaticamente quando o tipo de consignado muda
  useEffect(() => {
    // Define a taxa de juros com base no tipo de consignado
    const taxasConsignado = {
      inss: 1.7,
      servidor: 1.5,
      militar: 1.3
    };
    
    // Altera o valor do campo taxaJuros
    form.setValue("taxaJuros", taxasConsignado[tipoConsignado]);
    
    // Ativa a animação visual para indicar a mudança
    setTaxaChanged(true);
    
    // Desativa a animação após 1 segundo
    const timer = setTimeout(() => {
      setTaxaChanged(false);
    }, 1000);
    
    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [tipoConsignado, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Usar a função simularFinanciamento que engloba todos os cálculos necessários
      const data = simularFinanciamento(
        values.valorFinanciado, 
        values.taxaJuros, 
        values.numParcelas, 
        false // não incluir IOF para empréstimos consignados
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="mb-8 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="font-heading text-4xl font-bold mb-4">Crédito Consignado</h1>
          <p className="text-xl opacity-90 mb-4">Menores taxas do mercado com desconto em folha</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">✓ INSS</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">✓ Servidor Público</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">✓ Militar</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">✓ Até 96 meses</span>
          </div>
        </div>
      </section>
      
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <div className="mb-8">
          <p className="mb-4 text-lg">O <strong>crédito consignado</strong> oferece as menores taxas de juros do mercado brasileiro. Com desconto direto na folha de pagamento ou benefício, é a modalidade mais vantajosa para aposentados, servidores públicos e militares.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">👥</span>
                INSS
              </h3>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>✓ Aposentados e pensionistas</li>
                <li>✓ Margem de até 45% do benefício</li>
                <li>✓ Taxa média: 1,7% a.m.</li>
                <li>✓ Prazo: até 84 meses</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">🏢</span>
                Servidor Público
              </h3>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>✓ Federal, estadual, municipal</li>
                <li>✓ Margem de 30% a 40% do salário</li>
                <li>✓ Taxa média: 1,5% a.m.</li>
                <li>✓ Prazo: até 96 meses</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">🎖️</span>
                Militar
              </h3>
              <ul className="text-yellow-700 space-y-2 text-sm">
                <li>✓ Exército, Marinha, Aeronáutica</li>
                <li>✓ Margem conforme regulamento</li>
                <li>✓ Taxa média: 1,3% a.m.</li>
                <li>✓ Prazo: até 84 meses</li>
              </ul>
            </div>
          </div>
          
          <h2 id="taxas-consignado-2025" className="text-2xl font-semibold text-primary mt-8 mb-4">Taxas de Crédito Consignado 2025 por Categoria</h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead>
                <tr className="bg-primary/10">
                  <th className="px-4 py-3 border text-left font-semibold">Categoria</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Mínima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Máxima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Margem Máxima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Prazo Máximo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border font-medium">INSS (Aposentados/Pensionistas)</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">1,4% a.m.</td>
                  <td className="px-4 py-3 border text-center">2,0% a.m.</td>
                  <td className="px-4 py-3 border text-center">45%</td>
                  <td className="px-4 py-3 border text-center">84 meses</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 border font-medium">Servidor Público Federal</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">1,2% a.m.</td>
                  <td className="px-4 py-3 border text-center">1,8% a.m.</td>
                  <td className="px-4 py-3 border text-center">35%</td>
                  <td className="px-4 py-3 border text-center">96 meses</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border font-medium">Militar (Forças Armadas)</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">1,0% a.m.</td>
                  <td className="px-4 py-3 border text-center">1,6% a.m.</td>
                  <td className="px-4 py-3 border text-center">30%</td>
                  <td className="px-4 py-3 border text-center">84 meses</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 border font-medium">Servidor Estadual/Municipal</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">1,5% a.m.</td>
                  <td className="px-4 py-3 border text-center">2,2% a.m.</td>
                  <td className="px-4 py-3 border text-center">30-40%</td>
                  <td className="px-4 py-3 border text-center">72 meses</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
            <p className="text-sm italic">Use nosso <strong>simulador de crédito consignado</strong> com as taxas acima para obter cálculos precisos. Verifique sempre sua margem consignável disponível antes de contratar.</p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            <div className="mb-6">
              <FormField
                control={form.control}
                name="tipoConsignado"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium text-neutral-700">Tipo de consignado</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="inss" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Aposentado/Pensionista INSS</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="servidor" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Servidor Público</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="militar" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">Militar</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Dados do Crédito Consignado */}
            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-orange-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Dados do Crédito Consignado
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="valorFinanciado"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-orange-700">Valor do empréstimo (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                          <Input
                            type="number"
                            placeholder="10000"
                            className="pl-10 pr-4 py-3 bg-white border-orange-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-orange-600">De R$ 1.000,00 até R$ 150.000,00</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="taxaJuros"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-orange-700">Taxa de juros (% ao mês)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="1.7"
                            className={`pl-4 pr-10 py-3 bg-white border-orange-200 transition-all duration-300 ${taxaChanged ? 'bg-primary/10 border-primary' : ''}`}
                            {...field}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                        </div>
                      </FormControl>
                      <div>
                        <p className="text-xs text-orange-600">
                          Taxa média para {tipoConsignado === "inss" ? "INSS" : tipoConsignado === "servidor" ? "servidores" : "militares"}: {
                            tipoConsignado === "inss" ? "1,7%" : tipoConsignado === "servidor" ? "1,5%" : "1,3%"
                          } a.m.
                        </p>
                        {taxaChanged && (
                          <p className="text-xs text-primary animate-pulse mt-1">
                            * Taxa ajustada automaticamente para este tipo de consignado
                          </p>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numParcelas"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-orange-700">Número de parcelas</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-10 py-3 bg-white border-orange-200">
                            <SelectValue placeholder="Selecione o número de parcelas" />
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
                          {tipoConsignado === "servidor" && (
                            <SelectItem value="96">96 meses (8 anos)</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-orange-600">
                        Prazo comum para {tipoConsignado === "inss" ? "INSS" : tipoConsignado === "servidor" ? "servidores" : "militares"}: {
                          tipoConsignado === "inss" ? "60 a 84" : tipoConsignado === "servidor" ? "60 a 96" : "60 a 84"
                        } meses
                      </p>
                      <FormMessage />
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
        
        {result && (
          <div id="resultado-simulacao" className="mb-8">
            <h3 className="font-heading text-xl font-semibold text-primary mb-4">Resultado da simulação</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Valor da parcela</p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valorParcela)}
                </p>
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
                  fileName={`simulacao-emprestimo-consignado-${tipoConsignado}`} 
                  title={`Simulação de Empréstimo Consignado - ${tipoConsignado === "inss" ? "INSS" : tipoConsignado === "servidor" ? "Servidor Público" : "Militar"}`}
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
          <h2 className="text-2xl font-semibold text-primary mb-6">Perguntas Frequentes - Crédito Consignado</h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Quem pode contratar crédito consignado?</h3>
              <p className="text-neutral-700">Podem contratar <strong>crédito consignado</strong>: aposentados e pensionistas do INSS, servidores públicos federais, estaduais e municipais, e militares das Forças Armadas.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual a margem consignável do INSS?</h3>
              <p className="text-neutral-700">A <strong>margem consignável do INSS</strong> é de até 45% do benefício: 35% para empréstimo consignado e 10% para cartão de crédito consignado ou saque-aniversário FGTS.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Quais são as taxas do crédito consignado?</h3>
              <p className="text-neutral-700">As <strong>taxas do crédito consignado</strong> variam: INSS 1,7% a.m., servidores públicos 1,5% a.m., militares 1,3% a.m. São as menores taxas do mercado de crédito.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual o prazo máximo do consignado?</h3>
              <p className="text-neutral-700">O prazo máximo varia: INSS até 84 meses, servidores públicos até 96 meses, militares até 84 meses, dependendo da instituição e regulamentação específica.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Posso ter mais de um consignado?</h3>
              <p className="text-neutral-700">Sim, é possível ter mais de um <strong>crédito consignado</strong>, desde que a soma das parcelas não ultrapasse sua margem consignável disponível.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Como calcular a margem consignável?</h3>
              <p className="text-neutral-700">Para calcular sua margem: multiplique sua renda/benefício pelo percentual permitido (30-45%) e subtraia os descontos já existentes (outros consignados, pensão, etc.).</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Vantagens do Crédito Consignado</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold mb-1">Menores Taxas</h3>
              <p className="text-sm text-gray-600">As menores do mercado brasileiro</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold mb-1">Prazos Longos</h3>
              <p className="text-sm text-gray-600">Até 96 meses para pagar</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✓</div>
              <h3 className="font-semibold mb-1">Fácil Aprovação</h3>
              <p className="text-sm text-gray-600">Mesmo com nome sujo</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold mb-1">Desconto Automático</h3>
              <p className="text-sm text-gray-600">Direto na folha ou benefício</p>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-100 border-l-4 border-secondary p-4 mt-6">
          <p className="text-sm font-medium">AVISO IMPORTANTE:</p>
          <p className="text-sm">Este <strong>simulador de crédito consignado</strong> é uma ferramenta educativa. Os valores são aproximações para planejamento. Para condições oficiais, consulte bancos e financeiras autorizadas.</p>
        </div>
      </section>
    </div>
  );
}
