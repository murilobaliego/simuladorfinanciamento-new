<?php
require_once 'Finance.php';
require_once 'Validator.php';

// Calcular o IOF para diferentes valores
$valores = [10000, 30000, 50000, 100000];
$parcelas = [12, 24, 36, 48, 60];

echo "Teste de cálculo de IOF\n";
echo "=====================\n\n";

foreach ($valores as $valor) {
    echo "Valor financiado: R$ " . number_format($valor, 2, ',', '.') . "\n";
    echo "-------------------------------\n";
    
    foreach ($parcelas as $parcela) {
        $iof = Finance::calcularIOF($valor, $parcela);
        $percentual = ($iof / $valor) * 100;
        
        echo "Parcelas: $parcela, IOF: R$ " . number_format($iof, 2, ',', '.') . 
             " (" . number_format($percentual, 2, ',', '.') . "% do valor)\n";
    }
    echo "\n";
}

// Agora testamos a comunicação direta com o endpoint
echo "Teste de comunicação com o endpoint\n";
echo "================================\n\n";

// Dados para o teste
$testData = [
    'valorFinanciado' => 30000,
    'taxaJuros' => 1.5,
    'numParcelas' => 48,
    'incluirIOF' => true
];

// Extrair os dados validados
$validatedData = Validator::validarCalculadora($testData);
        
// Extrair os dados validados
$valorFinanciado = $validatedData['valorFinanciado'];
$taxaJuros = $validatedData['taxaJuros'];
$numParcelas = $validatedData['numParcelas'];
$incluirIOF = $validatedData['incluirIOF'];

// Valor do IOF
$valorIOF = 0;
if ($incluirIOF) {
    $valorIOF = Finance::calcularIOF($valorFinanciado, $numParcelas);
    $valorFinanciadoOriginal = $valorFinanciado;
    $valorFinanciado += $valorIOF;
    
    echo "Valor do IOF: R$ " . number_format($valorIOF, 2, ',', '.') . "\n";
    echo "Valor financiado original: R$ " . number_format($valorFinanciadoOriginal, 2, ',', '.') . "\n";
    echo "Valor financiado com IOF: R$ " . number_format($valorFinanciado, 2, ',', '.') . "\n";
}

// Calcular a prestação
$valorParcela = Finance::calcularPrestacao($valorFinanciado, $taxaJuros, $numParcelas);
// Calcular o total a pagar
$totalPagar = Finance::calcularTotalPagar($valorParcela, $numParcelas);
// Calcular o total de juros
$valorFinanciadoSemIOF = $incluirIOF ? $valorFinanciadoOriginal : $valorFinanciado;
$totalJuros = Finance::calcularTotalJuros($totalPagar, $valorFinanciadoSemIOF);

echo "Valor da parcela: R$ " . number_format($valorParcela, 2, ',', '.') . "\n";
echo "Total a pagar: R$ " . number_format($totalPagar, 2, ',', '.') . "\n";
echo "Total de juros: R$ " . number_format($totalJuros, 2, ',', '.') . "\n";

// Preparar resposta
$response = [
    'valorParcela' => $valorParcela,
    'totalPagar' => $totalPagar,
    'totalJuros' => $totalJuros
];

// Adicionar valor do IOF se foi calculado
if ($incluirIOF) {
    $response['valorIOF'] = $valorIOF;
}

echo "\nResposta JSON:\n";
echo json_encode($response, JSON_PRETTY_PRINT);
echo "\n";
