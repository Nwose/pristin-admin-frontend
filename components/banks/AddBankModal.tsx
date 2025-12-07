"use client";
import { useState, useEffect } from "react";
import { useBankStore } from "@/lib/api/stores/useBankStore";
import BankService from "@/lib/api/services/Bank.Service";

interface AddBankModalProps {
  setShowAddBankModal: (show: boolean) => void;
  onBankAdded?: () => void;
}

export default function AddBankModal({ setShowAddBankModal, onBankAdded }: AddBankModalProps) {
  const { supportedBanks: allBanks, loading: banksLoading } = useBankStore();
  const [newBankCode, setNewBankCode] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [addingBank, setAddingBank] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [resolutionError, setResolutionError] = useState<string | null>(null);

  // Resolve NUBAN when account number is 10 digits and bank is selected
  useEffect(() => {
    const resolveAccount = async () => {
      if (newAccountNumber.length === 10 && newBankCode) {
        setResolving(true);
        setAccountName(null);
        setResolutionError(null);

        try {
          const result = await BankService.resolveNuban({
            bank_code: newBankCode,
            account_number: newAccountNumber,
          });
          setAccountName(result.account_name);
        } catch (err: any) {
          setResolutionError(
            err?.response?.data?.message || 
            "Unable to verify account details. Please check the account number and try again."
          );
        } finally {
          setResolving(false);
        }
      } else {
        setAccountName(null);
        setResolutionError(null);
      }
    };

    const timeoutId = setTimeout(resolveAccount, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [newAccountNumber, newBankCode]);

  const handleAddBank = async () => {
    if (!newBankCode || !newAccountNumber || !accountName) return;
    setAddingBank(true);
    try {
      await BankService.addBank({
        bank_code: newBankCode,
        account_number: newAccountNumber,
      });
      setShowAddBankModal(false);
      onBankAdded?.();
    } catch (err) {
      console.error("Failed to add bank:", err);
    } finally {
      setAddingBank(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={() => setShowAddBankModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Bank Account</h2>
        
        <div className="mb-4">
          <label className="block text-gray-500 text-sm mb-2">Bank</label>
          <select
            value={newBankCode}
            onChange={(e) => setNewBankCode(e.target.value)}
            disabled={banksLoading}
            className="w-full border border-[#CCEAE9] rounded-lg px-3 py-2 bg-[#F6F8FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#CCEAE9]"
          >
            <option value="">Select a bank</option>
            {allBanks.map((bank) => (
              <option key={bank.bank_code} value={bank.bank_code}>
                {bank.bank_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-gray-500 text-sm mb-2">
            Account Number
          </label>
          <input
            type="text"
            value={newAccountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setNewAccountNumber(value);
            }}
            placeholder="Enter 10-digit account number"
            maxLength={10}
            className="w-full border border-[#CCEAE9] rounded-lg px-3 py-2 bg-[#F6F8FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#CCEAE9]"
          />
        </div>

        {/* Account Name Display */}
        {resolving && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span>Verifying account...</span>
          </div>
        )}

        {accountName && !resolving && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Account Name</p>
            <p className="text-sm font-semibold text-green-800">{accountName}</p>
          </div>
        )}

        {resolutionError && !resolving && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">{resolutionError}</p>
          </div>
        )}

        <button
          onClick={handleAddBank}
          disabled={addingBank || !accountName || resolving}
          className="w-full bg-[#012638] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#019893] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {addingBank ? "Adding..." : "Add Bank"}
        </button>
      </div>
    </div>
  );
}