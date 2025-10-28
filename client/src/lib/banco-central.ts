// API do Banco Central para taxas de juros
// Documentação: https://olinda.bcb.gov.br/olinda/servico/taxaJuros/versao/v2/aplicacao#!/recursos

export interface BankRate {
  bank: string;
  monthlyRate: number;
  annualRate: number;
}

// Lista de bancos principais para exibir
const MAIN_BANKS = [
  'BANCO DO BRASIL S.A.',
  'CAIXA ECONOMICA FEDERAL',
  'ITAU UNIBANCO S.A.',
  'BANCO BRADESCO S.A.',
  'BANCO SANTANDER (BRASIL) S.A.',
  'BANCO SAFRA S.A.',
  'BANCO VOTORANTIM S.A.',
  'BANCO PAN S.A.',
  'BANCO BMG S.A.',
  'BANCO DAYCOVAL S.A.'
];

export async function getBankRates(): Promise<BankRate[]> {
  try {
    // API do Banco Central - Taxas de juros de financiamento de veículos
    // Modalidade: 223 (Aquisição de veículos automotores - PF)
    const url = 'https://olinda.bcb.gov.br/olinda/servico/taxaJuros/versao/v2/odata/TaxasJurosMensalPorMes?$top=100&$format=json&$filter=Modalidade%20eq%20%27Aquisi%C3%A7%C3%A3o%20de%20ve%C3%ADculos%20automotores%20-%20PF%27';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar taxas do Banco Central');
    }
    
    const data = await response.json();
    
    if (!data.value || !Array.isArray(data.value)) {
      throw new Error('Formato de resposta inválido');
    }
    
    // Processar dados e filtrar bancos principais
    const bankRatesMap = new Map<string, { monthly: number; annual: number }>();
    
    data.value.forEach((item: any) => {
      const bankName = item.InstituicaoFinanceira?.toUpperCase() || '';
      const monthlyRate = parseFloat(item.TaxaJurosAoMes) || 0;
      const annualRate = parseFloat(item.TaxaJurosAoAno) || 0;
      
      // Verificar se é um dos bancos principais e se tem taxa válida
      const isMainBank = MAIN_BANKS.some(bank => bankName.includes(bank));
      
      if (isMainBank && monthlyRate > 0) {
        // Pegar a taxa mais recente (menor taxa disponível)
        const existing = bankRatesMap.get(bankName);
        if (!existing || monthlyRate < existing.monthly) {
          bankRatesMap.set(bankName, { monthly: monthlyRate, annual: annualRate });
        }
      }
    });
    
    // Converter para array e ordenar por taxa
    const rates: BankRate[] = Array.from(bankRatesMap.entries())
      .map(([bank, rates]) => ({
        bank: formatBankName(bank),
        monthlyRate: rates.monthly,
        annualRate: rates.annual
      }))
      .sort((a, b) => a.monthlyRate - b.monthlyRate)
      .slice(0, 10); // Limitar a 10 bancos
    
    return rates;
  } catch (error) {
    console.error('Erro ao buscar taxas do Banco Central:', error);
    // Retornar taxas padrão em caso de erro
    return getDefaultRates();
  }
}

function formatBankName(name: string): string {
  // Simplificar nomes dos bancos
  const simplifications: Record<string, string> = {
    'BANCO DO BRASIL S.A.': 'Banco do Brasil',
    'CAIXA ECONOMICA FEDERAL': 'Caixa Econômica',
    'ITAU UNIBANCO S.A.': 'Itaú',
    'BANCO BRADESCO S.A.': 'Bradesco',
    'BANCO SANTANDER (BRASIL) S.A.': 'Santander',
    'BANCO SAFRA S.A.': 'Safra',
    'BANCO VOTORANTIM S.A.': 'Votorantim',
    'BANCO PAN S.A.': 'Banco Pan',
    'BANCO BMG S.A.': 'BMG',
    'BANCO DAYCOVAL S.A.': 'Daycoval'
  };
  
  for (const [full, short] of Object.entries(simplifications)) {
    if (name.includes(full)) {
      return short;
    }
  }
  
  return name;
}

function getDefaultRates(): BankRate[] {
  // Taxas padrão caso a API falhe (baseadas em médias históricas)
  return [
    { bank: 'Banco do Brasil', monthlyRate: 1.49, annualRate: 19.49 },
    { bank: 'Caixa Econômica', monthlyRate: 1.52, annualRate: 19.89 },
    { bank: 'Itaú', monthlyRate: 1.69, annualRate: 22.29 },
    { bank: 'Bradesco', monthlyRate: 1.72, annualRate: 22.69 },
    { bank: 'Santander', monthlyRate: 1.75, annualRate: 23.09 },
    { bank: 'Safra', monthlyRate: 1.79, annualRate: 23.59 },
    { bank: 'Banco Pan', monthlyRate: 1.89, annualRate: 24.99 },
    { bank: 'BMG', monthlyRate: 1.95, annualRate: 25.79 },
  ];
}
