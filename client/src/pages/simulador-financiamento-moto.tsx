import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import { Link } from "wouter";
import SimulatorCard from "@/components/simulators/simulator-card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { simularFinanciamento } from "@/utils/finance";
import PriceTable from "@/components/simulators/price-table";
import ExportButtons from "@/components/simulators/export-buttons";
import DebtChart from "@/components/simulators/debt-chart";

// Esquema de validação do formulário
const formSchema = z.object({
  valorFinanciado: z
    .number()
    .min(5000, "O valor mínimo para financiamento é de R$ 5.000,00")
    .max(100000, "O valor máximo para financiamento é de R$ 100.000,00"),
  taxaJuros: z
    .number()
    .min(0.5, "A taxa de juros deve ser maior que 0,5%")
    .max(4, "A taxa de juros deve ser menor que 4%"),
  numParcelas: z.string().min(1, "Selecione o número de parcelas"),
  incluirIOF: z.boolean().default(false),
  cilindrada: z.string().min(1, "Selecione a cilindrada da moto"),
  usada: z.boolean().default(false),
});

export default function SimuladorFinanciamentoMoto() {
  const [result, setResult] = useState<any | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taxaAjustada, setTaxaAjustada] = useState(1.85);
  const [cilindrada, setCilindrada] = useState("150-500");
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorFinanciado: 20000,
      taxaJuros: 1.85,
      numParcelas: "36",
      incluirIOF: false,
      cilindrada: "150-500",
      usada: false,
    },
  });
  
  // Função para calcular a taxa ajustada
  const calcularTaxaAjustada = (cilindrada: string, usada: boolean, taxaBase: number) => {
    const TAXA_PADRAO = 1.85;
    if (!taxaBase || isNaN(taxaBase)) {
      taxaBase = TAXA_PADRAO;
    }
    let taxa = taxaBase;
    if (cilindrada === "ate-150") {
      taxa = TAXA_PADRAO - 0.05;
    } else if (cilindrada === "acima-500") {
      taxa = TAXA_PADRAO - 0.10;
    } else if (cilindrada === "150-500") {
      taxa = TAXA_PADRAO;
    }
    if (usada) {
      taxa = taxa + 0.35;
    }
    return Number(taxa.toFixed(2));
  };
  
  const atualizarTaxaAjustada = useCallback(() => {
    try {
      const cilindradaSelecionada = form.getValues('cilindrada');
      const usada = form.getValues('usada');
      const taxaBase = form.getValues('taxaJuros');
      
      if (cilindradaSelecionada) {
        setCilindrada(cilindradaSelecionada);
      }
      
      const novaTaxa = calcularTaxaAjustada(
        cilindradaSelecionada || 'ate-150', 
        usada || false, 
        taxaBase || 1.85
      );
      
      setTaxaAjustada(novaTaxa);
      return novaTaxa;
    } catch (error) {
      console.error("Erro ao atualizar taxa:", error);
      return 1.85;
    }
  }, [form]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      atualizarTaxaAjustada();
    }, 100);
    return () => clearTimeout(timer);
  }, [atualizarTaxaAjustada]);
  
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'cilindrada' || name === 'usada') {
        const novaTaxa = atualizarTaxaAjustada();
        form.setValue('taxaJuros', novaTaxa, { 
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, atualizarTaxaAjustada]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const resultado = simularFinanciamento(
        values.valorFinanciado,
        taxaAjustada,
        parseInt(values.numParcelas),
        values.incluirIOF
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
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <Helmet>
        <title>Simulador de Financiamento de Moto | Calcule Parcelas Online 2025</title>
        <meta name="description" content="Simulador de financiamento de moto gratuito. Calcule parcelas, juros e IOF para motocicletas novas e usadas. Compare taxas por cilindrada e encontre as melhores condições." />
        <meta name="keywords" content="simulador financiamento moto, financiamento motocicleta, simulador moto, parcelas moto, financiar moto, taxa juros moto, financiamento honda yamaha" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/financiamento-moto" />
        <meta property="og:title" content="Simulador de Financiamento de Moto | Calcule Parcelas Online 2025" />
        <meta property="og:description" content="Use nosso simulador gratuito para calcular o financiamento da sua moto. Taxas diferenciadas por cilindrada e condições especiais." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/financiamento-moto" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Financiamento de Moto",
              "url": "https://simuladorfinanciamento.com/financiamento-moto",
              "description": "Simulador online gratuito para financiamento de motocicletas com taxas diferenciadas por cilindrada.",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "operatingSystem": "Web",
              "featureList": [
                "Taxas por cilindrada",
                "Simulação para motos novas e usadas",
                "Cálculo de IOF",
                "Tabela de amortização",
                "Comparação de condições"
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
                  "name": "Simulador de Financiamento de Moto",
                  "item": "https://simuladorfinanciamento.com/financiamento-moto"
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
                  "name": "Qual a taxa de juros para financiamento de moto?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As taxas para financiamento de moto variam de 1,5% a 2,5% ao mês, dependendo da cilindrada, se é nova ou usada, e da instituição financeira. Motos de maior cilindrada geralmente têm taxas menores."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Posso financiar moto usada?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim, é possível financiar motos usadas, mas as taxas são cerca de 0,3% a 0,5% maiores que motos novas, com prazos menores (até 36-48 meses) e entrada maior."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual o prazo máximo para financiar uma moto?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O prazo máximo para financiamento de moto é geralmente de 60 meses (5 anos) para motos novas, e 36-48 meses para motos usadas, dependendo da instituição financeira."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <section className="mb-12 bg-white rounded-lg shadow-md p-6">
          <h1 className="font-heading text-3xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Simulador de Financiamento de Moto</h1>
          
          <div className="mb-8">
            <p className="mb-4">O <strong>simulador de financiamento de moto</strong> é uma ferramenta especializada para calcular as condições de financiamento de motocicletas, considerando as particularidades deste mercado. Com taxas diferenciadas por cilindrada e condições específicas para motos novas e usadas, você pode planejar a compra da sua motocicleta com precisão.</p>
            
            <h2 id="como-funciona-financiamento-moto" className="text-xl font-semibold text-primary mt-6 mb-3">Como Funciona o Financiamento de Moto</h2>
            
            <p className="mb-4">O <strong>financiamento de motocicleta</strong> no Brasil possui características específicas que diferem do financiamento de carros. As instituições financeiras consideram fatores como cilindrada, marca, modelo, ano de fabricação e finalidade de uso para determinar as condições do crédito.</p>
            
            <p className="mb-4">Os principais fatores que influenciam as condições do seu financiamento são:</p>
            
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li><strong>Cilindrada da moto:</strong> Motos de maior cilindrada geralmente têm taxas menores</li>
              <li><strong>Moto nova vs. usada:</strong> Motos novas têm condições mais vantajosas</li>
              <li><strong>Valor da entrada:</strong> Entradas maiores resultam em melhores taxas</li>
              <li><strong>Prazo de financiamento:</strong> Prazos menores têm taxas mais baixas</li>
              <li><strong>Perfil de crédito:</strong> Seu histórico financeiro influencia diretamente nas condições</li>
            </ul>
            
            <div className="my-8 p-5 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-lg mb-3">Vantagens do Financiamento de Moto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-primary mb-2">Facilidades</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Documentação simplificada</li>
                    <li>• Aprovação mais rápida</li>
                    <li>• Menor valor de entrada</li>
                    <li>• Parcelas acessíveis</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-primary mb-2">Flexibilidade</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Prazos de 12 a 60 meses</li>
                    <li>• Taxas competitivas</li>
                    <li>• Opções para todos os perfis</li>
                    <li>• Possibilidade de quitação antecipada</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h2 id="taxas-financiamento-moto-2025" className="text-xl font-semibold text-primary mt-6 mb-3">Taxas de Financiamento de Moto 2025</h2>
            
            <p className="mb-4">As taxas de financiamento de moto variam significativamente conforme a cilindrada e se a moto é nova ou usada. Veja a tabela com as taxas médias praticadas pelo mercado:</p>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="px-4 py-3 border text-left font-semibold">Categoria</th>
                    <th className="px-4 py-3 border text-center font-semibold">Taxa Mínima</th>
                    <th className="px-4 py-3 border text-center font-semibold">Taxa Máxima</th>
                    <th className="px-4 py-3 border text-center font-semibold">Prazo Máximo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 border font-medium">Scooters até 150cc (novas)</td>
                    <td className="px-4 py-3 border text-center text-green-600 font-bold">1,50% a.m.</td>
                    <td className="px-4 py-3 border text-center">1,90% a.m.</td>
                    <td className="px-4 py-3 border text-center">48 meses</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 border font-medium">150cc a 300cc (novas)</td>
                    <td className="px-4 py-3 border text-center text-green-600 font-bold">1,60% a.m.</td>
                    <td className="px-4 py-3 border text-center">2,00% a.m.</td>
                    <td className="px-4 py-3 border text-center">60 meses</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border font-medium">300cc a 500cc (novas)</td>
                    <td className="px-4 py-3 border text-center text-green-600 font-bold">1,55% a.m.</td>
                    <td className="px-4 py-3 border text-center">1,95% a.m.</td>
                    <td className="px-4 py-3 border text-center">60 meses</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 border font-medium">Acima de 500cc (novas)</td>
                    <td className="px-4 py-3 border text-center text-green-600 font-bold">1,45% a.m.</td>
                    <td className="px-4 py-3 border text-center">1,85% a.m.</td>
                    <td className="px-4 py-3 border text-center">60 meses</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border font-medium">Motos usadas (qualquer cilindrada)</td>
                    <td className="px-4 py-3 border text-center text-orange-600 font-bold">+0,35% a.m.</td>
                    <td className="px-4 py-3 border text-center">+0,50% a.m.</td>
                    <td className="px-4 py-3 border text-center">36-48 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <p className="text-sm italic text-blue-800">Use nosso <strong>simulador de financiamento de moto</strong> com as taxas acima para obter cálculos precisos. As condições podem variar conforme sua análise de crédito e relacionamento bancário.</p>
            </div>
          </div>
          
          <h2 className="font-heading text-2xl font-bold text-primary mb-6">Simule seu Financiamento de Moto</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
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
                            placeholder="20000"
                            className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-neutral-500">Valor mínimo: R$ 5.000,00</p>
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
                            placeholder="1.85"
                            className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                            {...field}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                        </div>
                      </FormControl>
                      <p className="text-xs text-neutral-500">
                        Taxa atual: {taxaAjustada}% a.m.
                        {taxaAjustada < 1.85 && <span className="text-green-500"> (menor)</span>}
                        {taxaAjustada > 1.85 && <span className="text-red-500"> (maior)</span>}
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
                      <FormLabel className="text-sm font-medium text-neutral-700">Número de parcelas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300">
                            <SelectValue placeholder="Selecione o número de parcelas" />
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
                      <p className="text-xs text-neutral-500">Prazo comum para motos: 36 a 48 meses</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="cilindrada"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Cilindrada da moto</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300">
                            <SelectValue placeholder="Selecione a cilindrada da moto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ate-150">Até 150cc (Scooter/Street)</SelectItem>
                          <SelectItem value="150-500">Entre 150cc e 500cc</SelectItem>
                          <SelectItem value="acima-500">Acima de 500cc</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-neutral-500">
                        <p>A cilindrada influencia na taxa de juros:</p>
                        <ul className="mt-1 pl-4 list-disc">
                          <li className={cilindrada === "ate-150" ? "text-primary font-medium" : ""}>Até 150cc: -0,05%</li>
                          <li className={cilindrada === "150-500" ? "text-primary font-medium" : ""}>150cc a 500cc: taxa padrão</li>
                          <li className={cilindrada === "acima-500" ? "text-primary font-medium" : ""}>Acima de 500cc: -0,10% (melhor taxa)</li>
                        </ul>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="usada"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-neutral-700">Moto usada</FormLabel>
                        <p className="text-xs text-neutral-500">
                          Motos usadas têm taxa de juros <span className="text-red-500 font-medium">+0,35%</span> mais alta
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="incluirIOF"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-neutral-700">Incluir IOF no cálculo</FormLabel>
                        <p className="text-xs text-neutral-500">
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
                  <p className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valorParcela)}
                  </p>
                </div>
                
                <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Total a pagar</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalPagar)}
                  </p>
                </div>
                
                <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Total de juros</p>
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
                    <p className="text-xs text-neutral-500 mt-1">Taxa que representa o custo total da operação</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h4 className="font-heading font-semibold mb-4">Evolução do saldo devedor</h4>
                <div className="h-64 md:h-80">
                  <DebtChart data={result.tabelaAmortizacao} />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-heading font-semibold">Tabela de amortização</h4>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-primary hover:text-primary-dark flex items-center"
                    onClick={() => setIsTableExpanded(!isTableExpanded)}
                  >
                    {isTableExpanded ? "Mostrar menos" : "Ver tabela completa"}
                  </Button>
                </div>
                <PriceTable data={result.tabelaAmortizacao} expanded={isTableExpanded} />
              </div>
              
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-600 italic">* Este é apenas um cálculo aproximado. As condições reais podem variar conforme a instituição financeira.</p>
                  <ExportButtons 
                    data={result.tabelaAmortizacao} 
                    fileName="simulacao-financiamento-moto" 
                    title="Simulação de Financiamento de Motocicleta"
                    summary={{
                      valorFinanciado: form.getValues().valorFinanciado,
                      taxaJuros: form.getValues().taxaJuros,
                      numParcelas: parseInt(form.getValues().numParcelas),
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
          
          <h2 className="font-heading text-2xl font-bold text-primary mb-6 mt-12">Simuladores Relacionados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

            
            <SimulatorCard
              title="Comparativo de Financiamento"
              description="Compare diferentes condições de financiamento para encontrar a melhor opção."
              path="/comparativo-amortizacao"
              imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Gráficos comparativos"
            />
            
            <SimulatorCard
              title="Calculadora de Entrada Ideal"
              description="Descubra o valor ideal de entrada para equilibrar parcelas e custo total."
              path="/calculadora-entrada-ideal"
              imageSrc="https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Dinheiro e calculadora"
            />
            
            <SimulatorCard
              title="Financiamento de Veículos"
              description="Simulador geral para carros, motos e outros veículos."
              path="/simulador-financiamento-veiculos"
              imageSrc="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Veículos"
            />
            
            <SimulatorCard
              title="Simulador de Refinanciamento"
              description="Calcule a economia ao refinanciar sua moto para condições melhores."
              path="/simulador-refinanciamento"
              imageSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Refinanciamento"
            />
            
            <SimulatorCard
              title="Capacidade de Pagamento"
              description="Descubra qual valor de financiamento cabe no seu orçamento."
              path="/capacidade-pagamento"
              imageSrc="https://images.unsplash.com/photo-1554224155-3a58922a22c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              imageAlt="Orçamento"
            />
          </div>
          
          <h2 id="perguntas-frequentes" className="text-xl font-semibold text-primary mt-8 mb-3">Perguntas Frequentes sobre Financiamento de Moto</h2>
          
          <div className="space-y-5 mb-6">
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">Qual a diferença entre financiar moto nova e usada?</h3>
              <p className="text-neutral-700">Motos novas têm taxas menores (a partir de 1,5% a.m.), prazos maiores (até 60 meses) e entrada menor. Motos usadas têm taxas cerca de 0,35% maiores, prazos menores (36-48 meses) e exigem entrada maior, mas podem ser uma opção mais econômica dependendo do modelo.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">Como a cilindrada da moto afeta o financiamento?</h3>
              <p className="text-neutral-700">Motos de maior cilindrada geralmente têm taxas menores porque são associadas a compradores com melhor perfil de crédito. Scooters até 150cc têm taxas ligeiramente maiores, enquanto motos acima de 500cc conseguem as melhores condições do mercado.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">Qual documentação preciso para financiar uma moto?</h3>
              <p className="text-neutral-700">Você precisa de RG, CPF, comprovante de residência atualizado, comprovante de renda (3x o valor da parcela) e conta bancária. Para motos usadas, também é necessária a documentação do veículo. A documentação é mais simples que financiamento de carros.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">Posso quitar o financiamento da moto antecipadamente?</h3>
              <p className="text-neutral-700">Sim, a quitação antecipada é permitida e você tem direito a desconto nos juros proporcionalmente ao tempo antecipado. Algumas instituições oferecem condições especiais para quitação antecipada, então sempre negocie antes de quitar.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Vale mais a pena financiar ou fazer consórcio de moto?</h3>
              <p className="text-neutral-700">Depende da sua necessidade. O financiamento permite sair com a moto imediatamente, mas tem juros. O consórcio não tem juros (apenas taxa de administração), mas você precisa aguardar a contemplação. Use nosso <Link href="/comparativo-amortizacao" className="text-primary hover:underline">simulador comparativo</Link> para analisar.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}