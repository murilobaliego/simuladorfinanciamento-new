import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalculadoraPrestamoAutoArgentina() {
  const [precioVehiculo, setPrecioVehiculo] = useState("8000000");
  const [anticipo, setAnticipo] = useState("1600000");
  const [plazo, setPlazo] = useState("36");
  const [tasaAnual, setTasaAnual] = useState("65");
  const [resultado, setResultado] = useState<any>(null);

  const calcularPrestamo = () => {
    const precio = parseFloat(precioVehiculo.replace(/\./g, ""));
    const entrada = parseFloat(anticipo.replace(/\./g, ""));
    const meses = parseInt(plazo);
    const tasaAnualNum = parseFloat(tasaAnual.replace(",", "."));

    if (isNaN(precio) || isNaN(entrada) || isNaN(meses) || isNaN(tasaAnualNum)) {
      alert("Por favor, completá todos los campos correctamente");
      return;
    }

    const montoFinanciar = precio - entrada;
    const tasaMensual = tasaAnualNum / 100 / 12;
    
    const cuotaMensual = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
    
    const totalPagar = cuotaMensual * meses;
    const totalIntereses = totalPagar - montoFinanciar;
    const cftea = tasaAnualNum;

    setResultado({
      montoFinanciar,
      cuotaMensual,
      totalPagar,
      totalIntereses,
      cftea,
      porcentajeAnticipo: (entrada / precio) * 100
    });
  };

  const formatARS = (valor: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Préstamos para Autos Argentina 2025 | CFTEA y Cuotas</title>
        <meta name="description" content="Calculadora gratuita de préstamos prendarios en Argentina. Calculá tu cuota mensual, CFTEA, intereses totales y encontrá las mejores tasas para tu financiamiento de auto." />
        <meta name="keywords" content="calculadora préstamo auto Argentina, préstamo prendario, crédito automotor, CFTEA, cuota mensual, financiamiento auto Argentina" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/argentina/calculadora-prestamo-auto" />
        <html lang="es-AR" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculadora de Préstamos para Autos en Argentina
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculá tu cuota mensual, CFTEA y el costo total de tu préstamo prendario de forma gratuita
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            ¿Cómo Funciona el Préstamo Prendario en Argentina?
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              El <strong>préstamo prendario</strong> (o crédito automotor) es la forma más común de financiar la compra de un vehículo en Argentina. A través de un <strong>préstamo para auto</strong>, podés adquirir el vehículo que necesitás pagando cuotas mensuales durante un período que generalmente va de <strong>12 a 60 meses</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              ¿Qué es el CFTEA y Por Qué es Importante?
            </h3>
            <p className="mb-4">
              El <strong>CFTEA (Costo Financiero Total Efectivo Anual)</strong> es el indicador más importante al comparar préstamos prendarios en Argentina. Este porcentaje incluye:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Tasa de interés nominal:</strong> El costo del dinero prestado</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Gastos administrativos:</strong> Comisiones y sellados</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Seguros obligatorios:</strong> Seguro de vida y del vehículo</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Otros costos:</strong> Gastos de otorgamiento y gestión</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Consejo Importante
              </p>
              <p className="text-sm text-yellow-900">
                Siempre compará el <strong>CFTEA</strong>, no solo la tasa nominal. Un préstamo con tasa baja pero gastos altos puede resultar más caro que uno con tasa más alta pero menos gastos.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Factores que Afectan tu Tasa de Interés
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Mejoran tu tasa:</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Buen historial crediticio (Veraz limpio)</li>
                  <li>• Anticipo mayor al 20%</li>
                  <li>• Ingresos en blanco comprobables</li>
                  <li>• Plazo más corto (24-36 meses)</li>
                  <li>• Auto 0km vs usado</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">✗ Aumentan tu tasa:</h4>
                <ul className="text-sm text-red-900 space-y-1">
                  <li>• Deudas en Veraz o BCRA</li>
                  <li>• Anticipo bajo o sin anticipo</li>
                  <li>• Ingresos informales</li>
                  <li>• Plazo muy largo (48+ meses)</li>
                  <li>• Auto usado o muy antiguo</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              ¿Cuánto Anticipo Debo Dar?
            </h3>
            <p className="mb-4">
              El <strong>anticipo</strong> (o entrega inicial) es fundamental para obtener mejores condiciones:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Mínimo recomendado:</strong> 20% del valor del auto</li>
              <li><strong>Ideal:</strong> 30% o más para las mejores tasas</li>
              <li><strong>Beneficios:</strong> Menor cuota, menos intereses, mejor aprobación</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📊 Ejemplo Real
              </p>
              <p className="text-sm text-blue-900">
                Auto de <strong>$8.000.000</strong> a <strong>36 meses</strong> con tasa del <strong>65% anual</strong>:<br />
                • Con anticipo del 10% ($800.000): Cuota de <strong>$350.000</strong><br />
                • Con anticipo del 20% ($1.600.000): Cuota de <strong>$311.000</strong><br />
                <strong className="text-blue-700">¡Ahorrás $39.000 por mes!</strong>
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Tasas Promedio de Préstamos Prendarios en Argentina (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Tipo de Vehículo</th>
                    <th className="px-4 py-2 text-left border">Plazo</th>
                    <th className="px-4 py-2 text-right border">CFTEA Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">0km</td>
                    <td className="px-4 py-2 border">24-36 meses</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">55% - 70%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">0km</td>
                    <td className="px-4 py-2 border">48-60 meses</td>
                    <td className="px-4 py-2 text-right border">65% - 85%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Usado reciente</td>
                    <td className="px-4 py-2 border">24-36 meses</td>
                    <td className="px-4 py-2 text-right border">70% - 90%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Usado antiguo</td>
                    <td className="px-4 py-2 border">12-24 meses</td>
                    <td className="px-4 py-2 text-right border text-red-700">80% - 110%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Principales Entidades de Financiamiento en Argentina
            </h3>
            <p className="mb-4">
              Podés obtener un préstamo prendario en:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Bancos:</strong> Banco Nación, Banco Provincia, Santander, BBVA, Galicia, Macro</li>
              <li><strong>Concesionarias:</strong> Financiamiento directo con planes propios</li>
              <li><strong>Financieras:</strong> PSA Finance, Volkswagen Financial Services, Rombo</li>
              <li><strong>Cooperativas:</strong> Credicoop, Cabal</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Documentos Necesarios para Solicitar tu Préstamo
            </h3>
            <div className="bg-neutral-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold mb-3">Para Empleados en Relación de Dependencia:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>✓ DNI (ambos lados)</li>
                <li>✓ Últimos 3 recibos de sueldo</li>
                <li>✓ Certificado de trabajo</li>
                <li>✓ Últimos 3 resúmenes de cuenta bancaria</li>
                <li>✓ Servicio a tu nombre (luz, gas, agua)</li>
              </ul>
              
              <h4 className="font-bold mb-3">Para Monotributistas y Autónomos:</h4>
              <ul className="text-sm space-y-1">
                <li>✓ DNI (ambos lados)</li>
                <li>✓ Constancia de inscripción AFIP</li>
                <li>✓ Últimas 6 declaraciones juradas</li>
                <li>✓ Resúmenes bancarios (6 meses)</li>
                <li>✓ Comprobantes de ingresos</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calculá tu Cuota Mensual
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="precioVehiculo" className="text-base font-semibold">Precio del Auto ($)</Label>
              <Input
                id="precioVehiculo"
                type="text"
                value={precioVehiculo}
                onChange={(e) => setPrecioVehiculo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="anticipo" className="text-base font-semibold">Anticipo ($)</Label>
              <Input
                id="anticipo"
                type="text"
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
              <Label htmlFor="tasaAnual" className="text-base font-semibold">Tasa de Interés Anual (%)</Label>
              <Input
                id="tasaAnual"
                type="text"
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
                <p className="text-3xl font-bold text-neutral-800">{formatARS(resultado.montoFinanciar)}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Anticipo: {resultado.porcentajeAnticipo.toFixed(1)}% del precio
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Tu Cuota Mensual Será</p>
                <p className="text-4xl font-bold text-green-700">{formatARS(resultado.cuotaMensual)}</p>
                <p className="text-xs text-green-600 mt-1">Durante {plazo} meses</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-xl font-bold text-neutral-800">{formatARS(resultado.totalPagar)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total de Intereses</p>
                  <p className="text-xl font-bold text-red-600">{formatARS(resultado.totalIntereses)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">CFTEA Aproximado</p>
                  <p className="text-xl font-bold text-blue-600">{resultado.cftea.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Nota:</strong> Este cálculo es aproximado. El CFTEA real puede variar según gastos administrativos, seguros y otros costos de cada entidad.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Consejos para Obtener el Mejor Préstamo Prendario
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compará al Menos 3 Opciones</h3>
                <p className="text-sm text-neutral-600">
                  Las tasas pueden variar hasta 20 puntos entre entidades. Usá comparadores online.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Revisá tu Veraz</h3>
                <p className="text-sm text-neutral-600">
                  Un Veraz limpio puede reducir tu tasa significativamente. Revisalo antes de solicitar.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Elegí Plazos Cortos</h3>
                <p className="text-sm text-neutral-600">
                  Un préstamo a 24 meses cuesta mucho menos que uno a 48 meses en intereses.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Leé el Contrato Completo</h3>
                <p className="text-sm text-neutral-600">
                  Verificá seguros obligatorios, gastos administrativos y condiciones de cancelación anticipada.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            Esta calculadora es una herramienta informativa. Los resultados son aproximados y pueden variar según las condiciones de cada entidad financiera.
          </p>
        </div>
      </div>
    </>
  );
}
