"use client";

import React, { useState } from "react";
import { Calendar, Filter, ChevronDown } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import GoBackButton from "@/components/admin/GoBackButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const loanGrowthData = [
  { month: "Jan", growth: 60 },
  { month: "Feb", growth: 65 },
  { month: "Mar", growth: 70 },
  { month: "Apr", growth: 68 },
  { month: "May", growth: 72 },
  { month: "Jun", growth: 75 },
];

const loanTypeData = [
  { type: "Personal", percent: 80 },
  { type: "Business", percent: 50 },
  { type: "Emergency", percent: 95 },
];

export default function LoanAnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [status, setStatus] = useState("All");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      {/* Centered Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Loan Analytics</h1>
          <GoBackButton />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 relative">
          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>{dateRange}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDateDropdown && (
              <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-44">
                {["Last 6 Months", "Last 12 Months", "This Year"].map(
                  (range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        setShowDateDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                    >
                      {range}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <Filter className="w-4 h-4" />
              <span>{status}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showStatusDropdown && (
              <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                {["All", "Active", "Repaid", "Defaulted"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatus(s);
                      setShowStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            {
              title: "Total Loan Disbursed",
              value: "₦1,250,000",
              change: "+10%",
              changeColor: "text-emerald-600",
            },
            {
              title: "Active Loans",
              value: "350",
              change: "+5%",
              changeColor: "text-emerald-600",
            },
            {
              title: "Repaid Loans",
              value: "200",
              change: "+8%",
              changeColor: "text-emerald-600",
            },
            {
              title: "Default Rate",
              value: "2.5%",
              change: "-1%",
              changeColor: "text-red-500",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {card.title}
              </h4>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className={`text-sm font-semibold mt-1 ${card.changeColor}`}>
                {card.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Monthly Loan Growth */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Monthly Loan Growth
            </h3>
            <p className="text-3xl font-bold text-emerald-700 mb-1">+15%</p>
            <p className="text-sm text-gray-500 mb-6">
              Last 6 Months <span className="text-emerald-600">+15%</span>
            </p>

            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loanGrowthData} barSize={28}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: "rgba(16,185,129,0.1)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#fff",
                      boxShadow:
                        "0 4px 10px rgba(0,0,0,0.05), 0 2px 5px rgba(0,0,0,0.03)",
                    }}
                  />
                  <Bar
                    dataKey="growth"
                    fill="#10B981"
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Loan Types Distribution (Interactive Bar Chart) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Loan Types Distribution
            </h3>
            <p className="text-3xl font-bold text-emerald-700 mb-1">30%</p>
            <p className="text-sm text-gray-500 mb-6">
              Current <span className="text-emerald-600">+5%</span>
            </p>

            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loanTypeData} layout="vertical" barSize={20}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="type"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(16,185,129,0.1)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#fff",
                      boxShadow:
                        "0 4px 10px rgba(0,0,0,0.05), 0 2px 5px rgba(0,0,0,0.03)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="percent"
                    fill="#10B981"
                    radius={[0, 8, 8, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
