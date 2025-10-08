#!/bin/bash

# Script para configurar o backend PHP e gerar o frontend

# Definir cores para as mensagens
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Exibir cabeçalho
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}  SIMULADOR DE FINANCIAMENTO - CONFIGURAÇÃO PHP  ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Verificar se PHP está instalado
if ! command -v php &> /dev/null; then
    echo -e "${RED}Erro: PHP não está instalado.${NC}"
    echo -e "${YELLOW}Por favor, instale o PHP antes de continuar.${NC}"
    exit 1
fi

# Verificar versão do PHP
PHP_VERSION=$(php -v | head -n 1 | cut -d ' ' -f 2 | cut -d '.' -f 1,2)
echo -e "${GREEN}Verificação PHP: PHP $PHP_VERSION encontrado${NC}"

# Verificar permissões dos scripts
echo -e "${YELLOW}Verificando permissões dos scripts...${NC}"

chmod +x php_backend/build_frontend.sh
chmod +x php_backend/start.sh
chmod +x start_php_server.sh

echo -e "${GREEN}Scripts configurados com permissão de execução${NC}"

# Compilar o frontend
echo -e "${YELLOW}Compilando o frontend...${NC}"
echo -e "${BLUE}-------------------------------------------------${NC}"

if php_backend/build_frontend.sh; then
    echo -e "${GREEN}Frontend compilado com sucesso!${NC}"
else
    echo -e "${RED}Erro ao compilar o frontend. Abortando.${NC}"
    exit 1
fi

echo -e "${BLUE}-------------------------------------------------${NC}"

# Tudo concluído
echo -e "${GREEN}Configuração concluída!${NC}"
echo -e "${YELLOW}Para iniciar o servidor PHP:${NC}"
echo -e "  ./php_backend/start.sh"
echo -e "${YELLOW}ou${NC}"
echo -e "  ./start_php_server.sh"
echo -e "${BLUE}=================================================${NC}"