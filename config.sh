#!/bin/bash

# Script de configuração do Simulador de Financiamento
# Este script permite selecionar o backend a ser utilizado (Node.js ou PHP)

# Definir cores para as mensagens
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Exibir cabeçalho
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}    SIMULADOR DE FINANCIAMENTO - CONFIGURAÇÃO    ${NC}"
echo -e "${BLUE}=================================================${NC}"

echo -e "\n${YELLOW}Selecione o backend a ser utilizado:${NC}"
echo -e "1. ${GREEN}Node.js${NC} (padrão/original)"
echo -e "2. ${GREEN}PHP${NC} (versão convertida)"
echo -e "\nDigite sua escolha (1 ou 2): "
read -r backend_choice

if [ "$backend_choice" == "1" ]; then
    echo -e "\n${GREEN}Você selecionou o backend Node.js.${NC}"
    echo -e "${YELLOW}Para iniciar o servidor:${NC}"
    echo -e "  npm run dev"
    echo -e "\n${YELLOW}O servidor estará disponível em:${NC} http://localhost:5000"

elif [ "$backend_choice" == "2" ]; then
    echo -e "\n${GREEN}Você selecionou o backend PHP.${NC}"
    
    # Verificar se PHP está instalado
    if ! command -v php &> /dev/null; then
        echo -e "${RED}Erro: PHP não está instalado.${NC}"
        echo -e "${YELLOW}Por favor, instale o PHP antes de continuar.${NC}"
        exit 1
    fi
    
    # Verificar se os scripts estão com permissão de execução
    if [ ! -x "php_backend/build_frontend.sh" ] || [ ! -x "php_backend/start.sh" ]; then
        echo -e "${YELLOW}Configurando permissões dos scripts...${NC}"
        chmod +x php_backend/*.sh
    fi
    
    echo -e "\n${YELLOW}Deseja compilar o frontend agora? (s/n):${NC} "
    read -r compile_choice
    
    if [[ $compile_choice == "s" || $compile_choice == "S" ]]; then
        # Compilar o frontend
        if php_backend/build_frontend.sh; then
            echo -e "${GREEN}Frontend compilado com sucesso!${NC}"
        else
            echo -e "${RED}Erro ao compilar o frontend.${NC}"
            exit 1
        fi
    fi
    
    echo -e "\n${YELLOW}Para iniciar o servidor PHP:${NC}"
    echo -e "  ./php_backend/start.sh"
    echo -e "\n${YELLOW}O servidor estará disponível em:${NC} http://localhost:5000"
    
else
    echo -e "\n${RED}Opção inválida. Por favor, execute novamente o script e selecione 1 ou 2.${NC}"
    exit 1
fi

echo -e "\n${BLUE}=================================================${NC}"