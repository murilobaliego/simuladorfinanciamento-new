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
  valorFinanciado: z.coerce.number().min(500, "Valor mínimo: R$ 500").max(30000, "Valor máximo: R$ 30.000"),
  taxaJuros: z.coerce.number().min(3, "Taxa mínima: 3%").max(15, "Taxa máxima: 15%"),
  numParcelas: z.coerce.number().min(3, "Mínimo: 3 parcelas").max(36, "Máximo: 36 parcelas")
});

export default function EmprestimoNegativado() {
  return (
    <>
      <Helmet>
        <title>Empréstimo para Negativado | Crédito com Nome Sujo 2025</title>
        <meta name="description" content="Empréstimo para negativado com aprovação rápida. Simule crédito mesmo com nome sujo, score baixo ou restrições no CPF. Taxas especiais e parcelas que cabem no bolso." />
        <meta name="keywords" content="empréstimo para negativado, crédito para negativado, empréstimo com nome sujo, empréstimo score baixo, crédito com restrição, empréstimo cpf negativado" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/emprestimo-negativado" />
        <meta property="og:title" content="Empréstimo para Negativado | Crédito com Nome Sujo 2025" />
        <meta property="og:description" content="Empréstimo para negativado com aprovação rápida. Simule crédito mesmo com nome sujo, score baixo ou restrições no CPF." />
        <meta property="og:url" content="https://simuladorfinanciamento.com/emprestimo-negativado" />
        
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Simulador de Empréstimo para Negativado",
            "url": "https://simuladorfinanciamento.com/emprestimo-negativado",
            "description": "Simulador de empréstimo para pessoas com nome sujo, score baixo ou restrições no CPF.",
            "applicationCategory": "FinanceApplication",
            "isAccessibleForFree": true,
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "BRL"},
            "featureList": ["Crédito para negativados", "Aprovação rápida", "Sem consulta ao SPC/Serasa", "Parcelas flexíveis"]
          }`}
        </script>
        
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
              "@type": "Question",
              "name": "É possível conseguir empréstimo estando negativado?",
              "acceptedAnswer": {"@type": "Answer", "text": "Sim, existem instituições financeiras que oferecem empréstimo para negativados. As taxas são mais altas devido ao risco, mas é possível obter crédito mesmo com nome sujo."}
            }, {
              "@type": "Question",
              "name": "Qual o valor máximo de empréstimo para negativado?",
              "acceptedAnswer": {"@type": "Answer", "text": "O valor varia por instituição, geralmente entre R$ 500 e R$ 30.000, dependendo da renda e capacidade de pagamento."}
            }, {
              "@type": "Question",
              "name": "Quanto tempo demora para aprovar empréstimo para negativado?",
              "acceptedAnswer": {"@type": "Answer", "text": "A aprovação pode ocorrer em 24 a 48 horas, com o dinheiro liberado em até 3 dias úteis após aprovação."}
            }]
          }`}
        </script>
      </Helmet>
      <EmprestimoNegativadoContent />
    </>
  );
}

