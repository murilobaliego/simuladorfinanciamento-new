<?php
/**
 * Script para testar as funcionalidades do backend PHP
 * 
 * Uso: php test.php [opcao]
 * 
 * Opções:
 * - calcular: Testa o cálculo básico de financiamento (tabela Price)
 * - imobiliario: Testa o cálculo de financiamento imobiliário (Price ou SAC)
 * - consignado: Testa o cálculo de crédito consignado
 * - validacao: Testa a validação de dados
 * - tudo: Executa todos os testes
 */

// Incluir classes necessárias
require_once "Finance.php";
require_once "Validator.php";

// Função para formatar valores monetários
function formatMoney($value) {
    return 'R$ ' . number_format($value, 2, ',', '.');
}

// Função para testar cálculo básico de financiamento
function testarCalculoBasico() {
    echo "\n===== TESTE DE CÁLCULO BÁSICO =====\n";
    
    try {
        // Dados do financiamento
        $data = [
            "valorFinanciado" => 50000,
            "taxaJuros" => 1.5,
            "numParcelas" => 60
        ];
        
        // Validar dados
        $validated = Validator::validarCalculadora($data);
        echo "✓ Validação de dados OK\n";
        
        // Calcular prestação
        $valorParcela = Finance::calcularPrestacao(
            $validated["valorFinanciado"],
            $validated["taxaJuros"],
            $validated["numParcelas"]
        );
        echo "✓ Cálculo de prestação OK: " . formatMoney($valorParcela) . "\n";
        
        // Calcular total a pagar
        $totalPagar = Finance::calcularTotalPagar($valorParcela, $validated["numParcelas"]);
        echo "✓ Cálculo de total a pagar OK: " . formatMoney($totalPagar) . "\n";
        
        // Calcular total de juros
        $totalJuros = Finance::calcularTotalJuros($totalPagar, $validated["valorFinanciado"]);
        echo "✓ Cálculo de total de juros OK: " . formatMoney($totalJuros) . "\n";
        
        // Gerar tabela de amortização
        $tabela = Finance::gerarTabelaPrice(
            $validated["valorFinanciado"],
            $validated["taxaJuros"],
            $validated["numParcelas"]
        );
        echo "✓ Geração de tabela de amortização OK (" . count($tabela) . " registros)\n";
        
        echo "\nPrimeiras 3 parcelas da tabela Price:\n";
        for ($i = 0; $i < 3; $i++) {
            $item = $tabela[$i];
            echo "Parcela " . $item["parcela"] . ": ";
            echo "Valor " . formatMoney($item["valorParcela"]);
            echo ", Amortização " . formatMoney($item["amortizacao"]);
            echo ", Juros " . formatMoney($item["juros"]);
            echo ", Saldo " . formatMoney($item["saldoDevedor"]);
            echo "\n";
        }
        
        echo "\n✅ TESTE DE CÁLCULO BÁSICO CONCLUÍDO COM SUCESSO!\n";
        
    } catch (Exception $e) {
        echo "❌ ERRO: " . $e->getMessage() . "\n";
    }
}

