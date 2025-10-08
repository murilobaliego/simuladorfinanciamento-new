import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Helmet } from 'react-helmet-async';

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
    .min(50000, "O valor mínimo para financiamento é de R$ 50.000,00")
    .max(2000000, "O valor máximo para financiamento é de R$ 2.000.000,00"),
  taxaJuros: z
    .number()
    .min(0.1, "A taxa de juros deve ser maior que 0,1%")
    .max(4, "A taxa de juros deve ser menor que 4%"),
  numParcelas: z.string().min(1, "Selecione o número de parcelas"),
  incluirIOF: z.boolean().default(false),
  tipoVeiculo: z.string().min(1, "Selecione o tipo de caminhão"),
});

export default function TruckFinance() {
  return (
    <>
      <Helmet>
        <title>Financiamento de Caminhões | Simulador Veículos Pesados 2025</title>
        <meta name="description" content="Simulador de financiamento de caminhões, carretas e veículos pesados. Calcule parcelas com taxas especiais, IOF e tabela de amortização. Compare condições FINAME e bancos comerciais." />
        <meta name="keywords" content="financiamento caminhão, simulador caminhão, financiar veículo pesado, finame caminhão, financiamento carreta, simulador veículos comerciais" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/financiamento-caminhao" />
        <meta property="og:title" content="Financiamento de Caminhões | Simulador Veículos Pesados 2025" />
        <meta property="og:description" content="Simulador de financiamento de caminhões, carretas e veículos pesados. Calcule parcelas com taxas especiais, IOF e tabela de amortização." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/financiamento-caminhao" />
        <meta property="og:image" content="https://simuladorfinanciamento.com/images/financiamento-caminhao-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Financiamento de Caminhões | Simulador Veículos Pesados" />
        <meta name="twitter:description" content="Simulador de financiamento de caminhões, carretas e veículos pesados. Calcule parcelas com taxas especiais." />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Simulador de Financiamento de Caminhões",
              "alternateName": "Calculadora de Financiamento de Veículos Pesados",
              "url": "https://simuladorfinanciamento.com/financiamento-caminhao",
              "description": "Simulador especializado para financiamento de caminhões, carretas e veículos comerciais pesados com taxas diferenciadas.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "isAccessibleForFree": true,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL"
              },
              "featureList": [
                "Taxas diferenciadas por tipo de caminhão",
                "Simulação FINAME",
                "Cálculo de IOF para veículos",
                "Prazos de até 120 meses",
                "Tabela de amortização completa",
                "Exportação em PDF e Excel",
                "Gráfico de evolução do saldo"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Transportadores, empresas de logística e caminhoneiros autônomos"
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
                  "name": "Qual a taxa de juros para financiamento de caminhão?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "As taxas para financiamento de caminhão variam de 1,3% a 2,0% ao mês, dependendo do tipo de veículo, banco e programa utilizado (FINAME, CDC comercial, etc.)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual o prazo máximo para financiar um caminhão?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O prazo máximo para financiamento de caminhão pode chegar a 120 meses (10 anos) em programas especiais como FINAME, e até 72 meses em financiamentos convencionais."
                  }
                },
                {
                  "@type": "Question",
                  "name": "O que é o FINAME para caminhões?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O FINAME é uma linha de crédito do BNDES para financiamento de máquinas e equipamentos, incluindo caminhões, com taxas subsidiadas a partir de 0,85% a.m. + TLP."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual a entrada mínima para financiar um caminhão?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A entrada mínima para financiamento de caminhão varia de 10% (FINAME) a 30% (bancos comerciais), dependendo do programa e perfil do cliente."
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
                  "name": "Financiamento de Caminhões",
                  "item": "https://simuladorfinanciamento.com/financiamento-caminhao"
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <TruckFinanceContent />
    </>
  );
}

