"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { makeRequest } from "@/services/base";
import { toast } from "react-toastify";

interface LoanApplication {
  id: string;
  purpose: string;
  amount: string;
  created_at: string;
  status: string;
}

interface LoanSummary {
  balance: string;
  debt: string;
  pending: string;
}

export default function LoansPage() {
  const [loanHistory, setLoanHistory] = useState<LoanApplication[]>([]);
  const [summary, setSummary] = useState<LoanSummary>({
    balance: "0.00",
    debt: "0.00",
    pending: "0.00",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);

      // Fetch all loan applications
      const loanApps = await makeRequest<LoanApplication[]>(
        "loan-application/",
        "GET"
      );

      // Optionally fetch loan summary
      const loanSummary = await makeRequest<any>("loan/", "GET").catch(
        () => null
      );

      setLoanHistory(loanApps || []);

      if (loanSummary) {
        setSummary({
          balance: loanSummary?.balance ?? "0.00",
          debt: loanSummary?.debt ?? "0.00",
          pending: loanSummary?.pending ?? "0.00",
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to fetch loans:", error.message);
      toast.error("Failed to load loan data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-yellow-500";
      case "rejected":
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Left: Loan Summary and Actions */}
      <div className="flex-1 max-w-xl">
        <div className="bg-white rounded-2xl border border-[#CCEAE9] p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none select-none">
            <svg width="220" height="120" viewBox="0 0 220 120" fill="none">
              <rect
                x="30"
                y="30"
                width="160"
                height="60"
                rx="10"
                fill="#CCEAE9"
              />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="text-gray-400 text-lg mb-2">
              Current Loan Balance
            </div>
            <div className="text-3xl font-bold text-[#001B2E] mb-6">
              ₦{summary.balance}
            </div>
            <div className="text-gray-400 text-lg mb-2">Loan Debt</div>
            <div className="text-2xl font-bold text-[#001B2E] mb-6">
              ₦{summary.debt}
            </div>
            <div className="text-gray-400 text-lg mb-2">Pending Loan</div>
            <div className="text-2xl font-bold text-[#001B2E] mb-6">
              ₦{summary.pending}
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/admin/loans/request")}
          className="w-full bg-[#444] text-white py-3 rounded-lg font-semibold text-lg mb-2"
        >
          Request for Loan
        </button>
        <div className="text-center text-gray-400 text-xs mb-4">
          Please add your Business Details before you request for loan
        </div>
        <button
          onClick={() => router.push("/admin/business/add")}
          className="w-full bg-[#012638] text-white py-3 rounded-lg font-semibold text-lg"
        >
          Add your Business Details
        </button>
      </div>

      {/* Right: Loan History */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold text-[#001B2E]">
            Loan History
          </div>
          <button className="text-[#019893] text-base font-medium hover:underline">
            See All
          </button>
        </div>

        {loading ? (
          <div className="text-gray-500 text-center py-6">Loading...</div>
        ) : loanHistory.length === 0 ? (
          <div className="text-gray-400 text-center py-6">
            No loan records found.
          </div>
        ) : (
          <div className="space-y-4">
            {loanHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white border border-[#CCEAE9] rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1CC5AE] flex items-center justify-center">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#fff" />
                      <path
                        d="M12 8v4l3 2"
                        stroke="#019893"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[#001B2E] font-medium text-base">
                      {item.purpose || "Loan Purpose"}
                    </div>
                    <div className="text-[#019893] font-bold text-lg">
                      ₦{item.amount}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                </div>
                <div
                  className={`font-semibold text-base capitalize ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
