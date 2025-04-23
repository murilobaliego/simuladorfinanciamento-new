#!/bin/bash

# Este script inicia o servidor PHP

# Definir a porta do servidor
PORT=5000
HOST=0.0.0.0

echo "Iniciando servidor PHP em http://$HOST:$PORT"
echo "Pressione Ctrl+C para parar o servidor"

# Ir para o diretório raiz do projeto
cd "$(dirname "$0")/.."

# Verificar se o PHP está instalado
if ! command -v php &> /dev/null; then
    echo "Erro: PHP não está instalado."
    echo "Por favor, instale o PHP antes de continuar."
    exit 1
fi

# Verificar a versão do PHP
PHP_VERSION=$(php -v | head -n 1 | cut -d ' ' -f 2 | cut -d '.' -f 1,2)
echo "Versão do PHP: $PHP_VERSION"

# Iniciar o servidor PHP
echo "Executando: php -S $HOST:$PORT php_backend/router.php"
php -S $HOST:$PORT php_backend/router.php