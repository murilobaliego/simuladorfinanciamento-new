<?php
/**
 * Roteador para o servidor PHP integrado
 * Este arquivo é usado pelo servidor PHP integrado para rotear as requisições
 */

// Obter o caminho da requisição
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Verificar se é uma requisição para a API
if (strpos($uri, '/api/') === 0) {
    // Requisição para a API, direciona para index.php
    require_once __DIR__ . '/index.php';
    return true;
}

// Verificar se o arquivo existe
$filePath = __DIR__ . '/../client/dist' . $uri;

// Se for um diretório, procurar por index.html
if (is_dir($filePath)) {
    if (file_exists($filePath . '/index.html')) {
        // Atualizar o caminho para o index.html
        $filePath .= '/index.html';
    } else {
        // Retornar 404 para diretórios sem index.html
        http_response_code(404);
        echo '404 Not Found';
        return true;
    }
}

// Verificar se o arquivo existe e não é um diretório
if (file_exists($filePath) && !is_dir($filePath)) {
    // Determinar o tipo MIME do arquivo
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    
    switch ($ext) {
        case 'html':
            header('Content-Type: text/html');
            break;
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'json':
            header('Content-Type: application/json');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        case 'gif':
            header('Content-Type: image/gif');
            break;
        case 'svg':
            header('Content-Type: image/svg+xml');
            break;
        default:
            header('Content-Type: text/plain');
    }
    
    // Incluir o arquivo
    readfile($filePath);
    return true;
}

// Se o arquivo não existir, tentar servir o index.html (para rotas SPA)
$indexFile = __DIR__ . '/../client/dist/index.html';

if (file_exists($indexFile)) {
    header('Content-Type: text/html');
    readfile($indexFile);
    return true;
}

// Se não houver index.html, retornar 404
http_response_code(404);
echo '404 Not Found';
return true;