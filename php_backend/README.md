# Backend PHP para Simulador de Financiamento

Este diretório contém a versão PHP do backend para o Simulador de Financiamento, uma alternativa ao backend Node.js original.

## Estrutura do Backend PHP

- `Finance.php`: Implementa todos os cálculos financeiros (tabela Price, SAC, etc.)
- `Validator.php`: Realiza validação de dados para as APIs
- `index.php`: Ponto de entrada da API, contém todas as rotas
- `router.php`: Roteador para o servidor PHP embutido, serve arquivos estáticos e APIs
- `test.php`: Script para testar todas as funcionalidades
- Scripts: `build_frontend.sh` e `start.sh` para construir o frontend e iniciar o servidor

## Requisitos

- PHP 7.4 ou superior
- Servidor web com suporte a PHP (Apache/Nginx) ou servidor embutido para desenvolvimento

## API Endpoints

O backend PHP implementa os mesmos endpoints que o backend Node.js original:

1. **POST /api/simulador/calcular**
   - Calcula financiamento usando sistema Price
   - Payload: `{ valorFinanciado, taxaJuros, numParcelas }`

2. **POST /api/simulador/imobiliario**
   - Calcula financiamento imobiliário (Price ou SAC)
   - Payload: `{ valorFinanciado, taxaJuros, numParcelas, sistema }`

3. **POST /api/simulador/pessoal**
   - Calcula empréstimo pessoal
   - Payload: `{ valorFinanciado, taxaJuros, numParcelas }`

4. **POST /api/simulador/consignado**
   - Calcula crédito consignado
   - Payload: `{ valorFinanciado, taxaJuros, numParcelas, tipoConsignado }`

## Como Testar o Backend

Para verificar se o backend PHP está funcionando corretamente, você pode executar o script de teste:

```bash
cd php_backend
php test.php
```

Para testar apenas partes específicas, você pode passar um argumento:
- `php test.php calcular`: Testa apenas o cálculo básico
- `php test.php imobiliario`: Testa apenas o financiamento imobiliário
- `php test.php consignado`: Testa apenas o crédito consignado
- `php test.php validacao`: Testa apenas a validação de dados

## Como Executar o Servidor PHP

### Preparando o Frontend

Antes de iniciar o servidor PHP, é necessário compilar o frontend:

```bash
./build_frontend.sh
```

Isto irá gerar os arquivos estáticos na pasta `client/dist` que serão servidos pelo PHP.

### Iniciando o Servidor

Para iniciar o servidor PHP, execute:

```bash
./start.sh
```

Isto irá iniciar o servidor na porta 5000. Se quiser usar outra porta, passe como argumento:

```bash
./start.sh 8080
```

## Usando com o Script de Configuração

Na raiz do projeto, existe um script `config.sh` que facilita a configuração e escolha do backend:

```bash
./config.sh
```

Este script permite escolher entre o backend Node.js original e o backend PHP convertido, e automatiza a configuração.

## Considerações de Produção

Para ambiente de produção, recomenda-se:

1. Usar um servidor web dedicado como Apache ou Nginx
2. Configurar a raiz do site para a pasta `client/dist`
3. Configurar rewrite rules para direcionar requisições `/api/*` para o arquivo `php_backend/index.php`