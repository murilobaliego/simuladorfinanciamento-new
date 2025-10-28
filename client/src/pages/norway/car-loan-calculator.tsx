import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanCalculatorNorway() {
  const [vehiclePrice, setVehiclePrice] = useState("400000");
  const [deposit, setDeposit] = useState("80000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [interestRate, setInterestRate] = useState("5.5");
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

    setResult({
      loanAmount,
      monthlyPayment: payment,
      totalAmount,
      totalInterest
    });
  };

  const formatNOK = (value: number) => {
    return new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Loan Calculator Norway 2025 | Billån Kalkulator</title>
        <meta name="description" content="Free car loan calculator for Norway. Calculate your monthly payment and compare rates from Norwegian banks." />
        <link rel="canonical" href="https://simuladorfinanciamento.com/norway/car-loan-calculator" />
        <html lang="en-NO" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Car Loan Calculator Norway
          </h1>
          <p className="text-xl text-neutral-600">
            Calculate your car loan payment and interest rates in Norway.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How Car Loans Work in Norway
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              <strong>Car loans</strong> (Billån) in Norway are popular financing options for purchasing vehicles. Most loans range from <strong>12 to 84 months</strong>, with typical terms being 36-60 months.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Average Interest Rates in Norway (2025)
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
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">4.5% - 7.5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Used Car</td>
                    <td className="px-4 py-2 text-right border">6.0% - 10.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Major Lenders in Norway
            </h3>
            <ul className="space-y-2 mb-6">
              <li><strong>Traditional Banks:</strong> DNB (Norway's largest bank), Nordea, SpareBank 1, Danske Bank</li>
              <li><strong>Online Lenders:</strong> Bank Norwegian, Santander Consumer Bank Norway</li>
              <li><strong>Dealer Financing:</strong> Available through major car dealerships</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Key Requirements
            </h3>
            <ul className="space-y-2 mb-6">
              <li>Norwegian residency and valid ID</li>
              <li>Stable income documentation</li>
              <li>Good credit history (checked through Gjeldsregisteret)</li>
              <li>Typically 15-20% down payment recommended</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calculate Your Loan
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Vehicle Price (kr)</Label>
              <Input type="number" value={vehiclePrice} onChange={(e) => setVehiclePrice(e.target.value)} className="mt-2 text-lg" />
            </div>
            <div>
              <Label>Down Payment (kr)</Label>
              <Input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="mt-2 text-lg" />
            </div>
            <div>
              <Label>Loan Term (months)</Label>
              <Input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="mt-2 text-lg" />
            </div>
            <div>
              <Label>Interest Rate (%)</Label>
              <Input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="mt-2 text-lg" />
            </div>
          </div>

          <Button onClick={calculateLoan} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
            <Calculator className="mr-2 h-5 w-5" />
            Calculate
          </Button>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Monthly Payment</p>
                <p className="text-4xl font-bold text-green-700">{formatNOK(result.monthlyPayment)}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold">{formatNOK(result.totalAmount)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatNOK(result.totalInterest)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Tips for Getting the Best Car Loan in Norway
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare Multiple Lenders</h3>
                <p className="text-sm text-neutral-600">
                  Interest rates can vary by 2-3% between Norwegian banks. Use comparison sites like Finansportalen.no to find the best rates.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Maintain Good Credit</h3>
                <p className="text-sm text-neutral-600">
                  Your credit history in Gjeldsregisteret affects your rate. Pay bills on time and avoid excessive debt.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Consider Shorter Terms</h3>
                <p className="text-sm text-neutral-600">
                  Shorter loan terms (36-48 months) typically offer lower interest rates than 60-84 month loans.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Save for Down Payment</h3>
                <p className="text-sm text-neutral-600">
                  A 20-30% down payment can significantly reduce your interest rate and monthly payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
