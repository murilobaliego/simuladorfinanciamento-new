import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingDown, FileText, AlertCircle, IndianRupee } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function CarLoanCalculatorIndia() {
  const [carPrice, setCarPrice] = useState("800000");
  const [downPayment, setDownPayment] = useState("160000");
  const [loanTenure, setLoanTenure] = useState("60");
  const [interestRate, setInterestRate] = useState("9.5");
  const [result, setResult] = useState<{
    emi: number;
    totalAmount: number;
    totalInterest: number;
    amortization: AmortizationRow[];
  } | null>(null);

  const calculateEMI = () => {
    const price = parseFloat(carPrice);
    const down = parseFloat(downPayment);
    const months = parseInt(loanTenure);
    const rate = parseFloat(interestRate) / 100 / 12;
    const principal = price - down;

    if (principal <= 0 || months <= 0 || rate < 0) return;

    const emi = principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    
    const amortization: AmortizationRow[] = [];
    let balance = principal;
    let totalPaid = 0;

    for (let i = 1; i <= months; i++) {
      const interestPayment = balance * rate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;
      totalPaid += emi;

      amortization.push({
        month: i,
        payment: emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    setResult({
      emi,
      totalAmount: totalPaid,
      totalInterest: totalPaid - principal,
      amortization
    });
  };

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Car Loan EMI Calculator India 2025 | Calculate Auto Loan EMI Online</title>
        <meta name="description" content="Free Car Loan EMI Calculator for India. Calculate monthly EMI, total interest, and loan amount for new & used cars. Compare rates from SBI, HDFC, ICICI Bank & more. Get instant results!" />
        <meta name="keywords" content="car loan calculator, car loan emi calculator, auto loan calculator india, vehicle loan calculator, car finance calculator, emi calculator, sbi car loan, hdfc car loan, icici car loan" />
        <link rel="canonical" href="https://simuladorfinanciamento.com/india/car-loan-calculator" />
        <meta property="og:title" content="Car Loan EMI Calculator India 2025 | Free Auto Loan Calculator" />
        <meta property="og:description" content="Calculate car loan EMI instantly. Compare interest rates from top banks. Plan your car purchase with our free EMI calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://simuladorfinanciamento.com/india/car-loan-calculator" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Car Loan EMI Calculator India
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Calculate your monthly EMI, total interest, and loan amount for your car purchase
          </p>
        </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center">
              <Calculator className="mr-3 h-8 w-8 text-blue-600" />
              Calculate Your Car Loan EMI
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="carPrice" className="text-base font-semibold">Car Price (₹)</Label>
                <Input
                  id="carPrice"
                  type="number"
                  value={carPrice}
                  onChange={(e) => setCarPrice(e.target.value)}
                  placeholder="800000"
                  className="mt-2 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="downPayment" className="text-base font-semibold">Down Payment (₹)</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="160000"
                  className="mt-2 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="loanTenure" className="text-base font-semibold">Loan Tenure (months)</Label>
                <Input
                  id="loanTenure"
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  placeholder="60"
                  className="mt-2 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="interestRate" className="text-base font-semibold">Interest Rate (% per annum)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="9.5"
                  className="mt-2 text-lg"
                />
              </div>
            </div>

            <Button onClick={calculateEMI} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
              <Calculator className="mr-2 h-5 w-5" />
              Calculate EMI
            </Button>

            {result && (
              <div className="mt-8 space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-sm text-neutral-600 mb-2">Loan Amount</p>
                  <p className="text-3xl font-bold text-neutral-800">
                    {formatINR(parseFloat(carPrice) - parseFloat(downPayment))}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-500">
                  <p className="text-sm text-green-700 mb-2">Your Monthly EMI</p>
                  <p className="text-4xl font-bold text-green-700">{formatINR(result.emi)}</p>
                  <p className="text-xs text-green-600 mt-1">For {loanTenure} months</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-xs text-neutral-600 mb-1">Total Amount Payable</p>
                    <p className="text-xl font-bold text-neutral-800">{formatINR(result.totalAmount)}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-xs text-neutral-600 mb-1">Total Interest</p>
                    <p className="text-xl font-bold text-red-600">{formatINR(result.totalInterest)}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-900">
                      <strong>Note:</strong> This calculation is an estimate. Actual EMI and rates may vary based on your credit score, lender fees, and other factors.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {result && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Amortization Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>EMI</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.amortization.slice(0, 12).map((row) => (
                        <TableRow key={row.month}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell>{formatINR(row.payment)}</TableCell>
                          <TableCell>{formatINR(row.principal)}</TableCell>
                          <TableCell>{formatINR(row.interest)}</TableCell>
                          <TableCell>{formatINR(row.balance)}</TableCell>
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

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Car Loan Interest Rates in India (2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bank/NBFC</TableHead>
                      <TableHead>Interest Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>SBI Car Loan</TableCell>
                      <TableCell>8.70% - 9.70%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>HDFC Bank</TableCell>
                      <TableCell>8.75% - 10.50%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ICICI Bank</TableCell>
                      <TableCell>8.75% - 11.25%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Axis Bank</TableCell>
                      <TableCell>9.00% - 11.00%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Kotak Mahindra Bank</TableCell>
                      <TableCell>8.90% - 10.90%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bank of Baroda</TableCell>
                      <TableCell>9.15% - 10.50%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Car Loan Providers in India</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>State Bank of India (SBI)</strong> - Lowest rates, up to 90% funding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>HDFC Bank</strong> - Quick approval, flexible tenure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>ICICI Bank</strong> - Pre-approved loans, doorstep service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>Axis Bank</strong> - Competitive rates, minimal documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>Kotak Mahindra Bank</strong> - Fast processing, attractive offers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span><strong>Bajaj Finserv</strong> - Easy approval, flexible repayment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="guide" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guide">Complete Guide</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="guide">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Guide to Car Loans in India</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">What is a Car Loan?</h3>
                    <p className="text-sm text-gray-600">
                      A car loan is a secured loan provided by banks and NBFCs to help you purchase a new or used vehicle. 
                      The loan amount typically covers 80-90% of the on-road price, with the remaining paid as down payment. 
                      The vehicle serves as collateral until the loan is fully repaid.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">How is EMI Calculated?</h3>
                    <p className="text-sm text-gray-600">
                      EMI (Equated Monthly Installment) is calculated using the reducing balance method. The formula is: 
                      EMI = [P × R × (1+R)^N] / [(1+R)^N-1], where P is principal, R is monthly interest rate, and N is tenure in months. 
                      Each EMI consists of principal and interest components, with interest being higher initially.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Loan Tenure Options</h3>
                    <p className="text-sm text-gray-600">
                      Car loans in India typically range from 12 to 84 months (1-7 years). Shorter tenures mean higher EMIs but 
                      lower total interest. Longer tenures reduce EMI burden but increase overall cost. Most borrowers opt for 
                      3-5 years tenure for optimal balance.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Down Payment Requirements</h3>
                    <p className="text-sm text-gray-600">
                      Banks typically finance 80-90% of the on-road price, requiring 10-20% down payment. Higher down payment 
                      reduces loan amount, EMI, and total interest. Some banks offer 100% financing for select customers with 
                      excellent credit scores, though at higher interest rates.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Processing Fees & Charges</h3>
                    <p className="text-sm text-gray-600">
                      Processing fees range from 0.25% to 2% of loan amount (typically ₹2,000-₹10,000). Additional charges include 
                      documentation fees, prepayment charges (usually 2-5% if closed within first year), and late payment penalties. 
                      GST is applicable on all fees.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eligibility">
              <Card>
                <CardHeader>
                  <CardTitle>Car Loan Eligibility Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">For Salaried Individuals</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>Age: 21-65 years (at loan maturity)</li>
                        <li>Minimum monthly income: ₹25,000-₹30,000</li>
                        <li>Employment: Minimum 1-2 years work experience</li>
                        <li>Current employer: At least 6 months-1 year</li>
                        <li>CIBIL Score: 750+ for best rates (minimum 650)</li>
                        <li>Debt-to-Income ratio: EMI should not exceed 50% of monthly income</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">For Self-Employed Individuals</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>Age: 21-65 years (at loan maturity)</li>
                        <li>Minimum annual income: ₹3-4 lakhs</li>
                        <li>Business vintage: Minimum 2-3 years</li>
                        <li>ITR filing: Last 2-3 years returns required</li>
                        <li>CIBIL Score: 750+ preferred</li>
                        <li>Business stability: Consistent income proof needed</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Factors Affecting Eligibility</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>Credit score and repayment history</li>
                        <li>Monthly income and existing EMI obligations</li>
                        <li>Employment stability and company profile</li>
                        <li>Age and loan tenure requested</li>
                        <li>Down payment amount offered</li>
                        <li>Type of vehicle (new/used) and brand</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents Required for Car Loan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Identity & Address Proof</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>PAN Card (mandatory)</li>
                        <li>Aadhaar Card</li>
                        <li>Passport / Voter ID / Driving License</li>
                        <li>Utility bills (electricity, gas, telephone) for address proof</li>
                        <li>Passport size photographs</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Income Proof - Salaried</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>Last 3-6 months salary slips</li>
                        <li>Last 6 months bank statements</li>
                        <li>Form 16 or IT returns for last 2 years</li>
                        <li>Employment certificate / offer letter</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Income Proof - Self-Employed</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>ITR for last 2-3 years with computation</li>
                        <li>Audited financial statements (P&L, Balance Sheet)</li>
                        <li>Business proof (GST registration, shop license)</li>
                        <li>Last 6-12 months bank statements</li>
                        <li>Business continuity proof</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Vehicle Documents</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>Proforma invoice from dealer</li>
                        <li>Vehicle quotation with on-road price</li>
                        <li>For used cars: RC book, insurance, NOC from previous lender</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle>Tips to Get Best Car Loan Deal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Improve Your CIBIL Score:</strong> A score above 750 can get you 1-2% lower interest rates. 
                        Pay existing EMIs on time, clear credit card dues, and avoid multiple loan applications.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Compare Multiple Lenders:</strong> Interest rates vary by 1-3% across banks. Check at least 
                        3-4 banks and NBFCs. Consider processing fees, prepayment charges, and hidden costs.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Negotiate Interest Rates:</strong> If you have good credit score and relationship with bank, 
                        negotiate for lower rates. Existing customers often get 0.25-0.50% discount.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Increase Down Payment:</strong> Higher down payment (25-30%) reduces loan amount and may qualify 
                        you for better rates. It also reduces EMI burden and total interest paid.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Choose Optimal Tenure:</strong> Don't stretch tenure beyond 5 years. While longer tenure reduces 
                        EMI, it significantly increases total interest. Balance affordability with cost efficiency.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Consider Total Cost:</strong> Factor in insurance (₹15,000-50,000/year), maintenance, fuel, 
                        and parking. Your total car expenses should not exceed 15-20% of monthly income.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Read Fine Print:</strong> Check prepayment charges, foreclosure terms, and penalty clauses. 
                        Some banks allow part-prepayment without charges after 6-12 months.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Timing Matters:</strong> Apply during festive seasons (Diwali, year-end) when banks offer 
                        special rates and waive processing fees. Manufacturer schemes can also reduce effective cost.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Disclaimer:</strong> This calculator provides approximate EMI calculations for informational purposes only. 
              Actual loan terms, interest rates, and EMI may vary based on lender policies, your credit profile, and current market conditions. 
              Please consult with banks/NBFCs for accurate quotations.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions (FAQs)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. What is the minimum CIBIL score required for car loan?</h3>
                <p className="text-sm text-gray-600">
                  Most banks require a minimum CIBIL score of 650-700. However, a score of 750+ is recommended for best interest 
                  rates and quick approval. Scores below 650 may face rejection or higher rates.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Can I get 100% car loan financing?</h3>
                <p className="text-sm text-gray-600">
                  While most banks finance 80-90% of on-road price, some offer 100% financing to customers with excellent credit 
                  scores (750+) and stable income. However, interest rates may be 0.5-1% higher for 100% financing.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. What is the maximum loan tenure available?</h3>
                <p className="text-sm text-gray-600">
                  Car loans in India are available for up to 84 months (7 years). However, most banks recommend 3-5 years tenure. 
                  Longer tenures increase total interest significantly, making the car more expensive.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Are there any tax benefits on car loans?</h3>
                <p className="text-sm text-gray-600">
                  For personal use cars, there are no tax benefits. However, if the car is used for business purposes (self-employed), 
                  you can claim depreciation and interest as business expenses under Income Tax Act.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5. Can I prepay my car loan?</h3>
                <p className="text-sm text-gray-600">
                  Yes, most banks allow prepayment. However, prepayment charges (2-5% of outstanding principal) may apply if done 
                  within first 12 months. After 1 year, many banks allow part-prepayment without charges. Check your loan agreement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">6. What happens if I miss an EMI payment?</h3>
                <p className="text-sm text-gray-600">
                  Missing EMI payments attracts late payment charges (₹500-₹1,000) and negatively impacts your CIBIL score. 
                  Repeated defaults can lead to loan recall, vehicle repossession, and legal action. Always inform bank if facing difficulties.
                </p>
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
}
