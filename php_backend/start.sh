#!/bin/bash

# Este script inicia o servidor PHP

# Definir a porta do servidor
PORT=5000
HOST=0.0.0.0

echo "Iniciando servidor PHP em http://$HOST:$PORT"
echo "Pressione Ctrl+C para parar o servidor"

# Ir para o diretório raiz do projeto
cd "$(dirname "$0")/.."

# Iniciar o servidor PHP
php -S $HOST:$PORT php_backend/router.php