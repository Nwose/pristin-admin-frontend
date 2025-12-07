"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLoanApplicationById } from "@/services/loan_application.service";
import { Loader2, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { makeRequest } from "@/services/base";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoanDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [penaltyReason, setPenaltyReason] = useState("");
  const [penaltyLoading, setPenaltyLoading] = useState(false);

  const fetchLoan = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getLoanApplicationById(id as string);
      setLoan(data);
    } catch (err: any) {
      console.error("❌ Failed to load loan details:", err);
      setError(err.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoan();
  }, [id]);

  // ✅ Custom error handler to extract readable messages
  const handleError = (err: any, fallbackMsg: string) => {
    let message = fallbackMsg;

    try {
      if (err.message?.startsWith("HTTP")) {
        const jsonPart = err.message.replace(/^HTTP \d+: /, "");
        const parsed = JSON.parse(jsonPart);

        if (parsed.detail) {
          message = parsed.detail;
        } else {
          // If error object has field-level errors
          message = Object.entries(parsed)
            .map(([key, val]) => `${key}: ${(val as string[]).join(", ")}`)
            .join("\n");
        }
      }
    } catch {
      // do nothing, keep fallback message
    }

    toast.error(message);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading loan details...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error}
      </div>
    );

  if (!loan)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        No loan found
      </div>
    );

  // ✅ Approve Loan
  const handleApprove = async () => {
    try {
      await makeRequest(`loan-application/${loan.id}/approve/`, "POST");
      toast.success("✅ Loan approved successfully!");
      await fetchLoan();
    } catch (err: any) {
      handleError(err, "Failed to approve loan");
    }
  };

  // ✅ Reject Loan
  const handleReject = async () => {
    try {
      await makeRequest(`loan-application/${loan.id}/reject/`, "POST");
      toast.success("🚫 Loan rejected successfully!");
      await fetchLoan();
    } catch (err: any) {
      handleError(err, "Failed to reject loan");
    }
  };

  // ✅ Add Penalty
  const handleAddPenalty = async () => {
    setPenaltyLoading(true);
    try {
      await makeRequest(`loan/${loan.id}/add_penalty/`, "POST", {
        amount: Number(penaltyAmount),
        reason: penaltyReason,
      });
      toast.success("⚠️ Penalty added successfully!");
      setShowPenaltyModal(false);
      setPenaltyAmount("");
      setPenaltyReason("");
      await fetchLoan();
    } catch (err: any) {
      handleError(err, "Failed to add penalty");
    } finally {
      setPenaltyLoading(false);
    }
  };

  // 💡 Repayment breakdown
  const principal = Number(loan.amount_requested || loan.amount || 0);
  const interestRate = loan.product?.interest_rate || 0;
  const interest = principal * interestRate;
  const total = principal + interest;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-300";
      case "disbursed":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#CCEAE9]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#001B2E]">
              Loan Details
            </h2>
            <button
              onClick={() => router.back()}
              className="text-[#019893] hover:text-[#017e79] text-sm font-medium"
            >
              ← Back
            </button>
          </div>

          {/* User Info */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-gray-700 mb-1">User Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-gray-700">
                <strong>Name:</strong>{" "}
                {loan.user
                  ? `${loan.user.first_name || ""} ${loan.user.last_name || ""}`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {loan.user?.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Loan Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <p className="text-gray-500 text-sm">Loan Product</p>
              <p className="font-semibold">{loan.product?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Amount Requested</p>
              <p className="font-semibold">
                ₦{principal.toLocaleString("en-NG")}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tenure (months)</p>
              <p className="font-semibold">
                {loan.tenure_months || loan.tenure || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Interest Rate</p>
              <p className="font-semibold">
                {interestRate ? `${(interestRate * 100).toFixed(2)}%` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <span
                className={`px-2 rounded-full text-sm font-medium ${getStatusColor(
                  loan.status
                )}`}
              >
                {loan.status || "Unknown"}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Date Applied</p>
              <p className="font-semibold">
                {loan.created_at
                  ? new Date(loan.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Purpose */}
          {loan.purpose && (
            <div className="mt-6">
              <p className="text-gray-500 text-sm mb-1">Purpose</p>
              <p className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700">
                {loan.purpose}
              </p>
            </div>
          )}

          {/* 💰 Repayment Breakdown */}
          <div className="mt-8 bg-[#F9FAFB] p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Repayment Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Principal</p>
                <p className="text-lg font-semibold text-gray-800">
                  ₦{principal.toLocaleString("en-NG")}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Interest</p>
                <p className="text-lg font-semibold text-gray-800">
                  ₦{interest.toLocaleString("en-NG")}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Total Repayment</p>
                <p className="text-lg font-semibold text-[#019893]">
                  ₦{(total || 0).toLocaleString("en-NG")}
                </p>
              </div>
            </div>

            {/* 📜 Penalty List */}
            {loan.penalties?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  Penalties
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 text-sm text-gray-700 bg-white rounded-lg">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Reason</th>
                        <th className="px-4 py-2 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loan.penalties.map((p: any, i: number) => (
                        <tr
                          key={i}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-2">₦{p.amount}</td>
                          <td className="px-4 py-2">{p.reason}</td>
                          <td className="px-4 py-2">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Reject
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Disburse
            </button>
            <button
              onClick={() => setShowPenaltyModal(true)}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Add Penalty
            </button>
          </div>
        </div>
      </div>

      {showPenaltyModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowPenaltyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add Penalty
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Penalty Amount (₦)
                </label>
                <input
                  type="number"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#019893]"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Reason
                </label>
                <textarea
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#019893]"
                  placeholder="Enter reason for penalty"
                  rows={3}
                ></textarea>
              </div>

              <button
                onClick={handleAddPenalty}
                disabled={penaltyLoading}
                className="w-full bg-[#019893] hover:bg-[#017e79] text-white rounded-lg py-2 font-medium mt-2"
              >
                {penaltyLoading ? "Adding..." : "Add Penalty"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
