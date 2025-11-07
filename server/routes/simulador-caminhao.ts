import { Express } from "express";
import { z } from "zod";

const calculoSchema = z.object({
  valorCaminhao: z.number().min(50000).max(10000000),
  valorEntrada: z.number().min(0),
  numParcelas: z.number().min(6).max(120),
  taxaJuros: z.number().min(0.1).max(4),
  incluirIOF: z.boolean().optional().default(false),
  tipoVeiculo: z.enum(["leve", "medio", "pesado", "extra-pesado", "implemento"])
});

function calcularTaxaPorTipo(tipoVeiculo: string): number {
  const TAXA_PADRAO = 1.58;
  
  switch (tipoVeiculo) {
    case "leve": return TAXA_PADRAO - 0.03;
    case "medio": return TAXA_PADRAO - 0.01;
    case "pesado": return TAXA_PADRAO;
    case "extra-pesado": return TAXA_PADRAO + 0.05;
    case "implemento": return TAXA_PADRAO + 0.02;
    default: return TAXA_PADRAO;
  }
}

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

function calcularFinanciamentoCaminhao(
  valorCaminhao: number,
  valorEntrada: number,
  taxaJuros: number,
  numParcelas: number,
  incluirIOF: boolean
) {
  const valorFinanciadoBase = valorCaminhao - valorEntrada;
  let valorFinanciadoTotal = valorFinanciadoBase;
  
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
  
  return {
    valorFinanciado: valorFinanciadoBase,
    valorParcela,
    totalPagar,
    totalJuros,
    tabelaAmortizacao,
    ...(incluirIOF && { valorIOF }),
    taxaCET
  };
}

export function registerSimuladorCaminhaoRoutes(app: Express) {
  app.post("/api/simulador-caminhao/calcular", async (req, res) => {
    try {
      const dados = calculoSchema.parse(req.body);
      
      if (dados.valorEntrada >= dados.valorCaminhao) {
        return res.status(400).json({
          error: "Valor da entrada deve ser menor que o valor do caminhão"
        });
      }
      
      const taxaAjustada = calcularTaxaPorTipo(dados.tipoVeiculo);
      
      const resultado = calcularFinanciamentoCaminhao(
        dados.valorCaminhao,
        dados.valorEntrada,
        taxaAjustada,
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
