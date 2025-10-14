import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, FileText, Clock, CheckCircle } from "lucide-react";

export default function BlogPost4() {
  return (
    <>
      <Helmet>
        <title>Documentação para Financiamento de Veículos 2025 | Guia Completo</title>
        <meta name="description" content="Lista completa e atualizada de documentos necessários para financiamento de veículos em 2025. Guia para PF, PJ, autônomos e MEI com dicas para agilizar aprovação." />
        <link rel="canonical" href="https://simuladorfinanciamento.com/blog/documentacao-financiamento-veiculos-2025" />
      </Helmet>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/blog">
          <a className="inline-flex items-center text-primary hover:text-primary-dark mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o blog
          </a>
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">
            Documentação para Financiamento de Veículos 2025: Guia Completo
          </h1>
          <div className="flex items-center text-neutral-600">
            <time dateTime="2025-04-05">5 de abril de 2025</time>
            <span className="mx-2">•</span>
            <span>7 min de leitura</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-neutral-700 mb-6">
            Ter todos os documentos em mãos acelera a aprovação do seu financiamento e evita dores de cabeça. Veja a lista completa atualizada para 2025 e dicas para cada tipo de solicitante.
          </p>

          <h2>Documentos Básicos para Pessoa Física (CLT)</h2>
          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <FileText className="mr-2" />
              Documentação Pessoal
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>RG e CPF</strong> (cópia autenticada ou original + cópia simples)
                  <p className="text-xs text-neutral-600 mt-1">Validade: Indeterminada</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>CNH</strong> (Carteira Nacional de Habilitação)
                  <p className="text-xs text-neutral-600 mt-1">Validade: Dentro do prazo de validade</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Comprovante de residência</strong> (água, luz, telefone ou internet)
                  <p className="text-xs text-neutral-600 mt-1">Validade: Últimos 90 dias</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Certidão de estado civil</strong> (casamento, nascimento ou divórcio)
                  <p className="text-xs text-neutral-600 mt-1">Validade: Últimos 90 dias</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg my-6">
            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
              <FileText className="mr-2" />
              Comprovação de Renda (CLT)
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Últimos 3 contracheques</strong>
                  <p className="text-xs text-neutral-600 mt-1">Validade: Últimos 90 dias</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Carteira de trabalho</strong> (páginas de identificação e último contrato)
                  <p className="text-xs text-neutral-600 mt-1">Validade: Indeterminada</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Extrato bancário</strong> (últimos 3 meses)
                  <p className="text-xs text-neutral-600 mt-1">Validade: Últimos 90 dias</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Declaração de Imposto de Renda</strong> (último ano)
                  <p className="text-xs text-neutral-600 mt-1">Opcional, mas ajuda na aprovação</p>
                </div>
              </li>
            </ul>
          </div>

          <h2>Documentos para Autônomos e Profissionais Liberais</h2>
          <div className="bg-yellow-50 p-6 rounded-lg my-6">
            <p className="text-sm text-yellow-900 mb-4">
              <strong>Atenção:</strong> Autônomos precisam comprovar renda de forma mais detalhada.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Declaração de Imposto de Renda</strong> (últimos 2 anos completa)
                  <p className="text-xs text-neutral-600 mt-1">Obrigatório para autônomos</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Extratos bancários</strong> (últimos 6 meses)
                  <p className="text-xs text-neutral-600 mt-1">Mostrando entradas regulares</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Recibos de pagamento</strong> (RPA - Recibo de Pagamento Autônomo)
                  <p className="text-xs text-neutral-600 mt-1">Últimos 6 meses</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Carnê de INSS</strong> (comprovante de contribuição)
                  <p className="text-xs text-neutral-600 mt-1">Últimos 6 meses</p>
                </div>
              </li>
            </ul>
          </div>

          <h2>Documentos para MEI (Microempreendedor Individual)</h2>
          <div className="bg-purple-50 p-6 rounded-lg my-6">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>CCMEI</strong> (Certificado da Condição de Microempreendedor Individual)
                  <p className="text-xs text-neutral-600 mt-1">Obtenha em: gov.br/mei</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Declaração Anual do MEI</strong> (DASN-SIMEI)
                  <p className="text-xs text-neutral-600 mt-1">Último ano completo</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Extratos bancários</strong> (PF e PJ, se tiver)
                  <p className="text-xs text-neutral-600 mt-1">Últimos 6 meses</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Comprovantes de DAS</strong> (pagamento mensal do MEI)
                  <p className="text-xs text-neutral-600 mt-1">Últimos 6 meses</p>
                </div>
              </li>
            </ul>
          </div>

          <h2>Documentos para Pessoa Jurídica (Empresa)</h2>
          <div className="bg-indigo-50 p-6 rounded-lg my-6">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Contrato Social</strong> e última alteração
                  <p className="text-xs text-neutral-600 mt-1">Registrado na Junta Comercial</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>CNPJ</strong> (Cartão ou comprovante de inscrição)
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Balanço Patrimonial</strong> (últimos 2 anos)
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Faturamento</strong> (extratos bancários ou DRE)
                  <p className="text-xs text-neutral-600 mt-1">Últimos 6 meses</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Documentos dos sócios</strong> (RG, CPF, comprovante de residência)
                </div>
              </li>
            </ul>
          </div>

          <h2>Onde Obter Cada Documento</h2>
          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-sm border">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="px-4 py-2 text-left border">Documento</th>
                  <th className="px-4 py-2 text-left border">Onde Obter</th>
                  <th className="px-4 py-2 text-center border">Prazo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border">
                  <td className="px-4 py-2 border">RG/CPF</td>
                  <td className="px-4 py-2 border">Poupatempo, Detran</td>
                  <td className="px-4 py-2 text-center border">Imediato</td>
                </tr>
                <tr className="border bg-neutral-50">
                  <td className="px-4 py-2 border">Certidão de Casamento</td>
                  <td className="px-4 py-2 border">Cartório (online disponível)</td>
                  <td className="px-4 py-2 text-center border">1-3 dias</td>
                </tr>
                <tr className="border">
                  <td className="px-4 py-2 border">Extrato Bancário</td>
                  <td className="px-4 py-2 border">App do banco, internet banking</td>
                  <td className="px-4 py-2 text-center border">Imediato</td>
                </tr>
                <tr className="border bg-neutral-50">
                  <td className="px-4 py-2 border">CCMEI</td>
                  <td className="px-4 py-2 border">gov.br/mei</td>
                  <td className="px-4 py-2 text-center border">Imediato</td>
                </tr>
                <tr className="border">
                  <td className="px-4 py-2 border">Declaração IR</td>
                  <td className="px-4 py-2 border">gov.br (e-CAC)</td>
                  <td className="px-4 py-2 text-center border">Imediato</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Dicas Para Agilizar a Aprovação</h2>
          <div className="bg-green-50 border-l-4 border-green-500 p-6 my-6">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Organize tudo antes de solicitar:</strong> Ter todos os documentos prontos pode reduzir o prazo de aprovação de 15 para 3 dias.
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Digitalize em alta qualidade:</strong> Documentos ilegíveis atrasam a análise. Use scanner ou apps de digitalização.
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Atualize seu cadastro:</strong> Verifique se seus dados estão corretos no banco antes de solicitar.
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Tenha renda comprovada superior:</strong> Mostre renda 30% acima do valor da parcela para facilitar aprovação.
                </div>
              </li>
            </ul>
          </div>

          <h2>Casos Especiais</h2>
          
          <h3>Aposentados e Pensionistas</h3>
          <ul>
            <li>Extrato de benefício do INSS (últimos 3 meses)</li>
            <li>Carta de concessão de aposentadoria/pensão</li>
            <li>Documentos pessoais padrão</li>
          </ul>

          <h3>Servidores Públicos</h3>
          <ul>
            <li>Contracheques (últimos 3 meses)</li>
            <li>Declaração de vínculo empregatício</li>
            <li>Documentos pessoais padrão</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              Simule Seu Financiamento
            </h3>
            <p className="text-blue-900 mb-4">
              Antes de reunir os documentos, faça uma simulação para saber se o financiamento cabe no seu orçamento.
            </p>
            <Link href="/simulador-financiamento-veiculos">
              <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Fazer Simulação Gratuita
              </a>
            </Link>
          </div>

          <h2>Conclusão</h2>
          <p>
            Ter toda a documentação organizada e dentro da validade é fundamental para uma aprovação rápida. Comece a reunir os documentos assim que decidir financiar um veículo.
          </p>
          <p>
            Lembre-se: cada banco pode ter exigências específicas. Sempre confirme a lista completa com a instituição financeira escolhida antes de iniciar o processo.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link href="/blog">
            <a className="inline-flex items-center text-primary hover:text-primary-dark">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o blog
            </a>
          </Link>
        </div>
      </article>
    </>
  );
}
