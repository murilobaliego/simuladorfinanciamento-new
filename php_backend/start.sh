#!/bin/bash

# Script para iniciar o servidor PHP

# Definir cores para as mensagens
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Navegar para a raiz do projeto
cd "$(dirname "$0")/.." || exit

# Exibir cabeçalho
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}  SIMULADOR DE FINANCIAMENTO - SERVIDOR PHP      ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Verificar se PHP está instalado
if ! command -v php &> /dev/null; then
    echo -e "${RED}Erro: PHP não está instalado.${NC}"
    echo -e "${YELLOW}Por favor, instale o PHP antes de continuar.${NC}"
    exit 1
fi

# Verificar se a pasta dist existe, se não, sugerir construir o frontend
if [ ! -d "client/dist" ]; then
    echo -e "${YELLOW}A pasta client/dist não foi encontrada.${NC}"
    echo -e "${YELLOW}Deseja construir o frontend agora? (s/n)${NC}"
    read -r resposta
    
    if [[ $resposta == "s" || $resposta == "S" ]]; then
        ./php_backend/build_frontend.sh
        # Se o build falhar, sair
        if [ $? -ne 0 ]; then
            exit 1
        fi
    else
        echo -e "${YELLOW}Por favor, construa o frontend antes de iniciar o servidor PHP:${NC}"
        echo -e "${YELLOW}  ./php_backend/build_frontend.sh${NC}"
        exit 1
    fi
fi

# Definir a porta para o servidor
PORTA=${1:-5000}

echo -e "${GREEN}Iniciando servidor PHP na porta $PORTA...${NC}"
echo -e "${BLUE}-------------------------------------------------${NC}"
echo -e "${YELLOW}Servidor disponível em: http://localhost:$PORTA${NC}"
echo -e "${YELLOW}Pressione Ctrl+C para interromper${NC}"
echo -e "${BLUE}-------------------------------------------------${NC}"

# Iniciar o servidor PHP com o router.php
php -S 0.0.0.0:$PORTA php_backend/router.php