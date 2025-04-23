# Instruções de Deploy - Simulador de Financiamento

Este documento contém instruções detalhadas para implantar o Simulador de Financiamento em seu próprio servidor.

## Requisitos do Servidor

- Servidor web (Apache, Nginx, etc.)
- PHP 8.0 ou superior
- Node.js 16+ (apenas para compilação)
- npm ou yarn (apenas para compilação)

## Opção 1: Deploy Automático (Recomendado)

### Passo 1: Preparar o ambiente
1. Clone o repositório em sua máquina local
2. Instale as dependências:
   ```bash
   npm install
   ```

### Passo 2: Execute o script de deploy
1. Execute o script de deploy:
   ```bash
   ./deploy.sh
   ```
2. O script irá:
   - Compilar o frontend React
   - Compilar o backend Node.js (se necessário)
   - Preparar os arquivos PHP
   - Criar arquivos de configuração de exemplo para Apache e Nginx
   - Empacotar tudo em um arquivo ZIP

### Passo 3: Upload para seu servidor
1. Faça upload do arquivo `simulador-financiamento-deploy.zip` para seu servidor
2. Descompacte o arquivo no diretório raiz do seu servidor web:
   ```bash
   unzip simulador-financiamento-deploy.zip -d /caminho/para/raiz/do/servidor
   ```

### Passo 4: Configure seu servidor web
- Para Apache: use o arquivo `apache-example.conf` como referência
- Para Nginx: use o arquivo `nginx-example.conf` como referência
- Ajuste as configurações conforme necessário para seu ambiente

## Opção 2: Deploy Manual

### Passo 1: Compilar o frontend
1. Compile o frontend React:
   ```bash
   npm run build
   ```
2. Os arquivos compilados serão gerados na pasta `dist/`

### Passo 2: Preparar os arquivos PHP
1. Certifique-se de que os arquivos PHP estão prontos para produção:
   - Finance.php (cálculos financeiros)
   - Validator.php (validação de dados)
   - index.php (ponto de entrada da API)
   - router.php (roteamento da API)

### Passo 3: Organizar arquivos para upload
1. Crie uma estrutura de diretórios para o deploy:
   ```
   /public_html (ou diretório raiz do servidor)
   ├── index.html (e outros arquivos do frontend)
   ├── assets/ (arquivos estáticos do frontend)
   └── api/ (arquivos PHP do backend)
       ├── index.php
       ├── Finance.php
       ├── Validator.php
       └── .htaccess
   ```

### Passo 4: Configurar o servidor web

#### Para Apache
Crie um arquivo `.htaccess` na raiz:
```apache
# Habilitar motor de reescrita
RewriteEngine On

# Redirecionar todas as requisições que não são para arquivos ou diretórios existentes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Para API PHP (não reescrever)
RewriteRule ^api/ - [L]

# Para o frontend (SPA), reescrever para index.html
RewriteRule ^(.*)$ index.html [L]
```

#### Para Nginx
Configure seu servidor Nginx:
```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;
    root /caminho/para/deploy;
    index index.html index.php;

    # Configuração para o frontend (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Configuração para a API PHP
    location /api/ {
        try_files $uri $uri/ /api/index.php?$args;
        
        # Configurações PHP
        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;  # Ajuste para sua versão do PHP
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_param PATH_INFO $fastcgi_path_info;
        }
    }

    # Configurações adicionais para segurança
    location ~ /\.ht {
        deny all;
    }
}
```

## Configurações Adicionais e Otimizações

### SEO e Mecanismos de Busca
1. Crie um arquivo `robots.txt` na raiz do seu site:
   ```
   User-agent: *
   Allow: /
   
   Sitemap: https://seu-dominio.com.br/sitemap.xml
   ```

2. Crie um arquivo `sitemap.xml` básico:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://seu-dominio.com.br/</loc>
       <lastmod>2023-04-23</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://seu-dominio.com.br/simulador-financiamento-veiculos</loc>
       <lastmod>2023-04-23</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://seu-dominio.com.br/financiamento-imobiliario</loc>
       <lastmod>2023-04-23</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://seu-dominio.com.br/emprestimo-pessoal</loc>
       <lastmod>2023-04-23</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://seu-dominio.com.br/credito-consignado</loc>
       <lastmod>2023-04-23</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
   </urlset>
   ```

### Segurança
1. Configure HTTPS com Let's Encrypt ou outro provedor de certificado SSL
2. Adicione cabeçalhos de segurança no servidor:
   - Para Apache (adicione ao .htaccess):
     ```apache
     # Cabeçalhos de segurança
     <IfModule mod_headers.c>
       Header set X-Content-Type-Options "nosniff"
       Header set X-XSS-Protection "1; mode=block"
       Header set X-Frame-Options "SAMEORIGIN"
       Header set Referrer-Policy "strict-origin-when-cross-origin"
       Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
     </IfModule>
     ```
   
   - Para Nginx:
     ```nginx
     # Adicione ao bloco server
     add_header X-Content-Type-Options "nosniff" always;
     add_header X-XSS-Protection "1; mode=block" always;
     add_header X-Frame-Options "SAMEORIGIN" always;
     add_header Referrer-Policy "strict-origin-when-cross-origin" always;
     add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;" always;
     ```

### Desempenho
1. Configure cache para recursos estáticos:
   - Para Apache (adicione ao .htaccess):
     ```apache
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
     ```
   
   - Para Nginx:
     ```nginx
     # Adicione ao bloco location
     location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
       expires 1y;
       add_header Cache-Control "public, no-transform";
     }
     ```

2. Considere adicionar um CDN (Content Delivery Network) como Cloudflare ou Amazon CloudFront para melhorar o desempenho.

## Manutenção e Atualizações

Para manter o site seguro e atualizado:

1. Mantenha o PHP atualizado com as últimas versões de segurança
2. Faça backup regular dos arquivos e configurações
3. Monitore o desempenho do servidor e logs de erros
4. Se estiver usando Apache ou Nginx, mantenha-os atualizados com as últimas versões de segurança

## Suporte

Em caso de problemas durante a implementação, você pode:

1. Verificar os logs de erro do servidor web
2. Testar a API separadamente usando ferramentas como Postman
3. Verificar se as permissões dos arquivos estão configuradas corretamente
4. Contatar o desenvolvedor através do email de suporte