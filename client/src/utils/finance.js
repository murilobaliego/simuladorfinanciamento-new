/**
 * Calcula a prestação de um financiamento usando o sistema de Tabela Price
 * @param valorFinanciado Valor total a ser financiado
 * @param taxaJuros Taxa de juros mensal (em percentual, ex: 1.5 para 1.5%)
 * @param numParcelas Número total de parcelas
 * @returns O valor da prestação mensal
 */
export function calcularPrestacao(valorFinanciado, taxaJuros, numParcelas) {
    var i = taxaJuros / 100;
    return valorFinanciado * ((i * Math.pow(1 + i, numParcelas)) / (Math.pow(1 + i, numParcelas) - 1));
}
/**
 * Gera a tabela de amortização pelo sistema Price (parcelas fixas)
 * @param valorFinanciado Valor total a ser financiado
 * @param taxaJuros Taxa de juros mensal (em percentual, ex: 1.5 para 1.5%)
 * @param numParcelas Número total de parcelas
 * @returns Array contendo a tabela de amortização completa
 */
export function gerarTabelaPrice(valorFinanciado, taxaJuros, numParcelas) {
    var tabela = [];
    var i = taxaJuros / 100;
    var prestacao = calcularPrestacao(valorFinanciado, taxaJuros, numParcelas);
    var saldoDevedor = valorFinanciado;
    // Adiciona a linha inicial (parcela 0)
    tabela.push({
        parcela: 0,
        valorParcela: 0,
        amortizacao: 0,
        juros: 0,
        saldoDevedor: saldoDevedor
    });
    // Gera as linhas para cada parcela
    for (var parcela = 1; parcela <= numParcelas; parcela++) {
        var juros = saldoDevedor * i;
        var amortizacao = prestacao - juros;
        saldoDevedor -= amortizacao;
        tabela.push({
            parcela: parcela,
            valorParcela: prestacao,
            amortizacao: amortizacao,
            juros: juros,
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
export function gerarTabelaSAC(valorFinanciado, taxaJuros, numParcelas) {
    var tabela = [];
    var i = taxaJuros / 100;
    var amortizacaoConstante = valorFinanciado / numParcelas;
    var saldoDevedor = valorFinanciado;
    // Adiciona a linha inicial (parcela 0)
    tabela.push({
        parcela: 0,
        valorParcela: 0,
        amortizacao: 0,
        juros: 0,
        saldoDevedor: saldoDevedor
    });
    // Gera as linhas para cada parcela
    for (var parcela = 1; parcela <= numParcelas; parcela++) {
        var juros = saldoDevedor * i;
        var valorParcela = amortizacaoConstante + juros;
        saldoDevedor -= amortizacaoConstante;
        tabela.push({
            parcela: parcela,
            valorParcela: valorParcela,
            amortizacao: amortizacaoConstante,
            juros: juros,
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
export function calcularTotalPagar(valorParcela, numParcelas) {
    return valorParcela * numParcelas;
}
/**
 * Calcula o total de juros a ser pago em um financiamento
 * @param totalPagar Valor total a ser pago
 * @param valorFinanciado Valor total financiado
 * @returns O total de juros a ser pago (diferença entre total pago e valor financiado)
 */
export function calcularTotalJuros(totalPagar, valorFinanciado) {
    return totalPagar - valorFinanciado;
}
/**
 * Calcula o valor do IOF para financiamento de veículos
 * @param valorFinanciado Valor total a ser financiado
 * @param numParcelas Número total de parcelas (meses)
 * @returns O valor do IOF a ser adicionado ao financiamento
 */
export function calcularIOF(valorFinanciado, numParcelas) {
    // Taxa diária de IOF: 0,0082% ao dia, limitado a 365 dias
    var diasIOF = Math.min(numParcelas * 30, 365); // Converte meses em dias, limitado a 365
    var taxaIOFDiaria = 0.0082 / 100; // 0,0082% ao dia
    var iofDiario = valorFinanciado * taxaIOFDiaria * diasIOF;
    // Taxa adicional de IOF: 0,38% sobre o valor da operação
    var taxaIOFAdicional = 0.38 / 100; // 0,38% sobre o valor da operação
    var iofAdicional = valorFinanciado * taxaIOFAdicional;
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
export function calcularCET(valorFinanciado, valorParcela, numParcelas, valorIOF, tarifas, valorParcelaBalao) {
    if (valorIOF === void 0) { valorIOF = 0; }
    if (tarifas === void 0) { tarifas = 0; }
    if (valorParcelaBalao === void 0) { valorParcelaBalao = 0; }
    // Valor total desembolsado pelo cliente (incluindo IOF e tarifas)
    var valorDesembolsado = valorFinanciado + valorIOF + tarifas;
    // Função auxiliar para calcular o Valor Presente Líquido (VPL)
    var calcularVPL = function (taxa) {
        var vpn = -valorDesembolsado;
        for (var i = 1; i <= numParcelas; i++) {
            vpn += valorParcela / Math.pow(1 + taxa, i);
        }
        // Adicionar a parcela balão no fluxo, se existir
        if (valorParcelaBalao > 0) {
            vpn += valorParcelaBalao / Math.pow(1 + taxa, numParcelas + 1);
        }
        return vpn;
    };
    // Encontrar o CET usando o método da bissecção
    var taxaMin = 0.001; // 0.1% ao mês
    var taxaMax = 0.20; // 20% ao mês (limite superior razoável)
    var taxa = (taxaMin + taxaMax) / 2;
    var vpn = calcularVPL(taxa);
    // Precisão desejada
    var epsilon = 0.0001;
    // Máximo de iterações para evitar loops infinitos
    var maxIteracoes = 100;
    var iteracao = 0;
    while (Math.abs(vpn) > epsilon && iteracao < maxIteracoes) {
        if (vpn > 0) {
            taxaMin = taxa;
        }
        else {
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
export function simularFinanciamentoBalao(valorFinanciado, taxaJuros, numParcelas, percentualBalao, incluirIOF) {
    if (incluirIOF === void 0) { incluirIOF = false; }
    // Converter taxa de percentual para decimal
    var taxa = taxaJuros / 100;
    // Calcular valor da parcela balão (percentual do valor financiado)
    var valorParcelaBalao = valorFinanciado * (percentualBalao / 100);
    // Valor presente da parcela balão
    var valorPresenteBalao = valorParcelaBalao / Math.pow(1 + taxa, numParcelas);
    // Valor a ser financiado nas parcelas mensais regulares
    var valorFinanciadoSemBalao = valorFinanciado - valorPresenteBalao;
    var valorComIOF = valorFinanciado;
    var valorIOF = undefined;
    // Se deve incluir IOF no financiamento
    if (incluirIOF) {
        valorIOF = calcularIOF(valorFinanciado, numParcelas + 1); // +1 para incluir a parcela balão
        valorComIOF += valorIOF;
        // Recalcular proporcionalmente com IOF
        var valorParcelaBalaoComIOF = valorParcelaBalao * (valorComIOF / valorFinanciado);
        var valorPresenteBalaoComIOF = valorParcelaBalaoComIOF / Math.pow(1 + taxa, numParcelas);
        var valorFinanciadoSemBalaoComIOF = valorComIOF - valorPresenteBalaoComIOF;
        // Calcular parcela regular com base no valor ajustado
        var valorParcela = calcularPrestacao(valorFinanciadoSemBalaoComIOF, taxaJuros, numParcelas);
        // Gerar tabela de amortização
        var tabelaAmortizacao = [];
        var saldoDevedor = valorComIOF;
        // Linha inicial (parcela 0)
        tabelaAmortizacao.push({
            parcela: 0,
            valorParcela: 0,
            amortizacao: 0,
            juros: 0,
            saldoDevedor: saldoDevedor
        });
        // Parcelas regulares
        for (var i = 1; i <= numParcelas; i++) {
            var juros = saldoDevedor * taxa;
            var amortizacao = valorParcela - juros;
            saldoDevedor -= amortizacao;
            tabelaAmortizacao.push({
                parcela: i,
                valorParcela: valorParcela,
                amortizacao: amortizacao,
                juros: juros,
                saldoDevedor: Math.max(0, saldoDevedor)
            });
        }
        // Parcela balão final
        var jurosFinal = saldoDevedor * taxa;
        var amortizacaoFinal = valorParcelaBalaoComIOF - jurosFinal;
        tabelaAmortizacao.push({
            parcela: numParcelas + 1,
            valorParcela: valorParcelaBalaoComIOF,
            amortizacao: amortizacaoFinal,
            juros: jurosFinal,
            saldoDevedor: 0
        });
        // Cálculos finais
        var totalPagarSemBalao = valorParcela * numParcelas;
        var totalPagar = totalPagarSemBalao + valorParcelaBalaoComIOF;
        var totalJuros = totalPagar - valorComIOF;
        // Calcular CET
        var taxaCET = calcularCET(valorFinanciado, valorParcela, numParcelas, valorIOF, 0, valorParcelaBalaoComIOF);
        return {
            valorParcela: valorParcela,
            valorParcelaBalao: valorParcelaBalaoComIOF,
            totalPagar: totalPagar,
            totalJuros: totalJuros,
            percentualBalao: percentualBalao,
            tabelaAmortizacao: tabelaAmortizacao,
            valorIOF: valorIOF,
            taxaCET: taxaCET
        };
    }
    else {
        // Financiamento sem IOF
        var valorParcela = calcularPrestacao(valorFinanciadoSemBalao, taxaJuros, numParcelas);
        // Gerar tabela de amortização
        var tabelaAmortizacao = [];
        var saldoDevedor = valorFinanciado;
        // Linha inicial (parcela 0)
        tabelaAmortizacao.push({
            parcela: 0,
            valorParcela: 0,
            amortizacao: 0,
            juros: 0,
            saldoDevedor: saldoDevedor
        });
        // Parcelas regulares
        for (var i = 1; i <= numParcelas; i++) {
            var juros = saldoDevedor * taxa;
            var amortizacao = valorParcela - juros;
            saldoDevedor -= amortizacao;
            tabelaAmortizacao.push({
                parcela: i,
                valorParcela: valorParcela,
                amortizacao: amortizacao,
                juros: juros,
                saldoDevedor: Math.max(0, saldoDevedor)
            });
        }
        // Parcela balão final
        var jurosFinal = saldoDevedor * taxa;
        var amortizacaoFinal = valorParcelaBalao - jurosFinal;
        tabelaAmortizacao.push({
            parcela: numParcelas + 1,
            valorParcela: valorParcelaBalao,
            amortizacao: amortizacaoFinal,
            juros: jurosFinal,
            saldoDevedor: 0
        });
        // Cálculos finais
        var totalPagarSemBalao = valorParcela * numParcelas;
        var totalPagar = totalPagarSemBalao + valorParcelaBalao;
        var totalJuros = totalPagar - valorFinanciado;
        // Calcular CET
        var taxaCET = calcularCET(valorFinanciado, valorParcela, numParcelas, 0, 0, valorParcelaBalao);
        return {
            valorParcela: valorParcela,
            valorParcelaBalao: valorParcelaBalao,
            totalPagar: totalPagar,
            totalJuros: totalJuros,
            percentualBalao: percentualBalao,
            tabelaAmortizacao: tabelaAmortizacao,
            taxaCET: taxaCET
        };
    }
}
export function simularFinanciamento(valorFinanciado, taxaJuros, numParcelas, incluirIOF, sistema) {
    if (incluirIOF === void 0) { incluirIOF = false; }
    if (sistema === void 0) { sistema = "price"; }
    // Calcula IOF se solicitado
    var valorTotalFinanciado = valorFinanciado;
    var valorIOF = undefined;
    if (incluirIOF) {
        valorIOF = calcularIOF(valorFinanciado, numParcelas);
        valorTotalFinanciado += valorIOF;
    }
    // Gera tabela conforme o sistema selecionado
    var tabelaAmortizacao;
    var valorParcela;
    if (sistema === "sac") {
        // Para SAC, usamos a função específica e pegamos o valor da primeira parcela
        tabelaAmortizacao = gerarTabelaSAC(valorTotalFinanciado, taxaJuros, numParcelas);
        valorParcela = tabelaAmortizacao[1].valorParcela; // A primeira parcela está no índice 1 (índice 0 é o registro inicial)
    }
    else {
        // Para PRICE, calculamos a prestação e geramos a tabela
        valorParcela = calcularPrestacao(valorTotalFinanciado, taxaJuros, numParcelas);
        tabelaAmortizacao = gerarTabelaPrice(valorTotalFinanciado, taxaJuros, numParcelas);
    }
    // Calcula totais (no SAC, o valor da parcela varia, então calculamos somando todas as parcelas)
    var totalPagar;
    if (sistema === "sac") {
        totalPagar = tabelaAmortizacao.reduce(function (total, item) { return total + item.valorParcela; }, 0);
    }
    else {
        totalPagar = calcularTotalPagar(valorParcela, numParcelas);
    }
    var totalJuros = calcularTotalJuros(totalPagar, valorTotalFinanciado);
    // Calcula o CET 
    var taxaCET = calcularCET(valorFinanciado, valorParcela, numParcelas, valorIOF || 0);
    return {
        valorParcela: valorParcela,
        totalPagar: totalPagar,
        totalJuros: totalJuros,
        tabelaAmortizacao: tabelaAmortizacao,
        valorIOF: valorIOF,
        taxaCET: taxaCET
    };
}
