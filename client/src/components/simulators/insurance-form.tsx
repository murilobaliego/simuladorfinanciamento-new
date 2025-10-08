import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert, Car, Shield, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useSecureForm } from "@/hooks/use-secure-form";
import { validateNumberRange } from "@/utils/security";
import ExportButtons from "@/components/simulators/export-buttons";

const insuranceSchema = z.object({
  valorVeiculo: z.coerce
    .number()
    .min(10000, "O valor mínimo do veículo é R$ 10.000,00")
    .max(2000000, "O valor máximo do veículo é R$ 2.000.000,00"),
  anoVeiculo: z.coerce
    .number()
    .min(1990, "Ano mínimo: 1990")
    .max(new Date().getFullYear() + 1, "Ano inválido"),
  tipoVeiculo: z.enum(["hatch", "sedan", "suv", "pickup", "esportivo", "luxo"]),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  idadeCondutor: z.coerce
    .number()
    .min(18, "Idade mínima: 18 anos")
    .max(80, "Idade máxima: 80 anos"),
  sexoCondutor: z.enum(["masculino", "feminino"]),
  tempoHabilitacao: z.coerce
    .number()
    .min(0, "Tempo mínimo: 0 anos")
    .max(60, "Tempo máximo: 60 anos"),
  usoVeiculo: z.enum(["particular", "trabalho", "uber", "comercial"]),
  garagem: z.boolean().default(false),
  alarme: z.boolean().default(false),
  rastreador: z.boolean().default(false),
  coberturaTerceiros: z.boolean().default(true),
  coberturaRoubo: z.boolean().default(true),
  coberturaColisao: z.boolean().default(true),
  coberturaIncendio: z.boolean().default(true),
  assistencia24h: z.boolean().default(true),
  carroReserva: z.boolean().default(false),
  vidros: z.boolean().default(false),
  franquia: z.enum(["baixa", "media", "alta"])
});

export type InsuranceResult = {
  premioTotal: number;
  premioMensal: number;
  franquiaValor: number;
  coberturas: {
    terceiros: number;
    rouboFurto: number;
    colisao: number;
    incendio: number;
    assistencia: number;
    carroReserva?: number;
    vidros?: number;
  };
  fatoresRisco: {
    idade: number;
    veiculo: number;
    regiao: number;
    uso: number;
    seguranca: number;
  };
  descricaoCobertura: string[];
};

