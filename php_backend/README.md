# Backend PHP - Simulador de Financiamento

Este diretório contém o backend em PHP para o Simulador de Financiamento, que foi convertido do original em Node.js/Express.

## Estrutura de Arquivos

- `index.php`: Ponto de entrada para as requisições da API
- `Finance.php`: Classes para cálculos financeiros
- `Validator.php`: Classes para validação de dados
- `Storage.php`: Classes para armazenamento em memória
- `router.php`: Roteador para o servidor de desenvolvimento
- `server.php`: Script para iniciar o servidor
- `serve-static.php`: Script para servir arquivos estáticos
- `.htaccess`: Configuração para servidores Apache
- `build_frontend.sh`: Script para construir o frontend
- `start.sh`: Script para iniciar o servidor de desenvolvimento

## Como executar

### Desenvolvimento

1. Construa o frontend:
   ```bash
   ./php_backend/build_frontend.sh
   ```

2. Inicie o servidor PHP:
   ```bash
   ./php_backend/start.sh
   ```

3. Acesse o site em: http://localhost:5000

### Produção

Para produção, recomenda-se usar um servidor web como Apache ou Nginx. Configurar o servidor web para:

1. Servir os arquivos estáticos de `client/dist/`
2. Redirecionar as requisições API para `php_backend/index.php`
3. Redirecionar todas as outras requisições não encontradas para `client/dist/index.html`

## APIs disponíveis

- `/api/simulador/calcular`: Cálculo de financiamentos (Tabela Price)
- `/api/simulador/imobiliario`: Cálculo de financiamento imobiliário (Price ou SAC)
- `/api/simulador/pessoal`: Cálculo de empréstimo pessoal
- `/api/simulador/consignado`: Cálculo de crédito consignado