# Correção Rápida - Aplicação com 471 Restarts

## Problema Identificado
A aplicação está com erro e reiniciando constantemente (471 restarts).

## Solução Imediata

### 1. Conectar via SSH
```bash
ssh simuladorfinanciamento@ftp.simuladorfinanciamento.com
```

### 2. Ver o Erro Específico
```bash
pm2 logs simuladorfinanciamento --err --lines 100
```

### 3. Possíveis Causas e Soluções

#### Causa A: Falta NODE_ENV
```bash
pm2 delete simuladorfinanciamento
cd ~/apps_nodejs
NODE_ENV=production pm2 start dist/index.js --name simuladorfinanciamento
pm2 save
```

#### Causa B: Arquivo index.js não existe ou corrompido
```bash
cd ~/apps_nodejs
ls -la dist/
# Se não existir dist/index.js, você precisa fazer upload novamente
```

#### Causa C: Dependências faltando
```bash
cd ~/apps_nodejs
nvm use 22.1.0
rm -rf node_modules package-lock.json
npm install --production
pm2 restart simuladorfinanciamento
```

#### Causa D: Porta em uso ou erro de bind
```bash
# Verificar se há outro processo usando a porta
netstat -tulpn | grep node

# Matar processos órfãos
pm2 kill
pm2 start dist/index.js --name simuladorfinanciamento
pm2 save
```

### 4. Verificar se Funcionou
```bash
pm2 list
# Status deve estar "online" e não "errored"

pm2 logs simuladorfinanciamento --lines 20
# Deve mostrar "serving on port XXXX"
```

## Checklist de Deploy Correto

- [ ] Arquivo `dist/index.js` existe no servidor
- [ ] Pasta `dist/public/` existe com arquivos do frontend
- [ ] Arquivo `package.json` está presente
- [ ] Dependências instaladas: `npm install --production`
- [ ] Node.js correto: `nvm use 22.1.0`
- [ ] PM2 iniciado com: `NODE_ENV=production pm2 start dist/index.js`
- [ ] Configuração salva: `pm2 save`

## Estrutura Esperada no Servidor

```
~/apps_nodejs/
├── dist/
│   ├── index.js          ← Servidor Node.js
│   └── public/           ← Frontend compilado
│       ├── index.html
│       └── assets/
├── node_modules/         ← Dependências
├── package.json
└── package-lock.json
```

## Comandos de Diagnóstico

```bash
# Ver estrutura de arquivos
cd ~/apps_nodejs
ls -la
ls -la dist/

# Ver logs completos
tail -f ~/.pm2/logs/simuladorfinanciamento-error.log
tail -f ~/.pm2/logs/simuladorfinanciamento-out.log

# Ver processos Node.js
ps aux | grep node

# Ver uso de recursos
pm2 monit
```
