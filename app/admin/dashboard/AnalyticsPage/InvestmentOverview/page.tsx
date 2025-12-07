"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import GoBackButton from "@/components/admin/GoBackButton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", value: 3000 },
  { name: "Feb", value: 2400 },
  { name: "Mar", value: 3600 },
  { name: "Apr", value: 2000 },
  { name: "May", value: 4000 },
  { name: "Jun", value: 2600 },
  { name: "Jul", value: 3500 },
];

export default function InvestmentOverview() {
  const [activeRange, setActiveRange] = useState("30d");
  const ranges = [
    { label: "7d", value: "7d" },
    { label: "30d", value: "30d" },
    { label: "90d", value: "90d" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <AdminHeader />

      {/* Centered Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Investment Overview
          </h1>
          <GoBackButton />
        </div>

        {/* Total Invested */}
        <div className="bg-[#F1F3F5] border border-[#E9ECEF] p-6 rounded-xl mb-10">
          <p className="text-gray-600 text-sm font-medium">Total Invested</p>
          <h2 className="text-3xl font-bold text-[#1A1A1A] mt-1">₦12,500</h2>
        </div>

        {/* ROI Breakdown */}
        <h3 className="text-base font-semibold text-[#1A1A1A] mb-3">
          ROI Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {[
            { label: "Daily", value: "₦120" },
            { label: "Weekly", value: "₦840" },
            { label: "Monthly", value: "₦3,600" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white border border-[#E9ECEF] rounded-xl p-5 shadow-sm"
            >
              <p className="text-gray-600 text-sm font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-[#1A1A1A] mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* User Segment */}
        <h3 className="text-base font-semibold text-[#1A1A1A] mb-3">
          User Segment
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {[
            { label: "New Investors", value: "250" },
            { label: "Returning Investors", value: "750" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl p-5 shadow-sm"
            >
              <p className="text-gray-600 text-sm font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-[#1A1A1A] mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Investment Trends Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-[#1A1A1A]">
            Investment Trends
          </h3>
          <div className="flex gap-2">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => setActiveRange(r.value)}
                className={`px-3 py-1 rounded-md text-sm font-medium border transition ${
                  activeRange === r.value
                    ? "bg-[#008080] text-white border-[#008080]"
                    : "bg-white text-gray-600 border-[#E9ECEF] hover:bg-gray-50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Stats */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 font-medium">Investment Trends</p>
          <h2 className="text-3xl font-bold text-[#1A1A1A]">₦12,500</h2>
          <p className="text-sm text-[#008080] font-medium">
            Last 30 Days +15%
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white border border-[#E9ECEF] p-5 rounded-xl shadow-sm">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008080" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#008080" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6C757D", fontSize: 12 }}
              />
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#E9ECEF"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E9ECEF",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#008080"
                strokeWidth={2.5}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
