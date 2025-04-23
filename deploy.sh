#!/bin/bash

# Script para deploy do Simulador de Financiamento
# Este script prepara os arquivos para deploy em um servidor Apache/Nginx com PHP

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando preparação para deploy do Simulador de Financiamento...${NC}"

# 1. Compilar o frontend e o backend
echo -e "${YELLOW}Compilando o projeto...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Erro ao compilar o projeto. Aborting.${NC}"
  exit 1
fi

echo -e "${GREEN}Compilação concluída com sucesso!${NC}"

# 2. Criar diretório de deploy se não existir
mkdir -p deploy

# 3. Copiar arquivos compilados do frontend para a pasta de deploy
echo -e "${YELLOW}Copiando arquivos do frontend...${NC}"
cp -r dist/* deploy/

# 4. Não precisamos mais de backend PHP
echo -e "${GREEN}Frontend-only: Backend PHP removido, usando cálculos no cliente...${NC}"

# 5. Criar arquivo .htaccess para configurar o Apache (se necessário)
echo -e "${YELLOW}Criando arquivo .htaccess...${NC}"
cat > deploy/.htaccess << EOF
# Habilitar motor de reescrita
RewriteEngine On

# Redirecionar todas as requisições que não são para arquivos ou diretórios existentes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Para o frontend (SPA), reescrever para index.html
RewriteRule ^(.*)$ index.html [L]
EOF

# 6. Criar um arquivo de configuração de servidor de exemplo
echo -e "${YELLOW}Criando arquivo de configuração de exemplo para nginx...${NC}"
cat > deploy/nginx-example.conf << EOF
server {
    listen 80;
    server_name simuladorfinanciamento.com.br www.simuladorfinanciamento.com.br;
    root /caminho/para/deploy;
    index index.html;

    # Configuração para o frontend (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache para recursos estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Configurações adicionais para segurança
    location ~ /\.ht {
        deny all;
    }
    
    # Headers de segurança
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF

echo -e "${YELLOW}Criando arquivo de configuração de exemplo para Apache...${NC}"
cat > deploy/apache-example.conf << EOF
<VirtualHost *:80>
    ServerName simuladorfinanciamento.com.br
    ServerAlias www.simuladorfinanciamento.com.br
    DocumentRoot /caminho/para/deploy

    <Directory /caminho/para/deploy>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/simulador-error.log
    CustomLog \${APACHE_LOG_DIR}/simulador-access.log combined
</VirtualHost>
EOF

# 7. Criar arquivo README com instruções
echo -e "${YELLOW}Criando instruções de deploy...${NC}"
cat > deploy/README.md << EOF
# Instruções de Deploy - Simulador de Financiamento

## Requisitos do Servidor
- Servidor web Apache ou Nginx
- Permissões adequadas para os diretórios

## Vantagens desta Versão
- Frontend-only: Todos os cálculos são realizados diretamente no navegador
- Não necessita de PHP, Node.js ou qualquer outro backend
- Deploy simplificado e econômico
- Melhor performance e menor tempo de resposta
- Funciona até mesmo em ambientes de hospedagem estática

## Passos para Deploy

### 1. Upload dos Arquivos
Faça upload de todos os arquivos desta pasta para o diretório raiz do seu servidor web.

### 2. Configuração do Servidor Web

#### Para Apache:
- Certifique-se de que o mod_rewrite está ativado
- O arquivo .htaccess já está configurado
- Use o arquivo apache-example.conf como referência para configurar um virtualhost

#### Para Nginx:
- Use o arquivo nginx-example.conf como referência para configurar o site

### 4. Permissões
- Certifique-se de que os arquivos e diretórios têm as permissões corretas:
  \`\`\`
  chown -R www-data:www-data /caminho/para/deploy
  chmod -R 755 /caminho/para/deploy
  \`\`\`

### 5. Teste
- Acesse o site no navegador para verificar se está funcionando corretamente.

### 6. Configuração HTTPS (Recomendado)
- Recomendamos fortemente configurar HTTPS usando Let's Encrypt ou outro provedor de certificado SSL.

## Suporte
Em caso de problemas, entre em contato através de contato@simuladorfinanciamento.com.br
EOF

# 8. Zipar tudo para facilitar o upload
echo -e "${YELLOW}Criando arquivo zip para fácil upload...${NC}"
cd deploy
zip -r ../simulador-financiamento-deploy.zip ./*
cd ..

echo -e "${GREEN}Deploy preparado com sucesso!${NC}"
echo -e "${GREEN}Arquivos disponíveis:${NC}"
echo -e "  - Pasta 'deploy': Contém todos os arquivos prontos para upload"
echo -e "  - 'simulador-financiamento-deploy.zip': Arquivo compactado para fácil upload"
echo -e "${YELLOW}Consulte o arquivo deploy/README.md para instruções detalhadas de instalação no servidor.${NC}"