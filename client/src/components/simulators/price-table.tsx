import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// Interface para os dados da tabela
interface TableData {
  parcela: number;
  valorParcela: number;
  amortizacao: number;
  juros: number;
  saldoDevedor: number;
}

interface PriceTableProps {
  data: TableData[];
  expanded: boolean;
}

export default function PriceTable({ data, expanded }: PriceTableProps) {
  const [showAll, setShowAll] = useState(expanded);
  
  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Selecionar quantas parcelas mostrar na tabela reduzida
  const visibleRows = showAll ? data : data.slice(0, 6);
  const hasMoreRows = data.length > 6;

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 text-primary">
        Tabela de Amortização ({showAll ? "Completa" : "Resumida"})
      </h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Parcela</TableHead>
              <TableHead className="text-right">Valor da Parcela</TableHead>
              <TableHead className="text-right">Amortização</TableHead>
              <TableHead className="text-right">Juros</TableHead>
              <TableHead className="text-right">Saldo Devedor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.parcela}>
                <TableCell className="font-medium">{row.parcela}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.valorParcela)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.amortizacao)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.juros)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.saldoDevedor)}</TableCell>
              </TableRow>
            ))}
            
            {!showAll && hasMoreRows && (
              <TableRow>
                <TableCell colSpan={5} className="text-center italic text-muted-foreground">
                  ... e mais {data.length - 6} parcelas
                </TableCell>
              </TableRow>
            )}
            
            {showAll && data.length > 10 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center font-semibold bg-neutral-50">
                  <div className="flex justify-between">
                    <div>Total Pago:</div>
                    <div>
                      {formatCurrency(
                        data.reduce((sum, row) => sum + row.valorParcela, 0)
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {hasMoreRows && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Ver tabela completa
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}