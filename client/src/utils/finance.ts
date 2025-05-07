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

/**
 * Calcula o valor do IOF para financiamento de veículos
 * @param valorFinanciado Valor total a ser financiado
 * @param numParcelas Número total de parcelas (meses)
 * @returns O valor do IOF a ser adicionado ao financiamento
 */
export function calcularIOF(valorFinanciado: number, numParcelas: number): number {
  // Taxa diária de IOF: 0,0082% ao dia, limitado a 365 dias
  const diasIOF = Math.min(numParcelas * 30, 365); // Converte meses em dias, limitado a 365
  const taxaIOFDiaria = 0.0082 / 100; // 0,0082% ao dia
  const iofDiario = valorFinanciado * taxaIOFDiaria * diasIOF;
  
  // Taxa adicional de IOF: 0,38% sobre o valor da operação
  const taxaIOFAdicional = 0.38 / 100; // 0,38% sobre o valor da operação
  const iofAdicional = valorFinanciado * taxaIOFAdicional;
  
  // IOF total
  return iofDiario + iofAdicional;
}

/**
 * Simula um financiamento completo com base nos parâmetros fornecidos
 * @param valorFinanciado Valor total a ser financiado
 * @param taxaJuros Taxa de juros mensal (em percentual)
 * @param numParcelas Número total de parcelas
 * @param incluirIOF Se deve incluir o IOF no cálculo
 * @param sistema Sistema de amortização (price ou sac)
 * @returns Resultado completo da simulação
 */
/**
 * Calcula o Custo Efetivo Total (CET) de um financiamento
 * @param valorFinanciado Valor total a ser financiado (sem IOF)
 * @param valorParcela Valor da parcela mensal
 * @param numParcelas Número total de parcelas
 * @param valorIOF Valor do IOF, se aplicável
 * @param tarifas Valor de tarifas e seguros, se aplicável
 * @returns Taxa efetiva mensal (em percentual)
 */
export function calcularCET(
  valorFinanciado: number,
  valorParcela: number, 
  numParcelas: number,
  valorIOF: number = 0,
  tarifas: number = 0,
  valorParcelaBalao: number = 0
): number {
  // Valor total desembolsado pelo cliente (incluindo IOF e tarifas)
  const valorDesembolsado = valorFinanciado + valorIOF + tarifas;
  
  // Função auxiliar para calcular o Valor Presente Líquido (VPL)
  const calcularVPL = (taxa: number): number => {
    let vpn = -valorDesembolsado;
    for (let i = 1; i <= numParcelas; i++) {
      vpn += valorParcela / Math.pow(1 + taxa, i);
    }
    // Adicionar a parcela balão no fluxo, se existir
    if (valorParcelaBalao > 0) {
      vpn += valorParcelaBalao / Math.pow(1 + taxa, numParcelas + 1);
    }
    return vpn;
  };
  
  // Encontrar o CET usando o método da bissecção
  let taxaMin = 0.001; // 0.1% ao mês
  let taxaMax = 0.20;  // 20% ao mês (limite superior razoável)
  let taxa = (taxaMin + taxaMax) / 2;
  let vpn = calcularVPL(taxa);
  
  // Precisão desejada
  const epsilon = 0.0001;
  
  // Máximo de iterações para evitar loops infinitos
  const maxIteracoes = 100;
  let iteracao = 0;
  
  while (Math.abs(vpn) > epsilon && iteracao < maxIteracoes) {
    if (vpn > 0) {
      taxaMin = taxa;
    } else {
      taxaMax = taxa;
    }
    
    taxa = (taxaMin + taxaMax) / 2;
    vpn = calcularVPL(taxa);
    iteracao++;
  }
  
  // Converter a taxa decimal para percentual
  return taxa * 100;
}

