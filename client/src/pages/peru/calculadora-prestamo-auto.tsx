import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalculadoraPrestamoAutoPeru() {
  const [precioVehiculo, setPrecioVehiculo] = useState("80000");
  const [anticipo, setAnticipo] = useState("16000");
  const [plazo, setPlazo] = useState("48");
  const [tasaAnual, setTasaAnual] = useState("16");
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
      tcea: tasaAnualNum,
      porcentajeAnticipo: (entrada / precio) * 100
    });
  };

  const formatPEN = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(valor);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Préstamos para Autos Perú 2025 | TCEA y Cuotas</title>
        <meta name="description" content="Calculadora gratuita de préstamos vehiculares en Perú. Calcula tu cuota mensual, TCEA, intereses totales y encuentra las mejores tasas para tu financiamiento de auto." />
        <meta name="keywords" content="calculadora préstamo auto Perú, préstamo vehicular, crédito automotriz, TCEA, cuota mensual, financiamiento auto Perú" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/peru/calculadora-prestamo-auto" />
        <html lang="es-PE" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculadora de Préstamos para Autos en Perú
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calcula tu cuota mensual, TCEA y el costo total de tu préstamo vehicular
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Préstamos Vehiculares en Perú
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              El <strong>préstamo vehicular</strong> te permite financiar la compra de tu auto con plazos de <strong>12 a 60 meses</strong>. La <strong>TCEA</strong> (Tasa de Costo Efectivo Anual) incluye todos los costos del préstamo.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Tasas Promedio en Perú (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Tipo</th>
                    <th className="px-4 py-2 text-right border">TCEA Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">Nuevo</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">12% - 18%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Usado reciente</td>
                    <td className="px-4 py-2 text-right border">16% - 22%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Usado antiguo</td>
                    <td className="px-4 py-2 text-right border text-red-700">20% - 28%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Principales Bancos en Perú
            </h3>
            <ul className="space-y-2 mb-6">
              <li><strong>Bancos:</strong> BCP, BBVA, Interbank, Scotiabank, BanBif, Pichincha</li>
              <li><strong>Financieras:</strong> Crediscotia, Compartamos, Mitsui Auto Finance</li>
              <li><strong>Cajas:</strong> Caja Arequipa, Caja Huancayo, Caja Trujillo</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">💡 Consejo</p>
              <p className="text-sm text-yellow-900">
                Compara siempre la <strong>TCEA</strong>, no solo la tasa de interés. La TCEA incluye todos los costos y comisiones.
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
              <Label htmlFor="precioVehiculo" className="text-base font-semibold">Precio del Auto (S/)</Label>
              <Input
                id="precioVehiculo"
                type="number"
                value={precioVehiculo}
                onChange={(e) => setPrecioVehiculo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="anticipo" className="text-base font-semibold">Inicial (S/)</Label>
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
                <p className="text-3xl font-bold text-neutral-800">{formatPEN(resultado.montoFinanciar)}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Cuota Mensual</p>
                <p className="text-4xl font-bold text-green-700">{formatPEN(resultado.cuotaMensual)}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-xl font-bold text-neutral-800">{formatPEN(resultado.totalPagar)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Intereses</p>
                  <p className="text-xl font-bold text-red-600">{formatPEN(resultado.totalIntereses)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">TCEA</p>
                  <p className="text-xl font-bold text-blue-600">{resultado.tcea.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Nota:</strong> Cálculo referencial. Consulta con tu banco para valores exactos.
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
                <h3 className="font-bold text-neutral-800 mb-1">Compara TCEA</h3>
                <p className="text-sm text-neutral-600">
                  La TCEA te muestra el costo real del préstamo incluyendo todas las comisiones.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Revisa tu Historial</h3>
                <p className="text-sm text-neutral-600">
                  Un buen historial en Infocorp o Sentinel mejora tus condiciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
