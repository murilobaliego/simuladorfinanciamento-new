#!/bin/bash

# Este script prepara os arquivos para deploy

# Verifica se a pasta dist existe
if [ ! -d "dist" ]; then
  echo "Erro: Pasta dist não encontrada. Execute 'npm run build' primeiro."
  exit 1
fi

# Copia os arquivos de roteamento para a pasta dist
echo "Copiando arquivos de configuração de roteamento..."
cp -f public/_redirects dist/ 2>/dev/null || echo "Aviso: Não foi possível copiar _redirects"
cp -f public/.htaccess dist/ 2>/dev/null || echo "Aviso: Não foi possível copiar .htaccess"

echo "Criando arquivo vercel.json na pasta dist..."
cat > dist/vercel.json << 'EOL'
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
EOL

echo "Configuração de roteamento concluída. Execute os seguintes passos:"
echo "1. Faça o deploy da pasta 'dist'"
echo "2. Certifique-se de que o servidor web está configurado para SPA (Single Page Application)"
echo "3. Para NGINX adicione a seguinte configuração:"
echo "   location / {"
echo "     try_files \$uri \$uri/ /index.html;"
echo "   }"

# Tornar o script executável
chmod +x prepare-deploy.sh

echo "Concluído! Execute './prepare-deploy.sh' antes de fazer o deploy."