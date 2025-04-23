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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PriceTable from "@/components/simulators/price-table";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = calculatorSchema.extend({
  valorFinanciado: z.coerce
    .number()
    .min(5000, "O valor mínimo para financiamento é R$ 5.000,00"),
  taxaJuros: z.coerce
    .number()
    .min(0.1, "A taxa mínima é 0,1%")
    .max(5, "A taxa máxima é 5%"),
  numParcelas: z.coerce
    .number()
    .min(6, "O número mínimo de parcelas é 6")
    .max(120, "O número máximo de parcelas é 120"),
  incluirIOF: z.boolean().default(false)
});

export type TableData = {
  parcela: number;
  valorParcela: number;
  amortizacao: number;
  juros: number;
  saldoDevedor: number;
};

export type SimulationResult = {
  valorParcela: number;
  totalPagar: number;
  totalJuros: number;
  tabelaAmortizacao: TableData[];
  valorIOF?: number; // Opcional, só existe quando o IOF é incluído no cálculo
};

export default function VehicleForm() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorFinanciado: 30000,
      taxaJuros: 1.5,
      numParcelas: 48,
      incluirIOF: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/simulador/calcular", values);
      const data = await response.json();
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
    <>
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
                        placeholder="30000"
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
                        step="0.1"
                        placeholder="1.5"
                        className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                        {...field}
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                    </div>
                  </FormControl>
                  <p className="text-xs text-neutral-500">Taxa média para veículos: 1,5% a.m.</p>
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
                      <SelectItem value="24">24 meses (2 anos)</SelectItem>
                      <SelectItem value="36">36 meses (3 anos)</SelectItem>
                      <SelectItem value="48">48 meses (4 anos)</SelectItem>
                      <SelectItem value="60">60 meses (5 anos)</SelectItem>
                      <SelectItem value="72">72 meses (6 anos)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-500">Prazo comum para veículos: 48 a 60 meses</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mt-4">
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
          
          <div>
            <p className="text-sm text-neutral-600 italic">* Este é apenas um cálculo aproximado. As condições reais podem variar conforme a instituição financeira.</p>
          </div>
        </div>
      )}
    </>
  );
}
