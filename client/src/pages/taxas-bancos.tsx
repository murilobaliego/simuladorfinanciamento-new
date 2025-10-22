import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, Building2, Calendar } from "lucide-react";

interface TaxaBanco {
  instituicaoFinanceira: string;
  taxaJurosAoMes: number;
  taxaJurosAoAno: number;
}

export default function TaxasBancos() {
  const [taxas, setTaxas] = useState<TaxaBanco[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataConsulta, setDataConsulta] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const CACHE_KEY = 'taxas_bancos_cache';
    const CACHE_DATE_KEY = 'taxas_bancos_date';

    const fetchTaxas = async () => {
      try {
        const hoje = new Date();
        const dataHoje = hoje.toISOString().split('T')[0];
        setDataConsulta(hoje.toLocaleDateString('pt-BR'));

        // Verificar cache
        const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedDate === dataHoje && cachedData) {
          // Usar dados do cache
          const taxasCache = JSON.parse(cachedData);
          setTaxas(taxasCache);
          setLoading(false);
          return;
        }

        // Buscar da API
        const url = 'https://olinda.bcb.gov.br/olinda/servico/taxaJuros/versao/v2/odata/ConsultaUnificada?$top=150&$format=json&$select=Modalidade,Posicao,InstituicaoFinanceira,TaxaJurosAoMes';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados');
        }
        
        const data = await response.json();
        const items = data.value || [];

        const taxasVeiculos = items
          .filter((item: any) => 
            item.Modalidade && 
            (item.Modalidade.toLowerCase().includes('veículo') || 
             item.Modalidade.toLowerCase().includes('veiculo'))
          )
          .map((item: any) => ({
            instituicaoFinanceira: item.InstituicaoFinanceira,
            taxaJurosAoMes: parseFloat(item.TaxaJurosAoMes),
            taxaJurosAoAno: parseFloat(item.TaxaJurosAoMes) * 12,
          }))
          .filter((t: TaxaBanco) => !isNaN(t.taxaJurosAoMes) && t.taxaJurosAoMes > 0)
          .sort((a: TaxaBanco, b: TaxaBanco) => a.taxaJurosAoMes - b.taxaJurosAoMes);

        // Salvar no cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(taxasVeiculos));
        localStorage.setItem(CACHE_DATE_KEY, dataHoje);

        setTaxas(taxasVeiculos);
      } catch (error) {
        console.error("Erro ao buscar taxas:", error);
        setErro("Não foi possível carregar as taxas no momento. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaxas();
  }, []);

  return (
    <>
      <Helmet>
        <title>Menores Taxas de Juros para Financiamento de Veículos 2025 | Banco Central</title>
        <meta name="description" content="Compare as menores taxas de juros para financiar veículos. Dados oficiais do Banco Central atualizados diariamente. Encontre a taxa mais baixa e economize milhares de reais." />
        <meta name="keywords" content="menor taxa de juros financiamento veículos, taxa de juros carro, financiamento veículo taxa baixa, comparar taxas bancos, banco central taxas juros, financiamento automóvel juros" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/taxas-bancos" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">
            Taxas de Juros para Financiamento de Veículos
          </h1>
          <p className="text-lg text-neutral-600 mb-2">
            Compare as taxas de todos os bancos e financeiras do Brasil
          </p>
          {taxas.length > 0 && (
            <p className="text-sm text-neutral-500">
              {taxas.length} instituições encontradas
            </p>
          )}
          {dataConsulta && (
            <p className="text-sm text-neutral-500 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              Dados atualizados em: {dataConsulta}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">
            Por Que Comparar as Taxas de Juros é Essencial?
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              Ao financiar um veículo, a <strong>taxa de juros</strong> é o fator que mais impacta o valor total que você pagará. Uma diferença de apenas <strong>0,5% ao mês</strong> pode representar <strong>milhares de reais</strong> de economia ao longo do financiamento.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">⚡ Exemplo Prático:
              </p>
              <p className="text-sm text-yellow-900">
                Financiamento de <strong>R$ 50.000</strong> em <strong>48 meses</strong>:<br />
                • Taxa de 1,5% a.m. = Total pago: <strong>R$ 62.450</strong><br />
                • Taxa de 2,0% a.m. = Total pago: <strong>R$ 66.200</strong><br />
                <strong className="text-red-700">Diferença: R$ 3.750 a mais!</strong>
              </p>
            </div>

            <h3 className="text-xl font-bold text-neutral-800 mt-6 mb-3">
              De Onde Vêm Estes Dados?
            </h3>
            <p className="mb-4">
              Todas as taxas exibidas nesta página são <strong>dados oficiais do Banco Central do Brasil</strong>, obtidos diretamente da <strong>API Olinda</strong> - o sistema público de dados abertos do BCB. Estas informações são as mesmas que os bancos reportam mensalmente ao regulador.
            </p>

            <h3 className="text-xl font-bold text-neutral-800 mt-6 mb-3">
              Como Usar Esta Informação a Seu Favor
            </h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Identifique as menores taxas:</strong> Os bancos no topo da lista oferecem as melhores condições</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Negocie com seu banco:</strong> Use estes dados como argumento para conseguir taxas melhores</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Compare antes de decidir:</strong> Não aceite a primeira proposta sem pesquisar</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Simule o impacto:</strong> Use nosso simulador para ver quanto você economiza com taxas menores</span>
              </li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Dica Importante:</strong> As taxas apresentadas são médias praticadas por cada instituição. A taxa final oferecida a você dependerá do seu perfil de crédito, score, valor da entrada e prazo escolhido. Clientes com bom histórico conseguem taxas ainda menores!
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-neutral-600">Carregando taxas...</p>
          </div>
        ) : erro ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
            <p className="text-red-900">{erro}</p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>Fonte:</strong> Banco Central do Brasil - Taxas de juros para financiamento de veículos atualizadas
              </p>
            </div>

            <div className="grid gap-4">
              {taxas.map((taxa, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4"
                  style={{
                    borderLeftColor: index === 0 ? '#10b981' : index < 3 ? '#3b82f6' : '#6b7280'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-neutral-100 p-3 rounded-full">
                        <Building2 className="h-6 w-6 text-neutral-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {index === 0 && (
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                              Menor Taxa
                            </span>
                          )}
                          <span className="text-neutral-500 text-sm">#{index + 1}</span>
                        </div>
                        <h3 className="text-lg font-bold text-neutral-800 mb-1">
                          {taxa.instituicaoFinanceira}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="mb-3">
                        <p className="text-sm text-neutral-600 mb-1">Taxa Mensal</p>
                        <p className="text-3xl font-bold text-primary">
                          {taxa.taxaJurosAoMes.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Taxa Anual</p>
                        <p className="text-lg font-semibold text-neutral-700">
                          {taxa.taxaJurosAoAno.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <TrendingDown className="h-4 w-4" />
                        Esta é a menor taxa disponível no mercado hoje
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
              <h3 className="font-bold text-yellow-900 mb-2">⚠️ Importante</h3>
              <ul className="text-sm text-yellow-900 space-y-1">
                <li>• As taxas podem variar conforme análise de crédito e perfil do cliente</li>
                <li>• Valores apresentados são taxas médias praticadas pelos bancos</li>
                <li>• Consulte sempre o CET (Custo Efetivo Total) que inclui todas as tarifas</li>
                <li>• Use nosso simulador para calcular o valor real das parcelas</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
}
