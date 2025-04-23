#!/bin/bash

# Script para deploy do Simulador de Financiamento via SSH
# Este script compila o projeto e faz deploy automático no servidor remoto

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configurações do servidor (estas serão solicitadas durante a execução)
SSH_USER=""
SSH_HOST=""
SSH_PORT="22"
SERVER_PATH=""
SERVER_TYPE="" # apache ou nginx

# Função para validar entrada obrigatória
function validate_input {
  local input=$1
  local message=$2
  
  while [ -z "$input" ]; do
    echo -e "${YELLOW}$message${NC}"
    read input
  done
  
  echo "$input"
}

# Obter dados do servidor
echo -e "${YELLOW}Configuração do servidor para deploy automático via SSH${NC}"

echo -e "${YELLOW}Digite o usuário SSH (ex: root):${NC}"
read SSH_USER
SSH_USER=$(validate_input "$SSH_USER" "Usuário SSH é obrigatório. Digite o usuário SSH:")

echo -e "${YELLOW}Digite o host SSH (ex: meuservidor.com.br ou IP):${NC}"
read SSH_HOST
SSH_HOST=$(validate_input "$SSH_HOST" "Host SSH é obrigatório. Digite o host SSH:")

echo -e "${YELLOW}Digite a porta SSH (padrão: 22):${NC}"
read PORT_INPUT
if [ ! -z "$PORT_INPUT" ]; then
  SSH_PORT=$PORT_INPUT
fi

echo -e "${YELLOW}Digite o caminho completo para o diretório raiz do site no servidor (ex: /var/www/html):${NC}"
read SERVER_PATH
SERVER_PATH=$(validate_input "$SERVER_PATH" "Caminho do servidor é obrigatório. Digite o caminho:")

echo -e "${YELLOW}Qual o tipo de servidor web? (apache/nginx):${NC}"
read SERVER_TYPE
while [[ "$SERVER_TYPE" != "apache" && "$SERVER_TYPE" != "nginx" ]]; do
  echo -e "${YELLOW}Por favor, digite 'apache' ou 'nginx':${NC}"
  read SERVER_TYPE
done

# Verificar conexão SSH
echo -e "${YELLOW}Testando conexão SSH...${NC}"
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "echo 'Conexão SSH bem-sucedida!'" 2>/dev/null

if [ $? -ne 0 ]; then
  echo -e "${RED}Não foi possível conectar via SSH. Verifique as credenciais e tente novamente.${NC}"
  
  echo -e "${YELLOW}Você está usando autenticação por chave SSH ou senha?${NC}"
  echo -e "${YELLOW}1) Chave SSH (recomendado)${NC}"
  echo -e "${YELLOW}2) Senha${NC}"
  read AUTH_TYPE
  
  if [ "$AUTH_TYPE" == "2" ]; then
    echo -e "${YELLOW}Para deploy automático com senha, você precisará instalar o 'sshpass':${NC}"
    echo -e "${YELLOW}Em Ubuntu/Debian: sudo apt-get install sshpass${NC}"
    echo -e "${YELLOW}Em CentOS/RHEL: sudo yum install sshpass${NC}"
    echo -e "${YELLOW}Em macOS: brew install hudochenkov/sshpass/sshpass${NC}"
    
    echo -e "${YELLOW}Digite sua senha SSH (não será exibida):${NC}"
    read -s SSH_PASSWORD
    
    if [ -z "$SSH_PASSWORD" ]; then
      echo -e "${RED}Senha não fornecida. Abortando.${NC}"
      exit 1
    fi
    
    # Testar sshpass
    command -v sshpass >/dev/null 2>&1 || { 
      echo -e "${RED}O programa 'sshpass' não está instalado. Instale-o para continuar.${NC}"; 
      exit 1; 
    }
    
    # Testar conexão com sshpass
    sshpass -p "$SSH_PASSWORD" ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "echo 'Conexão SSH bem-sucedida!'" 2>/dev/null
    if [ $? -ne 0 ]; then
      echo -e "${RED}Não foi possível conectar via SSH mesmo com senha. Abortando.${NC}"
      exit 1
    fi
    
    SSH_CMD="sshpass -p \"$SSH_PASSWORD\" ssh -p $SSH_PORT $SSH_USER@$SSH_HOST"
    SCP_CMD="sshpass -p \"$SSH_PASSWORD\" scp -P $SSH_PORT"
  else
    echo -e "${RED}Não foi possível conectar via SSH usando chave. Verifique sua configuração SSH.${NC}"
    exit 1
  fi
