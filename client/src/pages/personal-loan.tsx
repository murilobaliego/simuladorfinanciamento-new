import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    .max(50000, "O valor máximo para empréstimo é R$ 50.000,00"),
  taxaJuros: z.coerce
    .number()
    .min(1, "A taxa mínima é 1%")
    .max(8, "A taxa máxima é 8%"),
  numParcelas: z.coerce
    .number()
    .min(3, "O número mínimo de parcelas é 3")
    .max(48, "O número máximo de parcelas é 48")
});

export default function PersonalLoan() {
  return (
    <>
      <Helmet>
        <title>Empréstimo Pessoal | Simulador com Melhores Taxas 2025</title>
        <meta name="description" content="Simulador de empréstimo pessoal gratuito com as melhores taxas do mercado. Calcule parcelas, juros e compare condições dos principais bancos. Crédito rápido e sem garantia." />
        <meta name="keywords" content="empréstimo pessoal, simulador empréstimo, crédito pessoal, empréstimo sem garantia, simulador crédito, melhores taxas empréstimo" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/emprestimo-pessoal" />
        <meta property="og:title" content="Empréstimo Pessoal | Simulador com Melhores Taxas 2025" />
        <meta property="og:description" content="Simulador de empréstimo pessoal gratuito com as melhores taxas do mercado. Calcule parcelas, juros e compare condições dos principais bancos." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/emprestimo-pessoal" />
        <meta property="og:image" content="https://simuladorfinanciamento.com/images/emprestimo-pessoal-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Empréstimo Pessoal | Simulador com Melhores Taxas" />
        <meta name="twitter:description" content="Simulador de empréstimo pessoal gratuito com as melhores taxas do mercado. Calcule parcelas, juros e compare condições." />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Empréstimo Pessoal",
              "alternateName": "Calculadora de Crédito Pessoal",
              "url": "https://simuladorfinanciamento.com/emprestimo-pessoal",
              "description": "Simulador completo para empréstimo pessoal com cálculo de parcelas, juros e comparação de taxas bancárias.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "isAccessibleForFree": true,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "featureList": [
                "Cálculo de parcelas mensais",
                "Simulação sem garantia",
                "Comparação de taxas bancárias",
                "Tabela de amortização completa",
                "Exportação em PDF e Excel",
                "Prazos de 3 a 48 meses",
                "Valores de R$ 1.000 a R$ 50.000"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Pessoas interessadas em empréstimo pessoal"
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
                  "name": "Como funciona o simulador de empréstimo pessoal?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O simulador de empréstimo pessoal calcula automaticamente o valor das parcelas, juros totais e tabela de amortização. Basta inserir o valor desejado, taxa de juros e prazo para obter uma simulação completa."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual a diferença entre empréstimo pessoal e financiamento?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O empréstimo pessoal não exige garantia e pode ser usado para qualquer finalidade, mas tem taxas mais altas. O financiamento é vinculado a um bem específico (carro, casa) que serve como garantia."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quais são as melhores taxas para empréstimo pessoal em 2025?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As melhores taxas para empréstimo pessoal em 2025 variam de 2,5% a 6% ao mês, dependendo do banco, relacionamento bancário e perfil de crédito do cliente."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual o valor máximo para empréstimo pessoal?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O valor máximo para empréstimo pessoal varia por banco, mas geralmente fica entre R$ 30.000 e R$ 100.000, dependendo da renda e relacionamento bancário do cliente."
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
                  "name": "Empréstimo Pessoal",
                  "item": "https://simuladorfinanciamento.com/emprestimo-pessoal"
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <PersonalLoanContent />
    </>
  );
}

