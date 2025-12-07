"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { send } from "@/services/base";

interface LoanDetailsActions {
  loanId: string;
  token: string;
  refreshData: () => void; // callback to reload loan details
}

const LoanDetailsActions: React.FC<LoanDetailsActions> = ({
  loanId,
  token,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);

  // ✅ Approve or reject loan
  const handleApproveReject = async () => {
    const action = prompt("Type 'approve' to approve or 'reject' to reject:");
    if (!action || !["approve", "reject"].includes(action.toLowerCase())) {
      toast.error("Invalid action");
      return;
    }

    setLoading(true);
    try {
      const res = await send(
        "POST",
        `loan/${action.toLowerCase()}/${loanId}/`, // backend endpoint
        undefined,
        token
      );

      if (res.ok) {
        toast.success(`Loan ${action.toLowerCase()}d successfully!`);
        refreshData();
      } else {
        const data = await res.json();
        toast.error(data?.message || `Failed to ${action.toLowerCase()} loan`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error processing loan action");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Disburse loan
  const handleDisburse = () => {
    toast.info("Use the Disbursement Queue below to disburse the loan.");
    // Disbursement happens through DisbursementQueue component
  };

  // ✅ Add penalty
  const handleAddPenalty = async () => {
    const amount = prompt("Enter penalty amount:");
    if (!amount || isNaN(Number(amount))) {
      toast.error("Invalid penalty amount");
      return;
    }

    setLoading(true);
    try {
      const res = await send(
        "POST",
        `loan/add_penalty/${loanId}/`, // backend endpoint
        { amount: Number(amount) },
        token
      );

      if (res.ok) {
        toast.success("Penalty added successfully!");
        refreshData();
      } else {
        const data = await res.json();
        toast.error(data?.message || "Failed to add penalty");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error adding penalty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={handleApproveReject}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition"
      >
        Approve/Reject
      </button>
      <button
        onClick={handleDisburse}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-md transition"
      >
        Disburse
      </button>
      <button
        onClick={handleAddPenalty}
        disabled={loading}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-md transition"
      >
        Add Penalty
      </button>
    </div>
  );
};

export default LoanDetailsActions;