function TruckFinanceContent() {
  const [result, setResult] = useState<any | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taxaAjustada, setTaxaAjustada] = useState(1.58); // Taxa média inicial
  const [tipoVeiculo, setTipoVeiculo] = useState("pesado"); // Tipo padrão
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorFinanciado: 300000,
      taxaJuros: 1.58, // Taxa média de juros para caminhões
      numParcelas: "60",
      incluirIOF: false,
      tipoVeiculo: "pesado",
    },
  });
  
  // Função para calcular a taxa ajustada com base no tipo de caminhão
  const calcularTaxaAjustada = (tipoVeiculo: string, taxaBase: number) => {
    // Taxa padrão para caminhões
    const TAXA_PADRAO = 1.58;
    
    // Se for o primeiro carregamento e não tiver taxa base definida, usar a padrão
    if (!taxaBase || isNaN(taxaBase)) {
      taxaBase = TAXA_PADRAO;
    }
    
    let taxa = TAXA_PADRAO; // Sempre começamos da taxa padrão de referência
    
    if (tipoVeiculo === "leve") {
      taxa = TAXA_PADRAO - 0.03; // Taxa levemente menor para caminhões leves
    } else if (tipoVeiculo === "medio") {
      taxa = TAXA_PADRAO - 0.01; // Taxa levemente menor para caminhões médios
    } else if (tipoVeiculo === "pesado") {
      taxa = TAXA_PADRAO; // Taxa padrão
    } else if (tipoVeiculo === "extra-pesado") {
      taxa = TAXA_PADRAO + 0.05; // Taxa levemente maior para caminhões extra-pesados
    } else if (tipoVeiculo === "implemento") {
      taxa = TAXA_PADRAO + 0.02; // Taxa levemente maior para implementos
    }
    
    console.log('Calculando taxa caminhão:', {tipoVeiculo, taxaBase, resultado: Number(taxa.toFixed(2))});
    
    return Number(taxa.toFixed(2));
  };
  
  // Observa mudanças no campo de tipo de veículo
  // Função para atualizar a taxa com base nos valores atuais
  const atualizarTaxaAjustada = useCallback(() => {
    try {
      const tipoVeiculoSelecionado = form.getValues('tipoVeiculo');
      const taxaBase = form.getValues('taxaJuros');
      
      // Somente atualiza o tipo se ele estiver definido
      if (tipoVeiculoSelecionado) {
        setTipoVeiculo(tipoVeiculoSelecionado);
      }
      
      // Calcula a nova taxa ajustada
      const novaTaxa = calcularTaxaAjustada(
        tipoVeiculoSelecionado || 'pesado', 
        taxaBase || 1.58
      );
      
      // Atualiza o estado da taxa
      setTaxaAjustada(novaTaxa);
      
      console.log('Taxa atualizada:', novaTaxa, 'Tipo:', tipoVeiculoSelecionado);
      
      return novaTaxa;
    } catch (error) {
      console.error("Erro ao atualizar taxa:", error);
      return 1.58; // Taxa padrão em caso de erro
    }
  }, [form]);
  
  // Inicializa a taxa ajustada na montagem do componente
  useEffect(() => {
    // Define um timeout curto para garantir que o form esteja totalmente inicializado
    const timer = setTimeout(() => {
      const novaTaxa = atualizarTaxaAjustada();
      console.log('Taxa inicial definida:', novaTaxa);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [atualizarTaxaAjustada]);
  
  // Observa mudanças nos campos que afetam a taxa
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'tipoVeiculo') {
        // Para esse campo, atualizamos a taxa ajustada e o campo de taxa
        const novaTaxa = atualizarTaxaAjustada();
        
        // Atualizando o campo do formulário com a nova taxa
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
      // Usar a taxa ajustada calculada pelo useEffect
      // Realizar os cálculos diretamente no frontend
      const resultado = simularFinanciamento(
        values.valorFinanciado,
        taxaAjustada, // Usa a taxa ajustada do estado
        parseInt(values.numParcelas),
        values.incluirIOF
      );
      
      setResult(resultado);
      
      // Auto scroll to results
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
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Financiamento de Caminhões</h1>
          <p className="text-xl text-gray-700 mb-4">Simule veículos pesados com taxas especiais e prazos longos</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ FINAME</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Até 120 meses</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ Taxas Especiais</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">✓ Com IOF</span>
          </div>
        </div>
      </section>
        
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <div className="mb-8">
          <p className="mb-4 text-lg">O <strong>financiamento de caminhões</strong> oferece condições especiais para veículos comerciais pesados. Com programas como FINAME e linhas específicas para transportadores, você pode financiar seu caminhão com prazos de até 120 meses e taxas diferenciadas.</p>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🚛</div>
              <h3 className="font-semibold text-orange-800 mb-2">Veículos Pesados</h3>
              <p className="text-orange-700 text-sm">Caminhões, carretas, implementos</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🏦</div>
              <h3 className="font-semibold text-green-800 mb-2">FINAME</h3>
              <p className="text-green-700 text-sm">Taxas subsidiadas BNDES</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold text-blue-800 mb-2">Até 120 Meses</h3>
              <p className="text-blue-700 text-sm">Prazos longos para menor parcela</p>
            </div>
          </div>
          
          <h2 id="taxas-caminhao-2025" className="text-2xl font-semibold text-primary mt-8 mb-4">Taxas de Financiamento de Caminhões 2025</h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead>
                <tr className="bg-primary/10">
                  <th className="px-4 py-3 border text-left font-semibold">Programa</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Mínima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Máxima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Entrada Mínima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Prazo Máximo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border font-medium">FINAME (BNDES)</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">0,85% a.m.</td>
                  <td className="px-4 py-3 border text-center">1,20% a.m.</td>
                  <td className="px-4 py-3 border text-center">10%</td>
                  <td className="px-4 py-3 border text-center">120 meses</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 border font-medium">CDC Bancos Comerciais</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">1,30% a.m.</td>
                  <td className="px-4 py-3 border text-center">2,00% a.m.</td>
                  <td className="px-4 py-3 border text-center">20%</td>
                  <td className="px-4 py-3 border text-center">72 meses</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border font-medium">Financeiras Especializadas</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">1,50% a.m.</td>
                  <td className="px-4 py-3 border text-center">2,50% a.m.</td>
                  <td className="px-4 py-3 border text-center">30%</td>
                  <td className="px-4 py-3 border text-center">60 meses</td>
                </tr>
              </tbody>
            </table>
          </div>
            
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <p className="text-sm italic">Use nosso <strong>simulador de financiamento de caminhões</strong> com as taxas acima para obter cálculos precisos. Considere programas especiais como FINAME para melhores condições.</p>
          </div>
        </div>
        

        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            {/* Dados do Financiamento de Caminhões */}
            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-orange-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Dados do Financiamento de Caminhões
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FormField
                  control={form.control}
                  name="valorFinanciado"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-orange-700">Valor a financiar (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                          <Input
                            type="number"
                            placeholder="300000"
                            className="pl-10 pr-4 py-3 bg-white border-orange-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-orange-600">Valor mínimo: R$ 50.000,00</p>
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
                            step="0.01"
                            placeholder="1.58"
                            className="pl-4 pr-10 py-3 bg-white border-orange-200"
                            {...field}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                        </div>
                      </FormControl>
                      <p className="text-xs text-orange-600">
                        Taxa média para caminhões: 1,58% a.m.
                        <span className="block mt-1 font-medium text-primary">
                          Taxa atual: {taxaAjustada}% a.m.
                          {taxaAjustada < 1.58 && <span className="text-green-500"> (menor)</span>}
                          {taxaAjustada > 1.58 && <span className="text-red-500"> (maior)</span>}
                        </span>
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
                      <FormLabel className="text-sm font-medium text-orange-700">Número de parcelas</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-10 py-3 bg-white border-orange-200">
                            <SelectValue placeholder="Selecione o número de parcelas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="24">24 meses (2 anos)</SelectItem>
                          <SelectItem value="36">36 meses (3 anos)</SelectItem>
                          <SelectItem value="48">48 meses (4 anos)</SelectItem>
                          <SelectItem value="60">60 meses (5 anos)</SelectItem>
                          <SelectItem value="72">72 meses (6 anos)</SelectItem>
                          <SelectItem value="84">84 meses (7 anos)</SelectItem>
                          <SelectItem value="96">96 meses (8 anos)</SelectItem>
                          <SelectItem value="120">120 meses (10 anos)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-orange-600">Prazo comum para caminhões: 60 a 120 meses</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Configurações Adicionais
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoVeiculo"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-orange-700">Tipo de caminhão</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-10 py-3 bg-white border-orange-200">
                            <SelectValue placeholder="Selecione o tipo de caminhão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="leve">Leve (até 10 ton.)</SelectItem>
                          <SelectItem value="medio">Médio (10-15 ton.)</SelectItem>
                          <SelectItem value="pesado">Pesado (15-40 ton.)</SelectItem>
                          <SelectItem value="extra-pesado">Extra-pesado (acima de 40 ton.)</SelectItem>
                          <SelectItem value="implemento">Implemento rodoviário/Semirreboque</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-orange-600">
                        <p>O tipo de veículo influencia na taxa de juros:</p>
                        <ul className="mt-1 pl-4 list-disc">
                          <li className={tipoVeiculo === "leve" ? "text-primary font-medium" : ""}>Leves: -0,03% (melhor taxa)</li>
                          <li className={tipoVeiculo === "medio" ? "text-primary font-medium" : ""}>Médio: -0,01%</li>
                          <li className={tipoVeiculo === "pesado" ? "text-primary font-medium" : ""}>Pesado: taxa padrão</li>
                          <li className={tipoVeiculo === "extra-pesado" ? "text-primary font-medium" : ""}>Extra-pesado: +0,05%</li>
                          <li className={tipoVeiculo === "implemento" ? "text-primary font-medium" : ""}>Implemento: +0,02%</li>
                        </ul>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="incluirIOF"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white rounded-md border border-orange-200 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-orange-700">
                          Incluir IOF no cálculo
                        </FormLabel>
                        <p className="text-xs text-orange-600">
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
              
              {/* Exibe valor do IOF se estiver incluído no cálculo */}
              {result.valorIOF !== undefined && (
                <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Valor do IOF</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(result.valorIOF))}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Imposto sobre Operações Financeiras</p>
                </div>
              )}
              
              {/* Exibe o CET (Custo Efetivo Total) */}
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
                  fileName="simulacao-financiamento-caminhao" 
                  title="Simulação de Financiamento de Caminhão"
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
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Perguntas Frequentes - Financiamento de Caminhões</h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual a taxa de juros para financiamento de caminhão?</h3>
              <p className="text-neutral-700">As taxas para <strong>financiamento de caminhão</strong> variam de 1,3% a 2,0% ao mês, dependendo do tipo de veículo, banco e programa utilizado (FINAME, CDC comercial, etc.).</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual o prazo máximo para financiar um caminhão?</h3>
              <p className="text-neutral-700">O prazo máximo para <strong>financiamento de caminhão</strong> pode chegar a 120 meses (10 anos) em programas especiais como FINAME, e até 72 meses em financiamentos convencionais.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">O que é o FINAME para caminhões?</h3>
              <p className="text-neutral-700">O <strong>FINAME</strong> é uma linha de crédito do BNDES para financiamento de máquinas e equipamentos, incluindo caminhões, com taxas subsidiadas a partir de 0,85% a.m. + TLP.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual a entrada mínima para financiar um caminhão?</h3>
              <p className="text-neutral-700">A entrada mínima para <strong>financiamento de caminhão</strong> varia de 10% (FINAME) a 30% (bancos comerciais), dependendo do programa e perfil do cliente.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Posso financiar caminhão usado?</h3>
              <p className="text-neutral-700">Sim, é possível financiar caminhões usados, mas com restrições de idade (geralmente até 10 anos) e condições diferentes dos veículos novos.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Quais documentos preciso para financiar um caminhão?</h3>
              <p className="text-neutral-700">Além dos documentos pessoais, é necessário: comprovação de renda, experiência no setor de transportes, contrato de prestação de serviços e documentação da empresa (se PJ).</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Vantagens do Financiamento de Caminhões</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold mb-1">Taxas Especiais</h3>
              <p className="text-sm text-gray-600">Menores que carros de passeio</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold mb-1">Prazos Longos</h3>
              <p className="text-sm text-gray-600">Até 120 meses no FINAME</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏦</div>
              <h3 className="font-semibold mb-1">FINAME</h3>
              <p className="text-sm text-gray-600">Crédito subsidiado BNDES</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚛</div>
              <h3 className="font-semibold mb-1">Investimento</h3>
              <p className="text-sm text-gray-600">Veículo para gerar renda</p>
            </div>
          </div>
        </div>
        
        {/* Seção informativa sobre financiamento de caminhões */}
        <section className="mt-12 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Programas Especiais para Financiamento de Caminhões
            </h2>
            
            <div className="prose prose-neutral max-w-none">
              <h3>Condições Especiais para Veículos Pesados</h3>
              <p>
                O financiamento de caminhões no Brasil possui características específicas que o diferem de outros tipos 
                de financiamento automotivo. Os prazos são geralmente mais longos (podendo chegar a 10 anos) e as taxas 
                costumam ser menores devido ao valor mais elevado dos bens e sua utilização para atividades produtivas.
              </p>
              
              <h3>Programas de Incentivo</h3>
              <p>
                Existem linhas de crédito específicas através do BNDES e outros bancos de fomento para aquisição de 
                caminhões e implementos rodoviários, com taxas subsidiadas para renovação de frota, especialmente 
                para caminhões mais eficientes e menos poluentes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">FINAME para Caminhões</h4>
                  <ul className="space-y-2">
                    <li>Taxa: A partir de 0,85% a.m. + TLP</li>
                    <li>Prazo: Até 120 meses</li>
                    <li>Entrada: Mínimo de 10%</li>
                    <li>Carência: Até 6 meses</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">CDC de Bancos Comerciais</h4>
                  <ul className="space-y-2">
                    <li>Taxa: A partir de 1,58% a.m.</li>
                    <li>Prazo: Até 60 meses (maiores prazos para alguns modelos)</li>
                    <li>Entrada: Mínimo de 20%</li>
                    <li>Melhores condições para caminhões novos</li>
                  </ul>
                </div>
              </div>
              
              <h3>Diferenças nas Taxas por Tipo de Veículo</h3>
              <p>
                As instituições financeiras costumam oferecer condições diferenciadas com base no tipo e porte do 
                caminhão. Normalmente, caminhões leves e médios têm taxas mais atrativas por representarem menor 
                risco e maior liquidez no mercado secundário. Já caminhões extrapesados e implementos especializados 
                podem ter taxas maiores devido à menor demanda no mercado de usados.
              </p>
              
              <h3>Documentação Necessária</h3>
              <p>
                Para financiar um caminhão, além dos documentos pessoais e comprovantes de renda, geralmente são solicitados:
              </p>
              <ul>
                <li>Comprovação de experiência no setor de transportes (para autônomos)</li>
                <li>Contrato de prestação de serviços ou carta de transportadora (para transportadores autônomos)</li>
                <li>Documentação completa da empresa (para pessoa jurídica)</li>
                <li>Comprovantes de faturamento dos últimos 6 a 12 meses</li>
                <li>Demonstrações financeiras para empresas de maior porte</li>
              </ul>
              
              <h3>Dicas para Obter as Melhores Condições</h3>
              <p>
                Para conseguir melhores taxas e condições no financiamento de seu caminhão:
              </p>
              <ul>
                <li><strong>Compare propostas:</strong> Bancos comerciais, financeiras e fabricantes costumam ter condições diferentes</li>
                <li><strong>Entrada maior:</strong> Quanto maior a entrada, melhores as condições de taxa e prazo</li>
                <li><strong>Fique atento a programas especiais:</strong> Montadoras frequentemente lançam condições especiais em determinadas épocas do ano</li>
                <li><strong>Verifique sua pontuação de crédito:</strong> Scores mais altos podem garantir taxas menores</li>
                <li><strong>Considere o Custo Efetivo Total (CET):</strong> Além da taxa de juros, verifique tarifas, seguros e outras despesas embutidas</li>
              </ul>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-blue-800 font-medium">
                  Nosso simulador considera as taxas médias praticadas pelo mercado, mas as condições reais podem variar 
                  conforme seu perfil de crédito, relacionamento com a instituição financeira e negociações específicas. 
                  Use essa simulação como referência para suas negociações.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}