function PersonalLoanContent() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorFinanciado: 5000,
      taxaJuros: 3.5,
      numParcelas: 12,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Usar a função simularFinanciamento que engloba todos os cálculos necessários
      const data = simularFinanciamento(
        values.valorFinanciado, 
        values.taxaJuros, 
        values.numParcelas, 
        false // não incluir IOF para empréstimos pessoais
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
      <section className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Empréstimo Pessoal</h1>
          <p className="text-xl text-gray-700 mb-4">Simule seu crédito pessoal com as melhores taxas do mercado</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ Sem Garantia</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Rápido</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ Livre Uso</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">✓ Até 48x</span>
          </div>
        </div>
      </section>
      
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <div className="mb-8">
          <p className="mb-4 text-lg">O <strong>empréstimo pessoal</strong> é a modalidade de crédito mais versátil do mercado. Sem necessidade de garantias, você pode usar o dinheiro para qualquer finalidade: quitar dívidas, viajar, reformar ou cobrir emergências financeiras.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-green-800 mb-2">Livre Uso</h3>
              <p className="text-green-700 text-sm">Use para qualquer finalidade</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-blue-800 mb-2">Rápido</h3>
              <p className="text-blue-700 text-sm">Aprovação em até 24h</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🔓</div>
              <h3 className="font-semibold text-purple-800 mb-2">Sem Garantia</h3>
              <p className="text-purple-700 text-sm">Não precisa de bens como garantia</p>
            </div>
          </div>
          
          <h2 id="melhores-taxas-2025" className="text-2xl font-semibold text-primary mt-8 mb-4">Melhores Taxas de Empréstimo Pessoal 2025</h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead>
                <tr className="bg-primary/10">
                  <th className="px-4 py-3 border text-left font-semibold">Banco/Instituição</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Mínima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Máxima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Valor Máximo</th>
                  <th className="px-4 py-3 border text-center font-semibold">Prazo Máximo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border font-medium">Nubank</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">2,5% a.m.</td>
                  <td className="px-4 py-3 border text-center">6,0% a.m.</td>
                  <td className="px-4 py-3 border text-center">R$ 50.000</td>
                  <td className="px-4 py-3 border text-center">36 meses</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 border font-medium">Inter</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">2,8% a.m.</td>
                  <td className="px-4 py-3 border text-center">6,5% a.m.</td>
                  <td className="px-4 py-3 border text-center">R$ 80.000</td>
                  <td className="px-4 py-3 border text-center">48 meses</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border font-medium">C6 Bank</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">3,0% a.m.</td>
                  <td className="px-4 py-3 border text-center">7,0% a.m.</td>
                  <td className="px-4 py-3 border text-center">R$ 30.000</td>
                  <td className="px-4 py-3 border text-center">36 meses</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 border font-medium">Itaú</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">3,5% a.m.</td>
                  <td className="px-4 py-3 border text-center">8,0% a.m.</td>
                  <td className="px-4 py-3 border text-center">R$ 100.000</td>
                  <td className="px-4 py-3 border text-center">48 meses</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <p className="text-sm italic">Use nosso <strong>simulador de empréstimo pessoal</strong> com as taxas acima para obter cálculos precisos. Lembre-se: não comprometa mais de 30% da sua renda mensal com empréstimos.</p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="valorFinanciado"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Valor do empréstimo (R$)</FormLabel>
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
                    <p className="text-xs text-neutral-500">De R$ 1.000,00 até R$ 50.000,00</p>
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
                          step="0.1"
                          placeholder="3.5"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Taxa média para empréstimo pessoal: 3,5% a.m.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numParcelas"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Número de parcelas</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300">
                          <SelectValue placeholder="Selecione o número de parcelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">3 meses</SelectItem>
                        <SelectItem value="6">6 meses</SelectItem>
                        <SelectItem value="12">12 meses (1 ano)</SelectItem>
                        <SelectItem value="18">18 meses (1 ano e meio)</SelectItem>
                        <SelectItem value="24">24 meses (2 anos)</SelectItem>
                        <SelectItem value="36">36 meses (3 anos)</SelectItem>
                        <SelectItem value="48">48 meses (4 anos)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-neutral-500">Prazo comum: 12 a 24 meses</p>
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
                  fileName="simulacao-emprestimo-pessoal" 
                  title="Simulação de Empréstimo Pessoal"
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
          <h2 className="text-2xl font-semibold text-primary mb-6">Perguntas Frequentes - Empréstimo Pessoal</h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Como funciona o simulador de empréstimo pessoal?</h3>
              <p className="text-neutral-700">Nosso <strong>simulador de empréstimo pessoal</strong> calcula automaticamente o valor das parcelas, juros totais e tabela de amortização. Basta inserir o valor desejado, taxa de juros e prazo para obter uma simulação completa.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual a diferença entre empréstimo pessoal e financiamento?</h3>
              <p className="text-neutral-700">O <strong>empréstimo pessoal</strong> não exige garantia e pode ser usado para qualquer finalidade, mas tem taxas mais altas. O financiamento é vinculado a um bem específico (carro, casa) que serve como garantia.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Quais são as melhores taxas para empréstimo pessoal em 2025?</h3>
              <p className="text-neutral-700">As <strong>melhores taxas para empréstimo pessoal</strong> em 2025 variam de 2,5% a 6% ao mês, dependendo do banco, relacionamento bancário e perfil de crédito do cliente.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual o valor máximo para empréstimo pessoal?</h3>
              <p className="text-neutral-700">O valor máximo para <strong>empréstimo pessoal</strong> varia por banco, mas geralmente fica entre R$ 30.000 e R$ 100.000, dependendo da renda e relacionamento bancário do cliente.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Como conseguir as melhores condições?</h3>
              <p className="text-neutral-700">Para conseguir as melhores condições: mantenha o CPF limpo, tenha relacionamento bancário, comprove renda estável e compare ofertas de diferentes instituições.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Posso quitar antecipadamente?</h3>
              <p className="text-neutral-700">Sim, a quitação antecipada de <strong>empréstimo pessoal</strong> é permitida por lei, com desconto proporcional nos juros. Algumas instituições podem cobrar taxa de até 2% sobre o valor quitado.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Vantagens do Nosso Simulador de Empréstimo Pessoal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Preciso</h3>
              <p className="text-sm text-gray-600">Cálculos exatos com juros compostos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🆓</div>
              <h3 className="font-semibold mb-1">Gratuito</h3>
              <p className="text-sm text-gray-600">100% gratuito, sem cadastro</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold mb-1">Completo</h3>
              <p className="text-sm text-gray-600">Tabela de amortização detalhada</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Rápido</h3>
              <p className="text-sm text-gray-600">Resultado instantâneo</p>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-100 border-l-4 border-secondary p-4 mt-6">
          <p className="text-sm font-medium">AVISO IMPORTANTE:</p>
          <p className="text-sm">Este <strong>simulador de empréstimo pessoal</strong> é uma ferramenta educativa. Os valores são aproximações para planejamento. Para condições oficiais, consulte bancos e financeiras autorizadas.</p>
        </div>
      </section>
    </div>
  );
}