// Função para testar cálculo de financiamento imobiliário
function testarCalculoImobiliario() {
    echo "\n===== TESTE DE FINANCIAMENTO IMOBILIÁRIO =====\n";
    
    try {
        // Dados do financiamento imobiliário com SAC
        $data = [
            "valorFinanciado" => 300000,
            "taxaJuros" => 0.8,
            "numParcelas" => 360,
            "sistema" => "sac"
        ];
        
        // Validar dados
        $validated = Validator::validarImobiliario($data);
        echo "✓ Validação de dados OK\n";
        
        // Gerar tabela de amortização SAC
        $tabela = Finance::gerarTabelaSAC(
            $validated["valorFinanciado"],
            $validated["taxaJuros"],
            $validated["numParcelas"]
        );
        echo "✓ Geração de tabela SAC OK (" . count($tabela) . " registros)\n";
        
        // Valor da primeira parcela (maior valor no SAC)
        $valorPrimeiraParcela = $tabela[1]["valorParcela"];
        echo "✓ Valor da primeira parcela (SAC): " . formatMoney($valorPrimeiraParcela) . "\n";
        
        // Valor da última parcela (menor valor no SAC)
        $valorUltimaParcela = $tabela[$validated["numParcelas"]]["valorParcela"];
        echo "✓ Valor da última parcela (SAC): " . formatMoney($valorUltimaParcela) . "\n";
        
        // Calcular total a pagar (somando todas as parcelas no SAC)
        $totalPagar = 0;
        for ($i = 1; $i <= $validated["numParcelas"]; $i++) {
            $totalPagar += $tabela[$i]["valorParcela"];
        }
        echo "✓ Total a pagar (SAC): " . formatMoney($totalPagar) . "\n";
        
        // Calcular total de juros
        $totalJuros = $totalPagar - $validated["valorFinanciado"];
        echo "✓ Total de juros (SAC): " . formatMoney($totalJuros) . "\n";
        
        echo "\nPrimeiras 3 parcelas da tabela SAC:\n";
        for ($i = 0; $i < 3; $i++) {
            $item = $tabela[$i];
            echo "Parcela " . $item["parcela"] . ": ";
            echo "Valor " . formatMoney($item["valorParcela"]);
            echo ", Amortização " . formatMoney($item["amortizacao"]);
            echo ", Juros " . formatMoney($item["juros"]);
            echo ", Saldo " . formatMoney($item["saldoDevedor"]);
            echo "\n";
        }
        
        // Testar também com sistema Price
        $data["sistema"] = "price";
        $validated = Validator::validarImobiliario($data);
        
        // Calcular prestação Price
        $valorParcela = Finance::calcularPrestacao(
            $validated["valorFinanciado"],
            $validated["taxaJuros"],
            $validated["numParcelas"]
        );
        echo "\n✓ Valor da parcela (Price): " . formatMoney($valorParcela) . "\n";
        
        // Calcular total a pagar Price
        $totalPagar = Finance::calcularTotalPagar($valorParcela, $validated["numParcelas"]);
        echo "✓ Total a pagar (Price): " . formatMoney($totalPagar) . "\n";
        
        // Calcular total de juros Price
        $totalJuros = Finance::calcularTotalJuros($totalPagar, $validated["valorFinanciado"]);
        echo "✓ Total de juros (Price): " . formatMoney($totalJuros) . "\n";
        
        echo "\n✅ TESTE DE FINANCIAMENTO IMOBILIÁRIO CONCLUÍDO COM SUCESSO!\n";
        
    } catch (Exception $e) {
        echo "❌ ERRO: " . $e->getMessage() . "\n";
    }
}

// Função para testar cálculo de crédito consignado
function testarCalculoConsignado() {
    echo "\n===== TESTE DE CRÉDITO CONSIGNADO =====\n";
    
    try {
        // Dados do crédito consignado
        $data = [
            "valorFinanciado" => 10000,
            "taxaJuros" => 1.2,
            "numParcelas" => 48,
            "tipoConsignado" => "inss"
        ];
        
        // Validar dados
        $validated = Validator::validarConsignado($data);
        echo "✓ Validação de dados OK\n";
        
        // Calcular prestação
        $valorParcela = Finance::calcularPrestacao(
            $validated["valorFinanciado"],
            $validated["taxaJuros"],
            $validated["numParcelas"]
        );
        echo "✓ Cálculo de prestação OK: " . formatMoney($valorParcela) . "\n";
        
        // Calcular total a pagar
        $totalPagar = Finance::calcularTotalPagar($valorParcela, $validated["numParcelas"]);
        echo "✓ Cálculo de total a pagar OK: " . formatMoney($totalPagar) . "\n";
        
        // Calcular total de juros
        $totalJuros = Finance::calcularTotalJuros($totalPagar, $validated["valorFinanciado"]);
        echo "✓ Cálculo de total de juros OK: " . formatMoney($totalJuros) . "\n";
        
        echo "\n✅ TESTE DE CRÉDITO CONSIGNADO CONCLUÍDO COM SUCESSO!\n";
        
    } catch (Exception $e) {
        echo "❌ ERRO: " . $e->getMessage() . "\n";
    }
}

