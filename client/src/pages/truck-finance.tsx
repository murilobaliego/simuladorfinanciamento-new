import { Helmet } from 'react-helmet-async';
import TruckForm2025 from "@/components/simulators/truck-form-2025";

export default function TruckFinance() {
  return (
    <>
      <Helmet>
        <title>Financiamento de Caminhões | Simulador Veículos Pesados 2025</title>
        <meta name="description" content="Simulador de financiamento de caminhões, carretas e veículos pesados. Calcule parcelas com taxas especiais, IOF e tabela de amortização. Compare condições FINAME e bancos comerciais." />
        <meta name="keywords" content="financiamento caminhão, simulador caminhão, financiar veículo pesado, finame caminhão, financiamento carreta, simulador veículos comerciais" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/financiamento-caminhao" />
      </Helmet>
      
      <TruckFinanceContent />
    </>
  );
}

function TruckFinanceContent() {
  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Financiamento de Caminhões</h1>
          <p className="text-xl text-gray-700 mb-4">Simule veículos pesados com taxas especiais e prazos longos</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ FINAME</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Até 120 meses</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ Taxas Especiais</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">✓ Com IOF</span>
          </div>
        </div>
      </section>
        
      <section className="mb-12 bg-white rounded-lg shadow-md p-6">
        <div className="mb-8">
          <p className="mb-4 text-lg">O <strong>financiamento de caminhões</strong> oferece condições especiais para veículos comerciais pesados. Com programas como FINAME e linhas específicas para transportadores, você pode financiar seu caminhão com prazos de até 120 meses e taxas diferenciadas.</p>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🚛</div>
              <h3 className="font-semibold text-orange-800 mb-2">Veículos Pesados</h3>
              <p className="text-orange-700 text-sm">Caminhões, carretas, implementos</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🏦</div>
              <h3 className="font-semibold text-green-800 mb-2">FINAME</h3>
              <p className="text-green-700 text-sm">Taxas subsidiadas BNDES</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold text-blue-800 mb-2">Até 120 Meses</h3>
              <p className="text-blue-700 text-sm">Prazos longos para menor parcela</p>
            </div>
          </div>
          
          <h2 id="taxas-caminhao-2025" className="text-2xl font-semibold text-primary mt-8 mb-4">Taxas de Financiamento de Caminhões 2025</h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead>
                <tr className="bg-primary/10">
                  <th className="px-4 py-3 border text-left font-semibold">Programa</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Mínima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Taxa Máxima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Entrada Mínima</th>
                  <th className="px-4 py-3 border text-center font-semibold">Prazo Máximo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border font-medium">FINAME (BNDES)</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">0,85% a.m.</td>
                  <td className="px-4 py-3 border text-center">1,20% a.m.</td>
                  <td className="px-4 py-3 border text-center">10%</td>
                  <td className="px-4 py-3 border text-center">120 meses</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 border font-medium">CDC Bancos Comerciais</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">1,30% a.m.</td>
                  <td className="px-4 py-3 border text-center">2,00% a.m.</td>
                  <td className="px-4 py-3 border text-center">20%</td>
                  <td className="px-4 py-3 border text-center">72 meses</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border font-medium">Financeiras Especializadas</td>
                  <td className="px-4 py-3 border text-center text-green-600 font-bold">1,50% a.m.</td>
                  <td className="px-4 py-3 border text-center">2,50% a.m.</td>
                  <td className="px-4 py-3 border text-center">30%</td>
                  <td className="px-4 py-3 border text-center">60 meses</td>
                </tr>
              </tbody>
            </table>
          </div>
            
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <p className="text-sm italic">Use nosso <strong>simulador de financiamento de caminhões</strong> com as taxas acima para obter cálculos precisos. Considere programas especiais como FINAME para melhores condições.</p>
          </div>
        </div>
        
        <TruckForm2025 />
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Perguntas Frequentes - Financiamento de Caminhões</h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual a taxa de juros para financiamento de caminhão?</h3>
              <p className="text-neutral-700">As taxas para <strong>financiamento de caminhão</strong> variam de 1,3% a 2,0% ao mês, dependendo do tipo de veículo, banco e programa utilizado (FINAME, CDC comercial, etc.).</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual o prazo máximo para financiar um caminhão?</h3>
              <p className="text-neutral-700">O prazo máximo para <strong>financiamento de caminhão</strong> pode chegar a 120 meses (10 anos) em programas especiais como FINAME, e até 72 meses em financiamentos convencionais.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">O que é o FINAME para caminhões?</h3>
              <p className="text-neutral-700">O <strong>FINAME</strong> é uma linha de crédito do BNDES para financiamento de máquinas e equipamentos, incluindo caminhões, com taxas subsidiadas a partir de 0,85% a.m. + TLP.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-lg text-primary mb-2">Qual a entrada mínima para financiar um caminhão?</h3>
              <p className="text-neutral-700">A entrada mínima para <strong>financiamento de caminhão</strong> varia de 10% (FINAME) a 30% (bancos comerciais), dependendo do programa e perfil do cliente.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
