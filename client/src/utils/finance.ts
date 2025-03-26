/**
 * Calcula a prestação de um financiamento usando o sistema de Tabela Price
 * @param valorFinanciado Valor total a ser financiado
 * @param taxaJuros Taxa de juros mensal (em percentual, ex: 1.5 para 1.5%)
 * @param numParcelas Número total de parcelas
 * @returns O valor da prestação mensal
 */
export function calcularPrestacao(
  valorFinanciado: number,
  taxaJuros: number,
  numParcelas: number
): number {
  const i = taxaJuros / 100;
  return valorFinanciado * ((i * Math.pow(1 + i, numParcelas)) / (Math.pow(1 + i, numParcelas) - 1));
}

export type TabelaItem = {
  parcela: number;
  valorParcela: number;
  amortizacao: number;
  juros: number;
  saldoDevedor: number;
};

/**
 * Gera a tabela de amortização pelo sistema Price (parcelas fixas)
 * @param valorFinanciado Valor total a ser financiado
 * @param taxaJuros Taxa de juros mensal (em percentual, ex: 1.5 para 1.5%)
 * @param numParcelas Número total de parcelas
 * @returns Array contendo a tabela de amortização completa
 */
export function gerarTabelaPrice(
  valorFinanciado: number,
  taxaJuros: number,
  numParcelas: number
): TabelaItem[] {
  const tabela: TabelaItem[] = [];
  const i = taxaJuros / 100;
  const prestacao = calcularPrestacao(valorFinanciado, taxaJuros, numParcelas);
  let saldoDevedor = valorFinanciado;
  
  // Adiciona a linha inicial (parcela 0)
  tabela.push({
    parcela: 0,
    valorParcela: 0,
    amortizacao: 0,
    juros: 0,
    saldoDevedor: saldoDevedor
  });
  
  // Gera as linhas para cada parcela
  for (let parcela = 1; parcela <= numParcelas; parcela++) {
    const juros = saldoDevedor * i;
    const amortizacao = prestacao - juros;
    saldoDevedor -= amortizacao;
    
    tabela.push({
      parcela,
      valorParcela: prestacao,
      amortizacao,
      juros,
      saldoDevedor: Math.max(0, saldoDevedor) // Evita saldo devedor negativo nos arredondamentos
    });
  }
  
  return tabela;
}

/**
 * Gera a tabela de amortização pelo sistema SAC (amortização constante)
 * @param valorFinanciado Valor total a ser financiado
 * @param taxaJuros Taxa de juros mensal (em percentual, ex: 1.5 para 1.5%)
 * @param numParcelas Número total de parcelas
 * @returns Array contendo a tabela de amortização completa
 */
export function gerarTabelaSAC(
  valorFinanciado: number,
  taxaJuros: number,
  numParcelas: number
): TabelaItem[] {
  const tabela: TabelaItem[] = [];
  const i = taxaJuros / 100;
  const amortizacaoConstante = valorFinanciado / numParcelas;
  let saldoDevedor = valorFinanciado;
  
  // Adiciona a linha inicial (parcela 0)
  tabela.push({
    parcela: 0,
    valorParcela: 0,
    amortizacao: 0,
    juros: 0,
    saldoDevedor: saldoDevedor
  });
  
  // Gera as linhas para cada parcela
  for (let parcela = 1; parcela <= numParcelas; parcela++) {
    const juros = saldoDevedor * i;
    const valorParcela = amortizacaoConstante + juros;
    saldoDevedor -= amortizacaoConstante;
    
    tabela.push({
      parcela,
      valorParcela,
      amortizacao: amortizacaoConstante,
      juros,
      saldoDevedor: Math.max(0, saldoDevedor) // Evita saldo devedor negativo nos arredondamentos
    });
  }
  
  return tabela;
}

/**
 * Calcula o valor total a ser pago em um financiamento
 * @param valorParcela Valor da parcela mensal
 * @param numParcelas Número total de parcelas
 * @returns O valor total a ser pago (parcela × número de parcelas)
 */
export function calcularTotalPagar(valorParcela: number, numParcelas: number): number {
  return valorParcela * numParcelas;
}

/**
 * Calcula o total de juros a ser pago em um financiamento
 * @param totalPagar Valor total a ser pago
 * @param valorFinanciado Valor total financiado
 * @returns O total de juros a ser pago (diferença entre total pago e valor financiado)
 */
export function calcularTotalJuros(totalPagar: number, valorFinanciado: number): number {
  return totalPagar - valorFinanciado;
}
