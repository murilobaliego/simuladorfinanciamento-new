import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanCalculatorFinland() {
  const [vehiclePrice, setVehiclePrice] = useState("30000");
  const [deposit, setDeposit] = useState("6000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [interestRate, setInterestRate] = useState("4.5");
  const [result, setResult] = useState<any>(null);

  const calculateLoan = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(deposit);
    const months = parseInt(loanTerm);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const loanAmount = price - down;

    if (loanAmount <= 0 || months <= 0) return;

    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = payment * months;
    const totalInterest = totalAmount - loanAmount;

    setResult({ loanAmount, monthlyPayment: payment, totalAmount, totalInterest });
  };

  const formatEUR = (value: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Loan Calculator Finland 2025 | Autolaina Laskuri</title>
        <meta name="description" content="Free car loan calculator for Finland. Calculate monthly payments and compare rates from Finnish banks." />
        <link rel="canonical" href="https://simuladorfinanciamento.com/finland/car-loan-calculator" />
        <html lang="en-FI" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Car Loan Calculator Finland</h1>
          <p className="text-xl text-neutral-600">Calculate your car loan in Finland</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How Car Loans Work in Finland
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              <strong>Car loans</strong> (Autolaina) in Finland are straightforward financing options with competitive rates. Finland's stable economy and strong banking sector offer reliable lending conditions.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Average Interest Rates in Finland (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Vehicle Type</th>
                    <th className="px-4 py-2 text-right border">Interest Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">New Car</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">3.5% - 6.0%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Used Car</td>
                    <td className="px-4 py-2 text-right border">5.0% - 9.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Major Lenders in Finland
            </h3>
            <ul className="space-y-2 mb-6">
              <li><strong>Traditional Banks:</strong> Nordea (largest in Nordics), OP Financial Group (cooperative bank), Danske Bank, Aktia</li>
              <li><strong>Online Lenders:</strong> Santander Consumer Finance, Collector Bank</li>
              <li><strong>Dealer Financing:</strong> Available through authorized dealers</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Key Requirements
            </h3>
            <ul className="space-y-2 mb-6">
              <li>Finnish residency and valid identification</li>
              <li>Stable employment and income verification</li>
              <li>Credit check through Suomen Asiakastieto</li>
              <li>Typically 10-20% down payment</li>
              <li>Loan terms usually 12-84 months</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calculate
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Vehicle Price (€)</Label>
              <Input type="number" value={vehiclePrice} onChange={(e) => setVehiclePrice(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Down Payment (€)</Label>
              <Input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Term (months)</Label>
              <Input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Interest Rate (%)</Label>
              <Input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="mt-2" />
            </div>
          </div>

          <Button onClick={calculateLoan} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
            Calculate
          </Button>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700">Monthly Payment</p>
                <p className="text-4xl font-bold text-green-700">{formatEUR(result.monthlyPayment)}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600">Total</p>
                  <p className="text-xl font-bold">{formatEUR(result.totalAmount)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600">Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatEUR(result.totalInterest)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Tips for Getting the Best Car Loan in Finland
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare Bank Offers</h3>
                <p className="text-sm text-neutral-600">
                  Finnish banks offer varying rates. OP Financial Group often has competitive rates for members.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Join a Cooperative Bank</h3>
                <p className="text-sm text-neutral-600">
                  OP Financial Group members often receive better loan terms and lower interest rates.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Maintain Clean Credit</h3>
                <p className="text-sm text-neutral-600">
                  Your credit record with Suomen Asiakastieto is crucial. Avoid payment defaults to get the best rates.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Consider Shorter Terms</h3>
                <p className="text-sm text-neutral-600">
                  Loans under 48 months typically have lower interest rates and save money on total interest paid.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
