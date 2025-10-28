import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalculadoraPrestamoAutoBolivia() {
  const [precioVehiculo, setPrecioVehiculo] = useState("150000");
  const [anticipo, setAnticipo] = useState("30000");
  const [plazo, setPlazo] = useState("48");
  const [tasaAnual, setTasaAnual] = useState("12");
  const [resultado, setResultado] = useState<any>(null);

  const calcularPrestamo = () => {
    const precio = parseFloat(precioVehiculo);
    const entrada = parseFloat(anticipo);
    const meses = parseInt(plazo);
    const tasaAnualNum = parseFloat(tasaAnual);

    if (isNaN(precio) || isNaN(entrada) || isNaN(meses) || isNaN(tasaAnualNum)) {
      alert("Por favor, complete todos los campos correctamente");
      return;
    }

    const montoFinanciar = precio - entrada;
    const tasaMensual = tasaAnualNum / 100 / 12;
    const cuotaMensual = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
    const totalPagar = cuotaMensual * meses;
    const totalIntereses = totalPagar - montoFinanciar;

    setResultado({
      montoFinanciar,
      cuotaMensual,
      totalPagar,
      totalIntereses,
      tea: tasaAnualNum,
      porcentajeAnticipo: (entrada / precio) * 100
    });
  };

  const formatBOB = (valor: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2
    }).format(valor);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Préstamos para Autos Bolivia 2025 | TEA y Cuotas</title>
        <meta name="description" content="Calculadora gratuita de préstamos automotrices en Bolivia. Calcula tu cuota mensual, TEA, intereses totales y encuentra las mejores tasas para tu financiamiento de auto." />
        <meta name="keywords" content="calculadora préstamo auto Bolivia, préstamo automotriz, crédito vehicular, TEA, cuota mensual, financiamiento auto Bolivia" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/bolivia/calculadora-prestamo-auto" />
        <html lang="es-BO" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculadora de Préstamos para Autos en Bolivia
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calcula tu cuota mensual, TEA y el costo total de tu préstamo automotriz
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Préstamos Automotrices en Bolivia
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              El <strong>préstamo automotriz</strong> te permite financiar tu vehículo con plazos de <strong>12 a 60 meses</strong>. Las tasas en Bolivia son reguladas por ASFI.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Tasas Promedio en Bolivia (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Tipo</th>
                    <th className="px-4 py-2 text-right border">TEA Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">Nuevo</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">8% - 14%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Usado reciente</td>
                    <td className="px-4 py-2 text-right border">12% - 18%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Usado antiguo</td>
                    <td className="px-4 py-2 text-right border text-red-700">16% - 24%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Principales Entidades en Bolivia
            </h3>
            <ul className="space-y-2 mb-6">
              <li><strong>Bancos:</strong> Banco Nacional, Mercantil Santa Cruz, BCP Bolivia, Bisa, Ganadero</li>
              <li><strong>Mutuales:</strong> La Primera, La Paz</li>
              <li><strong>Cooperativas:</strong> Jesús Nazareno, San Martín</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">💡 Consejo</p>
              <p className="text-sm text-yellow-900">
                En Bolivia, las tasas de interés están reguladas por ASFI. Verifica que tu entidad esté autorizada.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calcula tu Cuota
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="precioVehiculo" className="text-base font-semibold">Precio del Auto (Bs)</Label>
              <Input
                id="precioVehiculo"
                type="number"
                value={precioVehiculo}
                onChange={(e) => setPrecioVehiculo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="anticipo" className="text-base font-semibold">Inicial (Bs)</Label>
              <Input
                id="anticipo"
                type="number"
                value={anticipo}
                onChange={(e) => setAnticipo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="plazo" className="text-base font-semibold">Plazo (meses)</Label>
              <Input
                id="plazo"
                type="number"
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="tasaAnual" className="text-base font-semibold">Tasa Anual (%)</Label>
              <Input
                id="tasaAnual"
                type="number"
                step="0.1"
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
            Calcular
          </Button>

          {resultado && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Monto a Financiar</p>
                <p className="text-3xl font-bold text-neutral-800">{formatBOB(resultado.montoFinanciar)}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Cuota Mensual</p>
                <p className="text-4xl font-bold text-green-700">{formatBOB(resultado.cuotaMensual)}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-xl font-bold text-neutral-800">{formatBOB(resultado.totalPagar)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Intereses</p>
                  <p className="text-xl font-bold text-red-600">{formatBOB(resultado.totalIntereses)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">TEA</p>
                  <p className="text-xl font-bold text-blue-600">{resultado.tea.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Nota:</strong> Cálculo referencial. Consulta con tu entidad para valores exactos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Consejos para tu Préstamo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compara Tasas</h3>
                <p className="text-sm text-neutral-600">
                  Las tasas varían entre bancos y cooperativas. Solicita cotizaciones.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Verifica ASFI</h3>
                <p className="text-sm text-neutral-600">
                  Asegúrate que la entidad esté regulada por ASFI para tu protección.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
