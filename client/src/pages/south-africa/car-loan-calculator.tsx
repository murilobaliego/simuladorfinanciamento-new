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

export default function CarLoanCalculatorSouthAfrica() {
  const [vehiclePrice, setVehiclePrice] = useState("350000");
  const [deposit, setDeposit] = useState("70000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [interestRate, setInterestRate] = useState("11.5");
  const [balloonPayment, setBalloonPayment] = useState("0");
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
    const balloon = parseFloat(balloonPayment);

    if (loanAmount <= 0 || months <= 0 || monthlyRate < 0) return;

    const adjustedLoanAmount = loanAmount - (balloon / Math.pow(1 + monthlyRate, months));
    const payment = adjustedLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalAmount = (payment * months) + balloon;
    const totalInterest = totalAmount - loanAmount;

    const amortization: AmortizationRow[] = [];
    let balance = loanAmount;

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = payment - interest;
      balance -= principal;

      if (i === months && balloon > 0) {
        balance = balloon;
      }

      amortization.push({
        month: i,
        payment: i === months && balloon > 0 ? payment + balloon : payment,
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

  const formatZAR = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Loan Calculator South Africa 2025 | Vehicle Finance & Interest Rates</title>
        <meta name="description" content="Free car loan calculator for South Africa. Calculate your monthly instalment, total interest, and compare rates from major SA banks. Includes balloon payment option." />
        <meta name="keywords" content="car loan calculator south africa, vehicle finance calculator, car finance SA, interest rate calculator, monthly instalment calculator, balloon payment calculator" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/south-africa/car-loan-calculator" />
        <html lang="en-ZA" />
        <meta property="og:title" content="Car Loan Calculator South Africa | Calculate Your Vehicle Finance" />
        <meta property="og:description" content="Free tool to calculate car loan instalments in South Africa. Get instant results for monthly payments and total costs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/south-africa/car-loan-calculator" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Car Loan Calculator South Africa
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculate your monthly car instalment, interest rates, and total cost. Compare rates from South African banks.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How Car Finance Works in South Africa
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              <strong>Vehicle finance</strong> (or car loan) allows you to purchase a car by borrowing money from a bank or financial institution and repaying it over time with interest. Most car loans in South Africa range from <strong>24 to 72 months</strong>, with 60 months being the most common term.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Understanding Interest Rates in South Africa
            </h3>
            <p className="mb-4">
              Car loan interest rates in SA are influenced by the <strong>repo rate</strong> set by the South African Reserve Bank (SARB). Your personal rate depends on:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Credit score:</strong> Higher score = lower rate</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Deposit amount:</strong> Larger deposit = better rate</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Loan term:</strong> Shorter term = lower rate</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Vehicle type:</strong> New vs used, age of vehicle</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Pro Tip
              </p>
              <p className="text-sm text-yellow-900">
                Check your credit score with <strong>TransUnion</strong>, <strong>Experian</strong>, or <strong>Compuscan</strong> before applying. A score above 670 qualifies you for prime lending rates.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              What is a Balloon Payment?
            </h3>
            <p className="mb-4">
              A <strong>balloon payment</strong> (also called residual value) is a lump sum paid at the end of your loan term. It reduces your monthly instalments but means you'll owe a large amount at the end. Common balloon percentages in SA:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>New cars:</strong> 20-35% of purchase price</li>
              <li><strong>Used cars:</strong> 10-25% of purchase price</li>
              <li><strong>Maximum allowed:</strong> 35% by National Credit Act</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6">
              <p className="text-sm font-semibold text-red-900 mb-2">
                ⚠️ Warning
              </p>
              <p className="text-sm text-red-900">
                Balloon payments can be risky. You'll need to refinance, pay cash, or trade in the car at the end. Make sure you have a plan before choosing this option.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Average Car Loan Rates in South Africa (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Credit Score</th>
                    <th className="px-4 py-2 text-left border">Rating</th>
                    <th className="px-4 py-2 text-right border">New Car Rate</th>
                    <th className="px-4 py-2 text-right border">Used Car Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 border">740-999</td>
                    <td className="px-4 py-2 border">Excellent</td>
                    <td className="px-4 py-2 text-right border text-green-700 font-semibold">9.5% - 11.0%</td>
                    <td className="px-4 py-2 text-right border">10.5% - 12.5%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">670-739</td>
                    <td className="px-4 py-2 border">Good</td>
                    <td className="px-4 py-2 text-right border">11.0% - 13.0%</td>
                    <td className="px-4 py-2 text-right border">12.5% - 15.0%</td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 py-2 border">600-669</td>
                    <td className="px-4 py-2 border">Fair</td>
                    <td className="px-4 py-2 text-right border">13.0% - 16.0%</td>
                    <td className="px-4 py-2 text-right border">15.0% - 18.0%</td>
                  </tr>
                  <tr className="border bg-neutral-50">
                    <td className="px-4 py-2 border">Below 600</td>
                    <td className="px-4 py-2 border">Poor</td>
                    <td className="px-4 py-2 text-right border text-red-700">16.0% - 22.0%</td>
                    <td className="px-4 py-2 text-right border text-red-700">18.0% - 25.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Major Vehicle Finance Providers in South Africa
            </h3>
            <p className="mb-4">
              You can get vehicle finance from various sources:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Major Banks:</strong> Absa, Standard Bank, Nedbank, FNB, Capitec</li>
              <li><strong>Specialist Lenders:</strong> WesBank, MFC (Nedbank), SA Taxi Finance</li>
              <li><strong>Dealership Finance:</strong> Convenient but compare rates carefully</li>
              <li><strong>Online Lenders:</strong> Hippo, Lendcor, Earn-a-Car</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                <Info className="inline h-5 w-5 mr-1" />
                National Credit Act Protection
              </p>
              <p className="text-sm text-blue-900">
                All vehicle finance in South Africa is regulated by the <strong>National Credit Act (NCA)</strong>. This protects you from unfair lending practices and ensures transparent disclosure of all costs and fees.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              How Much Deposit Should You Pay?
            </h3>
            <p className="mb-4">
              Your <strong>deposit</strong> is crucial for getting favourable loan terms:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Minimum recommended:</strong> 10% of vehicle price</li>
              <li><strong>Ideal:</strong> 20-30% for best rates and approval odds</li>
              <li><strong>Benefits:</strong> Lower monthly instalment, less interest, better approval</li>
              <li><strong>No deposit:</strong> Possible but expect higher rates (13-18%)</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📊 Real Example
              </p>
              <p className="text-sm text-blue-900">
                R350,000 car financed for 60 months at 11.5% interest:<br />
                • With 10% deposit (R35,000): Monthly instalment of <strong>R6,850</strong><br />
                • With 20% deposit (R70,000): Monthly instalment of <strong>R6,090</strong><br />
                <strong className="text-blue-700">Save R760/month and R45,600 over the loan!</strong>
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
              <Label htmlFor="vehiclePrice" className="text-base font-semibold">Vehicle Price (R)</Label>
              <Input
                id="vehiclePrice"
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                className="mt-2 text-lg"
                placeholder="350000"
              />
            </div>

            <div>
              <Label htmlFor="deposit" className="text-base font-semibold">Deposit (R)</Label>
              <Input
                id="deposit"
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="mt-2 text-lg"
                placeholder="70000"
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
              <Label htmlFor="interestRate" className="text-base font-semibold">Interest Rate (% p.a.)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="mt-2 text-lg"
                placeholder="11.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="balloonPayment" className="text-base font-semibold">Balloon Payment (Optional - R)</Label>
              <Input
                id="balloonPayment"
                type="number"
                value={balloonPayment}
                onChange={(e) => setBalloonPayment(e.target.value)}
                className="mt-2 text-lg"
                placeholder="0"
              />
              <p className="text-xs text-neutral-600 mt-1">Leave as 0 for standard loan, or enter residual value (max 35%)</p>
            </div>
          </div>

          <Button
            onClick={calculateLoan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculate Instalment
          </Button>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Loan Amount</p>
                <p className="text-3xl font-bold text-neutral-800">
                  {formatZAR(parseFloat(vehiclePrice) - parseFloat(deposit))}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Deposit: {((parseFloat(deposit) / parseFloat(vehiclePrice)) * 100).toFixed(1)}% of vehicle price
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Your Monthly Instalment</p>
                <p className="text-4xl font-bold text-green-700">{formatZAR(result.monthlyPayment)}</p>
                <p className="text-xs text-green-600 mt-1">For {loanTerm} months</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Amount Paid</p>
                  <p className="text-xl font-bold text-neutral-800">{formatZAR(result.totalAmount)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatZAR(result.totalInterest)}</p>
                </div>
              </div>

              {parseFloat(balloonPayment) > 0 && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900">Balloon Payment Due</p>
                      <p className="text-sm text-orange-900 mt-1">
                        You'll need to pay <strong>{formatZAR(parseFloat(balloonPayment))}</strong> at the end of the loan term (month {loanTerm}).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> This calculation is indicative only. Actual rates and instalments may vary based on your credit profile, lender fees, and loan features.
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
                        <TableCell>{formatZAR(row.payment)}</TableCell>
                        <TableCell>{formatZAR(row.principal)}</TableCell>
                        <TableCell>{formatZAR(row.interest)}</TableCell>
                        <TableCell>{formatZAR(row.balance)}</TableCell>
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
            Tips for Getting the Best Car Loan in South Africa
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Check Your Credit Score</h3>
                <p className="text-sm text-neutral-600">
                  Get your free credit report from TransUnion, Experian, or Compuscan. A score above 670 qualifies for prime rates.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Save a Larger Deposit</h3>
                <p className="text-sm text-neutral-600">
                  Aim for 20% deposit to get better rates and avoid negative equity.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare Multiple Lenders</h3>
                <p className="text-sm text-neutral-600">
                  Get quotes from at least 3 banks or lenders. Rates can vary by 2-3%.
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
                <h3 className="font-bold text-neutral-800 mb-1">Avoid Balloon Payments Unless Necessary</h3>
                <p className="text-sm text-neutral-600">
                  Lower monthly instalments seem attractive but you'll pay more interest overall.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Read the Contract Carefully</h3>
                <p className="text-sm text-neutral-600">
                  Check for initiation fees, monthly admin fees, and early settlement penalties.
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
              <h3 className="font-bold text-neutral-800 mb-2">What credit score do I need for car finance in South Africa?</h3>
              <p className="text-sm text-neutral-600">
                Most lenders require a minimum score of 600. Scores above 670 qualify for prime lending rates (9.5-13%). Below 600, you may need a specialist lender or guarantor.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Can I get car finance with bad credit?</h3>
              <p className="text-sm text-neutral-600">
                Yes, but expect higher interest rates (16-25%). Consider improving your credit score first, or look at specialist lenders like Earn-a-Car or SA Taxi Finance.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">What fees should I expect?</h3>
              <p className="text-sm text-neutral-600">
                Common fees include: initiation fee (R1,200-R1,500), monthly admin fee (R60-R80), and early settlement fee (varies). All fees must be disclosed under the NCA.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Can I settle my car loan early?</h3>
              <p className="text-sm text-neutral-600">
                Yes, you can settle early. Some lenders charge an early settlement fee (typically 1-3 months' interest). Check your contract for specific terms.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Do I need insurance?</h3>
              <p className="text-sm text-neutral-600">
                Yes, comprehensive car insurance is mandatory for financed vehicles. The bank is listed as the first beneficiary until the loan is paid off.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            This calculator is for informational purposes only. Results are estimates and may vary based on individual circumstances and lender requirements. Always consult with a registered financial advisor before making financial decisions.
          </p>
        </div>
      </div>
    </>
  );
}
