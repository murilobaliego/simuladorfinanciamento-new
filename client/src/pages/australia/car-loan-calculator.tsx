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

export default function CarLoanCalculatorAustralia() {
  const [vehiclePrice, setVehiclePrice] = useState("45000");
  const [downPayment, setDownPayment] = useState("9000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [interestRate, setInterestRate] = useState("7.5");
  const [balloonPayment, setBalloonPayment] = useState("0");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalAmount: number;
    totalInterest: number;
    comparisonRate: number;
    amortization: AmortizationRow[];
  } | null>(null);

  const calculateLoan = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment);
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
    const comparisonRate = annualRate + 0.005;

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
      comparisonRate: comparisonRate * 100,
      amortization
    });
  };

  const formatAUD = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Loan Calculator Australia 2025 | Compare Rates & Calculate Repayments</title>
        <meta name="description" content="Free car loan calculator for Australia. Calculate monthly repayments, comparison rates, and total interest. Includes balloon payment option. Compare rates from major Australian lenders." />
        <meta name="keywords" content="car loan calculator australia, auto loan calculator, car finance calculator, comparison rate calculator, balloon payment calculator, vehicle loan australia, car repayment calculator" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/australia/car-loan-calculator" />
        <html lang="en-AU" />
        <meta property="og:title" content="Car Loan Calculator Australia | Calculate Your Car Finance" />
        <meta property="og:description" content="Free tool to calculate car loan repayments in Australia. Get instant results for monthly payments, comparison rates and total costs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/australia/car-loan-calculator" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Car Loan Calculator Australia
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculate your car loan repayments, comparison rate, and total interest. Compare rates from Australian banks and lenders to find the best deal.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            How Car Loans Work in Australia
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              A <strong>car loan</strong> (also called auto finance or vehicle loan) allows you to purchase a new or used car by borrowing money from a lender and repaying it over time with interest. Most car loans in Australia range from <strong>12 to 84 months</strong>, with 60 months (5 years) being the most common term.
            </p>

            <h3 className="text-2xl font-bold text-neutral-800 mt-6 mb-4">
              Understanding Comparison Rates
            </h3>
            <p className="mb-4">
              In Australia, lenders must display a <strong>comparison rate</strong> alongside the advertised interest rate. The comparison rate includes:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Interest rate:</strong> The cost of borrowing</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Fees:</strong> Application fees, monthly account fees</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-2">•</span>
                <span><strong>Charges:</strong> Other upfront and ongoing costs</span>
              </li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Pro Tip
              </p>
              <p className="text-sm text-yellow-900">
                Always compare loans by their <strong>comparison rate</strong>, not just the advertised interest rate. A loan with a lower interest rate but high fees might cost more overall.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              Secured vs Unsecured Car Loans
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✓ Secured Car Loan</h4>
                <ul className="text-sm text-green-900 space-y-1">
                  <li>• Lower interest rates (5-9%)</li>
                  <li>• Car is used as collateral</li>
                  <li>• Easier approval</li>
                  <li>• Higher borrowing amounts</li>
                  <li>• Most common type</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">○ Unsecured Car Loan</h4>
                <ul className="text-sm text-blue-900 space-y-1">
                  <li>• Higher interest rates (9-15%)</li>
                  <li>• No collateral required</li>
                  <li>• Stricter approval criteria</li>
                  <li>• Lower borrowing amounts</li>
                  <li>• More flexibility</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">
              What is a Balloon Payment?
            </h3>
            <p className="mb-4">
              A <strong>balloon payment</strong> (also called residual value) is a lump sum paid at the end of your loan term. It reduces your monthly repayments but means you'll owe a large amount at the end. Common balloon payment percentages:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>New cars:</strong> 20-40% of purchase price</li>
              <li><strong>Used cars:</strong> 10-30% of purchase price</li>
              <li><strong>Commercial vehicles:</strong> Up to 50%</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6">
              <p className="text-sm font-semibold text-red-900 mb-2">
                ⚠️ Warning
              </p>
              <p className="text-sm text-red-900">
                Balloon payments can be risky. You'll need to refinance, pay cash, or sell the car at the end of the term. Make sure you have a plan before choosing this option.
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
              <Label htmlFor="vehiclePrice" className="text-base font-semibold">Vehicle Price (AUD $)</Label>
              <Input
                id="vehiclePrice"
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                className="mt-2 text-lg"
                placeholder="45000"
              />
            </div>

            <div>
              <Label htmlFor="downPayment" className="text-base font-semibold">Deposit (AUD $)</Label>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="mt-2 text-lg"
                placeholder="9000"
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
                placeholder="7.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="balloonPayment" className="text-base font-semibold">Balloon Payment (Optional - AUD $)</Label>
              <Input
                id="balloonPayment"
                type="number"
                value={balloonPayment}
                onChange={(e) => setBalloonPayment(e.target.value)}
                className="mt-2 text-lg"
                placeholder="0"
              />
              <p className="text-xs text-neutral-600 mt-1">Leave as 0 for standard loan, or enter residual value</p>
            </div>
          </div>

          <Button
            onClick={calculateLoan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculate Repayments
          </Button>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-neutral-600 mb-2">Loan Amount</p>
                <p className="text-3xl font-bold text-neutral-800">
                  {formatAUD(parseFloat(vehiclePrice) - parseFloat(downPayment))}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Deposit: {((parseFloat(downPayment) / parseFloat(vehiclePrice)) * 100).toFixed(1)}% of vehicle price
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                <p className="text-sm text-green-700 mb-2">Your Monthly Repayment</p>
                <p className="text-4xl font-bold text-green-700">{formatAUD(result.monthlyPayment)}</p>
                <p className="text-xs text-green-600 mt-1">For {loanTerm} months</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Amount Paid</p>
                  <p className="text-xl font-bold text-neutral-800">{formatAUD(result.totalAmount)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{formatAUD(result.totalInterest)}</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-neutral-600 mb-1">Comparison Rate</p>
                  <p className="text-xl font-bold text-blue-600">{result.comparisonRate.toFixed(2)}% p.a.</p>
                </div>
              </div>

              {parseFloat(balloonPayment) > 0 && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900">Balloon Payment Due</p>
                      <p className="text-sm text-orange-900 mt-1">
                        You'll need to pay <strong>{formatAUD(parseFloat(balloonPayment))}</strong> at the end of the loan term (month {loanTerm}).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> This calculation is indicative only. Actual rates and repayments may vary based on your credit history, lender fees, and loan features.
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
                        <TableCell>{formatAUD(row.payment)}</TableCell>
                        <TableCell>{formatAUD(row.principal)}</TableCell>
                        <TableCell>{formatAUD(row.interest)}</TableCell>
                        <TableCell>{formatAUD(row.balance)}</TableCell>
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
            Average Car Loan Rates in Australia (2025)
          </h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full text-sm border">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="px-4 py-2 text-left border">Loan Type</th>
                  <th className="px-4 py-2 text-left border">Vehicle</th>
                  <th className="px-4 py-2 text-right border">Interest Rate</th>
                  <th className="px-4 py-2 text-right border">Comparison Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border">
                  <td className="px-4 py-2 border">Secured</td>
                  <td className="px-4 py-2 border">New Car</td>
                  <td className="px-4 py-2 text-right border text-green-700 font-semibold">5.5% - 7.5%</td>
                  <td className="px-4 py-2 text-right border">6.0% - 8.0%</td>
                </tr>
                <tr className="border bg-neutral-50">
                  <td className="px-4 py-2 border">Secured</td>
                  <td className="px-4 py-2 border">Used Car (0-5 years)</td>
                  <td className="px-4 py-2 text-right border">6.5% - 9.0%</td>
                  <td className="px-4 py-2 text-right border">7.0% - 9.5%</td>
                </tr>
                <tr className="border">
                  <td className="px-4 py-2 border">Secured</td>
                  <td className="px-4 py-2 border">Used Car (5+ years)</td>
                  <td className="px-4 py-2 text-right border">8.0% - 11.0%</td>
                  <td className="px-4 py-2 text-right border">8.5% - 11.5%</td>
                </tr>
                <tr className="border bg-neutral-50">
                  <td className="px-4 py-2 border">Unsecured</td>
                  <td className="px-4 py-2 border">Any Vehicle</td>
                  <td className="px-4 py-2 text-right border text-red-700">9.0% - 15.0%</td>
                  <td className="px-4 py-2 text-right border text-red-700">9.5% - 15.5%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-neutral-600 italic">
            Rates are indicative and vary by lender, credit score, and loan features. Always compare multiple offers.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Major Car Loan Lenders in Australia
          </h2>
          
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p className="mb-4">
              You can get car finance from various sources in Australia:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Major Banks:</strong> Commonwealth Bank, Westpac, ANZ, NAB</li>
              <li><strong>Online Lenders:</strong> Latitude, Pepper Money, MoneyMe</li>
              <li><strong>Credit Unions:</strong> Often offer competitive rates for members</li>
              <li><strong>Manufacturer Finance:</strong> Toyota Finance, Ford Credit, Volkswagen Financial Services</li>
              <li><strong>Dealer Finance:</strong> Convenient but compare rates carefully</li>
              <li><strong>Comparison Sites:</strong> Canstar, Finder, RateCity</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                <Info className="inline h-5 w-5 mr-1" />
                ASIC MoneySmart Tip
              </p>
              <p className="text-sm text-blue-900">
                Before signing any car loan, use ASIC's MoneySmart car loan calculator to verify the numbers. Check the comparison rate, total cost, and ensure you can afford the repayments even if your circumstances change.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Tips for Getting the Best Car Loan in Australia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Check Your Credit Score</h3>
                <p className="text-sm text-neutral-600">
                  Get your free credit report from Equifax, Experian, or illion. A higher score means better rates.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Save a Larger Deposit</h3>
                <p className="text-sm text-neutral-600">
                  Aim for 20% deposit to get better rates and avoid lenders mortgage insurance (LMI).
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Compare Comparison Rates</h3>
                <p className="text-sm text-neutral-600">
                  Don't just look at the interest rate. The comparison rate shows the true cost including fees.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Consider Shorter Loan Terms</h3>
                <p className="text-sm text-neutral-600">
                  3-4 year loans save thousands in interest compared to 7-year loans.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Avoid Balloon Payments Unless Necessary</h3>
                <p className="text-sm text-neutral-600">
                  Lower monthly payments seem attractive but you'll pay more interest overall.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <TrendingDown className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-800 mb-1">Read the Contract Carefully</h3>
                <p className="text-sm text-neutral-600">
                  Check for early repayment fees, account keeping fees, and other charges.
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
              <h3 className="font-bold text-neutral-800 mb-2">What credit score do I need for a car loan in Australia?</h3>
              <p className="text-sm text-neutral-600">
                Most lenders require a credit score of at least 600-650. Scores above 700 will get you the best rates. Below 600, you may need a specialist lender or guarantor.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Can I get a car loan with bad credit?</h3>
              <p className="text-sm text-neutral-600">
                Yes, but expect higher interest rates (12-18%). Consider improving your credit score first, or look at specialist lenders like Pepper Money or Latitude.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Should I choose a fixed or variable rate?</h3>
              <p className="text-sm text-neutral-600">
                Most car loans in Australia are fixed rate, giving you certainty over repayments. Variable rates are less common but offer flexibility if rates drop.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">What fees should I expect?</h3>
              <p className="text-sm text-neutral-600">
                Common fees include: application fee ($200-$500), monthly account fee ($5-$15), early repayment fee (varies), and late payment fee ($20-$35).
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Can I pay off my car loan early?</h3>
              <p className="text-sm text-neutral-600">
                Most lenders allow early repayment, but some charge an early exit fee. Check your contract for "break costs" or "early termination fees."
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>
            This calculator is for informational purposes only. Results are estimates and may vary based on individual circumstances and lender requirements. Always read the Product Disclosure Statement (PDS) before applying.
          </p>
        </div>
      </div>
    </>
  );
}
