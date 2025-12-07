"use client";
import { useState, useEffect } from "react";
import { useBankStore } from "@/lib/api/stores/useBankStore";
import BankService from "@/lib/api/services/Bank.Service";
import KYCService from "@/lib/api/services/KYC.Service";
import { toast } from "react-toastify";
import { Check, AlertCircle, Loader2 } from "lucide-react";

interface KYCModalProps {
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function KYCModal({ onSuccess, onClose }: KYCModalProps) {
    const { supportedBanks, loading: banksLoading } = useBankStore();
    const [bvn, setBvn] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // NUBAN Resolution State
    const [resolving, setResolving] = useState(false);
    const [accountName, setAccountName] = useState<string | null>(null);
    const [resolutionError, setResolutionError] = useState<string | null>(null);

    // Auto-resolve NUBAN when account number is 10 digits and bank is selected
    useEffect(() => {
        const resolveAccount = async () => {
            if (accountNumber.length === 10 && selectedBank) {
                setResolving(true);
                setAccountName(null);
                setResolutionError(null);

                try {
                    const result = await BankService.resolveNuban({
                        bank_code: selectedBank,
                        account_number: accountNumber,
                    });
                    setAccountName(result.account_name);
                    toast.success("Account verified!");
                } catch (err: any) {
                    const errorMsg = err?.response?.data?.message || "Unable to verify account. Please check details.";
                    setResolutionError(errorMsg);
                    toast.error(errorMsg);
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
    }, [accountNumber, selectedBank]);

    const handleBvnChange = (value: string) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 11);
        setBvn(cleaned);
    };

    const handleAccountNumberChange = (value: string) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 10);
        setAccountNumber(cleaned);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (bvn.length !== 11) {
            toast.error("BVN must be 11 digits");
            return;
        }

        if (accountNumber.length !== 10) {
            toast.error("Account number must be 10 digits");
            return;
        }

        if (!selectedBank) {
            toast.error("Please select a bank");
            return;
        }

        if (!accountName) {
            toast.error("Please wait for account verification to complete");
            return;
        }

        setIsSubmitting(true);

        try {
            await KYCService.verifyCustomer({
                bvn,
                bank_code: selectedBank,
                account_number: accountNumber,
            });

            toast.success("KYC verification successful!");
            onSuccess?.();
        } catch (error: any) {
            console.error("KYC submission failed:", error);
            const errorMessage = error?.response?.data?.message || "Verification failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = bvn.length === 11 && accountNumber.length === 10 && selectedBank && accountName && !resolving;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#012638] overflow-hidden">
                {/* Animated circles and rectangles */}
                <div className="hidden sm:block animate-float-1 z-60 bottom-[-24%] right-[36px] absolute w-[500px] h-[500px] opacity-25 rounded-full bg-gradient-to-r from-[#9ECAE0] to-[#566E7A00]" />
                <div className="hidden sm:block animate-float-1 z-60 top-[50%] left-[50%] translate-x-[-130%] translate-y-[-50%] opacity-25 absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#566E7A00] to-[#9ECAE0]" />
                {/* blured stuff */}
                <div className="hidden sm:block animate-float-3 z-60 blur-2xl top-[50%] left-[50%] translate-x-[-70%] translate-y-[-50%] opacity-25 absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r bg-black" />
                <div className="hidden sm:block animate-float-4 z-60 blur-2xl top-[50%] left-[50%] translate-x-[-10%] translate-y-[-50%] opacity-25 absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r bg-black" />
                {/* rectangles */}
                <div className="hidden sm:block animate-float-6 z-60 bottom-[0%] left-[0%] absolute w-[500px] h-[200px] opacity-25 bg-gradient-to-r from-[#036B9E] to-[#012638]" />
                <div className="hidden sm:block animate-float-6 z-60 top-[0%] right-[0%] absolute w-[500px] h-[200px] opacity-25 bg-gradient-to-r from-[#036B9E] to-[#012638]" />
                <div className="absolute inset-0 z-65" />

                {/* Modal Content */}
                <div className="z-70 fixed inset-0 overflow-y-auto overflow-x-hidden py-5 flex">
                    <div className="z-70 relative bg-[#012638] border border-[#019893]/30 max-w-[520px] rounded-2xl shadow-2xl w-[90%] p-8 m-auto">
                        {/* Close Button (optional) */}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}

                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#019893]/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#019893]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Complete Your Verification
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Verify your BVN to unlock full wallet features
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* BVN Input */}
                            <div>
                                <label className="block text-sm font-semibold text-[#019893] mb-2">
                                    Bank Verification Number (BVN)
                                </label>
                                <input
                                    type="password"
                                    value={bvn}
                                    onChange={(e) => handleBvnChange(e.target.value)}
                                    placeholder="Enter 11-digit BVN"
                                    maxLength={11}
                                    className="w-full bg-[#001B2E] border-2 border-[#019893]/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#019893] focus:ring-2 focus:ring-[#019893]/20 transition-all"
                                    required
                                    autoComplete="one-time-code"
                                />
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-xs text-gray-500">
                                        {bvn.length}/11 digits
                                    </p>
                                    {bvn.length === 11 && (
                                        <span className="text-xs text-green-400 flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Valid
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Bank Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-[#019893] mb-2">
                                    Select Your Bank
                                </label>
                                <select
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    disabled={banksLoading}
                                    className="w-full bg-[#001B2E] border-2 border-[#019893]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#019893] focus:ring-2 focus:ring-[#019893]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                >
                                    <option value="">Choose your bank</option>
                                    {supportedBanks.map((bank) => (
                                        <option key={bank.bank_code} value={bank.bank_code}>
                                            {bank.bank_name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-xs text-gray-500">
                                    Select the bank associated with your BVN
                                </p>
                            </div>

                            {/* Account Number Input */}
                            <div>
                                <label className="block text-sm font-semibold text-[#019893] mb-2">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                                    placeholder="Enter 10-digit account number"
                                    maxLength={10}
                                    className="w-full bg-[#001B2E] border-2 border-[#019893]/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#019893] focus:ring-2 focus:ring-[#019893]/20 transition-all"
                                    required
                                    autoComplete="off"
                                />
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-xs text-gray-500">
                                        {accountNumber.length}/10 digits
                                    </p>
                                    {accountNumber.length === 10 && !resolving && accountName && (
                                        <span className="text-xs text-green-400 flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Account Name Display */}
                            {resolving && (
                                <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                    <span className="text-sm text-blue-400">Verifying account...</span>
                                </div>
                            )}

                            {accountName && !resolving && (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-xs text-green-400 mb-1 font-semibold">Account Name</p>
                                    <p className="text-sm font-bold text-green-300">{accountName}</p>
                                </div>
                            )}

                            {resolutionError && !resolving && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <p className="text-xs text-red-400">{resolutionError}</p>
                                </div>
                            )}

                            {/* Info Box */}
                            <div className="bg-[#019893]/10 border border-[#019893]/30 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-[#019893] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="text-xs text-gray-300 space-y-1">
                                        <p className="font-semibold text-[#019893]">Why do we need this?</p>
                                        <p>Your BVN and bank details help us verify your identity securely. We'll instantly verify your account name to ensure accuracy.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!isFormValid || isSubmitting}
                                className="w-full bg-gradient-to-r from-[#019893] to-[#017a76] text-white font-bold py-4 rounded-xl hover:from-[#017a76] hover:to-[#015d5c] focus:outline-none focus:ring-4 focus:ring-[#019893]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#019893]/20 hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying BVN...
                                    </span>
                                ) : (
                                    "Complete Verification"
                                )}
                            </button>

                            {/* Security Note */}
                            <p className="text-center text-xs text-gray-500">
                                🔒 Your information is encrypted and secure
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
