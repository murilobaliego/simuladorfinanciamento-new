import { Express } from "express";
import { z } from "zod";

const calculoSchema = z.object({
  valorVeiculo: z.number().min(5000).max(10000000),
  valorEntrada: z.number().min(0),
  taxaAbertura: z.number().min(0).max(50000),
  taxaJuros: z.number().min(0.1).max(5),
  numParcelas: z.number().min(6).max(120),
  incluirIOF: z.boolean().optional().default(false)
});

function calcularCET(valorLiquidoRecebido: number, valorParcela: number, numParcelas: number): number {
  let cet = 0.02;
  const maxIteracoes = 100;
  const tolerancia = 0.0001;
  
  for (let i = 0; i < maxIteracoes; i++) {
    let vp = 0;
    let dvp = 0;
    
    for (let n = 1; n <= numParcelas; n++) {
      const fator = Math.pow(1 + cet, n);
      vp += valorParcela / fator;
      dvp -= n * valorParcela / (fator * (1 + cet));
    }
    
    const f = vp - valorLiquidoRecebido;
    
    if (Math.abs(f) < tolerancia) {
      return cet * 100;
    }
    
    cet = cet - f / dvp;
    
    if (cet < 0) cet = 0.001;
  }
  
  return cet * 100;
}

function calcularFinanciamentoGratis(
  valorVeiculo: number,
  valorEntrada: number,
  taxaAbertura: number,
  taxaJuros: number,
  numParcelas: number,
  incluirIOF: boolean
) {
  const valorFinanciadoBase = valorVeiculo - valorEntrada;
  let valorFinanciadoTotal = valorFinanciadoBase + taxaAbertura;
  
  let valorIOF = 0;
  if (incluirIOF) {
    const diasFinanciamento = Math.min(numParcelas * 30, 365);
    const iofDiario = valorFinanciadoTotal * (0.0082 / 100) * diasFinanciamento;
    const iofFixo = valorFinanciadoTotal * (0.38 / 100);
    valorIOF = iofDiario + iofFixo;
    valorFinanciadoTotal += valorIOF;
  }
  
  const taxaMensal = taxaJuros / 100;
  const valorParcela = valorFinanciadoTotal * (taxaMensal * Math.pow(1 + taxaMensal, numParcelas)) / (Math.pow(1 + taxaMensal, numParcelas) - 1);
  const totalPagar = valorParcela * numParcelas;
  const totalJuros = totalPagar - valorFinanciadoTotal;
  
  const tabelaAmortizacao = [];
  let saldoDevedor = valorFinanciadoTotal;
  
  for (let i = 1; i <= numParcelas; i++) {
    const juros = saldoDevedor * taxaMensal;
    const amortizacao = valorParcela - juros;
    saldoDevedor -= amortizacao;
    
    tabelaAmortizacao.push({
      parcela: i,
      valorParcela,
      amortizacao,
      juros,
      saldoDevedor: Math.max(0, saldoDevedor)
    });
  }
  
  const taxaCET = calcularCET(valorFinanciadoBase, valorParcela, numParcelas);
  const taxaCETAnual = (Math.pow(1 + taxaCET / 100, 12) - 1) * 100;
  
  return {
    valorParcela,
    totalPagar,
    totalJuros,
    tabelaAmortizacao,
    taxaCET,
    taxaCETAnual,
    ...(incluirIOF && { valorIOF })
  };
}

export function registerSimuladorGratisRoutes(app: Express) {
  app.post("/api/simulador-gratis/calcular", async (req, res) => {
    try {
      const dados = calculoSchema.parse(req.body);
      
      if (dados.valorEntrada >= dados.valorVeiculo) {
        return res.status(400).json({ error: "O valor da entrada deve ser menor que o valor do veículo" });
      }
      
      const resultado = calcularFinanciamentoGratis(
        dados.valorVeiculo,
        dados.valorEntrada,
        dados.taxaAbertura,
        dados.taxaJuros,
        dados.numParcelas,
        dados.incluirIOF
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
