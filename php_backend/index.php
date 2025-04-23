<?php
// Configurações iniciais
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Tratamento para requisições OPTIONS (preflight de CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Incluir classes necessárias
require_once 'Finance.php';
require_once 'Validator.php';

// Função para registrar logs
function log_message($message) {
    $formattedTime = date('h:i:s A');
    echo "[$formattedTime] [php] $message" . PHP_EOL;
}

// Função para enviar resposta JSON com código de status
function json_response($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
}

// Obter o caminho da URL requisitada
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Obter dados da requisição
$requestData = json_decode(file_get_contents('php://input'), true);
if ($_SERVER['REQUEST_METHOD'] === 'POST' && json_last_error() !== JSON_ERROR_NONE) {
    json_response(['message' => 'Formato de JSON inválido'], 400);
    exit;
}

// Roteamento da API
try {
    if ($path === '/api/simulador/calcular' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        // API para cálculo de financiamentos usando Tabela Price
        $validatedData = Validator::validarCalculadora($requestData);
        
        // Extrair os dados validados
        $valorFinanciado = $validatedData['valorFinanciado'];
        $taxaJuros = $validatedData['taxaJuros'];
        $numParcelas = $validatedData['numParcelas'];
        
        // Calcular a prestação
        $valorParcela = Finance::calcularPrestacao($valorFinanciado, $taxaJuros, $numParcelas);
        
        // Calcular o total a pagar
        $totalPagar = Finance::calcularTotalPagar($valorParcela, $numParcelas);
        
        // Calcular o total de juros
        $totalJuros = Finance::calcularTotalJuros($totalPagar, $valorFinanciado);
        
        // Gerar a tabela de amortização
        $tabelaAmortizacao = Finance::gerarTabelaPrice($valorFinanciado, $taxaJuros, $numParcelas);
        
        // Retornar os resultados
        json_response([
            'valorParcela' => $valorParcela,
            'totalPagar' => $totalPagar,
            'totalJuros' => $totalJuros,
            'tabelaAmortizacao' => $tabelaAmortizacao
        ]);
        
        // Registrar log
        log_message("POST $path 200");
    }
    
    else if ($path === '/api/simulador/imobiliario' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        // API para cálculo de financiamento imobiliário (pode usar Price ou SAC)
        $validatedData = Validator::validarImobiliario($requestData);
        
        // Extrair os dados validados
        $valorFinanciado = $validatedData['valorFinanciado'];
        $taxaJuros = $validatedData['taxaJuros'];
        $numParcelas = $validatedData['numParcelas'];
        $sistema = $validatedData['sistema'];
        
        // Variáveis para armazenar os resultados
        $valorParcela = 0;
        $tabelaAmortizacao = [];
        
        // Calcular de acordo com o sistema escolhido
        if ($sistema === 'price') {
            $valorParcela = Finance::calcularPrestacao($valorFinanciado, $taxaJuros, $numParcelas);
            $tabelaAmortizacao = Finance::gerarTabelaPrice($valorFinanciado, $taxaJuros, $numParcelas);
        } else {
            // Para o SAC, usamos a primeira parcela como referência (maior valor)
            $tabelaAmortizacao = Finance::gerarTabelaSAC($valorFinanciado, $taxaJuros, $numParcelas);
            $valorParcela = $tabelaAmortizacao[1]['valorParcela']; // índice 1 é a primeira parcela (índice 0 é o estado inicial)
        }
        
        // Calcular o total a pagar (somando todas as parcelas para o SAC, que tem parcelas decrescentes)
        $totalPagar = $sistema === 'price'
            ? Finance::calcularTotalPagar($valorParcela, $numParcelas)
            : array_reduce($tabelaAmortizacao, function($sum, $item) {
                return $sum + $item['valorParcela'];
            }, 0);
        
        // Calcular o total de juros
        $totalJuros = Finance::calcularTotalJuros($totalPagar, $valorFinanciado);
        
        // Retornar os resultados
        json_response([
            'valorParcela' => $valorParcela,
            'totalPagar' => $totalPagar,
            'totalJuros' => $totalJuros,
            'tabelaAmortizacao' => $tabelaAmortizacao
        ]);
        
        // Registrar log
        log_message("POST $path 200");
    }
    
    else if ($path === '/api/simulador/pessoal' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        // API para cálculo de empréstimo pessoal
        $validatedData = Validator::validarCalculadora($requestData);
        
        // Extrair os dados validados
        $valorFinanciado = $validatedData['valorFinanciado'];
        $taxaJuros = $validatedData['taxaJuros'];
        $numParcelas = $validatedData['numParcelas'];
        
        // Calcular a prestação
        $valorParcela = Finance::calcularPrestacao($valorFinanciado, $taxaJuros, $numParcelas);
        
        // Calcular o total a pagar
        $totalPagar = Finance::calcularTotalPagar($valorParcela, $numParcelas);
        
        // Calcular o total de juros
        $totalJuros = Finance::calcularTotalJuros($totalPagar, $valorFinanciado);
        
        // Gerar a tabela de amortização
        $tabelaAmortizacao = Finance::gerarTabelaPrice($valorFinanciado, $taxaJuros, $numParcelas);
        
        // Retornar os resultados
        json_response([
            'valorParcela' => $valorParcela,
            'totalPagar' => $totalPagar,
            'totalJuros' => $totalJuros,
            'tabelaAmortizacao' => $tabelaAmortizacao
        ]);
        
        // Registrar log
        log_message("POST $path 200");
    }
    
    else if ($path === '/api/simulador/consignado' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        // API para cálculo de crédito consignado
        $validatedData = Validator::validarConsignado($requestData);
        
        // Extrair os dados validados
        $valorFinanciado = $validatedData['valorFinanciado'];
        $taxaJuros = $validatedData['taxaJuros'];
        $numParcelas = $validatedData['numParcelas'];
        
        // Calcular a prestação
        $valorParcela = Finance::calcularPrestacao($valorFinanciado, $taxaJuros, $numParcelas);
        
        // Calcular o total a pagar
        $totalPagar = Finance::calcularTotalPagar($valorParcela, $numParcelas);
        
        // Calcular o total de juros
        $totalJuros = Finance::calcularTotalJuros($totalPagar, $valorFinanciado);
        
        // Gerar a tabela de amortização
        $tabelaAmortizacao = Finance::gerarTabelaPrice($valorFinanciado, $taxaJuros, $numParcelas);
        
        // Retornar os resultados
        json_response([
            'valorParcela' => $valorParcela,
            'totalPagar' => $totalPagar,
            'totalJuros' => $totalJuros,
            'tabelaAmortizacao' => $tabelaAmortizacao
        ]);
        
        // Registrar log
        log_message("POST $path 200");
    }
    
    else {
        // Rota não encontrada
        json_response(['message' => 'Endpoint não encontrado'], 404);
    }
} catch (Exception $e) {
    // Se houver um erro de validação, retornamos 400 Bad Request
    if (json_decode($e->getMessage(), true)) {
        $error = json_decode($e->getMessage(), true);
        json_response($error, 400);
    } else {
        // Para outros erros, retornar 500 Internal Server Error
        json_response(['message' => 'Erro ao processar a solicitação: ' . $e->getMessage()], 500);
    }
}