function EmprestimoNegativadoContent() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { valorFinanciado: 3000, taxaJuros: 8, numParcelas: 12 }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const data = simularFinanciamento(values.valorFinanciado, values.taxaJuros, values.numParcelas, false);
      setResult(data);
      setTimeout(() => document.getElementById("resultado-simulacao")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (error) {
      toast({ title: "Erro ao calcular", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
        <h1 className="font-heading text-4xl font-bold text-primary mb-4 text-center">Empréstimo para Negativado</h1>
        <p className="text-xl text-gray-700 mb-4 text-center">Crédito rápido mesmo com nome sujo ou score baixo</p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ Aprovação Rápida</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Sem Consulta SPC</span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ Score Baixo</span>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">✓ Até 36x</span>
        </div>
      </section>
      
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">Como Funciona o Empréstimo para Negativado?</h2>
        <p className="mb-4 text-lg">O <strong>empréstimo para negativado</strong> é uma modalidade de crédito destinada a pessoas com restrições no CPF, nome sujo no SPC/Serasa ou score baixo. Mesmo com histórico de crédito comprometido, é possível obter recursos financeiros.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-red-800 mb-2">Aprovação Rápida</h3>
            <p className="text-red-700 text-sm">Análise em até 24 horas</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">🔓</div>
            <h3 className="font-semibold text-blue-800 mb-2">Sem Burocracia</h3>
            <p className="text-blue-700 text-sm">Documentação simplificada</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-orange-800 mb-2">Parcelas Flexíveis</h3>
            <p className="text-orange-700 text-sm">Até 36 meses para pagar</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-primary mt-8 mb-4">Melhores Opções de Empréstimo para Negativado 2025</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-300 bg-white">
            <thead>
              <tr className="bg-primary/10">
                <th className="px-4 py-3 border text-left font-semibold">Instituição</th>
                <th className="px-4 py-3 border text-center font-semibold">Taxa Mínima</th>
                <th className="px-4 py-3 border text-center font-semibold">Valor Máximo</th>
                <th className="px-4 py-3 border text-center font-semibold">Prazo</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-4 py-3 border font-medium">Creditas</td><td className="px-4 py-3 border text-center text-green-600 font-bold">5,5% a.m.</td><td className="px-4 py-3 border text-center">R$ 30.000</td><td className="px-4 py-3 border text-center">36 meses</td></tr>
              <tr className="bg-gray-50"><td className="px-4 py-3 border font-medium">Moneyman</td><td className="px-4 py-3 border text-center text-green-600 font-bold">6,0% a.m.</td><td className="px-4 py-3 border text-center">R$ 15.000</td><td className="px-4 py-3 border text-center">24 meses</td></tr>
              <tr><td className="px-4 py-3 border font-medium">Simplic</td><td className="px-4 py-3 border text-center text-green-600 font-bold">7,5% a.m.</td><td className="px-4 py-3 border text-center">R$ 10.000</td><td className="px-4 py-3 border text-center">24 meses</td></tr>
            </tbody>
          </table>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-red-800 mb-4">Simule seu Empréstimo para Negativado</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="valorFinanciado" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-red-700">Valor (R$)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                        <Input type="number" placeholder="3000" className="pl-10 bg-white border-red-200" {...field} />
                      </div>
                    </FormControl>
                    <p className="text-xs text-red-600">De R$ 500 até R$ 30.000</p>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="taxaJuros" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-red-700">Taxa de juros (% mês)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" step="0.1" placeholder="8" className="pr-10 bg-white border-red-200" {...field} />
                        <span className="absolute inset-y-0 right-3 flex items-center text-neutral-500">%</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-red-600">Taxa média: 8% a.m.</p>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="numParcelas" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-red-700">Parcelas</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-red-200">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">3 meses</SelectItem>
                        <SelectItem value="6">6 meses</SelectItem>
                        <SelectItem value="12">12 meses</SelectItem>
                        <SelectItem value="18">18 meses</SelectItem>
                        <SelectItem value="24">24 meses</SelectItem>
                        <SelectItem value="36">36 meses</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            
            <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : null}
              Calcular Empréstimo
            </Button>
          </form>
        </Form>
        
        {result && (
          <div id="resultado-simulacao" className="mb-8">
            <h3 className="font-heading text-xl font-semibold text-primary mb-4">Resultado da Simulação</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-neutral-100 p-4 rounded-md border">
                <p className="text-sm text-neutral-600 mb-1">Valor da parcela</p>
                <p className="text-2xl font-bold text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.valorParcela)}</p>
              </div>
              <div className="bg-neutral-100 p-4 rounded-md border">
                <p className="text-sm text-neutral-600 mb-1">Total a pagar</p>
                <p className="text-2xl font-bold text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalPagar)}</p>
              </div>
              <div className="bg-neutral-100 p-4 rounded-md border">
                <p className="text-sm text-neutral-600 mb-1">Total de juros</p>
                <p className="text-2xl font-bold text-accent-dark">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalJuros)}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-semibold">Tabela de Amortização</h4>
                <Button variant="ghost" className="text-sm" onClick={() => setIsTableExpanded(!isTableExpanded)}>
                  {isTableExpanded ? "Mostrar menos" : "Ver tabela completa"}
                </Button>
              </div>
              <PriceTable data={result.tabelaAmortizacao} expanded={isTableExpanded} />
            </div>
            
            <ExportButtons data={result.tabelaAmortizacao} fileName="emprestimo-negativado" title="Empréstimo para Negativado" summary={{
              valorFinanciado: form.getValues().valorFinanciado,
              taxaJuros: form.getValues().taxaJuros,
              numParcelas: form.getValues().numParcelas,
              valorParcela: result.valorParcela,
              totalPagar: result.totalPagar,
              totalJuros: result.totalJuros
            }} />
          </div>
        )}

        <h2 className="text-2xl font-semibold text-primary mb-6 mt-12">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-lg text-primary mb-2">É possível conseguir empréstimo estando negativado?</h3>
            <p className="text-neutral-700">Sim, existem instituições financeiras especializadas em <strong>empréstimo para negativado</strong>. As taxas são mais altas devido ao risco, mas é possível obter crédito mesmo com nome sujo no SPC/Serasa.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-lg text-primary mb-2">Qual o valor máximo de empréstimo para negativado?</h3>
            <p className="text-neutral-700">O valor varia por instituição, geralmente entre R$ 500 e R$ 30.000, dependendo da renda comprovada e capacidade de pagamento.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-lg text-primary mb-2">Quanto tempo demora para aprovar?</h3>
            <p className="text-neutral-700">A aprovação de <strong>empréstimo para negativado</strong> pode ocorrer em 24 a 48 horas, com o dinheiro liberado em até 3 dias úteis após aprovação.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-lg text-primary mb-2">Preciso de garantia ou avalista?</h3>
            <p className="text-neutral-700">Depende da instituição. Algumas oferecem <strong>crédito para negativado</strong> sem garantia, enquanto outras podem exigir avalista ou garantia de bens.</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-8">
          <p className="text-sm font-medium">ATENÇÃO:</p>
          <p className="text-sm">Este simulador é educativo. Taxas reais variam conforme análise de crédito. Não comprometa mais de 30% da renda com empréstimos.</p>
        </div>
      </section>
    </div>
  );
}
