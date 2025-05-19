import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, ShieldAlert, GraduationCap, BookOpen, Calendar, Info, HelpCircle, Clock, Landmark, User, School } from "lucide-react";
import { Area, AreaChart, CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { gerarTabelaPrice } from "@/utils/finance";
import PriceTable from "@/components/simulators/price-table";
import ExportButtons from "@/components/simulators/export-buttons";
import HeadSEO from "@/components/seo/head-seo";
import { useSecureForm } from "@/hooks/use-secure-form";
import { validateNumberRange } from "@/utils/security";

// Schema de validação do formulário
const formSchema = z.object({
  valorMensalidade: z.coerce.number()
    .min(300, { message: "Valor mínimo: R$ 300,00" })
    .max(10000, { message: "Valor máximo: R$ 10.000,00" }),
  percentualFinanciamento: z.coerce.number()
    .min(10, { message: "Mínimo: 10%" })
    .max(100, { message: "Máximo: 100%" }),
  duracaoCurso: z.enum(["6", "8", "10", "12"], {
    required_error: "Selecione a duração do curso em semestres",
  }),
  taxaJuros: z.coerce.number()
    .min(0, { message: "Mínimo: 0%" })
    .max(12, { message: "Máximo: 12%" }),
  rendaMensal: z.coerce.number()
    .min(500, { message: "Mínimo: R$ 500,00" })
    .max(30000, { message: "Máximo: R$ 30.000,00" }),
  prazoAmortizacao: z.enum(["1x", "1.5x", "2x", "3x"], {
    required_error: "Selecione o prazo de amortização",
  }),
});

// Interface para resultado da simulação
interface SimulacaoFIES {
  valorMensalidade: number;
  valorCoparticipacao: number;
  valorFinanciado: number;
  totalCurso: number;
  valorDuranteCarencia: number;
  valorParcelaAmortizacao: number;
  numeroParcelas: number;
  taxaJurosMensal: number;
  taxaJurosAnual: number;
  prazoTotal: number;
  tabelaAmortizacao: any[];
  valorTotalPago: number;
  totalJuros: number;
  percentualRenda: number;
  rendaMensal: number;
}

export default function FinanciamentoFIES() {
  const [result, setResult] = useState<SimulacaoFIES | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const { toast } = useToast();
  
  // Inicializa o hook de formulário seguro
  const {
    secureSubmit,
    isSubmitting,
    isLimited,
    CsrfInput,
  } = useSecureForm({
    formId: 'fies-form',
    rateLimiterOptions: {
      maxAttempts: 15,
      timeWindowMs: 60000 
    }
  });
  
  // Inicializar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorMensalidade: 1200,
      percentualFinanciamento: 100,
      duracaoCurso: "8",
      taxaJuros: 8.0,
      rendaMensal: 2000,
      prazoAmortizacao: "1x",
    },
  });
  
  // Calcular valor financiado mensal
  const calcularValorFinanciado = (valorMensalidade: number, percentualFinanciamento: number): number => {
    return (valorMensalidade * percentualFinanciamento) / 100;
  };
  
  // Calcular valor da coparticipação
  const calcularCoparticipacao = (valorMensalidade: number, percentualFinanciamento: number): number => {
    return valorMensalidade - calcularValorFinanciado(valorMensalidade, percentualFinanciamento);
  };
  
  // Calcular valor a ser pago durante a fase de carência (após formatura)
  // No FIES atual, durante a carência pagam-se apenas os juros do período, sem amortização
  const calcularValorCarencia = (valorFinanciadoTotal: number, taxaJurosMensal: number): number => {
    return valorFinanciadoTotal * taxaJurosMensal / 100;
  };
  
  // Converter prazo de amortização em número de meses
  const converterPrazoAmortizacao = (duracaoCurso: number, multiplicador: string): number => {
    let multiplier = 1;
    
    switch (multiplicador) {
      case "1x":
        multiplier = 1;
        break;
      case "1.5x":
        multiplier = 1.5;
        break;
      case "2x":
        multiplier = 2;
        break;
      case "3x":
        multiplier = 3;
        break;
      default:
        multiplier = 1;
    }
    
    // Duração em meses * multiplicador
    return Math.round(duracaoCurso * 6 * multiplier);
  };
  
  // Função de submissão do formulário
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Usando o wrapper seguro para a submissão
    secureSubmit((secureValues) => {
      try {
        // Sanitizamos e validamos todos os valores
        const valorMensalidade = validateNumberRange(
          Number(secureValues.valorMensalidade), 
          300, 
          10000, 
          1200
        );
        
        const percentualFinanciamento = validateNumberRange(
          Number(secureValues.percentualFinanciamento), 
          10, 
          100, 
          100
        );
        
        // Validar a string da duração do curso
        let duracaoCurso = 8; // Valor padrão seguro
        if (typeof secureValues.duracaoCurso === 'string' && 
            ['6', '8', '10', '12'].includes(secureValues.duracaoCurso)) {
          duracaoCurso = parseInt(secureValues.duracaoCurso);
        }
        
        const taxaJuros = validateNumberRange(
          Number(secureValues.taxaJuros), 
          0, 
          12, 
          8
        );
        
        const rendaMensal = validateNumberRange(
          Number(secureValues.rendaMensal),
          500,
          30000,
          2000
        );
        
        // Validar o prazo de amortização
        let prazoAmortizacao = "1x"; // Valor padrão seguro
        if (typeof secureValues.prazoAmortizacao === 'string' && 
            ['1x', '1.5x', '2x', '3x'].includes(secureValues.prazoAmortizacao)) {
          prazoAmortizacao = secureValues.prazoAmortizacao;
        }
        
        // Cálculos FIES
        // 1. Valor financiado por mês
        const valorFinanciadoMensal = calcularValorFinanciado(valorMensalidade, percentualFinanciamento);
        
        // 2. Valor da coparticipação (o que o aluno paga durante o curso)
        const valorCoparticipacao = valorMensalidade - valorFinanciadoMensal;
        
        // 3. Valor total financiado no curso completo
        const totalMesesCurso = duracaoCurso * 6; // conversão para meses
        const valorFinanciadoTotal = valorFinanciadoMensal * totalMesesCurso;
        
        // 4. Total do curso (financiado + pago durante o curso)
        const valorTotalCurso = valorMensalidade * totalMesesCurso;
        
        // 5. Taxa de juros mensal
        const taxaJurosMensal = taxaJuros / 12;
        
        // 6. Período de carência (18 meses após formatura)
        const periodoCarencia = 18;
        
        // 7. Valor a ser pago durante a carência (apenas juros)
        const valorDuranteCarencia = calcularValorCarencia(valorFinanciadoTotal, taxaJurosMensal);
        
        // 8. Número de parcelas da amortização
        const numeroParcelasAmortizacao = converterPrazoAmortizacao(duracaoCurso, prazoAmortizacao);
        
        // 9. Valor da parcela na fase de amortização (usando Tabela Price)
        const valorParcelaAmortizacao = (valorFinanciadoTotal * (taxaJurosMensal / 100) * Math.pow(1 + taxaJurosMensal / 100, numeroParcelasAmortizacao)) / 
                               (Math.pow(1 + taxaJurosMensal / 100, numeroParcelasAmortizacao) - 1);
        
        // 10. Prazo total do financiamento (duração do curso + carência + amortização)
        const prazoTotalFinanciamento = totalMesesCurso + periodoCarencia + numeroParcelasAmortizacao;
        
        // 11. Tabela de amortização
        const tabelaAmortizacao = gerarTabelaPrice(valorFinanciadoTotal, taxaJurosMensal, numeroParcelasAmortizacao);
        
        // 12. Valor total pago no financiamento
        // - Durante o curso: valorCoparticipacao * totalMesesCurso
        // - Durante a carência: valorDuranteCarencia * periodoCarencia
        // - Durante a amortização: valorParcelaAmortizacao * numeroParcelasAmortizacao
        const valorTotalPago = 
          (valorCoparticipacao * totalMesesCurso) +
          (valorDuranteCarencia * periodoCarencia) +
          (valorParcelaAmortizacao * numeroParcelasAmortizacao);
        
        // 13. Total de juros pagos
        const totalJuros = valorTotalPago - valorTotalCurso;
        
        // 14. Percentual da renda mensal comprometido com a parcela
        const percentualRenda = (valorParcelaAmortizacao / rendaMensal) * 100;
        
        // Montar o resultado da simulação
        const simulacao: SimulacaoFIES = {
          valorMensalidade,
          valorCoparticipacao,
          valorFinanciado: valorFinanciadoMensal,
          totalCurso: valorTotalCurso,
          valorDuranteCarencia,
          valorParcelaAmortizacao,
          numeroParcelas: numeroParcelasAmortizacao,
          taxaJurosMensal,
          taxaJurosAnual: taxaJuros,
          prazoTotal: prazoTotalFinanciamento,
          tabelaAmortizacao,
          valorTotalPago,
          totalJuros,
          percentualRenda,
          rendaMensal
        };
        
        // Atrasar um pouco para mostrar o loading state
        setTimeout(() => {
          setResult(simulacao);
        }, 500);
      } catch (error) {
        console.error("Erro ao calcular simulação:", error);
        toast({
          title: "Erro ao calcular",
          description: "Ocorreu um erro ao processar sua simulação. Tente novamente.",
          variant: "destructive",
        });
      }
    }, values);
  }

  // Preparar dados para o gráfico de evolução das parcelas
  const prepararDadosGrafico = () => {
    if (!result) return [];
    
    const dadosGrafico = [];
    const duracaoCursoMeses = parseInt(form.getValues().duracaoCurso) * 6;
    
    // Fase do curso (coparticipação)
    for (let mes = 1; mes <= duracaoCursoMeses; mes++) {
      dadosGrafico.push({
        mes,
        fase: "Curso",
        valor: result.valorCoparticipacao,
        descricao: "Coparticipação durante o curso"
      });
    }
    
    // Fase de carência (apenas juros)
    for (let mes = 1; mes <= 18; mes++) {
      dadosGrafico.push({
        mes: duracaoCursoMeses + mes,
        fase: "Carência",
        valor: result.valorDuranteCarencia,
        descricao: "Pagamento de juros durante carência"
      });
    }
    
    // Fase de amortização
    for (let mes = 1; mes <= result.numeroParcelas; mes++) {
      dadosGrafico.push({
        mes: duracaoCursoMeses + 18 + mes,
        fase: "Amortização",
        valor: result.valorParcelaAmortizacao,
        descricao: "Amortização do financiamento"
      });
    }
    
    return dadosGrafico;
  };

  return (
    <>
      <HeadSEO 
        title="Simulador de Financiamento Estudantil (FIES) | Calculadora FIES"
        description="Calcule seu financiamento FIES com nossa calculadora. Entenda como funciona o FIES, carência, amortização e o impacto nas suas finanças após a formatura."
        keywords={["simulador FIES", "como funciona o FIES", "financiamento faculdade", "simulação FIES", "FIES 2025", "carência FIES", "amortização FIES", "valor parcela FIES"]}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">
              Simulador de Financiamento Estudantil (FIES)
            </h1>
          </div>
          
          <p className="text-lg text-neutral-600 mb-8">
            Calcule as condições do financiamento estudantil FIES, entenda o impacto no seu orçamento durante e após o curso
            e planeje sua vida financeira durante e após a graduação.
          </p>
          
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="valorMensalidade"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Valor da mensalidade (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                          <Input
                            type="number"
                            placeholder="1200"
                            className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                            min="300"
                            max="10000"
                            step="50"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            aria-describedby="mensalidade-description"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Mensalidade bruta da faculdade, sem descontos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="percentualFinanciamento"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Percentual a financiar (%)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="100"
                            className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                            min="10"
                            max="100"
                            step="5"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            aria-describedby="percentual-description"
                            {...field}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                        </div>
                      </FormControl>
                      <div className="space-y-2">
                        <FormDescription className="text-xs">
                          Percentual da mensalidade que será financiado pelo FIES
                        </FormDescription>
                        <div className="w-full">
                          <Progress value={field.value || 100} max={100} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duracaoCurso"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Duração do curso</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-4 py-3 bg-neutral-100 border-neutral-300">
                            <SelectValue placeholder="Selecione a duração" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="6">6 semestres (3 anos)</SelectItem>
                          <SelectItem value="8">8 semestres (4 anos)</SelectItem>
                          <SelectItem value="10">10 semestres (5 anos)</SelectItem>
                          <SelectItem value="12">12 semestres (6 anos)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Tempo normal para conclusão do curso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="taxaJuros"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Taxa de juros anual (%)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="12"
                            placeholder="8.0"
                            className="pl-4 pr-10 py-3 bg-neutral-100 border-neutral-300"
                            pattern="[0-9]*[.]?[0-9]{0,1}"
                            inputMode="decimal"
                            aria-describedby="juros-description"
                            {...field}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Taxa de juros anual do FIES (atualmente entre 7% e 8% a.a.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rendaMensal"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Renda mensal esperada após formado (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                          <Input
                            type="number"
                            placeholder="2000"
                            className="pl-10 pr-4 py-3 bg-neutral-100 border-neutral-300"
                            min="500"
                            max="30000"
                            step="100"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            aria-describedby="renda-description"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Estimativa de renda após concluir o curso (para cálculo do comprometimento)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prazoAmortizacao"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-neutral-700">Prazo de amortização</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-4 pr-4 py-3 bg-neutral-100 border-neutral-300">
                            <SelectValue placeholder="Selecione o prazo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1x">Mesmo tempo do curso</SelectItem>
                          <SelectItem value="1.5x">1,5x o tempo do curso</SelectItem>
                          <SelectItem value="2x">2x o tempo do curso</SelectItem>
                          <SelectItem value="3x">3x o tempo do curso</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Tempo para pagar o financiamento após a carência
                      </FormDescription>
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
                    <GraduationCap className="h-5 w-5 mr-2" />
                  )}
                  Calcular FIES
                </Button>
              </div>
            </form>
          </Form>
          
          {result && (
            <div className="my-8 animate-in fade-in duration-500">
              <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                  <CardTitle className="text-2xl font-bold text-gray-900">Resultado da Simulação FIES</CardTitle>
                  <CardDescription>
                    Simulação para um curso de {parseInt(form.getValues().duracaoCurso) / 2} anos com financiamento de {form.getValues().percentualFinanciamento}%
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <Tabs defaultValue="resumo" className="w-full">
                    <TabsList className="mb-4 grid grid-cols-3 gap-4">
                      <TabsTrigger value="resumo" className="text-sm">Resumo</TabsTrigger>
                      <TabsTrigger value="timeline" className="text-sm">Timeline de Pagamentos</TabsTrigger>
                      <TabsTrigger value="amortizacao" className="text-sm">Amortização</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="resumo" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800">Durante o Curso</h3>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Valor da Mensalidade:</span>
                            <span className="font-bold text-gray-900">R$ {result.valorMensalidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Parte Financiada (por mês):</span>
                            <span className="font-bold text-blue-700">R$ {result.valorFinanciado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Coparticipação (por mês):</span>
                            <span className="font-bold text-green-700">R$ {result.valorCoparticipacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Duração do Curso:</span>
                            <span className="font-bold text-gray-900">{parseInt(form.getValues().duracaoCurso)} semestres ({parseInt(form.getValues().duracaoCurso) / 2} anos)</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Valor Total do Curso:</span>
                            <span className="font-bold text-gray-900">R$ {result.totalCurso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800">Após o Curso</h3>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Valor na Carência (por mês):</span>
                            <span className="font-bold text-blue-700">R$ {result.valorDuranteCarencia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Período de Carência:</span>
                            <span className="font-bold text-gray-900">18 meses</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Valor na Amortização (por mês):</span>
                            <span className="font-bold text-orange-700">R$ {result.valorParcelaAmortizacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Prazo de Amortização:</span>
                            <span className="font-bold text-gray-900">{result.numeroParcelas} meses ({Math.round(result.numeroParcelas/12)} anos)</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Comprometimento da Renda:</span>
                            <span className={`font-bold ${result.percentualRenda > 15 ? 'text-red-700' : 'text-green-700'}`}>
                              {result.percentualRenda.toFixed(1)}% da renda mensal
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800">Resumo Financeiro</h3>
                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Taxa de Juros:</span>
                          <span className="font-bold text-gray-900">{result.taxaJurosAnual.toFixed(1)}% a.a. ({result.taxaJurosMensal.toFixed(2)}% a.m.)</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Prazo Total do Financiamento:</span>
                          <span className="font-bold text-gray-900">{result.prazoTotal} meses ({Math.round(result.prazoTotal/12)} anos)</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Valor Total Pago:</span>
                          <span className="font-bold text-gray-900">R$ {result.valorTotalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Total de Juros:</span>
                          <span className="font-bold text-blue-700">R$ {result.totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <div className="flex gap-2">
                          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Resumo do Plano</h4>
                            <p className="text-sm text-gray-700">
                              Durante o curso, você pagará <span className="font-medium">R$ {result.valorCoparticipacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> por mês.
                              Após a formatura, você terá 18 meses de carência pagando <span className="font-medium">R$ {result.valorDuranteCarencia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> por mês.
                              Na fase de amortização, suas parcelas serão de <span className="font-medium">R$ {result.valorParcelaAmortizacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> por {result.numeroParcelas} meses.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="timeline" className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800">Evolução dos Pagamentos ao Longo do Tempo</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={prepararDadosGrafico()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="mes" 
                              label={{ value: "Meses", position: "insideBottomRight", offset: -10 }}
                              tick={(props) => {
                                const { x, y, payload } = props;
                                const duracaoCursoMeses = parseInt(form.getValues().duracaoCurso) * 6;
                                const periodoCarencia = 18;
                                const label = 
                                  payload.value <= duracaoCursoMeses ? "Curso" :
                                  payload.value <= duracaoCursoMeses + periodoCarencia ? "Carência" :
                                  "Amortização";
                                return (
                                  <text x={x} y={y + 10} textAnchor="middle" fontSize={10}>
                                    {payload.value % 12 === 0 && (
                                      <tspan>{payload.value}</tspan>
                                    )}
                                  </text>
                                );
                              }}
                            />
                            <YAxis label={{ value: "Valor (R$)", angle: -90, position: "insideLeft" }} />
                            <Tooltip 
                              formatter={(value) => ["R$ " + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })]}
                              labelFormatter={(label) => `Mês ${label}`}
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
                                      <p className="font-bold text-sm">{`Mês ${label} - Fase: ${data.fase}`}</p>
                                      <p className="text-sm text-primary">{`Valor: R$ ${Number(data.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</p>
                                      <p className="text-xs text-gray-600 mt-1">{data.descricao}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Area 
                              type="stepAfter" 
                              dataKey="valor" 
                              stroke="#6366f1" 
                              fill="#a5b4fc" 
                              name="Valor da parcela mensal"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <Card className="border border-green-200 bg-green-50">
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center">
                              <School className="h-10 w-10 text-green-600 mb-2" />
                              <h4 className="font-bold text-gray-900">Durante o Curso</h4>
                              <p className="text-lg font-bold text-green-700">
                                R$ {result.valorCoparticipacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Coparticipação por {parseInt(form.getValues().duracaoCurso) * 6} meses
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center">
                              <Clock className="h-10 w-10 text-blue-600 mb-2" />
                              <h4 className="font-bold text-gray-900">Carência</h4>
                              <p className="text-lg font-bold text-blue-700">
                                R$ {result.valorDuranteCarencia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Pagamento de juros por 18 meses
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-orange-200 bg-orange-50">
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center">
                              <Landmark className="h-10 w-10 text-orange-600 mb-2" />
                              <h4 className="font-bold text-gray-900">Amortização</h4>
                              <p className="text-lg font-bold text-orange-700">
                                R$ {result.valorParcelaAmortizacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Amortização por {result.numeroParcelas} meses
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card className="border border-gray-200 p-4 mt-2">
                        <CardHeader className="p-0 mb-2">
                          <CardTitle className="text-lg">Fases do FIES</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex gap-3">
                              <div className="h-6 w-6 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
                              <div>
                                <h5 className="font-semibold">Fase de Utilização</h5>
                                <p className="text-sm text-gray-600">Durante o curso, você paga apenas a coparticipação (parte não financiada da mensalidade).</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <div className="h-6 w-6 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
                              <div>
                                <h5 className="font-semibold">Fase de Carência</h5>
                                <p className="text-sm text-gray-600">Período de 18 meses após a conclusão do curso, onde você paga apenas os juros sobre o saldo devedor.</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <div className="h-6 w-6 rounded-full bg-orange-500 flex-shrink-0 mt-1"></div>
                              <div>
                                <h5 className="font-semibold">Fase de Amortização</h5>
                                <p className="text-sm text-gray-600">Período onde você paga parcelas mensais que incluem amortização do principal e juros, reduzindo gradualmente o saldo devedor.</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="amortizacao">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Evolução do Saldo Devedor</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={result.tabelaAmortizacao.slice(1)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="parcela" 
                                label={{ value: "Parcela", position: "insideBottomRight", offset: -10 }}
                              />
                              <YAxis label={{ value: "Saldo Devedor (R$)", angle: -90, position: "insideLeft" }} />
                              <Tooltip 
                                formatter={(value) => ["R$ " + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })]}
                                labelFormatter={(label) => `Parcela ${label}`}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="saldoDevedor" 
                                stroke="#6366f1" 
                                strokeWidth={2}
                                name="Saldo Devedor"
                                dot={false} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Tabela de Amortização</h3>
                          <Button
                            variant="ghost"
                            className="text-sm text-primary hover:text-primary-dark flex items-center"
                            onClick={() => setIsTableExpanded(!isTableExpanded)}
                          >
                            {isTableExpanded ? "Mostrar menos" : "Mostrar completa"}
                          </Button>
                        </div>
                        
                        <PriceTable 
                          data={isTableExpanded ? result.tabelaAmortizacao : result.tabelaAmortizacao.slice(0, 13)}
                          showAll={isTableExpanded}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                
                <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex justify-end">
                    <ExportButtons 
                      data={result.tabelaAmortizacao.slice(1)} 
                      fileName={`financiamento_fies_${result.valorMensalidade}`}
                      title="Simulação de Financiamento FIES"
                      summary={{
                        valorFinanciado: result.valorFinanciado * parseInt(form.getValues().duracaoCurso) * 6,
                        taxaJuros: result.taxaJurosMensal,
                        numParcelas: result.numeroParcelas,
                        valorParcela: result.valorParcelaAmortizacao,
                        totalPagar: result.valorTotalPago,
                        totalJuros: result.totalJuros,
                        valorMensalidade: result.valorMensalidade,
                        duracaoCurso: Number(form.getValues().duracaoCurso),
                        percentualFinanciamento: Number(form.getValues().percentualFinanciamento),
                        valorCarencia: result.valorDuranteCarencia
                      }}
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
          
          <section className="mt-12 space-y-10">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="h-7 w-7 text-primary" />
                  Como Funciona o FIES
                </h2>
                <p className="text-lg text-gray-600 mt-2">
                  Entenda o programa de financiamento estudantil do governo federal, suas características e condições
                </p>
              </div>
              
              <div className="p-6">
                <div className="prose prose-neutral max-w-none">
                  <h3>O que é o FIES?</h3>
                  <p>
                    O Fundo de Financiamento Estudantil (FIES) é um programa do Ministério da Educação destinado a financiar 
                    a graduação na educação superior de estudantes matriculados em cursos superiores não gratuitos. O programa 
                    possibilita o acesso ao ensino superior para estudantes que não têm condições de arcar com os custos de sua formação.
                  </p>
                  
                  <h3>Como Funciona o FIES</h3>
                  <p>
                    O FIES oferece financiamento de até 100% do valor das mensalidades de cursos de graduação em instituições 
                    privadas cadastradas no programa. O funcionamento do FIES se divide em três fases principais:
                  </p>
                  
                  <ol>
                    <li><strong>Utilização:</strong> Período em que o estudante está cursando a graduação. Durante essa fase, o aluno 
                    paga apenas a coparticipação (parte não financiada da mensalidade) se houver.</li>
                    <li><strong>Carência:</strong> Período de 18 meses após a conclusão do curso, onde o estudante paga apenas os juros 
                    do financiamento, sem amortizar o principal.</li>
                    <li><strong>Amortização:</strong> Período em que o estudante paga o valor financiado, acrescido de juros, em parcelas 
                    mensais. O prazo de amortização varia de acordo com o tempo do curso.</li>
                  </ol>
                  
                  <h3>Condições do FIES Atual</h3>
                  <p>
                    As condições atuais do FIES incluem:
                  </p>
                  <ul>
                    <li><strong>Taxa de juros:</strong> Entre 7% e 8% ao ano, dependendo da modalidade de financiamento.</li>
                    <li><strong>Prazo de amortização:</strong> Pode variar entre 1 e 3 vezes o período de duração do curso, limitado a 12 anos.</li>
                    <li><strong>Período de carência:</strong> 18 meses após a conclusão do curso, pagando apenas os juros.</li>
                    <li><strong>Coparticipação:</strong> Dependendo da renda familiar e do percentual financiado, o estudante pode precisar 
                    pagar parte da mensalidade durante o curso.</li>
                  </ul>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                    <h4 className="font-bold text-gray-900">Comprometimento de Renda</h4>
                    <p className="text-gray-700 mb-2">
                      A parcela de amortização do FIES é calculada pelo sistema Price (parcelas fixas) e pode comprometer até 15% 
                      da renda mensal do estudante após formado. É importante planejar sua capacidade de pagamento futura ao 
                      considerar o financiamento.
                    </p>
                    <p className="text-gray-700 mb-0">
                      Nosso simulador permite estimar esse comprometimento com base na sua renda esperada após a formatura.
                    </p>
                  </div>
                  
                  <h3>Requisitos para Participar do FIES</h3>
                  <ul>
                    <li>Ter participado do ENEM a partir do ano de 2010, com aproveitamento mínimo (média de 450 pontos e nota diferente de zero na redação).</li>
                    <li>Possuir renda familiar mensal bruta per capita de até 3 salários mínimos para o FIES.</li>
                    <li>Estar matriculado em curso de graduação com avaliação positiva no Sistema Nacional de Avaliação da Educação Superior (SINAES).</li>
                    <li>Não ter concluído curso superior anteriormente (em alguns casos).</li>
                  </ul>
                  
                  <h3>Vantagens do FIES</h3>
                  <ul>
                    <li><strong>Acesso ao ensino superior:</strong> Permite que estudantes sem condições financeiras possam cursar o ensino superior.</li>
                    <li><strong>Juros baixos:</strong> As taxas são mais baixas que as praticadas no mercado para empréstimos pessoais.</li>
                    <li><strong>Carência:</strong> O período de 18 meses após a formatura facilita a inserção no mercado de trabalho antes de iniciar a amortização.</li>
                    <li><strong>Prazo longo:</strong> O prazo estendido para pagamento diminui o valor das parcelas mensais.</li>
                  </ul>
                  
                  <h3>Considerações Importantes</h3>
                  <p>
                    Ao optar pelo FIES, é fundamental:
                  </p>
                  <ul>
                    <li>Considerar suas perspectivas profissionais e salariais após a formatura.</li>
                    <li>Estar ciente do comprometimento financeiro de longo prazo (que pode chegar a mais de 10 anos).</li>
                    <li>Planejar-se financeiramente para arcar com os custos não cobertos pelo financiamento (como materiais, transporte, etc).</li>
                    <li>Entender que o não pagamento das parcelas pode resultar em negativação do nome e dificuldades em obter outros créditos no futuro.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Perguntas Frequentes sobre o FIES</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    O que acontece se eu não terminar o curso?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      Se você não concluir o curso, o financiamento será encerrado e você entrará em fase de carência, 
                      seguida pela fase de amortização. Você precisará pagar todo o valor financiado até o momento do 
                      abandono ou trancamento, seguindo as mesmas regras de quem concluiu o curso.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Posso transferir o FIES para outro curso ou instituição?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      Sim, é possível transferir o FIES para outro curso na mesma instituição, ou para outra instituição, 
                      desde que a nova instituição esteja credenciada no programa. Há limites para o número de transferências 
                      permitidas, e é necessário que o novo curso tenha avaliação igual ou superior ao anterior no SINAES.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    Como é feito o cálculo da parcela na fase de amortização?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      O cálculo da parcela de amortização é feito pelo sistema Price (parcelas fixas), considerando o 
                      saldo devedor total, a taxa de juros contratada e o prazo de amortização definido. O valor da 
                      parcela é calculado para ser constante durante todo o período de amortização, sendo que a 
                      composição entre juros e amortização varia ao longo do tempo.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    Posso pagar o FIES antecipadamente?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      Sim, é possível fazer a quitação antecipada do FIES, seja de forma parcial ou total. Ao antecipar 
                      o pagamento, você economizará nos juros que seriam cobrados ao longo do tempo. Para isso, é necessário 
                      entrar em contato com o agente financeiro do seu contrato (Caixa Econômica Federal ou Banco do Brasil) 
                      e solicitar o procedimento.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    O que é a fase de carência e por que ela existe?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      A fase de carência é um período de 18 meses após a conclusão do curso, onde o estudante paga apenas 
                      os juros sobre o saldo devedor, sem amortizar o principal. Esta fase existe para dar tempo ao recém-formado 
                      de se inserir no mercado de trabalho e estabilizar sua situação financeira antes de começar a pagar as 
                      parcelas completas do financiamento.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">
                    O FIES cobre 100% do valor da mensalidade?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      Dependendo da modalidade e da sua renda familiar, o FIES pode financiar até 100% do valor da mensalidade. 
                      No entanto, em muitos casos, é necessário pagar uma coparticipação, que é uma parte da mensalidade não 
                      coberta pelo financiamento. O percentual de financiamento é definido no momento da contratação e varia 
                      conforme as regras vigentes do programa e sua faixa de renda.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-center">Quem Pode Participar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Estudantes com renda familiar per capita de até 3 salários mínimos e aproveitamento mínimo no ENEM
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-center">Cursos Abrangidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Cursos de graduação com avaliação positiva no SINAES e oferecidos por instituições participantes
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <Calendar className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-center">Inscrições</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    As inscrições para o FIES geralmente abrem duas vezes ao ano, no início de cada semestre letivo
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <HelpCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Dicas para Quem vai Utilizar o FIES</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Planeje seu futuro financeiro:</strong> Considere quanto poderá ganhar em sua área após formado e se terá condições de arcar com as parcelas.</li>
                    <li><strong>Entenda todas as fases:</strong> Tenha clareza sobre como funcionam as fases de utilização, carência e amortização.</li>
                    <li><strong>Não atrase pagamentos:</strong> Evite atrasos nas parcelas, pois isso pode levar à negativação do seu nome e dificuldades de crédito futuras.</li>
                    <li><strong>Mantenha seus dados atualizados:</strong> Informe sempre que houver mudança de endereço, telefone ou situação financeira.</li>
                    <li><strong>Guarde toda documentação:</strong> Mantenha contratos e comprovantes de pagamento organizados até a quitação completa do financiamento.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}