/**
 * Simula um financiamento com parcela balão (parcela final maior)
 * @param valorFinanciado Valor total a ser financiado
 * @param taxaJuros Taxa de juros mensal (em percentual)
 * @param numParcelas Número de parcelas mensais regulares
 * @param percentualBalao Percentual do valor financiado a ser pago na parcela balão final
 * @param incluirIOF Se deve incluir o IOF no cálculo
 * @returns Resultado completo da simulação com parcela balão
 */
export function simularFinanciamentoBalao(
  valorFinanciado: number,
  taxaJuros: number,
  numParcelas: number,
  percentualBalao: number,
  incluirIOF: boolean = false
): {
  valorParcela: number;
  valorParcelaBalao: number;
  totalPagar: number;
  totalJuros: number;
  percentualBalao: number;
  tabelaAmortizacao: TabelaItem[];
  valorIOF?: number;
  taxaCET: number;
} {
  // Converter taxa de percentual para decimal
  const taxa = taxaJuros / 100;
  
  // Calcular valor da parcela balão (percentual do valor financiado)
  const valorParcelaBalao = valorFinanciado * (percentualBalao / 100);
  
  // Valor presente da parcela balão
  const valorPresenteBalao = valorParcelaBalao / Math.pow(1 + taxa, numParcelas);
  
  // Valor a ser financiado nas parcelas mensais regulares
  const valorFinanciadoSemBalao = valorFinanciado - valorPresenteBalao;
  
  let valorComIOF = valorFinanciado;
  let valorIOF: number | undefined = undefined;
  
  // Se deve incluir IOF no financiamento
  if (incluirIOF) {
    valorIOF = calcularIOF(valorFinanciado, numParcelas + 1); // +1 para incluir a parcela balão
    valorComIOF += valorIOF;
    
    // Recalcular proporcionalmente com IOF
    const valorParcelaBalaoComIOF = valorParcelaBalao * (valorComIOF / valorFinanciado);
    const valorPresenteBalaoComIOF = valorParcelaBalaoComIOF / Math.pow(1 + taxa, numParcelas);
    const valorFinanciadoSemBalaoComIOF = valorComIOF - valorPresenteBalaoComIOF;
    
    // Calcular parcela regular com base no valor ajustado
    const valorParcela = calcularPrestacao(valorFinanciadoSemBalaoComIOF, taxaJuros, numParcelas);
    
    // Gerar tabela de amortização
    const tabelaAmortizacao: TabelaItem[] = [];
    let saldoDevedor = valorComIOF;
    
    // Linha inicial (parcela 0)
    tabelaAmortizacao.push({
      parcela: 0,
      valorParcela: 0,
      amortizacao: 0,
      juros: 0,
      saldoDevedor: saldoDevedor
    });
    
    // Parcelas regulares
    for (let i = 1; i <= numParcelas; i++) {
      const juros = saldoDevedor * taxa;
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
    
    // Parcela balão final
    const jurosFinal = saldoDevedor * taxa;
    const amortizacaoFinal = valorParcelaBalaoComIOF - jurosFinal;
    
    tabelaAmortizacao.push({
      parcela: numParcelas + 1,
      valorParcela: valorParcelaBalaoComIOF,
      amortizacao: amortizacaoFinal,
      juros: jurosFinal,
      saldoDevedor: 0
    });
    
    // Cálculos finais
    const totalPagarSemBalao = valorParcela * numParcelas;
    const totalPagar = totalPagarSemBalao + valorParcelaBalaoComIOF;
    const totalJuros = totalPagar - valorComIOF;
    
    // Calcular CET
    const taxaCET = calcularCET(
      valorFinanciado,
      valorParcela,
      numParcelas,
      valorIOF,
      0,
      valorParcelaBalaoComIOF
    );
    
    return {
      valorParcela,
      valorParcelaBalao: valorParcelaBalaoComIOF,
      totalPagar,
      totalJuros,
      percentualBalao,
      tabelaAmortizacao,
      valorIOF,
      taxaCET
    };
  } else {
    // Financiamento sem IOF
    const valorParcela = calcularPrestacao(valorFinanciadoSemBalao, taxaJuros, numParcelas);
    
    // Gerar tabela de amortização
    const tabelaAmortizacao: TabelaItem[] = [];
    let saldoDevedor = valorFinanciado;
    
    // Linha inicial (parcela 0)
    tabelaAmortizacao.push({
      parcela: 0,
      valorParcela: 0,
      amortizacao: 0,
      juros: 0,
      saldoDevedor: saldoDevedor
    });
    
    // Parcelas regulares
    for (let i = 1; i <= numParcelas; i++) {
      const juros = saldoDevedor * taxa;
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
    
    // Parcela balão final
    const jurosFinal = saldoDevedor * taxa;
    const amortizacaoFinal = valorParcelaBalao - jurosFinal;
    
    tabelaAmortizacao.push({
      parcela: numParcelas + 1,
      valorParcela: valorParcelaBalao,
      amortizacao: amortizacaoFinal,
      juros: jurosFinal,
      saldoDevedor: 0
    });
    
    // Cálculos finais
    const totalPagarSemBalao = valorParcela * numParcelas;
    const totalPagar = totalPagarSemBalao + valorParcelaBalao;
    const totalJuros = totalPagar - valorFinanciado;
    
    // Calcular CET
    const taxaCET = calcularCET(
      valorFinanciado,
      valorParcela,
      numParcelas,
      0,
      0,
      valorParcelaBalao
    );
    
    return {
      valorParcela,
      valorParcelaBalao,
      totalPagar,
      totalJuros,
      percentualBalao,
      tabelaAmortizacao,
      taxaCET
    };
  }
}

export function simularFinanciamento(
  valorFinanciado: number,
  taxaJuros: number,
  numParcelas: number,
  incluirIOF: boolean = false,
  sistema: "price" | "sac" = "price"
): {
  valorParcela: number;
  totalPagar: number;
  totalJuros: number;
  tabelaAmortizacao: TabelaItem[];
  valorIOF?: number;
  taxaCET?: number;
} {
  // Calcula IOF se solicitado
  let valorTotalFinanciado = valorFinanciado;
  let valorIOF: number | undefined = undefined;
  
  if (incluirIOF) {
    valorIOF = calcularIOF(valorFinanciado, numParcelas);
    valorTotalFinanciado += valorIOF;
  }
  
  // Gera tabela conforme o sistema selecionado
  let tabelaAmortizacao: TabelaItem[];
  let valorParcela: number;
  
  if (sistema === "sac") {
    // Para SAC, usamos a função específica e pegamos o valor da primeira parcela
    tabelaAmortizacao = gerarTabelaSAC(valorTotalFinanciado, taxaJuros, numParcelas);
    valorParcela = tabelaAmortizacao[1].valorParcela; // A primeira parcela está no índice 1 (índice 0 é o registro inicial)
  } else {
    // Para PRICE, calculamos a prestação e geramos a tabela
    valorParcela = calcularPrestacao(valorTotalFinanciado, taxaJuros, numParcelas);
    tabelaAmortizacao = gerarTabelaPrice(valorTotalFinanciado, taxaJuros, numParcelas);
  }
  
  // Calcula totais (no SAC, o valor da parcela varia, então calculamos somando todas as parcelas)
  let totalPagar: number;
  
  if (sistema === "sac") {
    totalPagar = tabelaAmortizacao.reduce((total, item) => total + item.valorParcela, 0);
  } else {
    totalPagar = calcularTotalPagar(valorParcela, numParcelas);
  }
  
  const totalJuros = calcularTotalJuros(totalPagar, valorTotalFinanciado);
  
  // Calcula o CET 
  const taxaCET = calcularCET(
    valorFinanciado, 
    valorParcela, 
    numParcelas, 
    valorIOF || 0
  );
  
  return {
    valorParcela,
    totalPagar,
    totalJuros,
    tabelaAmortizacao,
    valorIOF,
    taxaCET
  };
}
