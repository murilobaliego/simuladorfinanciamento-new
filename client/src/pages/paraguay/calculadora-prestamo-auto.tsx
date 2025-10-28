import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalculadoraPrestamoAutoParaguay() {
  const [precioVehiculo, setPrecioVehiculo] = useState("150000000");
  const [anticipo, setAnticipo] = useState("30000000");
  const [plazo, setPlazo] = useState("48");
  const [tasaAnual, setTasaAnual] = useState("18");
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
    const tea = tasaAnualNum;

    setResultado({
      montoFinanciar,
      cuotaMensual,
      totalPagar,
      totalIntereses,
      tea,
      porcentajeAnticipo: (entrada / precio) * 100
    });
  };

  const formatPYG = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Préstamos para Autos Paraguay 2025 | TEA y Cuotas</title>
        <meta name="description" content="Calculadora gratuita de préstamos prendarios en Paraguay. Calculá tu cuota mensual, TEA, intereses totales y encontrá las mejores tasas para tu financiamiento de auto." />
        <meta name="keywords" content="calculadora préstamo auto Paraguay, préstamo prendario, crédito automotor, TEA, cuota mensual, financiamiento auto Paraguay, préstamo vehículo" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/paraguay/calculadora-prestamo-auto" />
        <html lang="es-PY" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculadora de Préstamos para Autos en Paraguay
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculá tu cuota mensual, TEA y el costo total de tu préstamo prendario en guaraníes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            ¿Cómo Funciona el Préstamo Prendario en Paraguay?
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              El <strong>préstamo prendario</strong> es la forma más común de financiar la compra de un vehículo en Paraguay. A través de este crédito, podés adquirir tu auto pagando cuotas mensuales durante un período que generalmente va de <strong>12 a 60 meses</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              ¿Qué es la TEA (Tasa Efectiva Anual)?
            </h3>
            <p className="mb-4">
              La <strong>TEA</strong> es el indicador más importante al comparar préstamos en Paraguay. Este porcentaje incluye:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Tasa de interés:</strong> El costo del dinero prestado</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Gastos administrativos:</strong> Comisiones y sellados</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Seguros:</strong> Seguro de vida y del vehículo</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Consejo Importante
              </p>
              <p className="text-sm text-yellow-900">
                Siempre compará la <strong>TEA</strong>, no solo la tasa nominal. Un préstamo con tasa baja pero gastos altos puede resultar más caro.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Factores que Afectan tu Tasa de Interés
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Mejoran tu tasa:</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Buen historial crediticio (Informconf limpio)</li>
                  <li>• Anticipo mayor al 20%</li>
                  <li>• Ingresos comprobables</li>
                  <li>• Plazo más corto (24-36 meses)</li>
                  <li>• Auto 0km vs usado</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">✗ Aumentan tu tasa:</h4>
                <ul className="text-sm text-red-900 space-y-1">
                  <li>• Deudas en Informconf o BCP</li>
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
              El <strong>anticipo</strong> es fundamental para obtener mejores condiciones:
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
                Auto de <strong>₲150.000.000</strong> a <strong>48 meses</strong> con tasa del <strong>18% anual</strong>:<br />
                • Con anticipo del 10% (₲15.000.000): Cuota de <strong>₲3.900.000</strong><br />
                • Con anticipo del 20% (₲30.000.000): Cuota de <strong>₲3.470.000</strong><br />
                <strong className="text-blue-700">¡Ahorrás ₲430.000 por mes!</strong>
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Tasas Promedio de Préstamos Prendarios en Paraguay (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Tipo de Vehículo</th>
                    <th className="px-4 py-2 text-left border">Plazo</th>
                    <th className="px-4 py-2 text-right border">TEA Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">0km</td>
                    <td className="px-4 py-2 border">24-36 meses</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">14% - 18%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">0km</td>
                    <td className="px-4 py-2 border">48-60 meses</td>
                    <td className="px-4 py-2 text-right border">16% - 22%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Usado reciente (0-3 años)</td>
                    <td className="px-4 py-2 border">24-36 meses</td>
                    <td className="px-4 py-2 text-right border">18% - 24%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Usado antiguo (3+ años)</td>
                    <td className="px-4 py-2 border">12-24 meses</td>
                    <td className="px-4 py-2 text-right border text-red-700">22% - 30%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Principales Entidades de Financiamiento en Paraguay
            </h3>
            <p className="mb-4">
              Podés obtener un préstamo prendario en:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Bancos:</strong> Itaú, Continental, Regional, GNB, Atlas, Familiar, BBVA</li>
              <li><strong>Financieras:</strong> Interfisa, Sudameris, Rio, Visión Banco</li>
              <li><strong>Cooperativas:</strong> Medalla Milagrosa, Universitaria, San Cristóbal</li>
              <li><strong>Concesionarias:</strong> Financiamiento directo con planes propios</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Documentos Necesarios para Solicitar tu Préstamo
            </h3>
            <div className="bg-neutral-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold mb-3">Para Empleados en Relación de Dependencia:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>✓ Cédula de identidad (ambos lados)</li>
                <li>✓ Últimos 3 recibos de sueldo</li>
                <li>✓ Certificado de trabajo</li>
                <li>✓ Últimos 3 extractos bancarios</li>
                <li>✓ Comprobante de domicilio (ANDE, ESSAP, COPACO)</li>
              </ul>
              
              <h4 className="font-bold mb-3">Para Trabajadores Independientes:</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Cédula de identidad (ambos lados)</li>
                <li>✓ RUC y constancia de inscripción</li>
                <li>✓ Últimas 6 declaraciones juradas (SET)</li>
                <li>✓ Extractos bancarios (6 meses)</li>
                <li>✓ Comprobantes de ingresos</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Préstamos en Guaraníes vs Dólares
            </h3>
            <p className="mb-4">
              En Paraguay podés financiar tu auto en dos monedas:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">Préstamo en Guaraníes (₲)</h4>
                <ul className="text-sm text-blue-900 space-y-1">
                  <li>• Tasas más altas (14-30%)</li>
                  <li>• Sin riesgo cambiario</li>
                  <li>• Ideal si tus ingresos son en guaraníes</li>
                  <li>• Más fácil de aprobar</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">Préstamo en Dólares (USD)</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Tasas más bajas (8-15%)</li>
                  <li>• Riesgo cambiario</li>
                  <li>• Ideal si tus ingresos son en dólares</li>
                  <li>• Requisitos más estrictos</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6">
              <p className="text-sm font-semibold text-red-900 mb-2">
                ⚠️ Advertencia sobre Préstamos en Dólares
              </p>
              <p className="text-sm text-red-900">
                Si tus ingresos son en guaraníes, evitá préstamos en dólares. Una devaluación puede aumentar significativamente tu cuota mensual.
              </p>
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
              <Label htmlFor="precioVehiculo" className="text-base font-semibold">Precio del Auto (₲)</Label>
              <Input
                id="precioVehiculo"
                type="text"
                value={precioVehiculo}
                onChange={(e) => setPrecioVehiculo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="anticipo" className="text-base font-semibold">Anticipo (₲)</Label>
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
                <p className="text-3xl font-bold text-neutral-800">{formatPYG(resultado.montoFinanciar)}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Anticipo: {resultado.porcentajeAnticipo.toFixed(1)}% del precio
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Tu Cuota Mensual Será</p>
                <p className="text-4xl font-bold text-green-700">{formatPYG(resultado.cuotaMensual)}</p>
                <p className="text-xs text-green-600 mt-1">Durante {plazo} meses</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-xl font-bold text-neutral-800">{formatPYG(resultado.totalPagar)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total de Intereses</p>
                  <p className="text-xl font-bold text-red-600">{formatPYG(resultado.totalIntereses)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">TEA Aproximada</p>
                  <p className="text-xl font-bold text-blue-600">{resultado.tea.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Nota:</strong> Este cálculo es aproximado. La TEA real puede variar según gastos administrativos, seguros y otros costos de cada entidad.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Consejos para Obtener el Mejor Préstamo Prendario
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compará al Menos 3 Opciones</h3>
                <p className="text-sm text-neutral-600">
                  Las tasas pueden variar significativamente entre bancos y financieras. Pedí cotizaciones.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Revisá tu Informconf</h3>
                <p className="text-sm text-neutral-600">
                  Un historial crediticio limpio puede reducir tu tasa. Revisalo antes de solicitar.
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
                <h3 className="font-bold text-neutral-800 mb-1">Considerá la Moneda</h3>
                <p className="text-sm text-neutral-600">
                  Solo tomá préstamos en dólares si tus ingresos son en esa moneda.
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

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Ahorrá para el Anticipo</h3>
                <p className="text-sm text-neutral-600">
                  Cuanto mayor sea tu anticipo, mejores serán las condiciones del préstamo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-neutral-800 mb-2">¿Cuál es la tasa de interés promedio en Paraguay?</h3>
              <p className="text-sm text-neutral-600">
                Para préstamos prendarios en guaraníes, las tasas van del 14% al 30% anual dependiendo del banco, plazo y tipo de vehículo. En dólares, las tasas son del 8% al 15%.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">¿Puedo financiar un auto usado?</h3>
              <p className="text-sm text-neutral-600">
                Sí, pero las tasas son más altas y los plazos más cortos. Los bancos generalmente financian autos usados de hasta 10 años de antigüedad.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">¿Qué pasa si tengo deudas en Informconf?</h3>
              <p className="text-sm text-neutral-600">
                Tener deudas registradas dificulta la aprobación y aumenta las tasas. Es recomendable regularizar tu situación antes de solicitar el préstamo.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">¿Puedo cancelar el préstamo antes de tiempo?</h3>
              <p className="text-sm text-neutral-600">
                Sí, la mayoría de los bancos permiten cancelación anticipada. Algunos cobran una comisión, otros no. Verificá las condiciones en tu contrato.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">¿Necesito seguro del vehículo?</h3>
              <p className="text-sm text-neutral-600">
                Sí, todos los bancos exigen seguro contra todo riesgo mientras dure el préstamo. El costo del seguro se suma a tu cuota mensual.
              </p>
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
