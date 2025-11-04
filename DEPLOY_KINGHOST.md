# Deploy na KingHost com Node.js

## Informações do Servidor

- **Host SSH**: ftp.simuladorfinanciamento.com
- **Usuário**: simuladorfinanciamento
- **Diretório Apps**: `~/apps_nodejs/`
- **Diretório Logs**: `~/.pm2/logs/`
- **Node.js**: v22.1.0
- **Gerenciador**: PM2

## Passo 1: Build Local

```bash
cd c:\temp\FinanciamentoFacil\FinanciamentoFacil
npm run build
```

Isso gera:
- `dist/index.js` (servidor)
- `dist/public/` (frontend)

## Passo 2: Parar Aplicação Atual

Via SSH:
```bash
ssh simuladorfinanciamento@ftp.simuladorfinanciamento.com
pm2 stop simuladorfinanciamento
pm2 delete simuladorfinanciamento
```

## Passo 3: Upload via FTP/SCP

Opção A - SCP (recomendado):
```bash
# Da sua máquina local
scp -r dist/* simuladorfinanciamento@ftp.simuladorfinanciamento.com:~/apps_nodejs/
scp package.json simuladorfinanciamento@ftp.simuladorfinanciamento.com:~/apps_nodejs/
scp package-lock.json simuladorfinanciamento@ftp.simuladorfinanciamento.com:~/apps_nodejs/
```

Opção B - FTP:
1. Conecte via FileZilla/WinSCP
2. Navegue até `/home/simuladorfinanciamento/apps_nodejs/`
3. Envie:
   - `dist/index.js`
   - `dist/public/` (pasta completa)
   - `package.json`
   - `package-lock.json`

## Passo 4: Instalar Dependências

Via SSH:
```bash
cd ~/apps_nodejs
nvm use 22.1.0
npm install --production
```

## Passo 5: Iniciar com PM2

```bash
cd ~/apps_nodejs
NODE_ENV=production pm2 start dist/index.js --name simuladorfinanciamento
pm2 save
```

## Passo 6: Verificar Status

```bash
pm2 list
pm2 logs simuladorfinanciamento --lines 50
```

## Verificar Logs de Erro

Se houver problemas:
```bash
cat ~/.pm2/logs/simuladorfinanciamento-error.log
cat ~/.pm2/logs/simuladorfinanciamento-out.log
```

## Script de Deploy Completo

Crie `deploy.sh` no Windows:
```bash
#!/bin/bash
echo "=== Building ==="
npm run build

echo "=== Uploading ==="
scp -r dist/* simuladorfinanciamento@ftp.simuladorfinanciamento.com:~/apps_nodejs/
scp package.json simuladorfinanciamento@ftp.simuladorfinanciamento.com:~/apps_nodejs/

echo "=== Restarting ==="
ssh simuladorfinanciamento@ftp.simuladorfinanciamento.com << 'EOF'
cd ~/apps_nodejs
nvm use 22.1.0
npm install --production
pm2 restart simuladorfinanciamento || NODE_ENV=production pm2 start dist/index.js --name simuladorfinanciamento
pm2 save
EOF

echo "=== Deploy Complete ==="
```

Execute:
```bash
bash deploy.sh
```

## Troubleshooting

**Erro: 471 restarts**
```bash
# Ver erro específico
pm2 logs simuladorfinanciamento --err --lines 100

# Possíveis causas:
# 1. Falta NODE_ENV=production
# 2. Porta em uso
# 3. Dependências faltando
```

**Reinstalar do zero:**
```bash
cd ~/apps_nodejs
pm2 delete simuladorfinanciamento
rm -rf node_modules package-lock.json
npm install --production
NODE_ENV=production pm2 start dist/index.js --name simuladorfinanciamento
pm2 save
```

**Verificar porta:**
```bash
# A aplicação usa porta dinâmica do PM2
# Não precisa configurar PORT_INDEX manualmente
netstat -tulpn | grep node
```

## Comandos Úteis PM2

```bash
pm2 list                    # Listar apps
pm2 logs simuladorfinanciamento  # Ver logs em tempo real
pm2 monit                   # Monitor de recursos
pm2 restart simuladorfinanciamento  # Reiniciar
pm2 stop simuladorfinanciamento     # Parar
pm2 delete simuladorfinanciamento   # Remover
pm2 save                    # Salvar configuração
```
