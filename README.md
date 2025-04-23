# Simulador de Financiamento

Um site em português brasileiro para simulação de financiamentos diversos com calculadora de Tabela Price.

## Descrição

Este projeto oferece calculadoras financeiras para diversos tipos de financiamentos:
- Financiamento de veículos
- Financiamento imobiliário
- Empréstimo pessoal
- Crédito consignado

As calculadoras utilizam a Tabela Price (parcelas fixas) e SAC (Sistema de Amortização Constante) para gerar os resultados.

## Backend em Node.js (Original)

O projeto foi originalmente desenvolvido com backend em Node.js/Express. Para executar o backend original:

```bash
npm run dev
```

## Backend em PHP (Convertido)

O projeto foi convertido para utilizar um backend em PHP. Para executar o backend PHP:

```bash
./php_backend/start.sh
```

### Dependências do Backend PHP
- PHP 7.4 ou superior
- Servidor web com suporte a PHP (Apache, Nginx) para produção
- Servidor web embutido do PHP para desenvolvimento

## Recursos Implementados

1. **Calculadoras Financeiras**
   - Tabela Price (parcelas fixas)
   - Sistema SAC (amortização constante)
   - Visualização da tabela de amortização completa
   - Gráfico de evolução do saldo devedor

2. **Interface Responsiva**
   - Layout adaptado para dispositivos móveis e desktop
   - Formulários com validação e máscaras
   - Resultados formatados em português brasileiro

3. **SEO e Acessibilidade**
   - Otimização para termos de busca relacionados a financiamento
   - Páginas com meta tags para compartilhamento
   - Suporte a leitores de tela

4. **Conformidade Legal**
   - Política de Privacidade
   - Termos de Uso
   - Consentimento de Cookies (LGPD)

## Tecnologias Utilizadas

### Frontend
- React com TypeScript
- Tailwind CSS para estilização
- Shadcn/UI para componentes
- React Query para gerenciamento de estado
- Recharts para gráficos

### Backend Original (Node.js)
- Express.js para API REST
- Zod para validação de dados
- TypeScript para tipagem

### Backend Convertido (PHP)
- PHP 7.4+ para API REST
- Classes para validação de dados
- Classes para cálculos financeiros

## Como Executar o Projeto

### Utilizando o Script de Configuração
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o script de configuração: `./config.sh`
4. Siga as instruções para escolher o backend (Node.js ou PHP)
5. Acesse no navegador: `http://localhost:5000`

### Manualmente com Backend Node.js
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm run dev`
4. Acesse no navegador: `http://localhost:5000`

### Manualmente com Backend PHP
1. Clone o repositório
2. Instale as dependências: `npm install` (necessário para compilar o frontend)
3. Construa o frontend: `./php_backend/build_frontend.sh`
4. Inicie o servidor PHP: `./php_backend/start.sh`
5. Acesse no navegador: `http://localhost:5000`

## Aviso Legal

Este site é apenas uma ferramenta de simulação financeira para fins informativos. Não é uma instituição financeira e não oferece empréstimos ou financiamentos reais. Os cálculos apresentados são aproximações e podem diferir dos valores oferecidos por instituições financeiras reais.