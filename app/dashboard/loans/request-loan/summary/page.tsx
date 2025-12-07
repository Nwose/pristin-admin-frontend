"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// ✅ Tailwind-only replacements for Button & Card
const Card = ({ children, className = "" }: any) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
}: any) => {
  const base =
    "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none";
  const styles =
    variant === "outline"
      ? "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-800"
      : "bg-[#001B2E] text-white hover:bg-[#003049]";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

// ✅ Main Page Component
export default function LoanSummaryPage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col items-center justify-start px-8 py-6 bg-gray-50 min-h-screen"
    >
      {/* Progress Steps */}
      <div className="w-full max-w-5xl flex items-center justify-start mb-8">
        <div className="flex items-center space-x-4">
          {/* Step 1 */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#001B2E] text-white flex items-center justify-center font-medium">
              1
            </div>
            <span className="text-gray-600 text-sm">Amount</span>
          </div>
          <div className="h-[2px] w-12 bg-[#001B2E]/30"></div>

          {/* Step 2 */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#009688] text-white flex items-center justify-center font-medium">
              2
            </div>
            <span className="font-semibold text-[#009688] text-sm">
              Summary
            </span>
          </div>
          <div className="h-[2px] w-12 bg-gray-300"></div>

          {/* Step 3 */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center font-medium">
              3
            </div>
            <span className="text-sm text-gray-500">Confirm</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl grid md:grid-cols-3 gap-6">
        {/* Left Side - Loan Summary */}
        <Card className="col-span-2">
          <CardContent>
            <h2 className="text-lg font-semibold mb-6 text-gray-900">
              Loan Summary
            </h2>

            <div className="grid grid-cols-2 gap-y-5 text-sm sm:text-base">
              <div className="text-gray-600">Service Fee</div>
              <div className="font-medium">₦800</div>

              <div className="text-gray-600">Repayment</div>
              <div className="font-medium text-[#009688]">&lt; 90 days</div>

              <div className="text-gray-600">Interest</div>
              <div className="font-medium">₦2,240</div>

              <div className="text-gray-600">Total Amount Due</div>
              <div className="font-semibold text-lg text-[#001B2E]">
                ₦44,800.90
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Loan Calculator + Scoring */}
        <div className="flex flex-col space-y-4">
          {/* Loan Calculator */}
          <Card className="bg-[#001B2E] text-white">
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Loan Calculator</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Repayment Amount</span>
                  <span className="font-medium">₦500,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Installment</span>
                  <span className="font-medium">6 Months</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate</span>
                  <span className="font-medium">₦50,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto Credit Scoring */}
          <Card className="bg-[#C7E9E8]">
            <CardContent>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Auto Credit Scoring
              </h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>💳 KYC Status: Verified</p>
                <p>🏦 Deposit History: Good</p>
                <p>📄 Prior Loans: 2</p>
              </div>
              <div className="mt-3 text-sm">
                <span className="font-semibold">Eligibility:</span>{" "}
                <span className="text-[#009688] font-medium">
                  Preliminary Qualified
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="w-full max-w-5xl flex justify-end mt-10 space-x-3">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button
          onClick={() => router.push("/dashboard/loans/request-loan/confirm")}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
