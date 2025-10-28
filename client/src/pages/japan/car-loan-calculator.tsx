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

export default function CarLoanCalculatorJapan() {
  const [vehiclePrice, setVehiclePrice] = useState("3000000");
  const [deposit, setDeposit] = useState("600000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [interestRate, setInterestRate] = useState("3.5");
  const [residualValue, setResidualValue] = useState("0");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
    amortization: AmortizationRow[];
  } | null>(null);

  const calculateLoan = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(deposit);
    const months = parseInt(loanTerm);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const loanAmount = price - down;
    const residual = parseFloat(residualValue);

    if (loanAmount <= 0 || months <= 0 || monthlyRate < 0) return;

    const adjustedLoanAmount = loanAmount - (residual / Math.pow(1 + monthlyRate, months));
    const payment = adjustedLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalAmount = (payment * months) + residual;
    const totalInterest = totalAmount - loanAmount;

    const amortization: AmortizationRow[] = [];
    let balance = loanAmount;

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = payment - interest;
      balance -= principal;

      if (i === months && residual > 0) {
        balance = residual;
      }

      amortization.push({
        month: i,
        payment: i === months && residual > 0 ? payment + residual : payment,
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

  const formatJPY = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Loan Calculator Japan 2025 | Auto Loan Interest Rate Calculator</title>
        <meta name="description" content="Free car loan calculator for Japan. Calculate your monthly payment, total interest, and compare rates from major Japanese banks. Includes residual value option." />
        <meta name="keywords" content="car loan calculator japan, auto loan calculator, マイカーローン計算, interest rate calculator, monthly payment calculator, residual value" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/japan/car-loan-calculator" />
        <html lang="en-JP" />
        <meta property="og:title" content="Car Loan Calculator Japan | Calculate Your Auto Loan" />
        <meta property="og:description" content="Free tool to calculate car loan payments in Japan. Get instant results for monthly payments and total costs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/japan/car-loan-calculator" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Car Loan Calculator Japan
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculate your monthly car loan payment, interest rates, and total cost. Compare rates from Japanese banks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How Car Loans Work in Japan
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              <strong>Auto loans</strong> (マイカーローン - My Car Loan) in Japan allow you to purchase a vehicle by borrowing money from a bank or dealer and repaying it over time with interest. Most car loans in Japan range from <strong>12 to 84 months</strong>, with 60 months being the most common term.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Understanding Interest Rates in Japan
            </h3>
            <p className="mb-4">
              Car loan interest rates in Japan are generally lower than in many other countries, typically ranging from <strong>1.5% to 8%</strong> depending on:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Credit history:</strong> Better credit = lower rate</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Down payment:</strong> Larger deposit = better rate</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Loan term:</strong> Shorter term = lower rate</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Vehicle type:</strong> New vs used, domestic vs import</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Pro Tip
              </p>
              <p className="text-sm text-yellow-900">
                Bank loans (銀行ローン) typically offer lower rates (1.5-4%) than dealer financing (ディーラーローン) which can be 4-8%. Always compare both options.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Average Car Loan Rates in Japan (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Lender Type</th>
                    <th className="px-4 py-2 text-left border">Vehicle</th>
                    <th className="px-4 py-2 text-right border">Interest Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">Bank Loan</td>
                    <td className="px-4 py-2 border">New Car</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">1.5% - 3.5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Bank Loan</td>
                    <td className="px-4 py-2 border">Used Car</td>
                    <td className="px-4 py-2 text-right border">2.5% - 4.5%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Dealer Financing</td>
                    <td className="px-4 py-2 border">New Car</td>
                    <td className="px-4 py-2 text-right border">3.5% - 6.0%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Dealer Financing</td>
                    <td className="px-4 py-2 border">Used Car</td>
                    <td className="px-4 py-2 text-right border text-red-700">5.0% - 8.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Major Car Loan Providers in Japan
            </h3>
            <p className="mb-4">
              You can get auto financing from various sources:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Major Banks:</strong> MUFG Bank, Mizuho Bank, SMBC, Resona Bank</li>
              <li><strong>Regional Banks:</strong> Often offer competitive rates for local residents</li>
              <li><strong>Credit Unions:</strong> JA Bank, Shinkin Bank (労働金庫)</li>
              <li><strong>Dealer Financing:</strong> Toyota Finance, Nissan Financial Services, Honda Finance</li>
              <li><strong>Online Lenders:</strong> SBI Sumishin Net Bank, Rakuten Bank</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                <Info className="inline h-5 w-5 mr-1" />
                Residual Value Loans (残価設定ローン)
              </p>
              <p className="text-sm text-blue-900">
                Popular in Japan, these loans set a residual value (typically 30-50% of vehicle price) that you pay at the end. This lowers monthly payments but requires a large final payment or trade-in.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              How Much Down Payment Should You Make?
            </h3>
            <p className="mb-4">
              Your <strong>down payment</strong> (頭金 - atama-kin) is important for getting favorable terms:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Minimum recommended:</strong> 10-20% of vehicle price</li>
              <li><strong>Ideal:</strong> 30% or more for best rates</li>
              <li><strong>Benefits:</strong> Lower monthly payment, less interest, better approval</li>
              <li><strong>Zero down:</strong> Available but expect higher rates</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📊 Real Example
              </p>
              <p className="text-sm text-blue-900">
                ¥3,000,000 car financed for 60 months at 3.5% interest:<br />
                • With 10% down (¥300,000): Monthly payment of <strong>¥49,200</strong><br />
                • With 20% down (¥600,000): Monthly payment of <strong>¥43,700</strong><br />
                <strong className="text-blue-700">Save ¥5,500/month and ¥330,000 over the loan!</strong>
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Types of Car Loans in Japan
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Bank Loan (銀行ローン)</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Lower interest rates (1.5-4%)</li>
                  <li>• You own the car immediately</li>
                  <li>• More paperwork required</li>
                  <li>• Flexible terms</li>
                  <li>• Can refinance easily</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">○ Dealer Financing (ディーラーローン)</h4>
                <ul className="text-sm text-blue-900 space-y-1">
                  <li>• Higher rates (3.5-8%)</li>
                  <li>• Dealer owns car until paid off</li>
                  <li>• Quick approval process</li>
                  <li>• Sometimes promotional 0% rates</li>
                  <li>• Convenient one-stop shopping</li>
                </ul>
              </div>
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
              <Label htmlFor="vehiclePrice" className="text-base font-semibold">Vehicle Price (¥)</Label>
              <Input
                id="vehiclePrice"
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                className="mt-2 text-lg"
                placeholder="3000000"
              />
            </div>

            <div>
              <Label htmlFor="deposit" className="text-base font-semibold">Down Payment (¥)</Label>
              <Input
                id="deposit"
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="mt-2 text-lg"
                placeholder="600000"
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
              <Label htmlFor="interestRate" className="text-base font-semibold">Interest Rate (% per year)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="mt-2 text-lg"
                placeholder="3.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="residualValue" className="text-base font-semibold">Residual Value (Optional - ¥)</Label>
              <Input
                id="residualValue"
                type="number"
                value={residualValue}
                onChange={(e) => setResidualValue(e.target.value)}
                className="mt-2 text-lg"
                placeholder="0"
              />
              <p className="text-xs text-neutral-600 mt-1">Leave as 0 for standard loan, or enter residual value (残価設定)</p>
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
                  {formatJPY(parseFloat(vehiclePrice) - parseFloat(deposit))}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Down payment: {((parseFloat(deposit) / parseFloat(vehiclePrice)) * 100).toFixed(1)}% of vehicle price
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Your Monthly Payment</p>
                <p className="text-4xl font-bold text-green-700">{formatJPY(result.monthlyPayment)}</p>
                <p className="text-xs text-green-600 mt-1">For {loanTerm} months</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Amount Paid</p>
                  <p className="text-xl font-bold text-neutral-800">{formatJPY(result.totalAmount)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatJPY(result.totalInterest)}</p>
                </div>
              </div>

              {parseFloat(residualValue) > 0 && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900">Residual Value Payment Due</p>
                      <p className="text-sm text-orange-900 mt-1">
                        You'll need to pay <strong>{formatJPY(parseFloat(residualValue))}</strong> at the end of the loan term (month {loanTerm}).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> This calculation is indicative only. Actual rates and payments may vary based on your credit history, lender fees, and loan features.
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
                        <TableCell>{formatJPY(row.payment)}</TableCell>
                        <TableCell>{formatJPY(row.principal)}</TableCell>
                        <TableCell>{formatJPY(row.interest)}</TableCell>
                        <TableCell>{formatJPY(row.balance)}</TableCell>
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
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Tips for Getting the Best Car Loan in Japan
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare Bank vs Dealer Rates</h3>
                <p className="text-sm text-neutral-600">
                  Bank loans typically offer rates 2-4% lower than dealer financing. Always compare both.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Save a Larger Down Payment</h3>
                <p className="text-sm text-neutral-600">
                  Aim for 20-30% down payment to get the best rates and lower monthly payments.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Consider Shorter Terms</h3>
                <p className="text-sm text-neutral-600">
                  36-48 month loans save significantly on interest compared to 72-84 month loans.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Be Careful with Residual Value Loans</h3>
                <p className="text-sm text-neutral-600">
                  Lower monthly payments are attractive but you'll need a plan for the large final payment.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Check for Promotional Rates</h3>
                <p className="text-sm text-neutral-600">
                  Dealers sometimes offer 0% or 1.9% promotional financing on new cars.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Read the Contract Carefully</h3>
                <p className="text-sm text-neutral-600">
                  Check for early repayment penalties and all fees before signing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-neutral-800 mb-2">What is the average car loan interest rate in Japan?</h3>
              <p className="text-sm text-neutral-600">
                Bank loans typically range from 1.5-4.5%, while dealer financing ranges from 3.5-8%. Rates depend on your credit history, down payment, and loan term.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Should I choose a bank loan or dealer financing?</h3>
              <p className="text-sm text-neutral-600">
                Bank loans usually offer lower rates but require more paperwork. Dealer financing is more convenient but typically has higher rates. Compare both options before deciding.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">What is a residual value loan (残価設定ローン)?</h3>
              <p className="text-sm text-neutral-600">
                A loan where you set aside 30-50% of the car's value to pay at the end. This lowers monthly payments but requires a large final payment, refinancing, or trade-in.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Can I pay off my car loan early in Japan?</h3>
              <p className="text-sm text-neutral-600">
                Yes, most loans allow early repayment. Bank loans typically have no penalty, while some dealer loans may charge a small fee. Check your contract.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Do I need insurance for a financed car?</h3>
              <p className="text-sm text-neutral-600">
                Yes, comprehensive insurance (車両保険) is typically required by lenders. This protects both you and the lender in case of accident or theft.
              </p>
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
