import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalculadoraCreditoAutoChile() {
  const [precioVehiculo, setPrecioVehiculo] = useState("15000000");
  const [pie, setPie] = useState("3000000");
  const [plazo, setPlazo] = useState("48");
  const [tasaAnual, setTasaAnual] = useState("8.5");
  const [resultado, setResultado] = useState<any>(null);

  const calcularCredito = () => {
    const precio = parseFloat(precioVehiculo.replace(/\./g, ""));
    const entrada = parseFloat(pie.replace(/\./g, ""));
    const meses = parseInt(plazo);
    const tasaAnualNum = parseFloat(tasaAnual.replace(",", "."));

    if (isNaN(precio) || isNaN(entrada) || isNaN(meses) || isNaN(tasaAnualNum)) {
      alert("Por favor, complete todos los campos correctamente");
      return;
    }

    const montoFinanciar = precio - entrada;
    const tasaMensual = tasaAnualNum / 100 / 12;
    
    const cuotaMensual = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
    
    const totalPagar = cuotaMensual * meses;
    const totalIntereses = totalPagar - montoFinanciar;
    const cae = tasaAnualNum;

    setResultado({
      montoFinanciar,
      cuotaMensual,
      totalPagar,
      totalIntereses,
      cae,
      porcentajePie: (entrada / precio) * 100
    });
  };

  const formatCLP = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Crédito Automotriz Chile 2025 | CAE y Cuotas</title>
        <meta name="description" content="Calculadora gratuita de crédito automotriz en Chile. Calcula tu cuota mensual, CAE, intereses totales y encuentra las mejores tasas para tu financiamiento de auto." />
        <meta name="keywords" content="calculadora crédito auto Chile, financiamiento automotriz, crédito automotriz Chile, CAE, cuota mensual, simulador crédito auto" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/chile/calculadora-credito-auto" />
        <html lang="es-CL" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculadora de Crédito Automotriz en Chile
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calcula tu cuota mensual, CAE y el costo total de tu financiamiento automotriz de forma gratuita
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            ¿Cómo Funciona el Crédito Automotriz en Chile?
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              El <strong>crédito automotriz</strong> es una de las formas más comunes de financiar la compra de un vehículo en Chile. A través de un <strong>préstamo para auto</strong>, puedes adquirir el vehículo que necesitas pagando cuotas mensuales fijas durante un período que generalmente va de <strong>12 a 60 meses</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              ¿Qué es el CAE y Por Qué es Importante?
            </h3>
            <p className="mb-4">
              La <strong>CAE (Carga Anual Equivalente)</strong> es el indicador más importante al comparar créditos automotrices en Chile. Este porcentaje incluye:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Tasa de interés:</strong> El costo del dinero prestado</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Gastos operacionales:</strong> Comisiones y costos administrativos</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Seguros obligatorios:</strong> Seguro de desgravamen y del vehículo</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Otros gastos:</strong> Tasación, notaría, inscripción</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Consejo Importante
              </p>
              <p className="text-sm text-yellow-900">
                Siempre compara la <strong>CAE</strong>, no solo la tasa de interés. Un crédito con tasa baja pero gastos altos puede resultar más caro que uno con tasa más alta pero menos gastos.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Factores que Afectan tu Tasa de Interés
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Mejoran tu tasa:</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Buen historial crediticio (DICOM limpio)</li>
                  <li>• Pie mayor al 20%</li>
                  <li>• Ingresos estables y comprobables</li>
                  <li>• Plazo más corto (24-36 meses)</li>
                  <li>• Auto nuevo vs usado</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">✗ Aumentan tu tasa:</h4>
                <ul className="text-sm text-red-900 space-y-1">
                  <li>• Morosidades en DICOM</li>
                  <li>• Pie menor al 10%</li>
                  <li>• Ingresos variables o sin comprobar</li>
                  <li>• Plazo muy largo (60+ meses)</li>
                  <li>• Auto usado o muy antiguo</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              ¿Cuánto Pie Debo Dar?
            </h3>
            <p className="mb-4">
              El <strong>pie</strong> (pago inicial) es fundamental para obtener mejores condiciones:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Mínimo recomendado:</strong> 20% del valor del auto</li>
              <li><strong>Ideal:</strong> 30% o más para tasas más bajas</li>
              <li><strong>Beneficios:</strong> Menor cuota, menos intereses, mejor aprobación</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📊 Ejemplo Real
              </p>
              <p className="text-sm text-blue-900">
                Auto de <strong>$15.000.000</strong> a <strong>48 meses</strong> con tasa del <strong>8,5% anual</strong>:<br />
                • Con pie del 10% ($1.500.000): Cuota de <strong>$332.000</strong><br />
                • Con pie del 20% ($3.000.000): Cuota de <strong>$295.000</strong><br />
                <strong className="text-blue-700">¡Ahorras $37.000 al mes!</strong>
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Tasas Promedio de Crédito Automotriz en Chile (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Tipo de Vehículo</th>
                    <th className="px-4 py-2 text-left border">Plazo</th>
                    <th className="px-4 py-2 text-right border">CAE Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">Nuevo</td>
                    <td className="px-4 py-2 border">24-36 meses</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">7,5% - 9,5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Nuevo</td>
                    <td className="px-4 py-2 border">48-60 meses</td>
                    <td className="px-4 py-2 text-right border">8,5% - 11,0%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Usado reciente</td>
                    <td className="px-4 py-2 border">24-48 meses</td>
                    <td className="px-4 py-2 text-right border">10,0% - 13,0%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Usado antiguo</td>
                    <td className="px-4 py-2 border">12-36 meses</td>
                    <td className="px-4 py-2 text-right border text-red-700">12,0% - 16,0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Principales Instituciones de Financiamiento en Chile
            </h3>
            <p className="mb-4">
              Puedes obtener crédito automotriz en:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Bancos:</strong> Banco de Chile, BCI, Santander, Banco Estado, Scotiabank</li>
              <li><strong>Automotoras:</strong> Financiamiento directo en concesionarias</li>
              <li><strong>Cooperativas:</strong> Coopeuch, Capual, Detacoop</li>
              <li><strong>Financieras:</strong> Tanner, Econofin, Credicar</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Documentos Necesarios para Solicitar tu Crédito
            </h3>
            <div className="bg-neutral-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold mb-3">Para Trabajadores Dependientes:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>✓ Cédula de identidad</li>
                <li>✓ Últimas 3 liquidaciones de sueldo</li>
                <li>✓ Certificado de antigüedad laboral</li>
                <li>✓ Cartola bancaria (3 meses)</li>
                <li>✓ Informe DICOM</li>
              </ul>
              
              <h4 className="font-bold mb-3">Para Trabajadores Independientes:</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Cédula de identidad</li>
                <li>✓ Declaración de renta (2 años)</li>
                <li>✓ Inicio de actividades (SII)</li>
                <li>✓ Cartolas bancarias (6 meses)</li>
                <li>✓ Boletas de honorarios</li>
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
              <Label htmlFor="pie" className="text-base font-semibold">Pie ($)</Label>
              <Input
                id="pie"
                type="text"
                value={pie}
                onChange={(e) => setPie(e.target.value)}
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
                <p className="text-3xl font-bold text-neutral-800">{formatCLP(resultado.montoFinanciar)}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Pie: {resultado.porcentajePie.toFixed(1)}% del precio
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Tu Cuota Mensual Será</p>
                <p className="text-4xl font-bold text-green-700">{formatCLP(resultado.cuotaMensual)}</p>
                <p className="text-xs text-green-600 mt-1">Durante {plazo} meses</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-xl font-bold text-neutral-800">{formatCLP(resultado.totalPagar)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total de Intereses</p>
                  <p className="text-xl font-bold text-red-600">{formatCLP(resultado.totalIntereses)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">CAE Aproximada</p>
                  <p className="text-xl font-bold text-blue-600">{resultado.cae.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Nota:</strong> Este cálculo es aproximado. La CAE real puede variar según gastos operacionales, seguros y otros costos de cada institución.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Consejos para Obtener el Mejor Crédito Automotriz
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compara al Menos 3 Opciones</h3>
                <p className="text-sm text-neutral-600">
                  Las tasas pueden variar hasta 5 puntos entre instituciones. Usa comparadores online.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Revisa tu DICOM</h3>
                <p className="text-sm text-neutral-600">
                  Un DICOM limpio puede reducir tu tasa hasta 3 puntos. Revísalo antes de solicitar.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Negocia el Pie</h3>
                <p className="text-sm text-neutral-600">
                  Mientras mayor sea tu pie, mejores condiciones obtendrás. Intenta llegar al 20%.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Lee el Contrato Completo</h3>
                <p className="text-sm text-neutral-600">
                  Verifica seguros obligatorios, gastos operacionales y condiciones de prepago.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            Esta calculadora es una herramienta informativa. Los resultados son aproximados y pueden variar según las condiciones de cada institución financiera.
          </p>
        </div>
      </div>
    </>
  );
}
