"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getWalletTransactions,
  getUserWallets,
} from "@/services/wallet.service";
import { toast } from "react-toastify";

export default function TransactionHistoryPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [walletData, txns] = await Promise.all([
        getUserWallets(),
        getWalletTransactions(),
      ]);
      setWallet(walletData);
      setTransactions(txns);
    } catch {
      toast.error("Failed to load transactions");
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Section */}
      <div className="bg-white rounded-lg border border-[#CCEAE9] p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-gray-500 text-sm mb-1">Wallet Balance</div>
          <div className="text-2xl font-bold text-[#001B2E]">
            ₦{wallet?.balance?.toLocaleString() ?? "0.00"}
          </div>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => router.push("/dashboard/wallet")}
            className="px-6 py-2 rounded bg-[#001B2E] text-white font-medium hover:bg-[#019893]"
          >
            Fund Wallet
          </button>
          <button className="px-6 py-2 rounded bg-[#CCEAE9] text-[#001B2E] font-medium hover:bg-[#019893] hover:text-white">
            Withdraw
          </button>
        </div>
      </div>

      {/* Transaction History Card */}
      <div className="bg-white rounded-2xl border border-[#CCEAE9] p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#001B2E] mb-4">
          Transaction History
        </h2>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-400">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#CCEAE9] bg-[#F6F8FA] text-gray-600 text-sm">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#E5ECEC] hover:bg-[#F9FBFB]"
                  >
                    <td className="py-3 px-4">{txn.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`${
                          txn.type === "Credit"
                            ? "text-green-600 bg-green-50"
                            : "text-red-600 bg-red-50"
                        } px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{txn.description}</td>
                    <td className="py-3 px-4 font-medium">{txn.amount}</td>
                    <td className="py-3 px-4 text-[#019893] font-semibold">
                      {txn.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push("/dashboard/wallet")}
          className="px-6 py-2 rounded-lg bg-[#CCEAE9] text-[#001B2E] font-medium hover:bg-[#019893] hover:text-white transition-colors"
        >
          ← Back to Wallet
        </button>
      </div>
    </div>
  );
}
