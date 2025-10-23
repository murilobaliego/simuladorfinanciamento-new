import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalculadoraPrestamoAutoMX() {
  const [valorAuto, setValorAuto] = useState("300000");
  const [enganche, setEnganche] = useState("60000");
  const [plazo, setPlazo] = useState("48");
  const [tasaAnual, setTasaAnual] = useState("12.5");
  const [resultado, setResultado] = useState<any>(null);

  const calcularPrestamo = () => {
    const precio = parseFloat(valorAuto.replace(/,/g, ""));
    const entrada = parseFloat(enganche.replace(/,/g, ""));
    const meses = parseInt(plazo);
    const tasaAnualNum = parseFloat(tasaAnual.replace(",", "."));

    if (isNaN(precio) || isNaN(entrada) || isNaN(meses) || isNaN(tasaAnualNum)) {
      alert("Por favor, complete todos los campos correctamente");
      return;
    }

    const montoFinanciar = precio - entrada;
    const tasaMensual = tasaAnualNum / 100 / 12;
    
    const pagoMensual = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
    
    const totalPagar = pagoMensual * meses;
    const totalIntereses = totalPagar - montoFinanciar;
    const cat = ((totalPagar / montoFinanciar) - 1) * (12 / meses) * 100;

    setResultado({
      montoFinanciar,
      pagoMensual,
      totalPagar,
      totalIntereses,
      cat,
      porcentajeEnganche: (entrada / precio) * 100
    });
  };

  const formatMXN = (valor: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(valor);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Préstamos para Autos México 2025 | CAT y Mensualidades</title>
        <meta name="description" content="Calculadora gratuita de financiamiento automotriz en México. Calcula tu mensualidad, CAT, intereses totales y encuentra las mejores tasas para tu crédito de auto." />
        <meta name="keywords" content="calculadora préstamo auto México, financiamiento automotriz, crédito auto México, CAT préstamo, mensualidad auto, calculadora crédito automotriz" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/mx/calculadora-prestamo-auto" />
        <html lang="es-MX" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculadora de Préstamos para Autos en México
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calcula tu mensualidad, CAT y el costo total de tu financiamiento automotriz de forma gratuita
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            ¿Cómo Funciona el Financiamiento de Autos en México?
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              El <strong>financiamiento automotriz</strong> es una de las formas más populares de adquirir un vehículo en México. A través de un <strong>crédito para auto</strong>, puedes comprar el carro que necesitas pagando mensualidades fijas durante un período determinado, generalmente entre 12 y 60 meses.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              ¿Qué es el CAT y Por Qué es Importante?
            </h3>
            <p className="mb-4">
              El <strong>CAT (Costo Anual Total)</strong> es el indicador más importante al comparar préstamos para autos en México. Este porcentaje incluye la tasa de interés, comisiones, seguros obligatorios y otros gastos.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Consejo Importante
              </p>
              <p className="text-sm text-yellow-900">
                Siempre compara el <strong>CAT</strong>, no solo la tasa de interés. Un préstamo con tasa baja pero comisiones altas puede resultar más caro.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              ¿Cuánto Debo Dar de Enganche?
            </h3>
            <p className="mb-4">
              El <strong>enganche</strong> (pago inicial) es crucial:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Mínimo recomendado:</strong> 20% del valor del auto</li>
              <li><strong>Ideal:</strong> 30% o más para tasas más bajas</li>
              <li><strong>Beneficios:</strong> Menor mensualidad, menos intereses</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calcula tu Mensualidad
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="valorAuto" className="text-base font-semibold">Precio del Auto (MXN)</Label>
              <Input
                id="valorAuto"
                type="text"
                placeholder="300000"
                value={valorAuto}
                onChange={(e) => setValorAuto(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="enganche" className="text-base font-semibold">Enganche (MXN)</Label>
              <Input
                id="enganche"
                type="text"
                placeholder="60000"
                value={enganche}
                onChange={(e) => setEnganche(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="plazo" className="text-base font-semibold">Plazo (meses)</Label>
              <Input
                id="plazo"
                type="number"
                placeholder="48"
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="tasaAnual" className="text-base font-semibold">Tasa de Interés Anual (%)</Label>
              <Input
                id="tasaAnual"
                type="text"
                placeholder="12.5"
                value={tasaAnual}
                onChange={(e) => setTasaAnual(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>
          </div>

          <Button
            onClick={calcularPrestamo}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calcular Financiamiento
          </Button>

          {resultado && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Monto a Financiar</p>
                <p className="text-3xl font-bold text-neutral-800">{formatMXN(resultado.montoFinanciar)}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Tu Mensualidad Será</p>
                <p className="text-4xl font-bold text-green-700">{formatMXN(resultado.pagoMensual)}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-xl font-bold text-neutral-800">{formatMXN(resultado.totalPagar)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total de Intereses</p>
                  <p className="text-xl font-bold text-red-600">{formatMXN(resultado.totalIntereses)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">CAT Aproximado</p>
                  <p className="text-xl font-bold text-blue-600">{resultado.cat.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Nota:</strong> Este cálculo es aproximado. El CAT real puede variar según cada institución financiera.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Consejos para Obtener el Mejor Financiamiento
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compara al Menos 3 Opciones</h3>
                <p className="text-sm text-neutral-600">
                  Las tasas pueden variar hasta 5 puntos porcentuales entre instituciones.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Mejora tu Historial Crediticio</h3>
                <p className="text-sm text-neutral-600">
                  Un buen score en Buró de Crédito puede reducir tu tasa hasta 3 puntos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
