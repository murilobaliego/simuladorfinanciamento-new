# Guia SEO do Simulador de Financiamento

Este documento contém orientações sobre a estrutura de SEO implementada neste projeto. Ele serve como uma referência para manutenção futura e para entender as decisões tomadas para otimizar o site para mecanismos de busca.

## Termos-chave Priorizados

Os seguintes termos-chave foram priorizados para otimização SEO:

1. **simulador de financiamento** - Termo principal, focado na página /simulador-de-financiamento
2. **simulador de financiamento de veículos** - Termo secundário, focado na página /simulador-financiamento-veiculos
3. **simulador caixa de financiamento** - Termo secundário, focado na página /simulador-caixa-financiamento
4. **tabela price** - Termo complementar, mencionado em várias páginas
5. **simulador de parcelas** - Termo complementar, utilizado em textos e meta tags

## Estrutura do Site para SEO

### URLs Amigáveis

O site utiliza URLs amigáveis que incluem palavras-chave:

- `/simulador-de-financiamento` (termo principal)
- `/simulador-financiamento-veiculos` (para veículos)
- `/simulador-caixa-financiamento` (para Caixa)
- `/financiamento-moto` (para motos)
- `/financiamento-caminhao` (para caminhões)
- `/financiamento-imobiliario` (para imóveis)

### Redirecionamentos 301

Implementamos redirecionamentos 301 para garantir que URLs antigas e alternativas apontem para as URLs canônicas:

- `/financiamento-veiculo` → `/simulador-financiamento-veiculos`
- `/simulador-da-caixa` → `/simulador-caixa-financiamento`
- `/vehicle-finance` → `/simulador-financiamento-veiculos`
- entre outros (veja o arquivo `_redirects` para a lista completa)

## Dados Estruturados (Schema.org)

Implementamos os seguintes tipos de dados estruturados:

1. **WebApplication** - Descreve o simulador como uma aplicação web
2. **WebSite** - Identifica o site para o Google Search
3. **FAQPage** - Estrutura as FAQs para aparecerem nos resultados de busca
4. **BreadcrumbList** - Melhora a navegação e a indexação hierárquica
5. **Article** - Para seções de conteúdo mais informativo

## Arquivos Técnicos SEO

Os seguintes arquivos foram implementados para melhorar o SEO técnico:

1. **sitemap.xml** - Lista todas as páginas do site para facilitar a indexação
2. **robots.txt** - Orienta os crawlers sobre o que indexar e o que ignorar
3. **manifest.json** - Suporte a PWA (Progressive Web App)
4. **humans.txt** - Informações para crawlers sobre os criadores do site
5. **security.txt** - Informações de segurança (padrão recomendado)
6. **support.js** - Melhora a detecção de recursos e suporte a Google Discover

## Service Worker

**Nota: Service Worker temporariamente desativado**  

Preparamos um Service Worker (sw.js) para:

1. Melhorar a performance com caching estratégico
2. Permitir funcionamento offline limitado
3. Melhorar experiência de usuário móvel
4. Suporte a PWA

**Problema Conhecido:** No ambiente de desenvolvimento Vite/SPA, o Service Worker não funciona corretamente porque todos os arquivos são servidos como HTML (retornando um token inesperado '<'). Isso ocorre devido à configuração do servidor de desenvolvimento que roteia todas as solicitações para o index.html.

**Solução para Produção:** Quando o site for implantado em produção, os arquivos estáticos serão servidos corretamente pelo servidor web (Netlify), e o Service Worker funcionará conforme esperado.

**Como Habilitar:**
1. Para habilitar em produção, descomente o código em main.tsx
2. Descomente a referência no index.html

## Otimizações Mobile

1. Viewport configurado para mobile-first
2. Design responsivo em todas as páginas
3. Meta tags específicas para dispositivos móveis
4. PWA configurado para instalação em homescreen

## Metadados por Página

Cada página tem metadados personalizados:

1. **Title** - Único para cada página, com 50-60 caracteres
2. **Meta Description** - Descrição única, com 150-160 caracteres
3. **Canonical URL** - Evita problemas de conteúdo duplicado
4. **Open Graph** - Para compartilhamento em redes sociais
5. **Schema.org** - Dados estruturados específicos

## Dicas de Manutenção SEO

1. **Ao adicionar páginas novas:**
   - Incluir no sitemap.xml
   - Adicionar metadados completos (title, description)
   - Implementar dados estruturados Schema.org
   - Verificar links internos para a nova página

2. **Monitoramento:**
   - Após implementações, verificar o Google Search Console
   - Acompanhar desempenho das palavras-chave
   - Verificar erros de indexação

3. **Atualização de conteúdo:**
   - Atualizar periodicamente as datas de "lastmod" no sitemap
   - Manter o conteúdo atualizado, especialmente taxas e informações financeiras

## Ferramentas Utilizadas

- **Google Search Console** - Para monitorar desempenho SEO
- **Google Analytics** - Para análise de tráfego
- **Structured Data Testing Tool** - Para validar dados estruturados
- **PageSpeed Insights** - Para verificar velocidade e experiência do usuário

---

Última atualização: 15 de maio de 2025