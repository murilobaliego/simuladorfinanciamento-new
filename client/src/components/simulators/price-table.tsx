import { TableData } from "@/components/simulators/vehicle-form";

interface PriceTableProps {
  data: TableData[];
  expanded: boolean;
}

export default function PriceTable({ data, expanded }: PriceTableProps) {
  // If not expanded, only show first 5 rows
  const displayData = expanded ? data : data.slice(0, 6);

  return (
    <div className="overflow-x-auto bg-white border border-neutral-200 rounded-md">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-100">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Parcela</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Valor da Parcela</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Amortização</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Juros</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Saldo Devedor</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {displayData.map((row) => (
            <tr key={row.parcela}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">{row.parcela}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                {row.parcela === 0 
                  ? "-" 
                  : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.valorParcela)
                }
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                {row.parcela === 0 
                  ? "-" 
                  : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.amortizacao)
                }
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                {row.parcela === 0 
                  ? "-" 
                  : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.juros)
                }
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.saldoDevedor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
