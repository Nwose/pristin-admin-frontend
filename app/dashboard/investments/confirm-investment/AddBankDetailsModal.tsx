"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { makeRequest } from "@/services/base";

interface AddBankDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBankDetailsModal({
  isOpen,
  onClose,
}: AddBankDetailsModalProps) {
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    branch: "",
  });

  const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // ✅ Fetch banks using makeRequest
  useEffect(() => {
    if (isOpen) {
      const fetchBanks = async () => {
        try {
          const data = await makeRequest(
            "/api/v1/bank_account/get_banks/",
            "GET"
          );
          setBanks(data || []);
        } catch (error) {
          console.error("❌ Failed to load banks:", error);
        }
      };
      fetchBanks();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Verify NUBAN account
  const verifyAccount = async () => {
    if (!formData.accountNumber || !formData.bankName) return;
    setVerifying(true);
    try {
      const data = await makeRequest(
        "/api/v1/bank_account/resolve_nuban/",
        "POST",
        {
          account_number: formData.accountNumber,
          bank_code: formData.bankName,
        }
      );
      setFormData((prev) => ({
        ...prev,
        accountHolderName: data.account_name || prev.accountHolderName,
      }));
      console.log("✅ Account verified:", data);
    } catch (error) {
      console.error("❌ Failed to verify account:", error);
    } finally {
      setVerifying(false);
    }
  };

  // ✅ Submit and add bank details
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        account_name: formData.accountHolderName,
        account_number: formData.accountNumber,
        bank_name: formData.bankName,
        branch: formData.branch,
      };
      const data = await makeRequest(
        "/api/v1/bank_account/add_bank_account/",
        "POST",
        payload
      );
      console.log("✅ Bank added successfully:", data);
      onClose();
    } catch (error) {
      console.error("❌ Failed to add bank:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft />
        </button>

        {/* Header */}
        <div className="text-center mb-6 mt-2">
          <Building2 className="mx-auto text-blue-600 mb-2" size={28} />
          <h2 className="text-lg font-semibold text-gray-800">
            Add Bank Details
          </h2>
          <p className="text-gray-500 text-sm">
            Securely add your bank account to receive your loan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Holder Name
            </label>
            <input
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              onBlur={verifyAccount}
              placeholder="Enter account number"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {verifying && (
              <p className="text-xs text-blue-600 mt-1">Verifying account...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <select
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Bank</option>
              {banks.map((bank, index) => (
                <option key={index} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Branch (Optional)
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="Enter branch name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A2533] text-white py-2 rounded-md hover:bg-[#133a50] transition-all disabled:opacity-50"
          >
            {loading ? "Adding..." : "+ Add Bank Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
