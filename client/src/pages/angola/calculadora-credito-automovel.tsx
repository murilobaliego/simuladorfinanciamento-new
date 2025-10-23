import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingDown, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function CalculadoraCreditoAutomovelAngola() {
  const [vehicleValue, setVehicleValue] = useState("15000000");
  const [downPayment, setDownPayment] = useState("4500000");
  const [term, setTerm] = useState("60");
  const [annualRate, setAnnualRate] = useState("16");
  const [system, setSystem] = useState<"price" | "sac">("price");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
    amortization: AmortizationRow[];
  } | null>(null);

  const calculateLoan = () => {
    const vehicle = parseFloat(vehicleValue);
    const down = parseFloat(downPayment);
    const months = parseInt(term);
    const rate = parseFloat(annualRate) / 100 / 12;
    const principal = vehicle - down;

    if (principal <= 0 || months <= 0 || rate < 0) return;

    const amortization: AmortizationRow[] = [];
    let balance = principal;
    let totalPaid = 0;

    if (system === "price") {
      const payment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      
      for (let i = 1; i <= months; i++) {
        const interestPayment = balance * rate;
        const principalPayment = payment - interestPayment;
        balance -= principalPayment;
        totalPaid += payment;

        amortization.push({
          month: i,
          payment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance)
        });
      }

      setResult({
        monthlyPayment: payment,
        totalAmount: totalPaid,
        totalInterest: totalPaid - principal,
        amortization
      });
    } else {
      const principalPayment = principal / months;
      
      for (let i = 1; i <= months; i++) {
        const interestPayment = balance * rate;
        const payment = principalPayment + interestPayment;
        balance -= principalPayment;
        totalPaid += payment;

        amortization.push({
          month: i,
          payment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance)
        });
      }

      setResult({
        monthlyPayment: amortization[0].payment,
        totalAmount: totalPaid,
        totalInterest: totalPaid - principal,
        amortization
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Calculadora de Crédito Automóvel - Angola
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Simule o seu financiamento de viatura em Kwanzas (AOA)
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Dados do Financiamento
              </CardTitle>
              <CardDescription>Preencha os dados para simular o seu crédito automóvel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vehicleValue">Valor da Viatura (AOA)</Label>
                <Input
                  id="vehicleValue"
                  type="number"
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(e.target.value)}
                  placeholder="15000000"
                />
              </div>

              <div>
                <Label htmlFor="downPayment">Entrada Inicial (AOA)</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="4500000"
                />
              </div>

              <div>
                <Label htmlFor="term">Prazo (meses)</Label>
                <Input
                  id="term"
                  type="number"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="60"
                />
              </div>

              <div>
                <Label htmlFor="annualRate">Taxa de Juro Anual (%)</Label>
                <Input
                  id="annualRate"
                  type="number"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  placeholder="16"
                />
              </div>

              <div>
                <Label htmlFor="system">Sistema de Amortização</Label>
                <Select value={system} onValueChange={(value: "price" | "sac") => setSystem(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Tabela Price (Prestações Fixas)</SelectItem>
                    <SelectItem value="sac">SAC (Amortização Constante)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculateLoan} className="w-full" size="lg">
                <Calculator className="mr-2 h-4 w-4" />
                Calcular Financiamento
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Resultados da Simulação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Prestação Mensal {system === "sac" && "(Primeira)"}</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(result.monthlyPayment)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Valor Total a Pagar</p>
                    <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.totalAmount)}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total de Juros</p>
                    <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.totalInterest)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Valor Financiado</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(parseFloat(vehicleValue) - parseFloat(downPayment))}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {result && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tabela de Amortização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Prestação</TableHead>
                      <TableHead>Amortização</TableHead>
                      <TableHead>Juros</TableHead>
                      <TableHead>Saldo Devedor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.amortization.slice(0, 12).map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{formatCurrency(row.payment)}</TableCell>
                        <TableCell>{formatCurrency(row.principal)}</TableCell>
                        <TableCell>{formatCurrency(row.interest)}</TableCell>
                        <TableCell>{formatCurrency(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {result.amortization.length > 12 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Mostrando os primeiros 12 meses de {result.amortization.length} meses
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Taxas de Juro Médias em Angola</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Crédito</TableHead>
                    <TableHead>Taxa Anual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Crédito Automóvel (Novo)</TableCell>
                    <TableCell>14% - 20%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Crédito Automóvel (Usado)</TableCell>
                    <TableCell>16% - 24%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Crédito Pessoal</TableCell>
                    <TableCell>18% - 28%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Principais Instituições Financeiras</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>BAI - Banco Angolano de Investimentos</strong> - Líder em crédito automóvel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>BFA - Banco de Fomento Angola</strong> - Taxas competitivas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>BPC - Banco de Poupança e Crédito</strong> - Financiamento até 70%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>Standard Bank Angola</strong> - Prazos até 72 meses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>Banco Económico</strong> - Aprovação rápida</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>Banco Millennium Atlântico</strong> - Condições flexíveis</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="info" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="docs">Documentos</TabsTrigger>
            <TabsTrigger value="tips">Dicas</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Como Funciona o Crédito Automóvel em Angola</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Entrada Inicial</h3>
                  <p className="text-sm text-gray-600">
                    A maioria dos bancos em Angola exige uma entrada inicial de 30% a 40% do valor da viatura. 
                    Esta percentagem é mais elevada que noutros mercados devido às políticas de gestão de risco dos bancos angolanos.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Prazo de Financiamento</h3>
                  <p className="text-sm text-gray-600">
                    O prazo típico varia entre 12 e 72 meses (6 anos). Alguns bancos oferecem prazos mais longos para 
                    viaturas novas de marcas premium. Prazos mais curtos resultam em prestações maiores mas menor custo total.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Taxa de Juro</h3>
                  <p className="text-sm text-gray-600">
                    As taxas de juro em Angola são influenciadas pela Taxa BNA (taxa de referência do Banco Nacional de Angola), 
                    inflação, e perfil do cliente. Viaturas novas têm taxas mais baixas que usadas. Clientes com salário domiciliado 
                    no banco podem obter melhores condições.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Seguro Obrigatório</h3>
                  <p className="text-sm text-gray-600">
                    É obrigatório contratar seguro automóvel que cubra responsabilidade civil. Os bancos também exigem 
                    seguro de vida e seguro contra todos os riscos durante o período do financiamento, com o banco como 
                    beneficiário preferencial.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Moeda do Financiamento</h3>
                  <p className="text-sm text-gray-600">
                    Os financiamentos são concedidos em Kwanzas (AOA). Alguns bancos oferecem crédito indexado ao dólar 
                    americano para viaturas importadas, mas com requisitos mais rigorosos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>Documentos Necessários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Para Trabalhadores por Conta de Outrem</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Bilhete de Identidade (BI) válido</li>
                      <li>NIF (Número de Identificação Fiscal)</li>
                      <li>Comprovativo de residência (conta de água, luz ou telefone)</li>
                      <li>Últimos 3 recibos de vencimento</li>
                      <li>Declaração da entidade patronal com antiguidade</li>
                      <li>Extractos bancários dos últimos 3 a 6 meses</li>
                      <li>Proforma ou factura pro-forma da viatura</li>
                      <li>Certidão de não dívida à Segurança Social</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Para Trabalhadores Independentes e Empresários</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Bilhete de Identidade (BI) válido</li>
                      <li>NIF e Certidão Comercial da empresa</li>
                      <li>Comprovativo de residência</li>
                      <li>Declaração de rendimentos dos últimos 2 anos</li>
                      <li>Extractos bancários dos últimos 6 a 12 meses</li>
                      <li>Balanço e demonstração de resultados auditados</li>
                      <li>Proforma ou factura pro-forma da viatura</li>
                      <li>Certidão de não dívida fiscal (AGT)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Documentos da Viatura</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Factura pro-forma do stand ou vendedor</li>
                      <li>Livrete (se viatura usada)</li>
                      <li>Certificado de matrícula (se viatura usada)</li>
                      <li>Avaliação da viatura por perito credenciado</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips">
            <Card>
              <CardHeader>
                <CardTitle>Dicas para Obter o Melhor Financiamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Compare várias instituições:</strong> As taxas variam significativamente entre bancos. 
                      Solicite propostas de pelo menos 3 bancos diferentes e negocie as condições.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Domicilie o salário:</strong> Bancos oferecem taxas até 2-3% mais baixas para clientes 
                      que domiciliam o salário. Esta pode ser a melhor forma de reduzir o custo total.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Aumente a entrada inicial:</strong> Uma entrada de 40% ou mais pode resultar em aprovação 
                      mais rápida e taxas mais favoráveis.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Prefira viaturas novas:</strong> Financiamentos para viaturas novas têm taxas 2-4% mais 
                      baixas que viaturas usadas e prazos mais longos.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Mantenha bom histórico bancário:</strong> Evite descobertos e atrasos em pagamentos. 
                      Um bom relacionamento com o banco facilita a aprovação.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Considere todos os custos:</strong> Além da prestação, considere seguro (pode custar 
                      5-8% do valor da viatura anualmente), manutenção, combustível e impostos no orçamento.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Verifique penalizações:</strong> Confirme as condições de liquidação antecipada e 
                      penalizações por atraso no pagamento antes de assinar o contrato.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Aviso Legal:</strong> Esta calculadora é apenas uma ferramenta de simulação para fins informativos. 
            Os valores apresentados são aproximações e podem diferir das condições oferecidas pelas instituições financeiras. 
            Consulte sempre um banco para obter uma proposta oficial e personalizada.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Sobre o Mercado Automóvel em Angola</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <p>
              O mercado de crédito automóvel em Angola tem crescido gradualmente, com mais angolanos a aceder a 
              financiamento para aquisição de viaturas. As principais instituições financeiras oferecem produtos 
              competitivos, embora com requisitos mais rigorosos comparados a outros mercados africanos.
            </p>
            <p>
              As taxas de juro são influenciadas pela Taxa BNA (taxa de referência do Banco Nacional de Angola) e 
              pela inflação. Actualmente, as taxas para crédito automóvel variam entre 14% e 24% ao ano, dependendo 
              do perfil do cliente, tipo de viatura, e relacionamento com o banco.
            </p>
            <p>
              A entrada inicial exigida é geralmente mais elevada (30-40%) devido às políticas de gestão de risco 
              dos bancos. Clientes com salário domiciliado, bom histórico bancário, e que trabalham em empresas 
              reconhecidas têm acesso a melhores condições.
            </p>
            <p>
              É importante notar que, além da prestação mensal, existem custos significativos como seguros obrigatórios 
              (responsabilidade civil, vida, e todos os riscos), manutenção, combustível, e impostos. Recomenda-se que 
              a prestação do financiamento não ultrapasse 30-35% do rendimento líquido mensal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
