"use client";

import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { uploadFile } from "@/services/files.service";
import {
  fundWallet,
  getUserBanks,
  getAllBanks,
  addBankAccount,
  resolveBankAccount,
  BankAccount,
  Bank,
} from "@/services/wallet.service";

export default function PaymentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [userBanks, setUserBanks] = useState<BankAccount[]>([]);
  const [allBanks, setAllBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);

  const [showBankModal, setShowBankModal] = useState(false);
  const [newBankNumber, setNewBankNumber] = useState("");
  const [newBankCode, setNewBankCode] = useState("");
  const [resolvedBankName, setResolvedBankName] = useState("");

  useEffect(() => {
    fetchBanks();
  }, []);

  async function fetchBanks() {
    try {
      const [myBanks, banks] = await Promise.all([
        getUserBanks(),
        getAllBanks(),
      ]);
      setUserBanks(myBanks);
      setAllBanks(banks);
      if (myBanks.length) setSelectedBank(myBanks[0]);
    } catch (err: any) {
      toast.error("Failed to load banks");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleAddBank = async () => {
    if (!newBankNumber || !newBankCode)
      return toast.error("Enter bank details");

    try {
      // Resolve NUBAN
      const resolved = await resolveBankAccount({
        account_number: newBankNumber,
        bank_code: newBankCode,
      });
      setResolvedBankName(resolved.account_name);

      // Add bank
      const bank = await addBankAccount({
        account_number: newBankNumber,
        bank_code: newBankCode,
      });
      toast.success("Bank added successfully!");
      setShowBankModal(false);
      fetchBanks();
    } catch (err: any) {
      toast.error(err.message || "Failed to add bank");
    }
  };

  const handleSubmit = async () => {
    if (!file) return toast.error("Please upload proof of payment");
    if (!selectedBank) return toast.error("Please select a bank");

    setLoading(true);
    try {
      const fileData = await uploadFile(file);
      toast.success("File uploaded successfully!");

      await fundWallet({ amount: 44800.9, payment_method: "bank_transfer" });
      toast.success("Repayment submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <div className="bg-white border border-[#CCEAE9] rounded-2xl p-10 max-w-xl w-full mx-auto mt-8 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-[#001B2E]">
            Repay Your Loan
          </h2>
          <button className="text-[#019893] text-base font-medium hover:underline">
            Repayment History
          </button>
        </div>

        {/* Loan info */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Outstanding Amount</span>
            <span className="font-bold text-lg text-[#001B2E]">₦44,800.90</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Due Date</span>
            <span className="text-[#001B2E]">15 June 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Loan ID</span>
            <span className="text-[#001B2E]">LN-5520198</span>
          </div>
        </div>

        {/* Bank selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select Bank
          </label>
          <div className="flex gap-2">
            {userBanks.length ? (
              <select
                className="border rounded-lg p-2 w-full"
                value={selectedBank?.id || ""}
                onChange={(e) => {
                  const bank = userBanks.find((b) => b.id === e.target.value);
                  setSelectedBank(bank || null);
                }}
              >
                {userBanks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.account_name} - {bank.account_number}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-gray-500">No linked banks</span>
            )}
            <button
              className="bg-[#019893] text-white px-3 rounded-lg"
              onClick={() => setShowBankModal(true)}
            >
              Add Bank
            </button>
          </div>
        </div>

        {/* Upload proof of payment */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Proof of Payment
          </label>
          <div className="flex gap-3 items-center">
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-[#CCEAE9] rounded-lg w-40 h-20 bg-[#F6F8FA] cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-xs text-gray-400 mt-1">Upload Area</span>
            </div>
            <button
              className="bg-[#012638] text-white px-4 py-2 rounded-lg font-medium text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
          {file && <div className="mt-2 text-sm">{file.name}</div>}
        </div>

        <button
          className="w-full bg-[#012638] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#019893] transition-colors"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Repayment"}
        </button>
      </div>

      {/* 🌟 Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add New Bank</h3>

            <div className="mb-3">
              <label className="block text-gray-600 mb-1">Select Bank</label>
              <select
                className="border rounded-lg p-2 w-full"
                value={newBankCode}
                onChange={(e) => setNewBankCode(e.target.value)}
              >
                <option value="">-- Select Bank --</option>
                {allBanks.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-gray-600 mb-1">Account Number</label>
              <input
                type="text"
                className="border rounded-lg p-2 w-full"
                value={newBankNumber}
                onChange={(e) => setNewBankNumber(e.target.value)}
              />
            </div>

            {resolvedBankName && (
              <div className="mb-3 text-green-600">
                Account Name: {resolvedBankName}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border"
                onClick={() => setShowBankModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#019893] text-white"
                onClick={handleAddBank}
              >
                Add Bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
