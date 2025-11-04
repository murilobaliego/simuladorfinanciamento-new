import type { Express } from "express";
import { z } from "zod";

const calculoSchema = z.object({
  valorVeiculo: z.number().min(5000).max(10000000),
  valorEntrada: z.number().min(0),
  numParcelas: z.number().min(6).max(120),
  taxaJuros: z.number().min(0.1).max(5),
});

function calcularFinanciamento(
  valorVeiculo: number,
  valorEntrada: number,
  numParcelas: number,
  taxaJuros: number
) {
  const valorFinanciado = valorVeiculo - valorEntrada;
  const taxaMensal = taxaJuros / 100;
  
  const valorParcela = valorFinanciado * 
    (taxaMensal * Math.pow(1 + taxaMensal, numParcelas)) / 
    (Math.pow(1 + taxaMensal, numParcelas) - 1);
  
  const totalPagar = valorParcela * numParcelas;
  const totalJuros = totalPagar - valorFinanciado;
  
  return {
    valorFinanciado,
    valorParcela,
    totalPagar,
    totalJuros,
  };
}

export function registerSimuladorTestRoutes(app: Express) {
  app.post("/api/simulador-test/calcular", async (req, res) => {
    try {
      const dados = calculoSchema.parse(req.body);
      
      if (dados.valorEntrada >= dados.valorVeiculo) {
        return res.status(400).json({ 
          error: "Valor da entrada deve ser menor que o valor do veículo" 
        });
      }
      
      const resultado = calcularFinanciamento(
        dados.valorVeiculo,
        dados.valorEntrada,
        dados.numParcelas,
        dados.taxaJuros
      );
      
      res.json(resultado);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao calcular" });
    }
  });
}
