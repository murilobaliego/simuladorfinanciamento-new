import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Calculator, TrendingDown, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanCalculatorChina() {
  const [vehiclePrice, setVehiclePrice] = useState("200000");
  const [deposit, setDeposit] = useState("60000");
  const [loanTerm, setLoanTerm] = useState("36");
  const [interestRate, setInterestRate] = useState("4.5");
  const [result, setResult] = useState<any>(null);

  const calculateLoan = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(deposit);
    const months = parseInt(loanTerm);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const loanAmount = price - down;

    if (loanAmount <= 0 || months <= 0 || monthlyRate < 0) return;

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

  const formatCNY = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Loan Calculator China 2025 | Auto Loan Interest Rate Calculator</title>
        <meta name="description" content="Free car loan calculator for China. Calculate your monthly payment, total interest, and compare rates from major Chinese banks. 汽车贷款计算器" />
        <meta name="keywords" content="car loan calculator china, auto loan calculator, 汽车贷款计算器, interest rate calculator, monthly payment calculator, 车贷计算" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/china/car-loan-calculator" />
        <html lang="en-CN" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Car Loan Calculator China
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculate your monthly car loan payment, interest rates, and total cost. Compare rates from Chinese banks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How Car Loans Work in China
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              <strong>Auto loans</strong> (汽车贷款) in China allow you to purchase a vehicle by borrowing money from a bank or auto finance company. Most car loans range from <strong>12 to 60 months</strong>, with 36 months being the most common term.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Average Interest Rates in China (2025)
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
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">3.5% - 5.5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Bank Loan</td>
                    <td className="px-4 py-2 border">Used Car</td>
                    <td className="px-4 py-2 text-right border">5.0% - 7.5%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">Auto Finance Company</td>
                    <td className="px-4 py-2 border">New Car</td>
                    <td className="px-4 py-2 text-right border">4.0% - 6.5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Auto Finance Company</td>
                    <td className="px-4 py-2 border">Used Car</td>
                    <td className="px-4 py-2 text-right border text-red-700">6.0% - 9.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Major Car Loan Providers in China
            </h3>
            <ul className="space-y-2 mb-6">
              <li><strong>Major Banks:</strong> ICBC, China Construction Bank, Agricultural Bank of China, Bank of China</li>
              <li><strong>Auto Finance Companies:</strong> SAIC-GMAC, Volkswagen Finance, Toyota Finance, BMW Finance</li>
              <li><strong>Online Lenders:</strong> Ant Financial, WeBank, MYbank</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">💡 Pro Tip</p>
              <p className="text-sm text-yellow-900">
                Auto finance companies (汽车金融公司) often offer faster approval and promotional 0% rates, but banks typically have lower standard rates.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Down Payment Requirements in China
            </h3>
            <ul className="space-y-2 mb-6">
              <li><strong>Minimum required:</strong> 20% for new cars, 30% for used cars (PBOC regulation)</li>
              <li><strong>Recommended:</strong> 30-40% for best rates</li>
              <li><strong>New energy vehicles:</strong> 15% minimum (government incentive)</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                <Info className="inline h-5 w-5 mr-1" />
                PBOC Regulations
              </p>
              <p className="text-sm text-blue-900">
                The People's Bank of China (PBOC) regulates auto loans. All lenders must follow minimum down payment requirements and maximum loan-to-value ratios.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">📊 Real Example</p>
              <p className="text-sm text-blue-900">
                ¥200,000 car financed for 36 months at 4.5% interest:<br />
                • With 20% down (¥40,000): Monthly payment of <strong>¥4,740</strong><br />
                • With 30% down (¥60,000): Monthly payment of <strong>¥4,145</strong><br />
                <strong className="text-blue-700">Save ¥595/month and ¥21,420 over the loan!</strong>
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
              <Label htmlFor="vehiclePrice" className="text-base font-semibold">Vehicle Price (¥)</Label>
              <Input
                id="vehiclePrice"
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                className="mt-2 text-lg"
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
                <p className="text-3xl font-bold text-neutral-800">{formatCNY(result.loanAmount)}</p>
                <p className="text-xs text-neutral-500 mt-1">Down payment: {result.depositPercent.toFixed(1)}%</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Your Monthly Payment</p>
                <p className="text-4xl font-bold text-green-700">{formatCNY(result.monthlyPayment)}</p>
                <p className="text-xs text-green-600 mt-1">For {loanTerm} months</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Amount Paid</p>
                  <p className="text-xl font-bold text-neutral-800">{formatCNY(result.totalAmount)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatCNY(result.totalInterest)}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> This calculation is indicative only. Actual rates may vary based on your credit score and lender.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Tips for Getting the Best Car Loan in China
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare Banks and Auto Finance Companies</h3>
                <p className="text-sm text-neutral-600">
                  Banks offer lower rates but stricter requirements. Auto finance companies are faster with promotional offers.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Check Your Credit Report</h3>
                <p className="text-sm text-neutral-600">
                  Use PBOC credit system or Sesame Credit (芝麻信用) to check your score before applying.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Consider New Energy Vehicles</h3>
                <p className="text-sm text-neutral-600">
                  NEVs qualify for lower down payments (15%) and often have promotional 0% rates.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Look for Manufacturer Promotions</h3>
                <p className="text-sm text-neutral-600">
                  During major shopping festivals (618, Double 11), manufacturers offer special financing rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
