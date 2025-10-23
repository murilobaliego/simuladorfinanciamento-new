import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalculadoraCreditoVehiculoColombia() {
  const [precioVehiculo, setPrecioVehiculo] = useState("80000000");
  const [cuotaInicial, setCuotaInicial] = useState("16000000");
  const [plazo, setPlazo] = useState("48");
  const [tasaAnual, setTasaAnual] = useState("18");
  const [resultado, setResultado] = useState<any>(null);

  const calcularCredito = () => {
    const precio = parseFloat(precioVehiculo.replace(/\./g, ""));
    const inicial = parseFloat(cuotaInicial.replace(/\./g, ""));
    const meses = parseInt(plazo);
    const tasaAnualNum = parseFloat(tasaAnual.replace(",", "."));

    if (isNaN(precio) || isNaN(inicial) || isNaN(meses) || isNaN(tasaAnualNum)) {
      alert("Por favor, complete todos los campos correctamente");
      return;
    }

    const montoFinanciar = precio - inicial;
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
      porcentajeCuotaInicial: (inicial / precio) * 100
    });
  };

  const formatCOP = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Crédito de Vehículo Colombia 2025 | TEA y Cuotas</title>
        <meta name="description" content="Calculadora gratuita de crédito de vehículo en Colombia. Calcula tu cuota mensual, TEA, intereses totales y encuentra las mejores tasas para tu financiamiento de carro." />
        <meta name="keywords" content="calculadora crédito vehículo Colombia, financiamiento carro, crédito automotriz Colombia, TEA, cuota mensual, simulador crédito carro" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/colombia/calculadora-credito-vehiculo" />
        <html lang="es-CO" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculadora de Crédito de Vehículo en Colombia
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calcula tu cuota mensual, TEA y el costo total de tu financiamiento de vehículo de forma gratuita
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            ¿Cómo Funciona el Crédito de Vehículo en Colombia?
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              El <strong>crédito de vehículo</strong> es una de las formas más comunes de financiar la compra de un carro en Colombia. A través de un <strong>préstamo para vehículo</strong>, puedes adquirir el carro que necesitas pagando cuotas mensuales durante un período que generalmente va de <strong>12 a 60 meses</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              ¿Qué es la TEA y Por Qué es Importante?
            </h3>
            <p className="mb-4">
              La <strong>TEA (Tasa Efectiva Anual)</strong> es el indicador más importante al comparar créditos de vehículo en Colombia. Este porcentaje incluye:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Tasa de interés:</strong> El costo del dinero prestado</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Gastos administrativos:</strong> Comisiones y costos de estudio</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Seguros obligatorios:</strong> Seguro de vida y del vehículo</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Otros costos:</strong> Avalúo, matrícula, impuestos</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Consejo Importante
              </p>
              <p className="text-sm text-yellow-900">
                Siempre compara la <strong>TEA</strong>, no solo la tasa nominal. Un crédito con tasa baja pero gastos altos puede resultar más caro que uno con tasa más alta pero menos gastos.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Factores que Afectan tu Tasa de Interés
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Mejoran tu tasa:</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Buen historial crediticio (DataCrédito limpio)</li>
                  <li>• Cuota inicial mayor al 20%</li>
                  <li>• Ingresos estables y comprobables</li>
                  <li>• Plazo más corto (24-36 meses)</li>
                  <li>• Vehículo nuevo vs usado</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">✗ Aumentan tu tasa:</h4>
                <ul className="text-sm text-red-900 space-y-1">
                  <li>• Reportes negativos en DataCrédito</li>
                  <li>• Cuota inicial baja o sin cuota</li>
                  <li>• Ingresos variables o informales</li>
                  <li>• Plazo muy largo (60+ meses)</li>
                  <li>• Vehículo usado o muy antiguo</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              ¿Cuánta Cuota Inicial Debo Dar?
            </h3>
            <p className="mb-4">
              La <strong>cuota inicial</strong> es fundamental para obtener mejores condiciones:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Mínimo recomendado:</strong> 20% del valor del vehículo</li>
              <li><strong>Ideal:</strong> 30% o más para las mejores tasas</li>
              <li><strong>Beneficios:</strong> Menor cuota, menos intereses, mejor aprobación</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📊 Ejemplo Real
              </p>
              <p className="text-sm text-blue-900">
                Vehículo de <strong>$80.000.000</strong> a <strong>48 meses</strong> con tasa del <strong>18% anual</strong>:<br />
                • Con cuota inicial del 10% ($8.000.000): Cuota de <strong>$2.100.000</strong><br />
                • Con cuota inicial del 20% ($16.000.000): Cuota de <strong>$1.867.000</strong><br />
                <strong className="text-blue-700">¡Ahorras $233.000 al mes!</strong>
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Tasas Promedio de Crédito de Vehículo en Colombia (2025)
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
                    <td className="px-4 py-2 border">Nuevo</td>
                    <td className="px-4 py-2 border">24-36 meses</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">15% - 20%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Nuevo</td>
                    <td className="px-4 py-2 border">48-60 meses</td>
                    <td className="px-4 py-2 text-right border">18% - 24%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Usado reciente</td>
                    <td className="px-4 py-2 border">24-48 meses</td>
                    <td className="px-4 py-2 text-right border">20% - 26%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Usado antiguo</td>
                    <td className="px-4 py-2 border">12-36 meses</td>
                    <td className="px-4 py-2 text-right border text-red-700">24% - 32%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Principales Entidades de Financiamiento en Colombia
            </h3>
            <p className="mb-4">
              Puedes obtener crédito de vehículo en:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Bancos:</strong> Bancolombia, Davivienda, Banco de Bogotá, BBVA, Banco Popular</li>
              <li><strong>Cooperativas:</strong> Coomeva, Confiar, Coofinep</li>
              <li><strong>Financieras:</strong> Tuya, Finandina, Credifamilia</li>
              <li><strong>Concesionarios:</strong> Financiamiento directo con planes propios</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Documentos Necesarios para Solicitar tu Crédito
            </h3>
            <div className="bg-neutral-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold mb-3">Para Empleados:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>✓ Cédula de ciudadanía</li>
                <li>✓ Últimos 3 desprendibles de nómina</li>
                <li>✓ Certificado laboral</li>
                <li>✓ Extractos bancarios (3 meses)</li>
                <li>✓ Declaración de renta (si aplica)</li>
              </ul>
              
              <h4 className="font-bold mb-3">Para Independientes:</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Cédula de ciudadanía</li>
                <li>✓ RUT actualizado</li>
                <li>✓ Declaración de renta (2 años)</li>
                <li>✓ Extractos bancarios (6 meses)</li>
                <li>✓ Estados financieros certificados</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calcula tu Cuota Mensual
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="precioVehiculo" className="text-base font-semibold">Precio del Vehículo ($)</Label>
              <Input
                id="precioVehiculo"
                type="text"
                value={precioVehiculo}
                onChange={(e) => setPrecioVehiculo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="cuotaInicial" className="text-base font-semibold">Cuota Inicial ($)</Label>
              <Input
                id="cuotaInicial"
                type="text"
                value={cuotaInicial}
                onChange={(e) => setCuotaInicial(e.target.value)}
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
            onClick={calcularCredito}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calcular Financiamiento
          </Button>

          {resultado && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Monto a Financiar</p>
                <p className="text-3xl font-bold text-neutral-800">{formatCOP(resultado.montoFinanciar)}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Cuota inicial: {resultado.porcentajeCuotaInicial.toFixed(1)}% del precio
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Tu Cuota Mensual Será</p>
                <p className="text-4xl font-bold text-green-700">{formatCOP(resultado.cuotaMensual)}</p>
                <p className="text-xs text-green-600 mt-1">Durante {plazo} meses</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-xl font-bold text-neutral-800">{formatCOP(resultado.totalPagar)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total de Intereses</p>
                  <p className="text-xl font-bold text-red-600">{formatCOP(resultado.totalIntereses)}</p>
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

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Consejos para Obtener el Mejor Crédito de Vehículo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compara al Menos 3 Opciones</h3>
                <p className="text-sm text-neutral-600">
                  Las tasas pueden variar hasta 10 puntos entre entidades. Usa comparadores online.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Revisa tu DataCrédito</h3>
                <p className="text-sm text-neutral-600">
                  Un DataCrédito limpio puede reducir tu tasa hasta 5 puntos. Revísalo antes de solicitar.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Elige Plazos Cortos</h3>
                <p className="text-sm text-neutral-600">
                  Un crédito a 36 meses cuesta mucho menos que uno a 60 meses en intereses.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Lee el Contrato Completo</h3>
                <p className="text-sm text-neutral-600">
                  Verifica seguros obligatorios, gastos administrativos y condiciones de prepago.
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
