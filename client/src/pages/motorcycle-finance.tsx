import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

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
import HeadSEO from "@/components/seo/head-seo";

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

export default function MotorcycleFinance() {
  const [result, setResult] = useState<any | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taxaAjustada, setTaxaAjustada] = useState(1.85); // Taxa média inicial
  const [cilindrada, setCilindrada] = useState("150-500"); // Cilindrada padrão
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorFinanciado: 20000,
      taxaJuros: 1.85, // Taxa média de juros para motos
      numParcelas: "36",
      incluirIOF: false,
      cilindrada: "150-500",
      usada: false,
    },
  });
  
  // Função para calcular a taxa ajustada com base na cilindrada e se é usada
  const calcularTaxaAjustada = (cilindrada: string, usada: boolean, taxaBase: number) => {
    // Taxa padrão para motos
    const TAXA_PADRAO = 1.85;
    
    // Se for o primeiro carregamento e não tiver taxa base definida, usar a padrão
    if (!taxaBase || isNaN(taxaBase)) {
      taxaBase = TAXA_PADRAO;
    }
    
    let taxa = taxaBase;
    
    // Ajuste por cilindrada
    if (cilindrada === "ate-150") {
      taxa = TAXA_PADRAO - 0.05; // Taxa menor para motos pequenas
    } else if (cilindrada === "acima-500") {
      taxa = TAXA_PADRAO - 0.10; // Taxa menor para motos grandes (geralmente melhor perfil de crédito)
    } else if (cilindrada === "150-500") {
      taxa = TAXA_PADRAO; // Taxa padrão
    }
    
    // Ajuste para motos usadas
    if (usada) {
      taxa = taxa + 0.35; // Taxa maior para motos usadas
    }
    
    console.log('Calculando taxa:', {cilindrada, usada, taxaBase, resultado: Number(taxa.toFixed(2))});
    
    return Number(taxa.toFixed(2));
  };
  
  // Função para atualizar a taxa com base nos valores atuais
  const atualizarTaxaAjustada = useCallback(() => {
    try {
      const cilindradaSelecionada = form.getValues('cilindrada');
      const usada = form.getValues('usada');
      const taxaBase = form.getValues('taxaJuros');
      
      // Somente atualiza a cilindrada se ela estiver definida
      if (cilindradaSelecionada) {
        setCilindrada(cilindradaSelecionada);
      }
      
      // Calcula a nova taxa ajustada
      const novaTaxa = calcularTaxaAjustada(
        cilindradaSelecionada || 'ate-150', 
        usada || false, 
        taxaBase || 1.85
      );
      
      // Atualiza o estado da taxa
      setTaxaAjustada(novaTaxa);
      
      console.log('Taxa atualizada:', novaTaxa, 'Cilindrada:', cilindradaSelecionada, 'Usada:', usada);
      
      return novaTaxa;
    } catch (error) {
      console.error("Erro ao atualizar taxa:", error);
      return 1.85; // Taxa padrão em caso de erro
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
      if (name === 'cilindrada' || name === 'usada') {
        // Para esses campos, atualizamos a taxa ajustada e o campo de taxa
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
    <>
      <HeadSEO 
        title="Simulador de Financiamento de Motos | Parcelas e Taxas"
        description="Simule o financiamento da sua moto ou scooter com taxas atualizadas. Calcule o valor das parcelas, juros, e compare as diferentes opções de pagamento."
        keywords={["financiamento moto", "simulador moto", "financiar motocicleta", "tabela price moto"]}
      />
    
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">
          Simulador de Financiamento de Motos
        </h1>
        <p className="text-lg text-neutral-600 mb-8">
          Simule as condições para financiar sua motocicleta ou scooter com taxas atualizadas
        </p>
        
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
                      Taxa média para motos: 1,85% a.m.
                      <span className="block mt-1 font-medium text-primary">
                        Taxa atual: {taxaAjustada}% a.m.
                        {taxaAjustada < 1.85 && <span className="text-green-500"> (menor)</span>}
                        {taxaAjustada > 1.85 && <span className="text-red-500"> (maior)</span>}
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
                    <FormLabel className="text-sm font-medium text-neutral-700">Número de parcelas</FormLabel>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium text-neutral-700">
                        Moto usada
                      </FormLabel>
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
      </div>
    </>
  );
}