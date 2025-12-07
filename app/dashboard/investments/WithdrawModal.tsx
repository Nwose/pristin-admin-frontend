"use client";

import { useEffect, useState } from "react";
import { X, Wallet } from "lucide-react";
import { makeRequest } from "@/services/base";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Fetch user banks when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserBanks();
    }
  }, [isOpen]);

  const fetchUserBanks = async () => {
    try {
      const res = await makeRequest("/api/v1/bank_account/my_banks/", "GET");
      if (res && res.length > 0) {
        setBanks(res);
        setSelectedBank(res[0].account_number); // default select
      }
    } catch (error) {
      console.error("Failed to fetch banks", error);
    }
  };

  const handleWithdraw = async (type: "partial" | "full") => {
    if (!amount && type === "partial") return alert("Please enter an amount");

    setLoading(true);
    try {
      const payload =
        type === "full"
          ? { bank_account: selectedBank, type: "full" }
          : { bank_account: selectedBank, amount, type: "partial" };

      // Example endpoint — replace with real withdrawal endpoint once confirmed
      const res = await makeRequest("/api/v1/wallets/fund/", "POST", payload);

      console.log(
        `${type === "full" ? "Full" : "Partial"} withdrawal response:`,
        res
      );
      alert("Withdrawal request submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Withdrawal error", error);
      alert("Failed to submit withdrawal request.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white w-[92%] max-w-md rounded-xl shadow-lg p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-6 h-6 text-[#012638]" />
          <h2 className="text-lg font-semibold text-[#012638]">
            Withdraw Funds
          </h2>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Select Bank */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Bank Account
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            >
              {banks.length > 0 ? (
                banks.map((bank) => (
                  <option key={bank.id} value={bank.account_number}>
                    {bank.bank_name} - {bank.account_number}
                  </option>
                ))
              ) : (
                <option disabled>No bank accounts found</option>
              )}
            </select>
          </div>

          {/* Withdrawal Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Withdrawal Amount (₦)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 200,000"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="flex-1 bg-[#012638] text-white py-2 rounded-md hover:bg-[#019893] transition disabled:opacity-50"
              disabled={loading}
              onClick={() => handleWithdraw("partial")}
            >
              {loading ? "Processing..." : "Withdraw Partial"}
            </button>

            <button
              type="button"
              className="flex-1 bg-[#012638] text-white py-2 rounded-md hover:bg-[#019893] transition disabled:opacity-50"
              disabled={loading}
              onClick={() => handleWithdraw("full")}
            >
              {loading ? "Processing..." : "Withdraw Full"}
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 mt-2">
            Withdrawals can be made only after the investment lock-in period.
            Processing may take up to 2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
