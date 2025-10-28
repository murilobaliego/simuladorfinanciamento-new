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
   - Otimização para termos-chave específicos:
     - "simulador de financiamento"
     - "simulador de financiamento de veículos"
     - "simulador caixa de financiamento"
     - "tabela price"
   - Implementação completa de dados estruturados (Schema.org)
   - Suporte a Progressive Web App (PWA)
   - Otimizações técnicas para SEO:
     - Redirecionamentos 301 para URLs canônicas
     - Sitemap.xml e robots.txt
     - Metadados Open Graph para compartilhamento
   - Suporte a leitores de tela e navegação por teclado

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

## Documentação de SEO

Foi criado um documento dedicado com detalhes sobre a implementação SEO:

- Arquivo [SEO_GUIDE.md](./SEO_GUIDE.md) contém:
  - Lista de termos-chave priorizados
  - Detalhes sobre dados estruturados Schema.org
  - Estrutura de URLs e redirecionamentos
  - Otimizações técnicas implementadas
  - Guia para adicionar novas páginas

Para melhorar a performance em produção, consulte também:
- Configurações no arquivo `netlify.toml` para otimização de cache
- Service Worker para caching de recursos estáticos (desativado em ambiente de dev)

## Hospedagem em Produção

O site está configurado para ser hospedado no Netlify com as seguintes configurações:

1. Domínio principal: `simuladorfinanciamento.com`
2. Redirecionamentos 301 configurados em `_redirects` e `netlify.toml`
3. Headers HTTP otimizados para segurança e performance
4. Configurações específicas para otimização de motores de busca

Para fazer deploy:
```bash
npm run build
netlify deploy --prod
```

## Ideas to implement ##
1. Adicionar no resultado da simulação o CET anual
2. Adicionar informações de CET no arquivo pdf gerado.
3. Adicionar calculo de CET e IOF nas outras calculadoras de financiamento pessoal por exemplo.
4. Buscar dados do banco central e gravar em algum banco de dados local
5. reenderizar no servidor as paginas (grande mudança) mas deixaria mais seguro. Fazer prototipo antes
6. Adicionar compartilhamento do resultado via whatsapp