#!/bin/bash

# Este script compila o frontend e inicia o servidor PHP
# Para uso em desenvolvimento

# Definir cores para as mensagens
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Exibir cabeçalho
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}  SIMULADOR DE FINANCIAMENTO - SERVIDOR PHP      ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Verificar se o PHP está instalado
if ! command -v php &> /dev/null; then
    echo -e "${RED}Erro: PHP não está instalado.${NC}"
    echo -e "${YELLOW}Por favor, instale o PHP antes de continuar:${NC}"
    echo -e "  sudo apt install php"
    exit 1
fi

# Verificar a versão do PHP
PHP_VERSION=$(php -v | head -n 1 | cut -d ' ' -f 2 | cut -d '.' -f 1,2)
echo -e "${GREEN}PHP versão $PHP_VERSION detectado${NC}"

# Compilar o frontend se a pasta dist não existir ou se for solicitado
if [ ! -d "client/dist" ] || [ "$1" == "--build" ]; then
    echo -e "${YELLOW}Compilando o frontend...${NC}"
    echo -e "${BLUE}-------------------------------------------------${NC}"
    npm run build
    echo -e "${BLUE}-------------------------------------------------${NC}"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Erro na compilação do frontend.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Frontend compilado com sucesso!${NC}"
else
    echo -e "${YELLOW}Usando a build existente do frontend.${NC}"
    echo -e "${YELLOW}Use --build para recompilar o frontend.${NC}"
fi

# Iniciar o servidor PHP
echo -e "${GREEN}Iniciando servidor PHP...${NC}"
echo -e "${BLUE}-------------------------------------------------${NC}"
echo -e "${YELLOW}Servidor PHP iniciando em http://localhost:5000${NC}"
echo -e "${YELLOW}Pressione Ctrl+C para interromper${NC}"
echo -e "${BLUE}-------------------------------------------------${NC}"

# Iniciar o servidor PHP
php -S 0.0.0.0:5000 php_backend/router.php