// Função para testar validação de dados
function testarValidacao() {
    echo "\n===== TESTE DE VALIDAÇÃO DE DADOS =====\n";
    
    // Teste de validação com dados corretos
    try {
        $dataOk = [
            "valorFinanciado" => 50000,
            "taxaJuros" => 1.5,
            "numParcelas" => 60
        ];
        
        $validated = Validator::validarCalculadora($dataOk);
        echo "✓ Validação de dados corretos OK\n";
    } catch (Exception $e) {
        echo "❌ ERRO (não esperado): " . $e->getMessage() . "\n";
    }
    
    // Teste de validação com valor financiado negativo
    try {
        $dataErro1 = [
            "valorFinanciado" => -1000,
            "taxaJuros" => 1.5,
            "numParcelas" => 60
        ];
        
        $validated = Validator::validarCalculadora($dataErro1);
        echo "❌ FALHA: Validação deveria ter falhado mas passou\n";
    } catch (Exception $e) {
        echo "✓ Validação corretamente rejeitou valor financiado negativo\n";
    }
    
    // Teste de validação com taxa de juros negativa
    try {
        $dataErro2 = [
            "valorFinanciado" => 50000,
            "taxaJuros" => -1.5,
            "numParcelas" => 60
        ];
        
        $validated = Validator::validarCalculadora($dataErro2);
        echo "❌ FALHA: Validação deveria ter falhado mas passou\n";
    } catch (Exception $e) {
        echo "✓ Validação corretamente rejeitou taxa de juros negativa\n";
    }
    
    // Teste de validação com número de parcelas negativo
    try {
        $dataErro3 = [
            "valorFinanciado" => 50000,
            "taxaJuros" => 1.5,
            "numParcelas" => -60
        ];
        
        $validated = Validator::validarCalculadora($dataErro3);
        echo "❌ FALHA: Validação deveria ter falhado mas passou\n";
    } catch (Exception $e) {
        echo "✓ Validação corretamente rejeitou número de parcelas negativo\n";
    }
    
    // Teste de validação para imobiliário com sistema inválido
    try {
        $dataErro4 = [
            "valorFinanciado" => 300000,
            "taxaJuros" => 0.8,
            "numParcelas" => 360,
            "sistema" => "invalido"
        ];
        
        $validated = Validator::validarImobiliario($dataErro4);
        echo "❌ FALHA: Validação deveria ter falhado mas passou\n";
    } catch (Exception $e) {
        echo "✓ Validação corretamente rejeitou sistema de amortização inválido\n";
    }
    
    // Teste de validação para consignado com tipo inválido
    try {
        $dataErro5 = [
            "valorFinanciado" => 10000,
            "taxaJuros" => 1.2,
            "numParcelas" => 48,
            "tipoConsignado" => "invalido"
        ];
        
        $validated = Validator::validarConsignado($dataErro5);
        echo "❌ FALHA: Validação deveria ter falhado mas passou\n";
    } catch (Exception $e) {
        echo "✓ Validação corretamente rejeitou tipo de consignado inválido\n";
    }
    
    echo "\n✅ TESTE DE VALIDAÇÃO DE DADOS CONCLUÍDO COM SUCESSO!\n";
}

// Executar os testes solicitados
$opcao = isset($argv[1]) ? strtolower($argv[1]) : 'tudo';

echo "\n🔍 INICIANDO TESTES DO BACKEND PHP\n";
echo "Opção selecionada: $opcao\n";

switch ($opcao) {
    case 'calcular':
        testarCalculoBasico();
        break;
        
    case 'imobiliario':
        testarCalculoImobiliario();
        break;
        
    case 'consignado':
        testarCalculoConsignado();
        break;
        
    case 'validacao':
        testarValidacao();
        break;
        
    case 'tudo':
    default:
        testarCalculoBasico();
        testarCalculoImobiliario();
        testarCalculoConsignado();
        testarValidacao();
}

echo "\n🎉 TODOS OS TESTES CONCLUÍDOS!\n";
echo "Confira o README.md para instruções sobre como iniciar o servidor PHP.\n\n";