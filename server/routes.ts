import type { Express } from "express";
import { createServer, type Server } from "http";
import { TabelaItem, calcularPrestacao, calcularTotalJuros, calcularTotalPagar, gerarTabelaPrice, gerarTabelaSAC } from "../client/src/utils/finance";
import { calculatorSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API para cálculo de financiamentos usando Tabela Price
  app.post("/api/simulador/calcular", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
