#!/bin/bash

# Este script constrói o frontend e prepara para o deployment

echo "Construindo o frontend..."
cd ../

# Instalar dependências do frontend se necessário
if [ ! -d "node_modules" ]; then
  echo "Instalando dependências do frontend..."
  npm install
fi

# Construir o frontend
echo "Executando build do frontend..."
npm run build

echo "Frontend construído com sucesso!"