import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface TableData {
  parcela: number;
  valorParcela: number;
  amortizacao: number;
  juros: number;
  saldoDevedor: number;
}

interface DebtChartProps {
  data: TableData[];
  height?: number;
}

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};

export default function DebtChart({ data, height = 300 }: DebtChartProps) {
  const isMobile = useIsMobile();
  
  // Filtrar os dados para mostrar apenas alguns pontos se tiver muitos (para melhor visualização)
  const filteredData = data.length <= 12 ? data : data.filter((_, index) => {
    const interval = Math.max(1, Math.floor(data.length / 12));
    return index % interval === 0 || index === data.length - 1;
  });

  // Customização do tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-neutral-200 rounded-md shadow-sm">
          <p className="font-semibold">Parcela {label}</p>
          <p className="text-sm text-primary">
            Saldo: {formatCurrency(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-sm text-success">
              Amortizado: {formatCurrency(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Preparar dados para mostrar valor amortizado (complemento do saldo devedor)
  const chartData = filteredData.map(item => {
    const valorInicial = data[0].saldoDevedor;
    const valorAmortizado = valorInicial - item.saldoDevedor;
    return {
      ...item,
      valorAmortizado
    };
  });

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-primary">Evolução do Saldo Devedor</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: isMobile ? 10 : 30,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="parcela" 
            label={{ 
              value: 'Parcela', 
              position: 'insideBottomRight', 
              offset: -5,
              fontSize: 12
            }}
          />
          <YAxis 
            tickFormatter={(value) => isMobile ? `${value / 1000}K` : formatCurrency(value)}
            width={isMobile ? 40 : 80}
            label={!isMobile ? { 
              value: 'Valor (R$)', 
              angle: -90, 
              position: 'insideLeft',
              fontSize: 12
            } : undefined}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="saldoDevedor"
            name="Saldo Devedor"
            stroke="#ff4757"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="valorAmortizado"
            name="Valor Amortizado"
            stroke="#2ed573"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}