# Deploy na KingHost com Node.js

## Passo 1: Build do Projeto

No seu computador local:
```bash
cd c:\temp\FinanciamentoFacil\FinanciamentoFacil
npm run build
```

## Passo 2: Preparar Arquivos para Upload

Você precisa enviar:
- Pasta `dist/` (arquivos compilados)
- Arquivo `package.json`
- Arquivo `package-lock.json`

## Passo 3: Acessar Painel KingHost

1. Acesse o Painel de Controle da KingHost
2. Selecione seu domínio
3. Clique no ícone **NODE.JS**
4. Clique em **Nova Aplicação**

## Passo 4: Configurar Aplicação

Preencha os campos:

- **Nome da Aplicação**: financiamento
- **Script de Inicialização**: `index.js`
- **Diretório da Aplicação**: `/dist`
- **Versão do Node.js**: Selecione a mais recente (18.x ou superior)

## Passo 5: Upload dos Arquivos via FTP

1. Conecte via FTP ao servidor KingHost
2. Navegue até a pasta da aplicação (geralmente `/public_html/`)
3. Crie a estrutura:
   ```
   /public_html/
   ├── dist/
   │   ├── index.js
   │   └── public/
   │       ├── index.html
   │       ├── assets/
   │       └── ...
   ├── package.json
   └── package-lock.json
   ```

## Passo 6: Instalar Dependências

Via SSH ou Terminal do Painel:
```bash
cd /public_html
npm install --production
```

## Passo 7: Iniciar Aplicação

No Painel de Controle KingHost:
1. Vá em **NODE.JS**
2. Clique em **Iniciar** na sua aplicação
3. Anote a **porta** que foi atribuída (ex: 21220)

## Passo 8: Configurar Domínio

A KingHost configura automaticamente o proxy reverso. Sua aplicação estará acessível em:
- `http://seudominio.com` (porta 80)
- `https://seudominio.com` (porta 443)

## Importante: Variável de Ambiente da Porta

A KingHost define automaticamente a variável `PORT_INDEX` (onde INDEX é o nome do seu script).

Se seu script é `index.js`, a variável será `PORT_INDEX`.

O código já está adaptado para usar:
```javascript
const port = process.env.PORT_INDEX || process.env.PORT || 5000;
```

## Verificar se Está Funcionando

1. No Painel KingHost, verifique se o status está "Rodando"
2. Acesse seu domínio no navegador
3. Verifique os logs no Painel de Controle

## Atualizar a Aplicação

Quando fizer mudanças:

1. Build local:
   ```bash
   npm run build
   ```

2. Upload da pasta `dist/` via FTP

3. No Painel KingHost:
   - Clique em **Parar**
   - Clique em **Iniciar**

## Script de Deploy Automático

Crie `deploy-kinghost.sh`:
```bash
#!/bin/bash
echo "Building..."
npm run build

echo "Uploading to KingHost..."
# Substitua com suas credenciais FTP
lftp -u usuario,senha ftp.seudominio.com.br <<EOF
mirror -R dist/ /public_html/dist/
put package.json -o /public_html/package.json
bye
EOF

echo "Deploy completed! Restart the app in KingHost panel."
```

## Troubleshooting

**Aplicação não inicia:**
- Verifique os logs no Painel de Controle
- Confirme que `package.json` tem todas as dependências
- Verifique se o script de inicialização está correto (`index.js`)

**Erro de porta:**
- A aplicação deve usar `process.env.PORT_INDEX`
- Não tente usar porta fixa como 5000 em produção

**Erro 502 Bad Gateway:**
- Aplicação não está rodando
- Verifique logs e reinicie no painel

## Monitoramento

A KingHost usa PM2 internamente. Você pode ver:
- Status da aplicação no Painel
- Logs em tempo real
- Uso de recursos (CPU/RAM)

## Suporte

Se tiver problemas, contate o suporte da KingHost com:
- Nome da aplicação
- Mensagens de erro dos logs
- Passos que você seguiu