else
  SSH_CMD="ssh -p $SSH_PORT $SSH_USER@$SSH_HOST"
  SCP_CMD="scp -P $SSH_PORT"
fi

# Iniciar o processo de build e deploy
echo -e "${YELLOW}Iniciando preparação para deploy do Simulador de Financiamento...${NC}"

# 1. Compilar o frontend e o backend
echo -e "${YELLOW}Compilando o projeto...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Erro ao compilar o projeto. Abortando.${NC}"
  exit 1
fi

echo -e "${GREEN}Compilação concluída com sucesso!${NC}"

# 2. Criar diretório de deploy temporário
rm -rf deploy_temp
mkdir -p deploy_temp

# 3. Copiar arquivos compilados do frontend para a pasta de deploy
echo -e "${YELLOW}Preparando arquivos do frontend...${NC}"
cp -r dist/* deploy_temp/

# 4. Copiar arquivos PHP para a pasta de deploy
echo -e "${YELLOW}Preparando arquivos do backend PHP...${NC}"
mkdir -p deploy_temp/api
cp -r php_backend/* deploy_temp/api/

# 5. Criar arquivos de configuração do servidor
if [ "$SERVER_TYPE" == "apache" ]; then
  echo -e "${YELLOW}Criando arquivo .htaccess para Apache...${NC}"
  cat > deploy_temp/.htaccess << EOF
# Habilitar motor de reescrita
RewriteEngine On

# Redirecionar todas as requisições que não são para arquivos ou diretórios existentes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Para API PHP (não reescrever)
RewriteRule ^api/ - [L]

# Para o frontend (SPA), reescrever para index.html
RewriteRule ^(.*)$ index.html [L]

# Cabeçalhos de segurança
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Cache para arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType application/x-font-woff "access plus 1 year"
</IfModule>
EOF
fi

# 6. Criar robots.txt e sitemap.xml para SEO
echo -e "${YELLOW}Criando arquivos para SEO...${NC}"
cat > deploy_temp/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://$SSH_HOST/sitemap.xml
EOF

CURRENT_DATE=$(date +"%Y-%m-%d")
cat > deploy_temp/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://$SSH_HOST/</loc>
    <lastmod>$CURRENT_DATE</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://$SSH_HOST/simulador-financiamento-veiculos</loc>
    <lastmod>$CURRENT_DATE</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://$SSH_HOST/financiamento-imobiliario</loc>
    <lastmod>$CURRENT_DATE</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://$SSH_HOST/emprestimo-pessoal</loc>
    <lastmod>$CURRENT_DATE</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://$SSH_HOST/credito-consignado</loc>
    <lastmod>$CURRENT_DATE</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
EOF

# 7. Empacotar todos os arquivos para transferência
echo -e "${YELLOW}Empacotando arquivos para transferência...${NC}"
cd deploy_temp
tar -czf ../deploy_package.tar.gz .
cd ..

# 8. Enviar o pacote para o servidor
echo -e "${YELLOW}Enviando pacote para o servidor...${NC}"
eval "$SCP_CMD deploy_package.tar.gz $SSH_USER@$SSH_HOST:/tmp/"

if [ $? -ne 0 ]; then
  echo -e "${RED}Erro ao enviar o pacote para o servidor. Abortando.${NC}"
  exit 1
fi

# 9. Descompactar e configurar no servidor
echo -e "${YELLOW}Configurando no servidor...${NC}"

# Criar comando a ser executado no servidor
REMOTE_COMMAND="
echo 'Preparando diretório de destino...' &&
mkdir -p $SERVER_PATH &&
echo 'Descompactando pacote...' &&
tar -xzf /tmp/deploy_package.tar.gz -C $SERVER_PATH &&
echo 'Configurando permissões...' &&
if command -v chown &> /dev/null; then
  chown -R www-data:www-data $SERVER_PATH 2>/dev/null || true
fi &&
chmod -R 755 $SERVER_PATH &&
echo 'Removendo pacote temporário...' &&
rm /tmp/deploy_package.tar.gz &&
echo 'Deploy concluído!' 
"

# Executar comando no servidor
echo -e "${YELLOW}Executando configuração no servidor...${NC}"
eval "$SSH_CMD \"$REMOTE_COMMAND\""

if [ $? -ne 0 ]; then
  echo -e "${RED}Ocorreram erros durante a configuração no servidor.${NC}"
  echo -e "${YELLOW}Verifique manualmente o estado do deploy.${NC}"
  exit 1
fi

# 10. Configuração do servidor web (se o usuário tiver permissão)
if [ "$SERVER_TYPE" == "nginx" ]; then
  echo -e "${YELLOW}Você deseja configurar o Nginx automaticamente? (s/n):${NC}"
  read CONFIG_NGINX
  
  if [ "$CONFIG_NGINX" == "s" ] || [ "$CONFIG_NGINX" == "S" ]; then
    NGINX_CONF="server {
    listen 80;
    server_name $SSH_HOST;
    root $SERVER_PATH;
    index index.html index.php;

    # Configuração para o frontend (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Configuração para a API PHP
    location /api/ {
        try_files \$uri \$uri/ /api/index.php?\$args;
        
        # Configurações PHP
        location ~ \\.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
            fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
            fastcgi_param PATH_INFO \$fastcgi_path_info;
        }
    }

    # Configurações adicionais para segurança
    location ~ /\\.ht {
        deny all;
    }
    
    # Headers de segurança
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;
    
    # Cache para recursos estáticos
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
      expires 1y;
      add_header Cache-Control \"public, no-transform\";
    }
}"

    # Enviar configuração Nginx para o servidor
    echo "$NGINX_CONF" > nginx_site.conf
    eval "$SCP_CMD nginx_site.conf $SSH_USER@$SSH_HOST:/tmp/"
    
    # Comandos para instalar configuração do Nginx
    NGINX_SETUP="
    if [ -d /etc/nginx/sites-available ]; then
      # Debian/Ubuntu style
      mv /tmp/nginx_site.conf /etc/nginx/sites-available/$SSH_HOST.conf
      ln -sf /etc/nginx/sites-available/$SSH_HOST.conf /etc/nginx/sites-enabled/
    else
      # CentOS/RHEL style
      mv /tmp/nginx_site.conf /etc/nginx/conf.d/$SSH_HOST.conf
    fi
    
    # Testar e recarregar Nginx se o teste for bem-sucedido
    nginx -t && systemctl reload nginx
    "
    
    echo -e "${YELLOW}Configurando Nginx no servidor...${NC}"
    eval "$SSH_CMD \"$NGINX_SETUP\""
    
    if [ $? -ne 0 ]; then
      echo -e "${RED}Erro ao configurar Nginx. Você pode precisar configurar manualmente.${NC}"
      echo -e "${YELLOW}Arquivo de configuração disponível em: /tmp/nginx_site.conf no servidor${NC}"
    else
      echo -e "${GREEN}Nginx configurado com sucesso!${NC}"
    fi
    
    # Limpar arquivo de configuração local
    rm -f nginx_site.conf
  fi
fi

# Limpar arquivos temporários
echo -e "${YELLOW}Limpando arquivos temporários...${NC}"
rm -rf deploy_temp
rm -f deploy_package.tar.gz

echo -e "${GREEN}Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}Seu site está agora disponível em: http://$SSH_HOST/${NC}"
echo -e "${YELLOW}Recomendações adicionais:${NC}"
echo -e "  - Configure HTTPS usando Let's Encrypt: https://certbot.eff.org/"
echo -e "  - Verifique se o PHP está configurado corretamente no servidor"
echo -e "  - Monitore os logs de erro do servidor para identificar possíveis problemas"