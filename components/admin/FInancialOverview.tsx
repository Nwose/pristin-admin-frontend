"use client";
import React from "react";
import Link from "next/link";
import { TrendingUp, Lock, DollarSign, PieChart } from "lucide-react";

type FinancialItem = {
  title: string;
  amount: string;
  users: string;
  growth: string;
  color: string;
  buttonText: string;
  buttonLink: string;
  icon: React.ReactNode;
};

const items: FinancialItem[] = [
  {
    title: "Investment",
    amount: "₦2,450,000",
    users: "1,234 active users",
    growth: "+12.5%",
    color: "bg-emerald-50 border-emerald-100",
    buttonText: "View Breakdown",
    buttonLink: "/admin/dashboard/AnalyticsPage/InvestmentOverview",
    icon: <TrendingUp className="text-emerald-600 w-5 h-5" />,
  },
  {
    title: "Loan",
    amount: "₦1,850,000",
    users: "892 active users",
    growth: "+8.2%",
    color: "bg-blue-50 border-blue-100",
    buttonText: "View More",
    buttonLink: "/admin/dashboard/AnalyticsPage/LoanAnalytics",
    icon: <DollarSign className="text-blue-600 w-5 h-5" />,
  },
  {
    title: "Bond",
    amount: "₦980,000",
    users: "567 active users",
    growth: "+6.8%",
    color: "bg-purple-50 border-purple-100",
    buttonText: "View Portfolio",
    buttonLink: "/admin/dashboard/AnalyticsPage/BondPortfolioMetrics",
    icon: <PieChart className="text-purple-600 w-5 h-5" />,
  },
  {
    title: "Safe Lock",
    amount: "₦3,200,000",
    users: "2,156 active users",
    growth: "+15.7%",
    color: "bg-teal-50 border-teal-100",
    buttonText: "View Details",
    buttonLink: "/admin/dashboard/AnalyticsPage/SafeLock",
    icon: <Lock className="text-teal-600 w-5 h-5" />,
  },
];

export default function FinancialOverview() {
  return (
    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Financial Overview
        </h3>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {items.slice(0, 3).map((i) => (
          <div
            key={i.title}
            className={`rounded-xl border ${i.color} p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition h-60`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-white/70 border border-gray-100">
                  {i.icon}
                </div>
                <span className="font-medium text-gray-700">{i.title}</span>
              </div>
              <span className="text-sm text-emerald-600 font-semibold">
                ↑ {i.growth}
              </span>
            </div>

            {/* Amount */}
            <div className="pb-8">
              <p className="text-2xl font-bold text-gray-900">{i.amount}</p>
              <p className="text-sm text-gray-500 mt-1">{i.users}</p>
            </div>

            {/* Button */}
            <Link
              href={i.buttonLink}
              className={`mt-4 text-sm text-center font-medium py-2.5 rounded-lg transition ${
                i.title === "Investment"
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : i.title === "Loan"
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : i.title === "Bond"
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : "bg-teal-100 text-teal-700 hover:bg-teal-200"
              }`}
            >
              {i.buttonText}
            </Link>
          </div>
        ))}

        {/* Bottom Card */}
        <div
          className={`rounded-xl border ${items[3].color} p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition h-60`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/70 border border-gray-100">
                {items[3].icon}
              </div>
              <span className="font-medium text-gray-700">
                {items[3].title}
              </span>
            </div>
            <span className="text-sm text-emerald-600 font-semibold">
              ↑ {items[3].growth}
            </span>
          </div>

          <div>
            <p className="text-2xl font-bold text-gray-900">
              {items[3].amount}
            </p>
            <p className="text-sm text-gray-500 mt-1">{items[3].users}</p>
          </div>

          <Link
            href={items[3].buttonLink}
            className="mt-4 text-sm text-center font-medium py-2.5 rounded-lg bg-teal-100 text-teal-700 hover:bg-teal-200 transition"
          >
            {items[3].buttonText}
          </Link>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end mt-8">
        <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-medium transition">
          Export as JPEG/PDF
        </button>
      </div>
    </section>
  );
}
