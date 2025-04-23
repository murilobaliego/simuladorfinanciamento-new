import { useState } from "react";
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
import { gerarTabelaPrice, calcularTotalPagar, calcularTotalJuros } from "@/utils/finance";

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
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Gerar tabela de amortização com Price (padrão para consignados)
      const tabelaAmortizacao = gerarTabelaPrice(
        values.valorFinanciado, 
        values.taxaJuros, 
        values.numParcelas
      );
      
      // Calcular valor da parcela, total a pagar e total de juros
      const valorParcela = tabelaAmortizacao[0].valorParcela;
      const totalPagar = calcularTotalPagar(valorParcela, values.numParcelas);
      const totalJuros = calcularTotalJuros(totalPagar, values.valorFinanciado);
      
      // Criar resultado da simulação
      const data: SimulationResult = {
        valorParcela,
        totalPagar,
        totalJuros,
        tabelaAmortizacao
      };
      
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
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="font-heading text-2xl font-bold text-primary mb-6 pb-2 border-b border-neutral-200">Simulador de Crédito Consignado</h2>
        
        <div className="mb-8">
          <p className="mb-4">O empréstimo consignado é uma modalidade de crédito com desconto das parcelas diretamente na folha de pagamento ou benefício. Por oferecer mais segurança para as instituições financeiras, suas taxas de juros são mais baixas comparadas a outros tipos de empréstimos.</p>
          
          <p className="mb-4">No Brasil, os principais públicos que podem acessar o crédito consignado são:</p>
          
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Aposentados e pensionistas do INSS:</strong> Podem comprometer até 45% da renda (35% para empréstimo consignado e 10% para cartão de crédito ou saque).</li>
            <li><strong>Servidores públicos:</strong> Federais, estaduais ou municipais, com margem consignável definida pelo órgão empregador, geralmente em torno de 30% a 40% do salário.</li>
            <li><strong>Militares das Forças Armadas:</strong> Com regras específicas para cada força.</li>
          </ul>
          
          <p className="mb-4">O empréstimo consignado se destaca por suas taxas de juros reduzidas (entre 1,5% e 2,2% ao mês), pela facilidade de aprovação (mesmo para quem tem restrições no nome) e pelos prazos mais longos, que podem chegar a 84 meses (7 anos) para aposentados e pensionistas do INSS e até 96 meses (8 anos) para algumas categorias de servidores públicos.</p>
          
          <p className="mb-4">Embora ofereça vantagens, é importante usar o crédito consignado com cautela. O desconto automático em folha pode comprometer sua renda por longo período. Além disso, em caso de refinanciamento, os juros podem incidir sobre juros anteriores, aumentando o custo total.</p>
          
          <p className="mb-4">Antes de contratar, verifique sua margem consignável disponível (valor máximo que pode ser descontado do seu benefício ou salário), compare as taxas entre diferentes instituições e avalie se o empréstimo é realmente necessário e se cabe no seu planejamento financeiro.</p>
          
          <p>Use nosso simulador para calcular as parcelas e o custo total do seu empréstimo consignado. Isso ajudará você a tomar uma decisão financeira mais consciente.</p>
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
                          placeholder="10000"
                          className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">De R$ 1.000,00 até R$ 150.000,00</p>
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
                          placeholder="1.7"
                          className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                          {...field}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-neutral-500">
                      Taxa média para {tipoConsignado === "inss" ? "INSS" : tipoConsignado === "servidor" ? "servidores" : "militares"}: {
                        tipoConsignado === "inss" ? "1,7%" : tipoConsignado === "servidor" ? "1,5%" : "1,3%"
                      } a.m.
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
                      defaultValue={field.value.toString()}
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
                        <SelectItem value="72">72 meses (6 anos)</SelectItem>
                        <SelectItem value="84">84 meses (7 anos)</SelectItem>
                        {tipoConsignado === "servidor" && (
                          <SelectItem value="96">96 meses (8 anos)</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-neutral-500">
                      Prazo comum para {tipoConsignado === "inss" ? "INSS" : tipoConsignado === "servidor" ? "servidores" : "militares"}: {
                        tipoConsignado === "inss" ? "60 a 84" : tipoConsignado === "servidor" ? "60 a 96" : "60 a 84"
                      } meses
                    </p>
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
            
            <div>
              <p className="text-sm text-neutral-600 italic">* Este é apenas um cálculo aproximado. As condições reais podem variar conforme a instituição financeira.</p>
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
