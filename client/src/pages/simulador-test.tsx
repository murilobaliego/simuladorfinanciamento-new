import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function SimuladorTest() {
  const [valorVeiculo, setValorVeiculo] = useState("50000");
  const [valorEntrada, setValorEntrada] = useState("10000");
  const [numParcelas, setNumParcelas] = useState("48");
  const [taxaJuros, setTaxaJuros] = useState("1.5");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calcular = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/simulador-test/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valorVeiculo: parseFloat(valorVeiculo),
          valorEntrada: parseFloat(valorEntrada),
          numParcelas: parseInt(numParcelas),
          taxaJuros: parseFloat(taxaJuros),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao calcular");
      }

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Simulador Test - Server Side Rendering</title>
        <meta name="description" content="Protótipo de simulador com cálculo server-side" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-neutral-800 mb-8 text-center">
          Simulador Test (Server-Side)
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cálculo no Servidor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="valorVeiculo">Valor do Veículo</Label>
              <Input
                id="valorVeiculo"
                type="number"
                value={valorVeiculo}
                onChange={(e) => setValorVeiculo(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="valorEntrada">Valor da Entrada</Label>
              <Input
                id="valorEntrada"
                type="number"
                value={valorEntrada}
                onChange={(e) => setValorEntrada(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="numParcelas">Número de Parcelas</Label>
              <Input
                id="numParcelas"
                type="number"
                value={numParcelas}
                onChange={(e) => setNumParcelas(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="taxaJuros">Taxa de Juros (% ao mês)</Label>
              <Input
                id="taxaJuros"
                type="number"
                step="0.1"
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(e.target.value)}
              />
            </div>

            <Button onClick={calcular} disabled={loading} className="w-full">
              {loading ? "Calculando..." : "Calcular no Servidor"}
            </Button>

            {result && (
              <div className="space-y-3 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 mb-1">Valor Financiado</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatBRL(result.valorFinanciado)}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-500">
                  <p className="text-sm text-green-700 mb-1">Parcela Mensal</p>
                  <p className="text-3xl font-bold text-green-700">
                    {formatBRL(result.valorParcela)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                    <p className="text-lg font-bold text-neutral-800">
                      {formatBRL(result.totalPagar)}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-red-600 mb-1">Total de Juros</p>
                    <p className="text-lg font-bold text-red-700">
                      {formatBRL(result.totalJuros)}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="text-sm text-yellow-800">
                    ✓ Cálculo processado no servidor Node.js
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
