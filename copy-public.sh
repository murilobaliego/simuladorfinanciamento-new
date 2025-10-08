#!/bin/bash

# Script para copiar arquivos da pasta public para dist/public
echo "Copiando arquivos da pasta public para dist/public..."

# Criar pasta dist/public se não existir
mkdir -p dist/public

# Copiar todos os arquivos da pasta public para dist/public
cp -R public/* dist/public/

echo "Arquivos copiados com sucesso!"
echo "Lista de arquivos em dist/public:"
ls -la dist/public/