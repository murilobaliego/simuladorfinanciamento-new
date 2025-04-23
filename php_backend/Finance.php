<?php
/**
 * Classe com utilitários para cálculos financeiros
 * Esta classe implementa funções equivalentes às do arquivo finance.ts
 */
class Finance {
    /**
     * Calcula a prestação de um financiamento usando o sistema de Tabela Price
     * @param float $valorFinanciado Valor total a ser financiado
     * @param float $taxaJuros Taxa de juros mensal (em percentual, ex: 1.5 para 1.5%)
     * @param int $numParcelas Número total de parcelas
     * @return float O valor da prestação mensal
     */
    public static function calcularPrestacao($valorFinanciado, $taxaJuros, $numParcelas) {
        $i = $taxaJuros / 100;
        return $valorFinanciado * (($i * pow(1 + $i, $numParcelas)) / (pow(1 + $i, $numParcelas) - 1));
    }

    /**
     * Gera a tabela de amortização pelo sistema Price (parcelas fixas)
     * @param float $valorFinanciado Valor total a ser financiado
     * @param float $taxaJuros Taxa de juros mensal (em percentual, ex: 1.5 para 1.5%)
     * @param int $numParcelas Número total de parcelas
     * @return array Array contendo a tabela de amortização completa
     */
    public static function gerarTabelaPrice($valorFinanciado, $taxaJuros, $numParcelas) {
        $tabela = [];
        $i = $taxaJuros / 100;
        $prestacao = self::calcularPrestacao($valorFinanciado, $taxaJuros, $numParcelas);
        $saldoDevedor = $valorFinanciado;
        
        // Adiciona a linha inicial (parcela 0)
        $tabela[] = [
            'parcela' => 0,
            'valorParcela' => 0,
            'amortizacao' => 0,
            'juros' => 0,
            'saldoDevedor' => $saldoDevedor
        ];
        
        // Gera as linhas para cada parcela
        for ($parcela = 1; $parcela <= $numParcelas; $parcela++) {
            $juros = $saldoDevedor * $i;
            $amortizacao = $prestacao - $juros;
            $saldoDevedor -= $amortizacao;
            
            $tabela[] = [
                'parcela' => $parcela,
                'valorParcela' => $prestacao,
                'amortizacao' => $amortizacao,
                'juros' => $juros,
                'saldoDevedor' => max(0, $saldoDevedor) // Evita saldo devedor negativo nos arredondamentos
            ];
        }
        
        return $tabela;
    }

    /**
     * Gera a tabela de amortização pelo sistema SAC (amortização constante)
     * @param float $valorFinanciado Valor total a ser financiado
     * @param float $taxaJuros Taxa de juros mensal (em percentual, ex: 1.5 para 1.5%)
     * @param int $numParcelas Número total de parcelas
     * @return array Array contendo a tabela de amortização completa
     */
    public static function gerarTabelaSAC($valorFinanciado, $taxaJuros, $numParcelas) {
        $tabela = [];
        $i = $taxaJuros / 100;
        $amortizacaoConstante = $valorFinanciado / $numParcelas;
        $saldoDevedor = $valorFinanciado;
        
        // Adiciona a linha inicial (parcela 0)
        $tabela[] = [
            'parcela' => 0,
            'valorParcela' => 0,
            'amortizacao' => 0,
            'juros' => 0,
            'saldoDevedor' => $saldoDevedor
        ];
        
        // Gera as linhas para cada parcela
        for ($parcela = 1; $parcela <= $numParcelas; $parcela++) {
            $juros = $saldoDevedor * $i;
            $valorParcela = $amortizacaoConstante + $juros;
            $saldoDevedor -= $amortizacaoConstante;
            
            $tabela[] = [
                'parcela' => $parcela,
                'valorParcela' => $valorParcela,
                'amortizacao' => $amortizacaoConstante,
                'juros' => $juros,
                'saldoDevedor' => max(0, $saldoDevedor) // Evita saldo devedor negativo nos arredondamentos
            ];
        }
        
        return $tabela;
    }

    /**
     * Calcula o valor total a ser pago em um financiamento
     * @param float $valorParcela Valor da parcela mensal
     * @param int $numParcelas Número total de parcelas
     * @return float O valor total a ser pago (parcela × número de parcelas)
     */
    public static function calcularTotalPagar($valorParcela, $numParcelas) {
        return $valorParcela * $numParcelas;
    }

    /**
     * Calcula o total de juros a ser pago em um financiamento
     * @param float $totalPagar Valor total a ser pago
     * @param float $valorFinanciado Valor total financiado
     * @return float O total de juros a ser pago (diferença entre total pago e valor financiado)
     */
    public static function calcularTotalJuros($totalPagar, $valorFinanciado) {
        return $totalPagar - $valorFinanciado;
    }
}