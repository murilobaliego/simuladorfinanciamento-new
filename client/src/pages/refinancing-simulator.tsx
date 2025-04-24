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
import { Switch } from "@/components/ui/switch";
import DebtChart from "@/components/simulators/debt-chart";

const refinancingSchema = z.object({
  saldoDevedor: z.coerce
    .number()
    .min(1000, "O valor mínimo é R$ 1.000,00")
    .max(500000, "O valor máximo é R$ 500.000,00"),
  parcelaAtual: z.coerce
    .number()
    .min(100, "O valor mínimo é R$ 100,00")
    .max(10000, "O valor máximo é R$ 10.000,00"),
  parcelasPagas: z.coerce
    .number()
    .min(1, "O mínimo é 1 parcela")
    .max(60, "O máximo é 60 parcelas"),
  parcelasRestantes: z.coerce
    .number()
    .min(12, "O mínimo é 12 parcelas")
    .max(60, "O máximo é 60 parcelas"),
  taxaJurosAtual: z.coerce
    .number()
    .min(0.5, "A taxa mínima é 0,5%")
    .max(3.5, "A taxa máxima é 3,5%"),
  taxaJurosNova: z.coerce
    .number()
    .min(0.5, "A taxa mínima é 0,5%")
    .max(3.5, "A taxa máxima é 3,5%"),
  numParcelas: z.coerce
    .number()
    .min(12, "O número mínimo de parcelas é 12")
    .max(72, "O número máximo de parcelas é 72"),
  incluirIOF: z.boolean().default(true)
});

interface RefinancingResult extends SimulationResult {
  economiaTotal: number;
  economiaPercentual: number;
  economiaMedia: number;
}

