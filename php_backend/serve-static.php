<?php
/**
 * Este arquivo serve os arquivos estáticos do frontend
 * Em produção, recomenda-se usar um servidor web como Apache ou Nginx
 */

// Função para determinar o tipo MIME com base na extensão do arquivo
function getMimeType($filename) {
    $mime_types = [
        'txt' => 'text/plain',
        'htm' => 'text/html',
        'html' => 'text/html',
        'php' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'xml' => 'application/xml',
        'swf' => 'application/x-shockwave-flash',
        'flv' => 'video/x-flv',
        
        // imagens
        'png' => 'image/png',
        'jpe' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'gif' => 'image/gif',
        'bmp' => 'image/bmp',
        'ico' => 'image/vnd.microsoft.icon',
        'tiff' => 'image/tiff',
        'tif' => 'image/tiff',
        'svg' => 'image/svg+xml',
        'svgz' => 'image/svg+xml',
        
        // arquivos
        'zip' => 'application/zip',
        'rar' => 'application/x-rar-compressed',
        'exe' => 'application/x-msdownload',
        'msi' => 'application/x-msdownload',
        'cab' => 'application/vnd.ms-cab-compressed',
        
        // audio/video
        'mp3' => 'audio/mpeg',
        'qt' => 'video/quicktime',
        'mov' => 'video/quicktime',
        
        // fontes
        'ttf' => 'font/ttf',
        'otf' => 'font/otf',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'eot' => 'application/vnd.ms-fontobject',
    ];
    
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    
    if (array_key_exists($ext, $mime_types)) {
        return $mime_types[$ext];
    } else {
        return 'application/octet-stream';
    }
}

// Definindo o diretório raiz dos arquivos estáticos
$dir = __DIR__ . '/../client/dist';

// Obtendo o caminho do arquivo solicitado
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Se a URL for a raiz, servir o index.html
if ($path === '/' || empty($path)) {
    $path = '/index.html';
}

// Caminho completo para o arquivo
$file = $dir . $path;

// Verificar se o arquivo existe
if (file_exists($file) && !is_dir($file)) {
    // Definir o content-type correto
    header('Content-Type: ' . getMimeType($file));
    
    // Servir o arquivo
    readfile($file);
    exit;
}

// Se o arquivo não existe, tentar servir o index.html (para rotas SPA)
if (!file_exists($file) || is_dir($file)) {
    // Verificar se estamos lidando com uma rota do frontend (não API)
    if (strpos($path, '/api/') !== 0) {
        $indexFile = $dir . '/index.html';
        
        if (file_exists($indexFile)) {
            header('Content-Type: text/html');
            readfile($indexFile);
            exit;
        }
    }
}

// Se chegou aqui, o arquivo não foi encontrado
header('HTTP/1.0 404 Not Found');
echo '404 Not Found';