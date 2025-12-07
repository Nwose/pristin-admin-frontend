"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { makeRequest } from "@/services/base";

export default function InvestmentPage() {
  const [amount, setAmount] = useState<number>(0);
  const [interest, setInterest] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
  });

  // Fetch wallet balance when page loads
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await makeRequest(
          "/api/v1/wallets/get_user_wallets/",
          "GET"
        );
        if (res && res.length > 0) {
          // Assuming API returns an array of wallets
          setWalletBalance(res[0].balance || 0);
        }
      } catch (error) {
        console.error("Failed to fetch wallet", error);
      }
    };
    fetchWallet();
  }, []);

  const calculateInterest = () => {
    const rate = 8; // %
    const tenure = 12; // months
    const result = (amount * rate * tenure) / (12 * 100);
    setInterest(result);
  };

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        account_name: bankDetails.account_name,
        account_number: bankDetails.account_number,
        bank_name: bankDetails.bank_name,
        branch: bankDetails.branch,
      };
      const res = await makeRequest(
        "/api/v1/bank_account/add_bank_account/",
        "POST",
        payload
      );
      console.log("Bank added successfully:", res);
      alert("✅ Bank details added successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to add bank account", error);
      alert("❌ Failed to add bank account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative p-6 space-y-8">
      {/* Invest in Growth Bond Alpha */}
      <section className="bg-white shadow-sm rounded-md p-6 border border-gray-100 max-w-4xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Invest in Growth Bond Alpha
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Amount
            </label>
            <input
              type="number"
              placeholder="500"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              <span className="text-gray-700">
                <Wallet className="inline-block w-4 h-4 mr-2" />
                Wallet Balance:
              </span>{" "}
              <span className="font-semibold text-[#03B5EC]">
                ₦{walletBalance.toLocaleString("en-NG")}
              </span>
            </span>
            <button
              className="text-[#03B5EC] hover:underline"
              onClick={() => alert("Redirecting to wallet funding page...")}
            >
              Fund Wallet
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#001F3F] text-white px-5 py-2 rounded-md hover:bg-[#002b58] transition"
            >
              Confirm Investment
            </button>
            {walletBalance < amount && amount > 0 ? (
              <p className="text-sm text-red-500">Insufficient wallet funds</p>
            ) : (
              <p className="text-sm text-green-600">Sufficient funds</p>
            )}
          </div>
        </div>
      </section>

      {/* Interest Calculator */}
      <section className="bg-white shadow-sm rounded-md p-6 border border-gray-100 max-w-7xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Interest Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Amount ₦
            </label>
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="800,000"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rate (%)
            </label>
            <input
              type="number"
              value={8}
              disabled
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tenure (months)
            </label>
            <input
              type="number"
              value={12}
              disabled
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={calculateInterest}
              className="bg-[#001F3F] text-white w-full py-2 rounded-md hover:bg-[#002b58] transition"
            >
              Calculate
            </button>
          </div>
        </div>

        {interest !== null && (
          <div className="border-t pt-4 text-gray-700 flex justify-between items-center">
            <p className="text-xl font-semibold">
              ₦{interest.toLocaleString("en-NG")}
            </p>
            <p className="text-sm text-gray-500">
              on ₦{amount.toLocaleString("en-NG")} for 12 months @ 8%
            </p>
          </div>
        )}
      </section>

      {/* Add Bank Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 relative">
            {/* Back Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft />
            </button>

            {/* Header */}
            <div className="text-center mb-6 mt-2">
              <CreditCard className="mx-auto text-blue-600 mb-2" size={28} />
              <h2 className="text-lg font-semibold text-gray-800">
                Add Bank Details
              </h2>
              <p className="text-gray-500 text-sm">
                Securely add your bank account to receive your loan
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAddBank} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={bankDetails.account_name}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      account_name: e.target.value,
                    })
                  }
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
                  placeholder="Enter account number"
                  value={bankDetails.account_number}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      account_number: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="Enter bank name"
                  value={bankDetails.bank_name}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      bank_name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Branch (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter branch name"
                  value={bankDetails.branch}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, branch: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#001F3F] text-white py-2 rounded-md hover:bg-[#002b58] transition disabled:opacity-50"
              >
                {loading ? "Adding..." : "+ Add Bank Details"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