export default function RefinancingSimulator() {
  const [result, setResult] = useState<RefinancingResult | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof refinancingSchema>>({
    resolver: zodResolver(refinancingSchema),
    defaultValues: {
      saldoDevedor: 30000,
      parcelaAtual: 800,
      parcelasPagas: 12,
      parcelasRestantes: 36,
      taxaJurosAtual: 1.9,
      taxaJurosNova: 1.5,
      numParcelas: 36,
      incluirIOF: true
    },
  });

  function onSubmit(values: z.infer<typeof refinancingSchema>) {
    setIsSubmitting(true);
    try {
      // Simular o financiamento com a nova taxa
      const simulacaoNova = simularFinanciamento(
        values.saldoDevedor, 
        values.taxaJurosNova, 
        values.numParcelas, 
        values.incluirIOF
      );
      
      // Calcular o total que seria pago continuando com o financiamento atual
      const totalRestanteAtual = values.parcelaAtual * values.parcelasRestantes;
      
      // Calcular economia
      const economiaTotal = totalRestanteAtual - simulacaoNova.totalPagar;
      const economiaPercentual = (economiaTotal / totalRestanteAtual) * 100;
      const economiaMedia = economiaTotal / values.numParcelas;
      
      // Criar resultado da simulação
      const resultadoRefinanciamento: RefinancingResult = {
        ...simulacaoNova,
        economiaTotal,
        economiaPercentual,
        economiaMedia
      };
      
      setResult(resultadoRefinanciamento);
      
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
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Simulador de Refinanciamento de Veículos</h2>
        
        <div className="mb-8">
          <p className="mb-4">O refinanciamento de veículos é uma excelente opção para quem deseja reduzir o valor das parcelas ou aproveitar taxas de juros mais baixas em um financiamento já em andamento.</p>
          
          <p className="mb-4">Através desta operação, você pode quitar o seu financiamento atual e iniciar um novo com condições mais vantajosas, resultando em economia significativa.</p>
          
          <p className="mb-4">As principais vantagens de refinanciar um veículo incluem:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Redução das parcelas mensais:</strong> Ideal para quem precisa aliviar o orçamento.</li>
            <li><strong>Aproveitamento de taxas mais baixas:</strong> Se as taxas de juros do mercado caíram, é possível economizar substancialmente.</li>
            <li><strong>Mudança no prazo:</strong> Possibilidade de estender o prazo para reduzir o valor das parcelas.</li>
            <li><strong>Liberação de crédito:</strong> Em alguns casos, é possível obter dinheiro extra além do valor necessário para quitar o financiamento atual.</li>
          </ul>
          
          <p className="mb-4">Para realizar um refinanciamento de veículo, geralmente você precisará:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Apresentar o histórico de pagamentos do financiamento atual</li>
            <li>Comprovar renda compatível com a nova parcela</li>
            <li>Submeter o veículo a uma avaliação atualizada</li>
            <li>Solicitar à instituição atual uma carta de quitação</li>
          </ul>
          
          <p className="mb-4">O melhor momento para refinanciar é quando você identifica que as taxas de juros do mercado estão significativamente mais baixas que a sua taxa atual, ou quando já pagou pelo menos 30% a 40% do financiamento original.</p>
          
          <p>Use nosso simulador para calcular quanto você pode economizar com o refinanciamento do seu veículo, comparando as condições atuais com as novas possibilidades.</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="saldoDevedor"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Saldo devedor atual (R$)</FormLabel>
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
                    <p className="text-xs text-neutral-500">Valor atual que falta pagar do financiamento</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parcelaAtual"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Valor da parcela atual (R$)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                        <Input
                          type="number"
                          placeholder="800"
                          className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Quanto você paga atualmente por mês</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <FormField
                control={form.control}
                name="parcelasPagas"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Parcelas já pagas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="12"
                        className="py-3 bg-neutral-100 border-neutral-300"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-neutral-500">Quantas parcelas você já pagou</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parcelasRestantes"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Parcelas restantes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="36"
                        className="py-3 bg-neutral-100 border-neutral-300"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-neutral-500">Quantas parcelas ainda faltam pagar</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxaJurosAtual"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Taxa de juros atual (% ao mês)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="1.9"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Taxa do seu financiamento atual</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
              <h3 className="font-heading text-lg font-semibold text-primary mb-4">Novas condições para refinanciamento</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="taxaJurosNova"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Nova taxa de juros (% ao mês)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="1.5"
                            className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                            {...field}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                        </div>
                      </FormControl>
                      <p className="text-xs text-neutral-500">Taxa oferecida para o refinanciamento</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numParcelas"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Novo prazo (em meses)</FormLabel>
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
                          <SelectItem value="12">12 meses (1 ano)</SelectItem>
                          <SelectItem value="24">24 meses (2 anos)</SelectItem>
                          <SelectItem value="36">36 meses (3 anos)</SelectItem>
                          <SelectItem value="48">48 meses (4 anos)</SelectItem>
                          <SelectItem value="60">60 meses (5 anos)</SelectItem>
                          <SelectItem value="72">72 meses (6 anos)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-neutral-500">Novo prazo para pagamento</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="incluirIOF"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-2 mt-8">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium text-neutral-700">Incluir IOF</FormLabel>
                        <p className="text-xs text-neutral-500">Imposto sobre Operações Financeiras</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                Calcular Economia
              </Button>
            </div>
          </form>
        </Form>
        
        {result && (
          <div id="resultado-simulacao" className="mb-8">
            <h3 className="font-heading text-xl font-semibold text-primary mb-4">Resultado da simulação de refinanciamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <p className="text-sm text-neutral-600 mb-1">Economia total estimada</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.economiaTotal)}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {result.economiaTotal > 0 
                    ? `Economia de ${result.economiaPercentual.toFixed(1)}% no total` 
                    : "Não há economia neste cenário"}
                </p>
              </div>
              
              <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Nova parcela mensal</p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valorParcela)}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  {result.valorParcela < form.getValues().parcelaAtual 
                    ? `R$ ${(form.getValues().parcelaAtual - result.valorParcela).toFixed(2)} menor por mês` 
                    : `R$ ${(result.valorParcela - form.getValues().parcelaAtual).toFixed(2)} maior por mês`}
                </p>
              </div>
              
              <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Total a pagar no refinanciamento</p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalPagar)}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  Em {form.getValues().numParcelas} parcelas
                </p>
              </div>
            </div>
            
            {result.valorIOF && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
                <p className="flex items-center text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>O valor do IOF incluído nesta simulação é de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valorIOF)}</span>
                </p>
              </div>
            )}
            
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
              
              <DebtChart 
                data={result.tabelaAmortizacao.slice(0, 12)} 
                height={300}
              />
              
              <PriceTable 
                data={result.tabelaAmortizacao} 
                expanded={isTableExpanded} 
              />
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 italic">* Este é apenas um cálculo aproximado. As condições reais podem variar conforme a instituição financeira e a análise de crédito individual.</p>
            </div>
          </div>
        )}
        
        <div className="bg-neutral-100 border-l-4 border-secondary p-4 mt-6">
          <p className="text-sm font-medium">AVISO IMPORTANTE:</p>
          <p className="text-sm">Não somos uma instituição financeira e não oferecemos empréstimos ou financiamentos. Este site fornece apenas ferramentas de simulação para cálculos e pesquisa. Os resultados são aproximados e podem variar conforme as condições reais oferecidas pelas instituições financeiras. Recomendamos sempre consultar um banco ou financeira para obter condições oficiais antes de tomar qualquer decisão.</p>
        </div>
      </section>
    </div>
  );
}