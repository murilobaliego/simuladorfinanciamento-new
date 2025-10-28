import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanCalculatorSweden() {
  const [vehiclePrice, setVehiclePrice] = useState("300000");
  const [deposit, setDeposit] = useState("60000");
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

    setResult({
      loanAmount,
      monthlyPayment: payment,
      totalAmount,
      totalInterest,
      depositPercent: (down / price) * 100
    });
  };

  const formatSEK = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Loan Calculator Sweden 2025 | Billån Kalkylator</title>
        <meta name="description" content="Free car loan calculator for Sweden. Calculate your monthly payment, total interest, and compare rates from Swedish banks. Billån kalkylator." />
        <meta name="keywords" content="car loan calculator sweden, billån kalkylator, auto loan sweden, interest rate calculator, monthly payment calculator" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/sweden/car-loan-calculator" />
        <html lang="en-SE" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Car Loan Calculator Sweden
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculate your car loan payment, interest rates, and total cost. Compare rates from Swedish banks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How Car Loans Work in Sweden
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              <strong>Car loans</strong> (Billån) in Sweden allow you to purchase a vehicle by borrowing money from a bank. Most car loans range from <strong>12 to 84 months</strong>, with 60 months being common.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Average Interest Rates in Sweden (2025)
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
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">3.5% - 6.5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Used Car</td>
                    <td className="px-4 py-2 text-right border">5.0% - 9.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Major Lenders in Sweden
            </h3>
            <ul className="space-y-2 mb-6">
              <li><strong>Traditional Banks:</strong> Swedbank (largest in Sweden), SEB, Handelsbanken, Nordea</li>
              <li><strong>Online Lenders:</strong> Santander Consumer Bank, Resurs Bank, SBAB</li>
              <li><strong>Dealer Financing:</strong> Available through Volvo Financial Services, Volkswagen Bank, etc.</li>
            </ul>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Key Requirements
            </h3>
            <ul className="space-y-2 mb-6">
              <li>Swedish residency (personnummer required)</li>
              <li>Stable income and employment history</li>
              <li>Credit check through UC (Upplysningscentralen)</li>
              <li>Typically 15-20% down payment recommended</li>
              <li>Loan terms usually 12-84 months</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calculate Your Car Loan
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="vehiclePrice" className="text-base font-semibold">Vehicle Price (kr)</Label>
              <Input
                id="vehiclePrice"
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="deposit" className="text-base font-semibold">Down Payment (kr)</Label>
              <Input
                id="deposit"
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="mt-2 text-lg"
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
              />
            </div>

            <div>
              <Label htmlFor="interestRate" className="text-base font-semibold">Interest Rate (% per year)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="mt-2 text-lg"
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
                <p className="text-3xl font-bold text-neutral-800">{formatSEK(result.loanAmount)}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Monthly Payment</p>
                <p className="text-4xl font-bold text-green-700">{formatSEK(result.monthlyPayment)}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-neutral-800">{formatSEK(result.totalAmount)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatSEK(result.totalInterest)}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> This is an indicative calculation. Actual rates may vary.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Tips for Getting the Best Car Loan in Sweden
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare Multiple Banks</h3>
                <p className="text-sm text-neutral-600">
                  Rates can vary significantly between Swedish banks. Get quotes from at least 3 lenders to find the best deal.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Check Your UC Credit Score</h3>
                <p className="text-sm text-neutral-600">
                  Your credit rating from UC affects your interest rate. Ensure your credit report is accurate before applying.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Save for a Larger Down Payment</h3>
                <p className="text-sm text-neutral-600">
                  Aim for 20-30% down payment to get better rates and lower monthly payments.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Consider Bank Membership</h3>
                <p className="text-sm text-neutral-600">
                  Being an existing customer at Swedbank or Handelsbanken may qualify you for preferential rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
