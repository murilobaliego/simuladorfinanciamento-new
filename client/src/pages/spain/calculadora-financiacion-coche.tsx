import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CalculadoraFinanciacionCocheSpain() {
  const [precioVehiculo, setPrecioVehiculo] = useState("25000");
  const [entrada, setEntrada] = useState("5000");
  const [plazo, setPlazo] = useState("60");
  const [tasaAnual, setTasaAnual] = useState("7.5");
  const [resultado, setResultado] = useState<any>(null);

  const calcularFinanciacion = () => {
    const precio = parseFloat(precioVehiculo.replace(/,/g, ""));
    const inicial = parseFloat(entrada.replace(/,/g, ""));
    const meses = parseInt(plazo);
    const tasaAnualNum = parseFloat(tasaAnual.replace(",", "."));

    if (isNaN(precio) || isNaN(inicial) || isNaN(meses) || isNaN(tasaAnualNum)) {
      alert("Por favor, rellena todos los campos correctamente");
      return;
    }

    const montoFinanciar = precio - inicial;
    const tasaMensual = tasaAnualNum / 100 / 12;
    
    const cuotaMensual = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
    
    const totalPagar = cuotaMensual * meses;
    const totalIntereses = totalPagar - montoFinanciar;
    const tae = tasaAnualNum;

    setResultado({
      montoFinanciar,
      cuotaMensual,
      totalPagar,
      totalIntereses,
      tae,
      porcentajeEntrada: (inicial / precio) * 100
    });
  };

  const formatEUR = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(valor);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Financiación de Coches España 2025 | TAE y Cuotas</title>
        <meta name="description" content="Calculadora gratuita de financiación de coches en España. Calcula tu cuota mensual, TAE, intereses totales y encuentra los mejores tipos para tu préstamo de coche." />
        <meta name="keywords" content="calculadora financiación coche España, préstamo coche, crédito coche, TAE, cuota mensual, financiación automóvil" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/spain/calculadora-financiacion-coche" />
        <html lang="es-ES" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculadora de Financiación de Coches en España
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calcula tu cuota mensual, TAE y el coste total de tu financiación de coche de forma gratuita
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            ¿Cómo Funciona la Financiación de Coches en España?
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              La <strong>financiación de coches</strong> (o préstamo para automóvil) es una de las formas más comunes de adquirir un vehículo en España. A través de un <strong>crédito para coche</strong>, puedes comprar el vehículo que necesitas pagando cuotas mensuales durante un período que generalmente va de <strong>12 a 84 meses</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              ¿Qué es la TAE y Por Qué es Importante?
            </h3>
            <p className="mb-4">
              La <strong>TAE (Tasa Anual Equivalente)</strong> es el indicador más importante al comparar préstamos para coches en España. Este porcentaje incluye:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Tipo de interés nominal:</strong> El coste del dinero prestado</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Comisiones:</strong> Apertura, estudio, gestión</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Seguros vinculados:</strong> Si son obligatorios</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Otros gastos:</strong> Tasación, notaría si aplica</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Consejo Importante
              </p>
              <p className="text-sm text-yellow-900">
                Compara siempre la <strong>TAE</strong>, no solo el tipo de interés. Un préstamo con tipo bajo pero comisiones altas puede resultar más caro que uno con tipo más alto sin comisiones.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Factores que Afectan tu Tipo de Interés
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Mejoran tu tipo:</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Buen historial crediticio (ASNEF limpio)</li>
                  <li>• Entrada mayor al 20%</li>
                  <li>• Ingresos estables y demostrables</li>
                  <li>• Plazo más corto (24-48 meses)</li>
                  <li>• Coche nuevo vs usado</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">✗ Aumentan tu tipo:</h4>
                <ul className="text-sm text-red-900 space-y-1">
                  <li>• Inclusión en ASNEF o RAI</li>
                  <li>• Entrada baja o sin entrada</li>
                  <li>• Ingresos irregulares</li>
                  <li>• Plazo muy largo (72+ meses)</li>
                  <li>• Coche usado o muy antiguo</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              ¿Cuánta Entrada Debo Dar?
            </h3>
            <p className="mb-4">
              La <strong>entrada</strong> es fundamental para obtener mejores condiciones:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Mínimo recomendado:</strong> 20% del valor del coche</li>
              <li><strong>Ideal:</strong> 30% o más para los mejores tipos</li>
              <li><strong>Ventajas:</strong> Menor cuota, menos intereses, mejor aprobación</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📊 Ejemplo Real
              </p>
              <p className="text-sm text-blue-900">
                Coche de <strong>25.000 €</strong> a <strong>60 meses</strong> con TAE del <strong>7,5%</strong>:<br />
                • Con entrada del 10% (2.500 €): Cuota de <strong>450 €</strong><br />
                • Con entrada del 20% (5.000 €): Cuota de <strong>400 €</strong><br />
                <strong className="text-blue-700">¡Ahorras 50 € al mes!</strong>
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Tipos Medios de Financiación de Coches en España (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Tipo de Vehículo</th>
                    <th className="px-4 py-2 text-left border">Plazo</th>
                    <th className="px-4 py-2 text-right border">TAE Media</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">Nuevo</td>
                    <td className="px-4 py-2 border">24-48 meses</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">6,0% - 8,5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Nuevo</td>
                    <td className="px-4 py-2 border">60-84 meses</td>
                    <td className="px-4 py-2 text-right border">7,5% - 10,0%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Seminuevo</td>
                    <td className="px-4 py-2 border">24-60 meses</td>
                    <td className="px-4 py-2 text-right border">8,0% - 11,0%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Usado antiguo</td>
                    <td className="px-4 py-2 border">12-48 meses</td>
                    <td className="px-4 py-2 text-right border text-red-700">10,0% - 14,0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Principales Entidades de Financiación en España
            </h3>
            <p className="mb-4">
              Puedes obtener financiación para coches en:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Bancos:</strong> Santander, BBVA, CaixaBank, Sabadell, Bankinter</li>
              <li><strong>Financieras de marca:</strong> Santander Consumer, PSA Finance, Volkswagen Financial Services</li>
              <li><strong>Financieras independientes:</strong> Cofidis, Cetelem, Pepper Money</li>
              <li><strong>Concesionarios:</strong> Financiación directa con condiciones especiales</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Documentos Necesarios para Solicitar tu Préstamo
            </h3>
            <div className="bg-neutral-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold mb-3">Para Asalariados:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>✓ DNI o NIE</li>
                <li>✓ Últimas 3 nóminas</li>
                <li>✓ Contrato de trabajo</li>
                <li>✓ Declaración de la renta</li>
                <li>✓ Extractos bancarios (3 meses)</li>
              </ul>
              
              <h4 className="font-bold mb-3">Para Autónomos:</h4>
              <ul className="text-sm space-y-1">
                <li>✓ DNI o NIE</li>
                <li>✓ Últimas declaraciones trimestrales (IVA)</li>
                <li>✓ Declaración de la renta (2 años)</li>
                <li>✓ Extractos bancarios (6 meses)</li>
                <li>✓ Certificado de estar al corriente con Hacienda</li>
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
              <Label htmlFor="precioVehiculo" className="text-base font-semibold">Precio del Coche (€)</Label>
              <Input
                id="precioVehiculo"
                type="text"
                value={precioVehiculo}
                onChange={(e) => setPrecioVehiculo(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="entrada" className="text-base font-semibold">Entrada (€)</Label>
              <Input
                id="entrada"
                type="text"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
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
              <Label htmlFor="tasaAnual" className="text-base font-semibold">Tipo de Interés Anual (%)</Label>
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
            onClick={calcularFinanciacion}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calcular Financiación
          </Button>

          {resultado && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Importe a Financiar</p>
                <p className="text-3xl font-bold text-neutral-800">{formatEUR(resultado.montoFinanciar)}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Entrada: {resultado.porcentajeEntrada.toFixed(1)}% del precio
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Tu Cuota Mensual Será</p>
                <p className="text-4xl font-bold text-green-700">{formatEUR(resultado.cuotaMensual)}</p>
                <p className="text-xs text-green-600 mt-1">Durante {plazo} meses</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total a Pagar</p>
                  <p className="text-xl font-bold text-neutral-800">{formatEUR(resultado.totalPagar)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total de Intereses</p>
                  <p className="text-xl font-bold text-red-600">{formatEUR(resultado.totalIntereses)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">TAE Aproximada</p>
                  <p className="text-xl font-bold text-blue-600">{resultado.tae.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Nota:</strong> Este cálculo es aproximado. La TAE real puede variar según comisiones, seguros y otros gastos de cada entidad.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Consejos para Obtener la Mejor Financiación
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compara al Menos 3 Ofertas</h3>
                <p className="text-sm text-neutral-600">
                  Los tipos pueden variar hasta 5 puntos entre entidades. Usa comparadores online.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Revisa tu ASNEF</h3>
                <p className="text-sm text-neutral-600">
                  Un historial limpio puede reducir tu tipo hasta 3 puntos. Revísalo antes de solicitar.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Elige Plazos Cortos</h3>
                <p className="text-sm text-neutral-600">
                  Un préstamo a 48 meses cuesta mucho menos que uno a 84 meses en intereses.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Lee el Contrato Completo</h3>
                <p className="text-sm text-neutral-600">
                  Verifica comisiones, seguros vinculados y condiciones de amortización anticipada.
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
