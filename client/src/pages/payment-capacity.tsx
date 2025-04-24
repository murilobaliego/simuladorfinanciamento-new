import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { simularFinanciamento } from "@/utils/finance";

const capacitySchema = z.object({
  rendaMensal: z.coerce
    .number()
    .min(1000, "A renda mínima é R$ 1.000,00")
    .max(50000, "A renda máxima é R$ 50.000,00"),
  despesasMensais: z.coerce
    .number()
    .min(0, "O valor mínimo é R$ 0,00"),
  comprometimentoMaximo: z.coerce
    .number()
    .min(10, "O mínimo é 10%")
    .max(50, "O máximo é 50%"),
  entrada: z.coerce
    .number()
    .min(0, "O valor mínimo é R$ 0,00"),
  taxaJuros: z.coerce
    .number()
    .min(0.5, "A taxa mínima é 0,5%")
    .max(3.5, "A taxa máxima é 3,5%"),
  numParcelas: z.coerce
    .number()
    .min(12, "O número mínimo de parcelas é 12")
    .max(84, "O número máximo de parcelas é 84")
});

interface VehicleCapacity {
  valorMaximoVeiculo: number;
  valorFinanciamento: number;
  parcelaMaxima: number;
  rendaDisponivel: number;
}

export default function PaymentCapacity() {
  const [result, setResult] = useState<VehicleCapacity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof capacitySchema>>({
    resolver: zodResolver(capacitySchema),
    defaultValues: {
      rendaMensal: 5000,
      despesasMensais: 2000,
      comprometimentoMaximo: 30,
      entrada: 10000,
      taxaJuros: 1.8,
      numParcelas: 48
    },
  });

  // Valores observados para cálculos em tempo real
  const rendaMensal = form.watch("rendaMensal");
  const despesasMensais = form.watch("despesasMensais");
  const comprometimentoMaximo = form.watch("comprometimentoMaximo");
  
  // Cálculo de renda disponível em tempo real
  const rendaDisponivel = Math.max(0, rendaMensal - despesasMensais);
  const parcelaMaxima = rendaDisponivel * (comprometimentoMaximo / 100);

  function onSubmit(values: z.infer<typeof capacitySchema>) {
    setIsSubmitting(true);
    try {
      // Cálculo da renda disponível após despesas
      const rendaDisponivel = values.rendaMensal - values.despesasMensais;
      
      // Parcela máxima com base no comprometimento máximo definido
      const parcelaMaxima = rendaDisponivel * (values.comprometimentoMaximo / 100);
      
      // Estimar o valor máximo do financiamento usando a função de simulação "ao contrário"
      // Vamos usar uma abordagem iterativa para encontrar o valor máximo
      
      let valorEstimado = 10000; // Valor inicial para teste
      let incremento = 5000; // Incremento inicial
      let valorMaximoVeiculo = 0;
      let valorFinanciamento = 0;
      
      // Algoritmo de aproximação para encontrar o valor máximo de financiamento
      for (let i = 0; i < 20; i++) { // Limite de iterações para evitar loop infinito
        try {
          const simulacao = simularFinanciamento(
            valorEstimado,
            values.taxaJuros,
            values.numParcelas,
            true // Incluir IOF para simulação de veículos
          );
          
          if (simulacao.valorParcela <= parcelaMaxima) {
            // Se a parcela for menor que a máxima, podemos aumentar o valor
            valorFinanciamento = valorEstimado;
            valorMaximoVeiculo = valorFinanciamento + values.entrada;
            valorEstimado += incremento;
          } else {
            // Se a parcela for maior, precisamos diminuir o valor e reduzir o incremento
            valorEstimado -= incremento;
            incremento = incremento / 2;
            valorEstimado += incremento;
          }
          
          // Se o incremento ficar muito pequeno, encerramos a busca
          if (incremento < 100) break;
        } catch (error) {
          console.error("Erro na simulação:", error);
          break;
        }
      }
      
      // Resultado final
      setResult({
        valorMaximoVeiculo,
        valorFinanciamento,
        parcelaMaxima,
        rendaDisponivel
      });
      
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
        <h2 className="font-heading text-2xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Calculadora de Capacidade de Pagamento</h2>
        
        <div className="mb-8">
          <p className="mb-4">Antes de financiar um veículo, é fundamental saber qual o valor máximo que você pode comprometer do seu orçamento. Esta calculadora ajuda a determinar sua capacidade de pagamento com base na sua renda e despesas mensais.</p>
          
          <p className="mb-4">Especialistas em finanças pessoais recomendam que o valor da parcela de financiamento de veículo não ultrapasse 15% a 20% da sua renda líquida mensal. Considerando outras despesas, o comprometimento total com dívidas não deve passar de 30% da sua renda.</p>
          
          <p className="mb-4">Ao calcular sua capacidade de pagamento, considere:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Renda líquida:</strong> O valor que efetivamente entra na sua conta após todos os descontos.</li>
            <li><strong>Despesas fixas:</strong> Aluguel/financiamento imobiliário, condomínio, contas de consumo, alimentação, educação, plano de saúde, etc.</li>
            <li><strong>Outras dívidas:</strong> Parcelas de outros financiamentos, empréstimos ou cartões de crédito.</li>
            <li><strong>Reserva de emergência:</strong> Idealmente, você deve manter uma reserva para imprevistos.</li>
          </ul>
          
          <p className="mb-4">Além do valor da parcela, não se esqueça de considerar os custos adicionais de ter um veículo, como:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>IPVA e licenciamento anual</li>
            <li>Seguro do veículo</li>
            <li>Combustível</li>
            <li>Manutenção preventiva e corretiva</li>
            <li>Estacionamento</li>
          </ul>
          
          <p>Use nossa calculadora para encontrar o valor ideal de veículo que cabe no seu orçamento, garantindo uma compra responsável e sustentável para suas finanças.</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="rendaMensal"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Renda mensal líquida (R$)</FormLabel>
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
                    <p className="text-xs text-neutral-500">Sua renda total após impostos e descontos</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="despesasMensais"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-neutral-700">Despesas mensais fixas (R$)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                        <Input
                          type="number"
                          placeholder="2000"
                          className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">Aluguel, contas, alimentação e outras despesas fixas</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mb-6">
              <FormField
                control={form.control}
                name="comprometimentoMaximo"
                render={({ field: { value, onChange, ...fieldProps }}) => (
                  <FormItem className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-sm font-medium text-neutral-700">
                        Comprometimento máximo da renda disponível
                      </FormLabel>
                      <span className="text-primary font-medium">{value}%</span>
                    </div>
                    <FormControl>
                      <Slider 
                        defaultValue={[value]} 
                        max={50} 
                        min={10} 
                        step={5}
                        onValueChange={(vals) => onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Conservador (10%)</span>
                      <span>Recomendado (30%)</span>
                      <span>Agressivo (50%)</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-neutral-700">Renda disponível após despesas:</p>
                  <p className="text-primary font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rendaDisponivel)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-neutral-700">Parcela máxima recomendada ({comprometimentoMaximo}%):</p>
                  <p className="text-primary font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parcelaMaxima)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200 mb-6">
              <h3 className="font-heading text-lg font-semibold text-primary mb-4">Condições do financiamento</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="entrada"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Valor da entrada (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                          <Input
                            type="number"
                            placeholder="10000"
                            className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-neutral-500">Quanto você pode dar de entrada</p>
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
                            placeholder="1.8"
                            className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                            {...field}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                        </div>
                      </FormControl>
                      <p className="text-xs text-neutral-500">Taxa média para veículos: 1,8% a.m.</p>
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
                          <SelectItem value="12">12 meses (1 ano)</SelectItem>
                          <SelectItem value="24">24 meses (2 anos)</SelectItem>
                          <SelectItem value="36">36 meses (3 anos)</SelectItem>
                          <SelectItem value="48">48 meses (4 anos)</SelectItem>
                          <SelectItem value="60">60 meses (5 anos)</SelectItem>
                          <SelectItem value="72">72 meses (6 anos)</SelectItem>
                          <SelectItem value="84">84 meses (7 anos)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-neutral-500">Prazo comum: 48 a 60 meses</p>
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
                Calcular Capacidade
              </Button>
            </div>
          </form>
        </Form>
        
        {result && (
          <div id="resultado-simulacao" className="mb-8">
            <h3 className="font-heading text-xl font-semibold text-primary mb-4">Resultado da análise de capacidade</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <p className="text-sm text-neutral-600 mb-1">Valor máximo do veículo</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valorMaximoVeiculo)}
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-600">Valor da entrada:</p>
                    <p className="text-sm font-semibold text-neutral-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.getValues().entrada)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-600">Valor a financiar:</p>
                    <p className="text-sm font-semibold text-neutral-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valorFinanciamento)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Capacidade de pagamento mensal</p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.parcelaMaxima)}
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-600">Renda disponível:</p>
                    <p className="text-sm font-semibold text-neutral-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.rendaDisponivel)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-600">Comprometimento:</p>
                    <p className="text-sm font-semibold text-neutral-700">
                      {form.getValues().comprometimentoMaximo}% da renda disponível
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
              <h4 className="font-semibold text-primary mb-2">Recomendações importantes:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm text-neutral-700">Lembre-se de considerar os custos adicionais de manutenção, seguro, IPVA e combustível.</li>
                <li className="text-sm text-neutral-700">Uma entrada maior pode reduzir significativamente o valor das parcelas.</li>
                <li className="text-sm text-neutral-700">Compare as taxas de juros oferecidas por diferentes instituições financeiras.</li>
                <li className="text-sm text-neutral-700">Evite comprometer mais de 30% da sua renda disponível com financiamentos.</li>
              </ul>
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