export default function InsuranceForm() {
  const [result, setResult] = useState<InsuranceResult | null>(null);
  const { toast } = useToast();
  
  const {
    secureSubmit,
    isSubmitting,
    isLimited,
    CsrfInput,
  } = useSecureForm({
    formId: 'insurance-form',
    rateLimiterOptions: {
      maxAttempts: 10,
      timeWindowMs: 60000
    }
  });
  
  const form = useForm<z.infer<typeof insuranceSchema>>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: {
      valorVeiculo: 50000,
      anoVeiculo: 2020,
      tipoVeiculo: "hatch",
      cep: "",
      idadeCondutor: 30,
      sexoCondutor: "masculino",
      tempoHabilitacao: 10,
      usoVeiculo: "particular",
      garagem: false,
      alarme: false,
      rastreador: false,
      coberturaTerceiros: true,
      coberturaRoubo: true,
      coberturaColisao: true,
      coberturaIncendio: true,
      assistencia24h: true,
      carroReserva: false,
      vidros: false,
      franquia: "media"
    },
  });

  function calcularSeguro(values: z.infer<typeof insuranceSchema>): InsuranceResult {
    // Base de cálculo: 3-8% do valor do veículo
    let taxaBase = 0.05; // 5% base
    
    // Fator idade do veículo
    const idadeVeiculo = new Date().getFullYear() - values.anoVeiculo;
    const fatorIdadeVeiculo = Math.max(0.8, 1 - (idadeVeiculo * 0.02));
    
    // Fator tipo de veículo
    const fatoresTipoVeiculo = {
      hatch: 1.0,
      sedan: 1.1,
      suv: 1.3,
      pickup: 1.2,
      esportivo: 1.8,
      luxo: 2.0
    };
    
    // Fator idade do condutor
    let fatorIdade = 1.0;
    if (values.idadeCondutor < 25) fatorIdade = 1.5;
    else if (values.idadeCondutor < 30) fatorIdade = 1.2;
    else if (values.idadeCondutor > 60) fatorIdade = 1.1;
    
    // Fator sexo (estatísticas de sinistralidade)
    const fatorSexo = values.sexoCondutor === "masculino" ? 1.1 : 0.95;
    
    // Fator tempo de habilitação
    let fatorHabilitacao = 1.0;
    if (values.tempoHabilitacao < 2) fatorHabilitacao = 1.4;
    else if (values.tempoHabilitacao < 5) fatorHabilitacao = 1.2;
    else if (values.tempoHabilitacao > 20) fatorHabilitacao = 0.9;
    
    // Fator uso do veículo
    const fatoresUso = {
      particular: 1.0,
      trabalho: 1.2,
      uber: 1.8,
      comercial: 1.5
    };
    
    // Fator região (baseado no CEP)
    let fatorRegiao = 1.0;
    const cepNumerico = parseInt(values.cep.replace("-", ""));
    if (cepNumerico >= 1000 && cepNumerico <= 19999) fatorRegiao = 1.4; // SP
    else if (cepNumerico >= 20000 && cepNumerico <= 28999) fatorRegiao = 1.3; // RJ
    else if (cepNumerico >= 30000 && cepNumerico <= 39999) fatorRegiao = 1.1; // MG
    else if (cepNumerico >= 40000 && cepNumerico <= 48999) fatorRegiao = 1.0; // BA
    else if (cepNumerico >= 80000 && cepNumerico <= 87999) fatorRegiao = 1.0; // PR
    else fatorRegiao = 0.9; // Outras regiões
    
    // Descontos por segurança
    let descontoSeguranca = 1.0;
    if (values.garagem) descontoSeguranca -= 0.05;
    if (values.alarme) descontoSeguranca -= 0.03;
    if (values.rastreador) descontoSeguranca -= 0.08;
    
    // Cálculo do prêmio base
    const premioBase = values.valorVeiculo * taxaBase * 
      fatorIdadeVeiculo * 
      fatoresTipoVeiculo[values.tipoVeiculo] * 
      fatorIdade * 
      fatorSexo * 
      fatorHabilitacao * 
      fatoresUso[values.usoVeiculo] * 
      fatorRegiao * 
      descontoSeguranca;
    
    // Adicionar coberturas opcionais
    let adicionalCoberturas = 0;
    if (values.carroReserva) adicionalCoberturas += premioBase * 0.15;
    if (values.vidros) adicionalCoberturas += premioBase * 0.10;
    
    const premioTotal = premioBase + adicionalCoberturas;
    
    // Cálculo da franquia
    const valoresFranquia = {
      baixa: values.valorVeiculo * 0.005, // 0.5%
      media: values.valorVeiculo * 0.01,  // 1%
      alta: values.valorVeiculo * 0.02    // 2%
    };
    
    // Ajuste do prêmio baseado na franquia
    const ajusteFranquia = {
      baixa: 1.2,
      media: 1.0,
      alta: 0.85
    };
    
    const premioFinal = premioTotal * ajusteFranquia[values.franquia];
    
    // Coberturas detalhadas
    const coberturas = {
      terceiros: values.coberturaTerceiros ? 100000 : 0, // R$ 100k padrão DPVAT
      rouboFurto: values.coberturaRoubo ? values.valorVeiculo : 0,
      colisao: values.coberturaColisao ? values.valorVeiculo : 0,
      incendio: values.coberturaIncendio ? values.valorVeiculo : 0,
      assistencia: values.assistencia24h ? 5000 : 0,
      ...(values.carroReserva && { carroReserva: 30 }), // 30 dias
      ...(values.vidros && { vidros: values.valorVeiculo * 0.1 })
    };
    
    // Descrição das coberturas
    const descricaoCobertura = [];
    if (values.coberturaTerceiros) descricaoCobertura.push("Responsabilidade Civil (Terceiros)");
    if (values.coberturaRoubo) descricaoCobertura.push("Roubo e Furto");
    if (values.coberturaColisao) descricaoCobertura.push("Colisão e Capotagem");
    if (values.coberturaIncendio) descricaoCobertura.push("Incêndio e Raio");
    if (values.assistencia24h) descricaoCobertura.push("Assistência 24h");
    if (values.carroReserva) descricaoCobertura.push("Carro Reserva (30 dias)");
    if (values.vidros) descricaoCobertura.push("Vidros");
    
    return {
      premioTotal: premioFinal,
      premioMensal: premioFinal / 12,
      franquiaValor: valoresFranquia[values.franquia],
      coberturas,
      fatoresRisco: {
        idade: fatorIdade,
        veiculo: fatoresTipoVeiculo[values.tipoVeiculo],
        regiao: fatorRegiao,
        uso: fatoresUso[values.usoVeiculo],
        seguranca: descontoSeguranca
      },
      descricaoCobertura
    };
  }

  function onSubmit(values: z.infer<typeof insuranceSchema>) {
    secureSubmit((secureValues) => {
      try {
        const valorVeiculo = validateNumberRange(
          Number(secureValues.valorVeiculo), 
          10000, 
          2000000, 
          50000
        );
        
        const idadeCondutor = validateNumberRange(
          Number(secureValues.idadeCondutor), 
          18, 
          80, 
          30
        );
        
        const resultado = calcularSeguro({
          ...secureValues,
          valorVeiculo,
          idadeCondutor
        } as z.infer<typeof insuranceSchema>);
        
        setResult(resultado);
        
        setTimeout(() => {
          const resultElement = document.getElementById("resultado-seguro");
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } catch (error) {
        console.error("Erro ao calcular seguro:", error);
        toast({
          title: "Erro ao calcular",
          description: "Ocorreu um erro ao processar sua simulação. Tente novamente.",
          variant: "destructive",
        });
      }
    }, values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
          <CsrfInput />
          
          {isLimited && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-start">
              <ShieldAlert className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Detectamos muitas solicitações em um curto período. Por favor, aguarde alguns instantes antes de tentar novamente.
              </p>
            </div>
          )}
          
          {/* Dados do Veículo */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Dados do Veículo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="valorVeiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do veículo (R$)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">R$</span>
                        <Input
                          type="number"
                          placeholder="50000"
                          className="pl-10"
                          min="10000"
                          max="2000000"
                          step="1000"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="anoVeiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano do veículo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2020"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipoVeiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo do veículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hatch">Hatch</SelectItem>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="esportivo">Esportivo</SelectItem>
                        <SelectItem value="luxo">Luxo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Dados do Condutor */}
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-green-800 mb-4">Dados do Condutor Principal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="idadeCondutor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        min="18"
                        max="80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sexoCondutor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tempoHabilitacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo de habilitação (anos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        min="0"
                        max="60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00000-000"
                        maxLength={9}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Uso e Segurança */}
          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-orange-800 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Uso e Segurança
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  control={form.control}
                  name="usoVeiculo"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Uso do veículo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="particular">Particular</SelectItem>
                          <SelectItem value="trabalho">Trabalho</SelectItem>
                          <SelectItem value="uber">Uber/App</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="franquia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Franquia</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa (0,5% do valor)</SelectItem>
                          <SelectItem value="media">Média (1% do valor)</SelectItem>
                          <SelectItem value="alta">Alta (2% do valor)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-orange-800">Itens de segurança:</p>
                
                <FormField
                  control={form.control}
                  name="garagem"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Garagem fechada (-5%)</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="alarme"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Alarme (-3%)</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rastreador"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Rastreador (-8%)</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Coberturas */}
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-purple-800 mb-4">Coberturas Desejadas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-purple-800">Coberturas básicas:</p>
                
                <FormField
                  control={form.control}
                  name="coberturaTerceiros"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Responsabilidade Civil (Terceiros)</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="coberturaRoubo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Roubo e Furto</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="coberturaColisao"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Colisão e Capotagem</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="coberturaIncendio"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Incêndio e Raio</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-purple-800">Coberturas adicionais:</p>
                
                <FormField
                  control={form.control}
                  name="assistencia24h"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Assistência 24h</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="carroReserva"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Carro Reserva (+15%)</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vidros"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Vidros (+10%)</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
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
                <Calculator className="h-5 w-5 mr-2" />
              )}
              Calcular Seguro
            </Button>
          </div>
        </form>
      </Form>
      
      {result && (
        <div id="resultado-seguro" className="mb-8">
          <h3 className="font-heading text-xl font-semibold text-primary mb-4">Resultado da Simulação de Seguro</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-100 p-4 rounded-md border border-green-200">
              <p className="text-sm text-green-700 mb-1">Prêmio Anual</p>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.premioTotal)}
              </p>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">Prêmio Mensal</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.premioMensal)}
              </p>
            </div>
            
            <div className="bg-orange-100 p-4 rounded-md border border-orange-200">
              <p className="text-sm text-orange-700 mb-1">Franquia</p>
              <p className="text-2xl font-bold text-orange-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.franquiaValor)}
              </p>
            </div>
          </div>
          
          {/* Coberturas */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">Coberturas Incluídas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.descricaoCobertura.map((cobertura, index) => (
                <div key={index} className="flex items-center">
                  <Shield className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">{cobertura}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Fatores de Risco */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">Fatores que Influenciaram o Preço</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Perfil do Condutor</p>
                <p className="text-lg font-semibold">{(result.fatoresRisco.idade * 100 - 100).toFixed(0)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Tipo do Veículo</p>
                <p className="text-lg font-semibold">{(result.fatoresRisco.veiculo * 100 - 100).toFixed(0)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Região</p>
                <p className="text-lg font-semibold">{(result.fatoresRisco.regiao * 100 - 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600 italic">* Esta é uma simulação aproximada. Os valores reais podem variar conforme a seguradora e análise de risco detalhada.</p>
              
              <ExportButtons 
                data={[{
                  item: "Prêmio Anual",
                  valor: result.premioTotal
                }, {
                  item: "Prêmio Mensal", 
                  valor: result.premioMensal
                }, {
                  item: "Franquia",
                  valor: result.franquiaValor
                }]}
                fileName="simulacao-seguro-automovel"
                title="Simulação de Seguro de Automóvel"
                summary={{
                  valorVeiculo: form.getValues().valorVeiculo,
                  anoVeiculo: form.getValues().anoVeiculo,
                  tipoVeiculo: form.getValues().tipoVeiculo,
                  idadeCondutor: form.getValues().idadeCondutor,
                  premioAnual: result.premioTotal,
                  premioMensal: result.premioMensal,
                  franquia: result.franquiaValor
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}