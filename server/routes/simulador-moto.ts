import { Express } from "express";
import { z } from "zod";

const calculoSchema = z.object({
  valorFinanciado: z.number().min(5000).max(100000),
  taxaJuros: z.number().min(0.5).max(4),
  numParcelas: z.number().min(12).max(60),
  incluirIOF: z.boolean().optional().default(false),
  cilindrada: z.enum(["ate-150", "150-500", "acima-500"]),
  usada: z.boolean().optional().default(false)
});

function calcularTaxaAjustada(cilindrada: string, usada: boolean, taxaBase: number): number {
  const TAXA_PADRAO = 1.85;
  let taxa = taxaBase || TAXA_PADRAO;
  
  if (cilindrada === "ate-150") {
    taxa = TAXA_PADRAO - 0.05;
  } else if (cilindrada === "acima-500") {
    taxa = TAXA_PADRAO - 0.10;
  } else {
    taxa = TAXA_PADRAO;
  }
  
  if (usada) {
    taxa += 0.35;
  }
  
  return Number(taxa.toFixed(2));
}

function calcularFinanciamentoMoto(
  valorFinanciado: number,
  taxaJuros: number,
  numParcelas: number,
  incluirIOF: boolean
) {
  let valorFinanciadoTotal = valorFinanciado;
  let valorIOF = 0;
  
  if (incluirIOF) {
    const diasFinanciamento = Math.min(numParcelas * 30, 365);
    const iofDiario = valorFinanciado * (0.0082 / 100) * diasFinanciamento;
    const iofFixo = valorFinanciado * (0.38 / 100);
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
  
  return {
    valorParcela,
    totalPagar,
    totalJuros,
    tabelaAmortizacao,
    ...(incluirIOF && { valorIOF })
  };
}

export function registerSimuladorMotoRoutes(app: Express) {
  app.post("/api/simulador-moto/calcular", async (req, res) => {
    try {
      const dados = calculoSchema.parse(req.body);
      
      const taxaAjustada = calcularTaxaAjustada(dados.cilindrada, dados.usada || false, dados.taxaJuros);
      
      const resultado = calcularFinanciamentoMoto(
        dados.valorFinanciado,
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
