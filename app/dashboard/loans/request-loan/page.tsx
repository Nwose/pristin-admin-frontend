"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestLoanAmountPage() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate loan details
  const amount = parseFloat(loanAmount) || 0;
  const months = parseInt(tenure) || 6;
  const interestRate = amount * 0.1; // 10% interest
  const monthlyInstallment = months > 0 ? (amount + interestRate) / months : 0;

  const handleNext = async () => {
    if (!loanAmount || !tenure || !purpose) {
      alert("Please fill in all fields.");
      return;
    }

    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!accessToken) {
      alert("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        amount: amount,
        tenure: months,
        purpose: purpose,
      };

      console.log("📤 Sending loan application:", payload);

      const res = await fetch("/api/v1/loan-application/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Raw response:", res);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Error response:", errorText);
        throw new Error("Failed to submit loan application");
      }

      const data = await res.json();
      console.log("✅ Loan application created:", data);

      // Save locally for summary page
      const loanData = {
        amount,
        tenure: months,
        purpose,
        monthlyInstallment,
        interestRate,
        repaymentAmount: amount + interestRate,
        backendResponse: data,
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("loanData", JSON.stringify(loanData));
      }

      // Navigate to summary page
      router.push("/dashboard/loans/request-loan/summary");
    } catch (error) {
      console.error("⚠️ Loan request failed:", error);
      alert("Unable to process loan request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = loanAmount !== "" && tenure !== "" && purpose !== "";

  return (
    <div className="min-h-screen max-7-xl bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 gap-4">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
                1
              </div>
              <span className="text-gray-900 font-medium">Amount</span>
            </div>
          </div>
          <div className="w-24 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
                2
              </div>
              <span className="text-gray-500 font-medium">Summary</span>
            </div>
          </div>
          <div className="w-24 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
                3
              </div>
              <span className="text-gray-500 font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Loan Amount
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter amount in ₦"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Tenure (months)
                </label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Purpose
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Type your Purpose here"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <div className="bg-[#001B2E] rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-6">Loan Calculator</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Repayment Amount</span>
                  <span className="font-semibold">
                    ₦{(amount + interestRate).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Tenure</span>
                  <span className="font-semibold">{months} Months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Interest Rate</span>
                  <span className="font-semibold">
                    ₦{interestRate.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#C7E9E8] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Auto Credit Scoring
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">📋</span>
                  <span>KYC Status: Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">💰</span>
                  <span>Deposit History: Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">🔄</span>
                  <span>Prior Loans: 2</span>
                </div>
                <div className="mt-4 pt-4 border-t border-teal-700">
                  <span className="font-semibold text-gray-900">
                    Eligibility:{" "}
                  </span>
                  <span className="text-gray-700">Preliminary Qualified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isFormValid || loading}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#001B2E] text-white hover:bg-[#003049]"
            }`}
          >
            {loading ? "Submitting..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
