import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AutoLoanCalculatorUSA() {
  const [vehiclePrice, setVehiclePrice] = useState("35000");
  const [downPayment, setDownPayment] = useState("7000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [interestRate, setInterestRate] = useState("6.5");
  const [tradeInValue, setTradeInValue] = useState("0");
  const [result, setResult] = useState<any>(null);

  const calculateLoan = () => {
    const price = parseFloat(vehiclePrice.replace(/,/g, ""));
    const down = parseFloat(downPayment.replace(/,/g, ""));
    const tradeIn = parseFloat(tradeInValue.replace(/,/g, ""));
    const months = parseInt(loanTerm);
    const annualRate = parseFloat(interestRate.replace(",", "."));

    if (isNaN(price) || isNaN(down) || isNaN(months) || isNaN(annualRate)) {
      alert("Please fill all fields correctly");
      return;
    }

    const loanAmount = price - down - tradeIn;
    const monthlyRate = annualRate / 100 / 12;
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;
    const apr = annualRate;

    setResult({
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      apr,
      downPaymentPercent: ((down + tradeIn) / price) * 100
    });
  };

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Auto Loan Calculator USA 2025 | Car Financing & APR Calculator</title>
        <meta name="description" content="Free auto loan calculator for USA. Calculate your monthly car payment, total interest, APR, and find the best rates for your car financing." />
        <meta name="keywords" content="auto loan calculator, car loan calculator USA, car financing calculator, APR calculator, monthly payment calculator, vehicle loan" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/usa/auto-loan-calculator" />
        <html lang="en-US" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Auto Loan Calculator
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculate your monthly payment, total interest, and APR for your car loan
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How Auto Loans Work in the United States
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              An <strong>auto loan</strong> (also called car financing or vehicle loan) allows you to purchase a car by borrowing money from a lender and paying it back over time with interest. Most auto loans in the USA range from <strong>24 to 84 months</strong>, with 60-72 months being the most common terms.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Understanding APR (Annual Percentage Rate)
            </h3>
            <p className="mb-4">
              The <strong>APR</strong> is the most important number when comparing auto loans. It represents the yearly cost of your loan, including:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Interest rate:</strong> The cost of borrowing money</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Fees:</strong> Origination fees, documentation fees</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Other charges:</strong> Processing and administrative costs</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Pro Tip
              </p>
              <p className="text-sm text-yellow-900">
                Always compare loans by <strong>APR</strong>, not just the interest rate. A loan with a lower interest rate but high fees might cost more than one with a slightly higher rate and no fees.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              What Affects Your Interest Rate?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Lower Your Rate:</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Excellent credit score (720+)</li>
                  <li>• Large down payment (20%+)</li>
                  <li>• Shorter loan term (36-48 months)</li>
                  <li>• New car vs used</li>
                  <li>• Stable employment history</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-900 mb-2">✗ Increase Your Rate:</h4>
                <ul className="text-sm text-red-900 space-y-1">
                  <li>• Poor credit score (below 620)</li>
                  <li>• Small or no down payment</li>
                  <li>• Longer loan term (72+ months)</li>
                  <li>• Used or older vehicle</li>
                  <li>• High debt-to-income ratio</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              How Much Should You Put Down?
            </h3>
            <p className="mb-4">
              Your <strong>down payment</strong> is crucial for getting favorable loan terms:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Minimum recommended:</strong> 20% for new cars, 10% for used</li>
              <li><strong>Ideal:</strong> 20-30% to avoid being underwater on your loan</li>
              <li><strong>Benefits:</strong> Lower monthly payment, less interest, better approval odds</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📊 Real Example
              </p>
              <p className="text-sm text-blue-900">
                $35,000 car financed for 60 months at 6.5% APR:<br />
                • With 10% down ($3,500): Monthly payment of <strong>$615</strong><br />
                • With 20% down ($7,000): Monthly payment of <strong>$547</strong><br />
                <strong className="text-blue-700">Save $68/month and $4,080 over the loan!</strong>
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Average Auto Loan Rates by Credit Score (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Credit Score</th>
                    <th className="px-4 py-2 text-left border">Rating</th>
                    <th className="px-4 py-2 text-right border">New Car APR</th>
                    <th className="px-4 py-2 text-right border">Used Car APR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">720-850</td>
                    <td className="px-4 py-2 border">Excellent</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">5.5% - 6.5%</td>
                    <td className="px-4 py-2 text-right border">6.5% - 7.5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">690-719</td>
                    <td className="px-4 py-2 border">Good</td>
                    <td className="px-4 py-2 text-right border">6.5% - 8.5%</td>
                    <td className="px-4 py-2 text-right border">8.0% - 10.0%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">630-689</td>
                    <td className="px-4 py-2 border">Fair</td>
                    <td className="px-4 py-2 text-right border">9.0% - 12.0%</td>
                    <td className="px-4 py-2 text-right border">11.0% - 15.0%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Below 630</td>
                    <td className="px-4 py-2 border">Poor</td>
                    <td className="px-4 py-2 text-right border text-red-700">13.0% - 18.0%</td>
                    <td className="px-4 py-2 text-right border text-red-700">16.0% - 21.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Top Auto Lenders in the USA
            </h3>
            <p className="mb-4">
              You can get auto financing from various sources:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Banks:</strong> Chase, Bank of America, Wells Fargo, Capital One</li>
              <li><strong>Credit Unions:</strong> Often offer the lowest rates (Navy Federal, PenFed)</li>
              <li><strong>Manufacturer Financing:</strong> Ford Credit, GM Financial, Toyota Financial</li>
              <li><strong>Online Lenders:</strong> LightStream, myAutoloan, AutoPay</li>
              <li><strong>Dealership Financing:</strong> Convenient but often higher rates</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8 text-blue-600" />
            Calculate Your Auto Loan
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="vehiclePrice" className="text-base font-semibold">Vehicle Price ($)</Label>
              <Input
                id="vehiclePrice"
                type="text"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="downPayment" className="text-base font-semibold">Down Payment ($)</Label>
              <Input
                id="downPayment"
                type="text"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="tradeInValue" className="text-base font-semibold">Trade-In Value ($)</Label>
              <Input
                id="tradeInValue"
                type="text"
                value={tradeInValue}
                onChange={(e) => setTradeInValue(e.target.value)}
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

            <div className="md:col-span-2">
              <Label htmlFor="interestRate" className="text-base font-semibold">Interest Rate (APR %)</Label>
              <Input
                id="interestRate"
                type="text"
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
                <p className="text-3xl font-bold text-neutral-800">{formatUSD(result.loanAmount)}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Down payment: {result.downPaymentPercent.toFixed(1)}% of vehicle price
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Your Monthly Payment</p>
                <p className="text-4xl font-bold text-green-700">{formatUSD(result.monthlyPayment)}</p>
                <p className="text-xs text-green-600 mt-1">For {loanTerm} months</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Amount Paid</p>
                  <p className="text-xl font-bold text-neutral-800">{formatUSD(result.totalPayment)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatUSD(result.totalInterest)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">APR</p>
                  <p className="text-xl font-bold text-blue-600">{result.apr.toFixed(2)}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> This calculation is an estimate. Actual rates and payments may vary based on your credit score, lender fees, and other factors.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Tips for Getting the Best Auto Loan
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Check Your Credit Score First</h3>
                <p className="text-sm text-neutral-600">
                  Know your score before applying. You can get free reports from AnnualCreditReport.com.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Get Pre-Approved</h3>
                <p className="text-sm text-neutral-600">
                  Pre-approval gives you negotiating power at the dealership and locks in your rate.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Shop Around for Rates</h3>
                <p className="text-sm text-neutral-600">
                  Compare at least 3-4 lenders. Credit unions often offer rates 1-2% lower than banks.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Consider Shorter Terms</h3>
                <p className="text-sm text-neutral-600">
                  48-month loans save thousands in interest compared to 72-month loans.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Avoid Being Upside Down</h3>
                <p className="text-sm text-neutral-600">
                  Put at least 20% down to avoid owing more than the car is worth.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Read the Fine Print</h3>
                <p className="text-sm text-neutral-600">
                  Watch for prepayment penalties, balloon payments, and hidden fees.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            This calculator is for informational purposes only. Results are estimates and may vary based on individual circumstances and lender requirements.
          </p>
        </div>
      </div>
    </>
  );
}
