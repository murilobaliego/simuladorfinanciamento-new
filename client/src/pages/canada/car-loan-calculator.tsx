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

export default function CarLoanCalculatorCanada() {
  const [vehiclePrice, setVehiclePrice] = useState("35000");
  const [downPayment, setDownPayment] = useState("7000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [interestRate, setInterestRate] = useState("6.5");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
    amortization: AmortizationRow[];
  } | null>(null);

  const calculateLoan = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment);
    const months = parseInt(loanTerm);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const loanAmount = price - down;

    if (loanAmount <= 0 || months <= 0 || monthlyRate < 0) return;

    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = payment * months;
    const totalInterest = totalAmount - loanAmount;

    const amortization: AmortizationRow[] = [];
    let balance = loanAmount;

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

  const formatCAD = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Loan Calculator Canada 2025 | Auto Financing & APR Calculator</title>
        <meta name="description" content="Free car loan calculator for Canada. Calculate your monthly payment, APR, total interest and find the best rates for your auto financing. Compare rates from major Canadian lenders." />
        <meta name="keywords" content="car loan calculator canada, auto loan calculator, car financing calculator, APR calculator canada, monthly payment calculator, vehicle loan canada, auto financing" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/canada/car-loan-calculator" />
        <html lang="en-CA" />
        <meta property="og:title" content="Car Loan Calculator Canada | Calculate Your Auto Financing" />
        <meta property="og:description" content="Free tool to calculate car loan payments in Canada. Get instant results for monthly payments, APR and total costs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/canada/car-loan-calculator" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": "Car Loan Calculator Canada",
          "description": "Free calculator for auto financing in Canada",
          "provider": {
            "@type": "Organization",
            "name": "Car Loan Calculator"
          },
          "featureList": ["Monthly payment calculation", "APR", "Amortization schedule", "Total costs"],
          "areaServed": "CA"
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Auto Financing Calculator",
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "CAD"
          },
          "operatingSystem": "Web"
        })}
      </script>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Car Loan Calculator – Calculate Your Auto Financing in Canada
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Looking to buy a new or used car and need financing? With our car loan calculator, you can easily calculate your monthly payment, interest rate, and total cost of credit according to Canadian market conditions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How the Car Loan Calculator Works
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              The calculation follows the <strong>amortization model</strong>, which is the most common method used by banks and financial institutions in Canada. The simulation considers:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Vehicle price and down payment</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Annual interest rate (APR)</strong> – average in Canada is around 6.5%</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Loan term</strong> – from 12 to 84 months</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Total interest paid</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Total amount financed</strong></span>
              </li>
            </ul>

            <p className="mb-6">
              Upon completion, you'll see the complete amortization schedule with the evolution of the outstanding balance and the total cost of credit.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                <Info className="inline h-5 w-5 mr-1" />
                Financial Education and Transparency
              </p>
              <p className="text-sm text-blue-900">
                This calculator was developed to promote transparency and financial literacy. Understanding the real costs of a car loan allows you to make more informed decisions and avoid over-indebtedness. We always recommend comparing multiple offers and carefully reading the contract terms before signing any financial commitment.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calculate Your Car Loan
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="vehiclePrice" className="text-base font-semibold">Vehicle Price (CAD $)</Label>
              <Input
                id="vehiclePrice"
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                className="mt-2 text-lg"
                placeholder="35000"
              />
            </div>

            <div>
              <Label htmlFor="downPayment" className="text-base font-semibold">Down Payment (CAD $)</Label>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="mt-2 text-lg"
                placeholder="7000"
              />
            </div>

            <div>
              <Label htmlFor="loanTerm" className="text-base font-semibold">Loan Term (months)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="mt-2 text-lg"
                placeholder="60"
              />
            </div>

            <div>
              <Label htmlFor="interestRate" className="text-base font-semibold">Interest Rate (APR %)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="mt-2 text-lg"
                placeholder="6.5"
              />
            </div>
          </div>

          <Button
            onClick={calculateLoan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculate Payment
          </Button>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Loan Amount</p>
                <p className="text-3xl font-bold text-neutral-800">
                  {formatCAD(parseFloat(vehiclePrice) - parseFloat(downPayment))}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Your Monthly Payment</p>
                <p className="text-4xl font-bold text-green-700">{formatCAD(result.monthlyPayment)}</p>
                <p className="text-xs text-green-600 mt-1">For {loanTerm} months</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-neutral-800">{formatCAD(result.totalAmount)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatCAD(result.totalInterest)}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> This calculation is indicative. Actual values may vary according to the specific conditions of each financial institution.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {result && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Amortization Schedule</CardTitle>
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
                        <TableCell>{formatCAD(row.payment)}</TableCell>
                        <TableCell>{formatCAD(row.principal)}</TableCell>
                        <TableCell>{formatCAD(row.interest)}</TableCell>
                        <TableCell>{formatCAD(row.balance)}</TableCell>
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
            Benefits of Using the Car Loan Calculator
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare Different Rates and Terms</h3>
                <p className="text-sm text-neutral-600">
                  Before applying for credit, try various combinations to find the best solution.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Understand the Impact of Down Payment</h3>
                <p className="text-sm text-neutral-600">
                  See how a larger down payment significantly reduces your monthly payment.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Calculate Total Financing Costs</h3>
                <p className="text-sm text-neutral-600">
                  Based on real Canadian market data with average APR of 6.5%.
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
            Car Financing in Canada – What You Should Know
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              In Canada, more than half of car buyers use <strong>auto financing</strong>. Contracts can be made directly with banks, credit unions, or through car dealerships (leasing, direct consumer credit).
            </p>

            <p className="mb-4">
              The <strong>average APR</strong> ranges between <strong>5% and 8%</strong>, varying according to customer profile, vehicle type, and term. The average financed amount is around <strong>$25,000 to $35,000</strong>, with terms between <strong>48 and 72 months</strong>.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Before signing a contract, always verify:
            </h3>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>The <strong>APR</strong> (Annual Percentage Rate)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>The <strong>total cost</strong> of financing</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>All <strong>fees and insurance</strong> associated</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">✓</span>
                <span>The conditions for <strong>early repayment</strong></span>
              </li>
            </ul>

            <div className="bg-neutral-50 p-6 rounded-lg my-6">
              <h4 className="font-bold text-neutral-800 mb-3">💡 Important Tip</h4>
              <p className="text-sm text-neutral-700">
                Experiment with the calculator by changing the down payment or term and see how it affects your monthly payment. A down payment of 20% to 30% of the vehicle value can significantly reduce the total interest paid.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Use the Calculator and Discover How Much You'll Pay for Your Car
          </h2>
          
          <p className="text-neutral-700 mb-4">
            Our calculator was created to help Canadian consumers make more informed decisions. You don't need to be a finance expert – just fill in the fields and let the calculator do the math for you.
          </p>

          <p className="text-neutral-700">
            This tool is completely free, requires no registration, and respects your privacy. Use it as many times as you need to find the best financing solution for your next vehicle.
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            This calculator is an informational tool. Results are approximate and may vary according to the specific conditions of each financial institution. Always consult a professional before making financial decisions.
          </p>
        </div>
      </div>
    </>
  );
}
