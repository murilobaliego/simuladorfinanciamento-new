import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function CarFinanceCalculatorUK() {
  const [carPrice, setCarPrice] = useState("20000");
  const [deposit, setDeposit] = useState("4000");
  const [term, setTerm] = useState("48");
  const [apr, setApr] = useState("7.9");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
    amortization: AmortizationRow[];
  } | null>(null);

  const calculateFinance = () => {
    const price = parseFloat(carPrice);
    const depositAmount = parseFloat(deposit);
    const months = parseInt(term);
    const annualRate = parseFloat(apr) / 100;
    const monthlyRate = annualRate / 12;
    const amountToFinance = price - depositAmount;

    if (amountToFinance <= 0 || months <= 0 || monthlyRate < 0) return;

    const payment = amountToFinance * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = payment * months;
    const totalInterest = totalAmount - amountToFinance;

    const amortization: AmortizationRow[] = [];
    let balance = amountToFinance;

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = payment - interest;
      balance -= principal;

      amortization.push({
        month: i,
        payment,
        principal,
        interest,
        balance: Math.max(0, balance)
      });
    }

    setResult({
      monthlyPayment: payment,
      totalAmount,
      totalInterest,
      amortization
    });
  };

  const formatGBP = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Finance Calculator UK 2025 | Calculate Monthly Payments & APR</title>
        <meta name="description" content="Free car finance calculator for UK. Calculate your monthly payment, APR, total interest and compare rates. Find the best car finance deals from UK lenders." />
        <meta name="keywords" content="car finance calculator uk, car loan calculator, hp calculator, pcp calculator, apr calculator, monthly payment calculator, car finance uk, auto finance" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/uk/car-finance-calculator" />
        <html lang="en-GB" />
        <meta property="og:title" content="Car Finance Calculator UK | Calculate Your Monthly Payments" />
        <meta property="og:description" content="Free tool to calculate car finance payments in the UK. Get instant results for monthly payments, APR and total costs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/uk/car-finance-calculator" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "Car Finance Calculator UK",
          "description": "Free calculator for car finance in the United Kingdom",
          "provider": {
            "@type": "Organization",
            "name": "Car Finance Calculator"
          },
          "featureList": ["Monthly payment calculation", "APR", "Amortization schedule", "Total costs"],
          "areaServed": "GB"
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Car Finance Calculator",
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "GBP"
          },
          "operatingSystem": "Web"
        })}
      </script>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Car Finance Calculator – Calculate Your Monthly Payments in the UK
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Looking to buy a new or used car and need finance? With our car finance calculator, you can easily calculate your monthly payment, APR, and total cost of credit according to UK market conditions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How the Car Finance Calculator Works
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              The calculation follows the <strong>hire purchase (HP) model</strong>, which is one of the most common methods used by lenders in the UK. The simulation considers:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Car price and deposit</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Annual Percentage Rate (APR)</strong> – average in UK is around 7.9%</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Finance term</strong> – from 12 to 60 months</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Total interest paid</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Total amount payable</strong></span>
              </li>
            </ul>

            <p className="mb-6">
              Upon completion, you'll see the complete repayment schedule with the evolution of the outstanding balance and the total cost of credit.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                <Info className="inline h-5 w-5 mr-1" />
                Financial Education and Transparency
              </p>
              <p className="text-sm text-blue-900">
                This calculator was developed to promote transparency and financial literacy. Understanding the real costs of car finance allows you to make more informed decisions and avoid over-indebtedness. We always recommend comparing multiple offers and carefully reading the contract terms before signing any financial commitment.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calculate Your Car Finance
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="carPrice" className="text-base font-semibold">Car Price (£)</Label>
              <Input
                id="carPrice"
                type="number"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                className="mt-2 text-lg"
                placeholder="20000"
              />
            </div>

            <div>
              <Label htmlFor="deposit" className="text-base font-semibold">Deposit (£)</Label>
              <Input
                id="deposit"
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="mt-2 text-lg"
                placeholder="4000"
              />
            </div>

            <div>
              <Label htmlFor="term" className="text-base font-semibold">Term (months)</Label>
              <Input
                id="term"
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="mt-2 text-lg"
                placeholder="48"
              />
            </div>

            <div>
              <Label htmlFor="apr" className="text-base font-semibold">APR (%)</Label>
              <Input
                id="apr"
                type="number"
                step="0.1"
                value={apr}
                onChange={(e) => setApr(e.target.value)}
                className="mt-2 text-lg"
                placeholder="7.9"
              />
            </div>
          </div>

          <Button
            onClick={calculateFinance}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculate Payment
          </Button>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Amount to Finance</p>
                <p className="text-3xl font-bold text-neutral-800">
                  {formatGBP(parseFloat(carPrice) - parseFloat(deposit))}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Your Monthly Payment</p>
                <p className="text-4xl font-bold text-green-700">{formatGBP(result.monthlyPayment)}</p>
                <p className="text-xs text-green-600 mt-1">For {term} months</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Amount Payable</p>
                  <p className="text-xl font-bold text-neutral-800">{formatGBP(result.totalAmount)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatGBP(result.totalInterest)}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> This calculation is indicative. Actual values may vary according to the specific conditions of each lender.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {result && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Repayment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.amortization.slice(0, 12).map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{formatGBP(row.payment)}</TableCell>
                        <TableCell>{formatGBP(row.principal)}</TableCell>
                        <TableCell>{formatGBP(row.interest)}</TableCell>
                        <TableCell>{formatGBP(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {result.amortization.length > 12 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Showing first 12 months of {result.amortization.length} months
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Benefits of Using the Car Finance Calculator
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare Different APRs and Terms</h3>
                <p className="text-sm text-neutral-600">
                  Before applying for finance, try various combinations to find the best deal.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Understand the Impact of Your Deposit</h3>
                <p className="text-sm text-neutral-600">
                  See how a larger deposit significantly reduces your monthly payment.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Calculate Total Finance Costs</h3>
                <p className="text-sm text-neutral-600">
                  Based on real UK market data with average APR of 7.9%.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Everything Online, No Commitment</h3>
                <p className="text-sm text-neutral-600">
                  Run unlimited simulations without sharing personal data or contacts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Car Finance in the UK – What You Should Know
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              In the UK, more than 90% of new cars are bought on finance. The most common types are <strong>Hire Purchase (HP)</strong>, <strong>Personal Contract Purchase (PCP)</strong>, and <strong>Personal Loans</strong>.
            </p>

            <p className="mb-4">
              The <strong>average APR</strong> ranges between <strong>6% and 10%</strong>, varying according to credit score, vehicle type, and term. The average financed amount is around <strong>£15,000 to £25,000</strong>, with terms between <strong>36 and 60 months</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Before signing a contract, always check:
            </h3>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>The <strong>APR</strong> (Annual Percentage Rate)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>The <strong>total amount payable</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>All <strong>fees and charges</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>The conditions for <strong>early settlement</strong></span>
              </li>
            </ul>

            <div className="bg-neutral-50 p-6 rounded-lg my-6">
              <h4 className="font-bold text-neutral-800 mb-3">💡 Top Tip</h4>
              <p className="text-sm text-neutral-700">
                Experiment with the calculator by changing the deposit or term and see how it affects your monthly payment. A deposit of 20% to 30% of the car value can significantly reduce the total interest paid.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Use the Calculator and Discover How Much You'll Pay for Your Car
          </h2>
          
          <p className="text-neutral-700 mb-4">
            Our calculator was created to help UK consumers make more informed decisions. You don't need to be a finance expert – just fill in the fields and let the calculator do the maths for you.
          </p>

          <p className="text-neutral-700">
            This tool is completely free, requires no registration, and respects your privacy. Use it as many times as you need to find the best finance solution for your next vehicle.
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            This calculator is an informational tool. Results are approximate and may vary according to the specific conditions of each lender. Always consult a professional before making financial decisions.
          </p>
        </div>
      </div>
    </>
  );
}
