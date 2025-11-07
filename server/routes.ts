import type { Express } from "express";
import { createServer, type Server } from "http";
import { TabelaItem, calcularPrestacao, calcularTotalJuros, calcularTotalPagar, gerarTabelaPrice, gerarTabelaSAC } from "../client/src/utils/finance";
import { calculatorSchema } from "@shared/schema";
import { z } from "zod";
import { registerSimuladorTestRoutes } from "./routes/simulador-test";
import { registerSimuladorCaminhaoRoutes } from "./routes/simulador-caminhao";
import { registerSimuladorMotoRoutes } from "./routes/simulador-moto";
import { registerSimuladorGratisRoutes } from "./routes/simulador-gratis";

export async function registerRoutes(app: Express): Promise<Server> {
  // API para cálculo de financiamentos usando Tabela Price
  app.post("/api/simulador/calcular", async (req, res) => {
    try {
      // Validar os dados de entrada (incluindo o campo opcional incluirIOF)
      const calculatorSchemaWithIOF = calculatorSchema.extend({
        incluirIOF: z.boolean().optional().default(false)
      });
      
      const { valorFinanciado, taxaJuros, numParcelas, incluirIOF } = calculatorSchemaWithIOF.parse(req.body);
      
      // Calcular IOF se solicitado (aproximadamente 3,38% do valor financiado para financiamentos de 36-60 meses)
      let valorIOF = 0;
      let valorFinanciadoTotal = valorFinanciado;
      
      if (incluirIOF) {
        // Taxa diária de IOF: 0,0082% ao dia, limitado a 365 dias
        const diasIOF = Math.min(numParcelas * 30, 365); // Converte meses em dias, limitado a 365
        const taxaIOFDiaria = 0.0082 / 100; // 0,0082% ao dia
        const iofDiario = valorFinanciado * taxaIOFDiaria * diasIOF;
        
        // Taxa adicional de IOF: 0,38% sobre o valor da operação
        const taxaIOFAdicional = 0.38 / 100; // 0,38% sobre o valor da operação
        const iofAdicional = valorFinanciado * taxaIOFAdicional;
        
        // IOF total
        valorIOF = iofDiario + iofAdicional;
        valorFinanciadoTotal = valorFinanciado + valorIOF;
      }
      
      // Calcular a prestação (usando o valor financiado + IOF se incluído)
      const valorParcela = calcularPrestacao(valorFinanciadoTotal, taxaJuros, numParcelas);
      
      // Calcular o total a pagar
      const totalPagar = calcularTotalPagar(valorParcela, numParcelas);
      
      // Calcular o total de juros (considerando valor financiado sem IOF)
      const totalJuros = calcularTotalJuros(totalPagar, valorFinanciado);
      
      // Gerar a tabela de amortização
      const tabelaAmortizacao = gerarTabelaPrice(valorFinanciadoTotal, taxaJuros, numParcelas);
      
      // Preparar resultado
      const result: any = {
        valorParcela,
        totalPagar,
        totalJuros,
        tabelaAmortizacao
      };
      
      // Adicionar valorIOF ao resultado se solicitado
      if (incluirIOF) {
        result.valorIOF = valorIOF;
      }
      
      // Retornar os resultados
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao processar a solicitação" });
      }
    }
  });
  
  // API para cálculo de financiamento imobiliário (pode usar Price ou SAC)
  app.post("/api/simulador/imobiliario", async (req, res) => {
    try {
      // Validar os dados de entrada com extensão para o sistema
      const schema = calculatorSchema.extend({
        sistema: z.enum(["price", "sac"])
      });
      
      const { valorFinanciado, taxaJuros, numParcelas, sistema } = schema.parse(req.body);
      
      let valorParcela: number;
      let tabelaAmortizacao: TabelaItem[];
      
      // Calcular de acordo com o sistema escolhido
      if (sistema === "price") {
        valorParcela = calcularPrestacao(valorFinanciado, taxaJuros, numParcelas);
        tabelaAmortizacao = gerarTabelaPrice(valorFinanciado, taxaJuros, numParcelas);
      } else {
        // Para o SAC, usamos a primeira parcela como referência (maior valor)
        tabelaAmortizacao = gerarTabelaSAC(valorFinanciado, taxaJuros, numParcelas);
        valorParcela = tabelaAmortizacao[1].valorParcela; // índice 1 é a primeira parcela (índice 0 é o estado inicial)
      }
      
      // Calcular o total a pagar (somando todas as parcelas para o SAC, que tem parcelas decrescentes)
      const totalPagar = sistema === "price" 
        ? calcularTotalPagar(valorParcela, numParcelas)
        : tabelaAmortizacao.reduce((sum, item) => sum + item.valorParcela, 0);
      
      // Calcular o total de juros
      const totalJuros = calcularTotalJuros(totalPagar, valorFinanciado);
      
      // Retornar os resultados
      res.json({
        valorParcela,
        totalPagar,
        totalJuros,
        tabelaAmortizacao
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao processar a solicitação" });
      }
    }
  });
  
  // API para cálculo de empréstimo pessoal
  app.post("/api/simulador/pessoal", async (req, res) => {
    try {
      // Validar os dados de entrada
      const { valorFinanciado, taxaJuros, numParcelas } = calculatorSchema.parse(req.body);
      
      // Calcular a prestação
      const valorParcela = calcularPrestacao(valorFinanciado, taxaJuros, numParcelas);
      
      // Calcular o total a pagar
      const totalPagar = calcularTotalPagar(valorParcela, numParcelas);
      
      // Calcular o total de juros
      const totalJuros = calcularTotalJuros(totalPagar, valorFinanciado);
      
      // Gerar a tabela de amortização
      const tabelaAmortizacao = gerarTabelaPrice(valorFinanciado, taxaJuros, numParcelas);
      
      // Retornar os resultados
      res.json({
        valorParcela,
        totalPagar,
        totalJuros,
        tabelaAmortizacao
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao processar a solicitação" });
      }
    }
  });
  
  // API para cálculo de crédito consignado
  app.post("/api/simulador/consignado", async (req, res) => {
    try {
      // Validar os dados de entrada com extensão para o tipo de consignado
      const schema = calculatorSchema.extend({
        tipoConsignado: z.enum(["inss", "servidor", "militar"])
      });
      
      const { valorFinanciado, taxaJuros, numParcelas } = schema.parse(req.body);
      
      // Calcular a prestação
      const valorParcela = calcularPrestacao(valorFinanciado, taxaJuros, numParcelas);
      
      // Calcular o total a pagar
      const totalPagar = calcularTotalPagar(valorParcela, numParcelas);
      
      // Calcular o total de juros
      const totalJuros = calcularTotalJuros(totalPagar, valorFinanciado);
      
      // Gerar a tabela de amortização
      const tabelaAmortizacao = gerarTabelaPrice(valorFinanciado, taxaJuros, numParcelas);
      
      // Retornar os resultados
      res.json({
        valorParcela,
        totalPagar,
        totalJuros,
        tabelaAmortizacao
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro ao processar a solicitação" });
      }
    }
  });

  registerSimuladorTestRoutes(app);
  registerSimuladorCaminhaoRoutes(app);
  registerSimuladorMotoRoutes(app);
  registerSimuladorGratisRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
