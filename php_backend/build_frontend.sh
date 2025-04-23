#!/bin/bash

# Script para construir o frontend para uso com o servidor PHP

# Definir cores para as mensagens
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Exibir cabeçalho
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}   SIMULADOR DE FINANCIAMENTO - BUILD FRONTEND   ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Navegar para a raiz do projeto
cd "$(dirname "$0")/.." || exit

echo -e "${YELLOW}Compilando o frontend...${NC}"
echo -e "${BLUE}-------------------------------------------------${NC}"

# Compilar o frontend com o Vite
npm run build

# Verificar se a compilação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro na compilação do frontend.${NC}"
    exit 1
fi

echo -e "${BLUE}-------------------------------------------------${NC}"
echo -e "${GREEN}Frontend compilado com sucesso!${NC}"
echo -e "${YELLOW}Os arquivos estão disponíveis em: client/dist${NC}"

exit 0