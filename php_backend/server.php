<?php
/**
 * Servidor PHP integrado para desenvolvimento
 * Rotas:
 * - /api/* -> API endpoints
 * - /* -> Arquivos estáticos e rotas do SPA
 */

// Definir a raiz do projeto
$rootPath = __DIR__ . '/../';

// Definir a porta do servidor
$port = 5000;
$host = '0.0.0.0';

echo "Iniciando servidor PHP em http://{$host}:{$port}" . PHP_EOL;
echo "Pressione Ctrl+C para parar o servidor" . PHP_EOL;

// Iniciar o servidor web integrado do PHP
$command = "php -S {$host}:{$port} -t {$rootPath} " . __DIR__ . "/router.php";
system($command);