"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Filter,
  Wallet,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import WithdrawModal from "./WithdrawModal";
import {
  getInvestmentProducts,
  getUserInvestments,
  fundInvestment,
} from "@/services/investment.service";

export default function InvestmentsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"active" | "completed">("active");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [investmentProducts, setInvestmentProducts] = useState<any[]>([]);
  const [activeInvestments, setActiveInvestments] = useState<any[]>([]);
  const [completedInvestments, setCompletedInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const products = await getInvestmentProducts();
      const userInvestments = await getUserInvestments();

      if (Array.isArray(products) && products.length > 0) {
        setInvestmentProducts(products);
        toast.success(
          `Loaded ${products.length} investment product${
            products.length > 1 ? "s" : ""
          }`
        );
      } else {
        setInvestmentProducts([]);
        if (products && !Array.isArray(products)) {
          toast.info("Investment products are being set up. Check back soon!");
        }
      }

      if (Array.isArray(userInvestments) && userInvestments.length > 0) {
        const active = userInvestments.filter(
          (inv: any) => inv.status === "active"
        );
        const completed = userInvestments.filter(
          (inv: any) => inv.status === "completed"
        );

        setActiveInvestments(active);
        setCompletedInvestments(completed);

        if (active.length > 0 || completed.length > 0) {
          toast.success(
            `Found ${active.length} active and ${
              completed.length
            } completed investment${
              active.length + completed.length > 1 ? "s" : ""
            }`
          );
        }
      } else {
        setActiveInvestments([]);
        setCompletedInvestments([]);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const handleFundWallet = () => {
    router.push("/dashboard/investments/confirm-investment");
  };

  const handleInvestClick = async (product: any) => {
    try {
      toast.info("Processing your investment...");
      await fundInvestment({
        product_id: product.id,
        amount: product.min || 100000,
      });
      toast.success(`Investment in ${product.title} successful!`);
    } catch (err: any) {
      console.error("❌ Error funding investment:", err);
      toast.error(
        err?.message || "Failed to process investment. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-[#012638] font-semibold">
        <div className="flex items-center gap-2">
          <TrendingUp className="animate-pulse" size={24} />
          Loading investments...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Bar and Fund Wallet Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <label className="text-gray-500 text-base font-medium">Rate</label>
            <select className="border border-[#CCEAE9] rounded px-3 py-2 bg-white text-base">
              <option>All</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-500 text-base font-medium">
              Tenure
            </label>
            <select className="border border-[#CCEAE9] rounded px-3 py-2 bg-white text-base">
              <option>All</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-500 text-base font-medium">Risk</label>
            <select className="border border-[#CCEAE9] rounded px-3 py-2 bg-white text-base">
              <option>All</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleFundWallet}
          className="bg-[#012638] text-white px-8 py-2 rounded-lg font-semibold text-base hover:bg-[#019893] transition-colors flex items-center gap-2"
        >
          <Wallet size={18} />
          Fund Wallet
        </button>
      </div>

      {/* Investment Products Row */}
      {investmentProducts.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6">
          {investmentProducts.map((inv, index) => (
            <div
              key={`${inv.id}-${index}`}
              className="flex-1 bg-white border border-[#CCEAE9] rounded-xl p-6 min-w-[270px] max-w-[350px] shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded bg-[#CDEBEB] flex items-center justify-center font-bold text-[#012638]">
                  {inv.label || inv.title?.[0]}
                </div>
                <span className="text-[#012638] font-semibold text-lg">
                  {inv.title}
                </span>
              </div>
              <div className="text-xs text-[#019893] mb-2">ID: {inv.id}</div>
              <div className="flex gap-6 mb-2 text-sm">
                <div>
                  Rate{" "}
                  <span className="block font-semibold text-[#012638]">
                    {inv.rate || "N/A"}
                  </span>
                </div>
                <div>
                  Tenure{" "}
                  <span className="block font-semibold text-[#012638]">
                    {inv.tenure || "N/A"}
                  </span>
                </div>
                <div>
                  Risk{" "}
                  <span className="block font-semibold text-[#012638]">
                    {inv.risk || "N/A"}
                  </span>
                </div>
              </div>
              <div className="text-xs text-[#019893] mb-4">
                Minimum Investment:{" "}
                <span className="font-semibold">
                  ₦{inv.min?.toLocaleString() || "0"}
                </span>
              </div>
              <button
                onClick={() => handleInvestClick(inv)}
                className="w-full bg-[#012638] text-white py-2 rounded-lg font-semibold text-base hover:bg-[#019893] transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp size={18} />
                Invest Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#CCEAE9] rounded-xl p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle size={48} className="text-gray-400" />
            <p className="text-gray-500 text-lg">
              Investment products are being set up. Check back soon!
            </p>
          </div>
        </div>
      )}

      {/* Investment Tracking Section */}
      <div className="bg-white border border-[#CCEAE9] rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-[#012638]">
            <TrendingUp size={22} className="text-[#012638]" />
            Investment Tracking
          </div>
          <button
            onClick={() => setShowWithdraw(true)}
            className="bg-[#012638] text-white px-8 py-2 rounded-lg font-semibold text-base hover:bg-[#019893] transition-colors flex items-center gap-2"
          >
            <Wallet size={18} />
            Withdraw Funds
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6">
          <button
            onClick={() => setTab("active")}
            className={`text-lg font-medium pb-2 border-b-2 transition-all flex items-center gap-2 ${
              tab === "active"
                ? "border-[#019893] text-[#012638]"
                : "border-transparent text-gray-400"
            }`}
          >
            <TrendingUp size={18} />
            Active Investments
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`text-lg font-medium pb-2 border-b-2 transition-all flex items-center gap-2 ${
              tab === "completed"
                ? "border-[#019893] text-[#012638]"
                : "border-transparent text-gray-400"
            }`}
          >
            <CheckCircle size={18} />
            Completed Investments
          </button>
        </div>

        {/* Active or Completed */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {tab === "active" ? (
            activeInvestments.length > 0 ? (
              activeInvestments.map((inv, index) => (
                <div
                  key={`${inv.id}-${index}`}
                  className="flex-1 bg-[#F6F8FA] border border-[#CCEAE9] rounded-xl p-6 min-w-[270px] max-w-[350px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#012638] font-semibold text-lg">
                      {inv.title}
                    </span>
                    <span className="text-xs text-[#019893]">ID: {inv.id}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">
                      Earnings Accrued:
                    </span>
                    <span className="text-[#019893] font-semibold">
                      ₦{inv.earnings || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">Invested:</span>
                    <span className="text-[#019893] font-semibold">
                      ₦{inv.amount || "0"}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    Lock-in Ends:{" "}
                    <span className="font-medium text-[#012638]">
                      {inv.lockin || "N/A"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8 text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <AlertCircle size={48} className="text-gray-400" />
                  <p>No active investments yet. Start investing above!</p>
                </div>
              </div>
            )
          ) : completedInvestments.length > 0 ? (
            completedInvestments.map((inv, index) => (
              <div
                key={`${inv.id}-${index}`}
                className="flex-1 bg-[#F6F8FA] border border-[#CCEAE9] rounded-xl p-6 min-w-[270px] max-w-[350px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#012638] font-semibold text-lg">
                    {inv.title}
                  </span>
                  <span className="text-xs text-[#019893]">ID: {inv.id}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">
                    Earnings Accrued:
                  </span>
                  <span className="text-[#019893] font-semibold">
                    ₦{inv.earnings || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">Invested:</span>
                  <span className="text-[#019893] font-semibold">
                    ₦{inv.amount || "0"}
                  </span>
                </div>
                <div className="text-gray-500 text-xs">
                  Completed:{" "}
                  <span className="font-medium text-[#012638]">
                    {inv.completed || "N/A"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <CheckCircle size={48} className="text-gray-400" />
                <p>No completed investments yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#CCEAE9] rounded-xl p-6 text-center">
            <div className="text-gray-500 text-sm mb-1">Total Invested</div>
            <div className="text-2xl font-bold text-[#012638]">₦0</div>
          </div>
          <div className="bg-white border border-[#CCEAE9] rounded-xl p-6 text-center">
            <div className="text-gray-500 text-sm mb-1">Earnings Accrued</div>
            <div className="text-2xl font-bold text-[#012638]">₦0</div>
          </div>
          <div className="bg-white border border-[#CCEAE9] rounded-xl p-6 text-center">
            <div className="text-gray-500 text-sm mb-1">Active Investments</div>
            <div className="text-2xl font-bold text-[#012638]">
              {activeInvestments.length}
            </div>
          </div>
          <div className="bg-white border border-[#CCEAE9] rounded-xl p-6 text-center">
            <div className="text-gray-500 text-sm mb-1">Completed</div>
            <div className="text-2xl font-bold text-[#012638]">
              {completedInvestments.length}
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
      />
    </div>
  );
}
