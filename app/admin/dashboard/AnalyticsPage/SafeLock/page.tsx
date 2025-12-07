"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import GoBackButton from "@/components/admin/GoBackButton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type DurationKey = "3 Months" | "6 Months" | "12 Months";

const chartData: Record<DurationKey, { month: string; growth: number }[]> = {
  "3 Months": [
    { month: "Jan", growth: 20 },
    { month: "Feb", growth: 40 },
    { month: "Mar", growth: 35 },
  ],
  "6 Months": [
    { month: "Jan", growth: 40 },
    { month: "Feb", growth: 70 },
    { month: "Mar", growth: 55 },
    { month: "Apr", growth: 65 },
    { month: "May", growth: 90 },
    { month: "Jun", growth: 50 },
  ],
  "12 Months": [
    { month: "Jan", growth: 40 },
    { month: "Feb", growth: 60 },
    { month: "Mar", growth: 55 },
    { month: "Apr", growth: 65 },
    { month: "May", growth: 70 },
    { month: "Jun", growth: 60 },
    { month: "Jul", growth: 75 },
    { month: "Aug", growth: 85 },
    { month: "Sep", growth: 80 },
    { month: "Oct", growth: 90 },
    { month: "Nov", growth: 95 },
    { month: "Dec", growth: 100 },
  ],
};

export default function SafeLockDetails() {
  const [selectedDuration, setSelectedDuration] =
    useState<DurationKey>("6 Months");

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <AdminHeader />

      {/* Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Safe Lock Insights
          </h1>
          <GoBackButton />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Total Locked Amount", value: "₦12,500" },
            { title: "Average Lock Duration", value: "6 months" },
            { title: "Early Unlock Rate", value: "5%" },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center"
            >
              <h4 className="text-gray-600 text-sm font-medium mb-1">
                {card.title}
              </h4>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Growth Over Time */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Growth Over Time
          </h2>

          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-2">
              Safe Lock Growth
            </h3>
            <p className="text-3xl font-bold text-emerald-600 mb-1">
              +
              {selectedDuration === "3 Months"
                ? "8"
                : selectedDuration === "6 Months"
                ? "15"
                : "22"}
              %
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Last {selectedDuration}{" "}
              <span className="text-emerald-600 font-medium">
                +
                {selectedDuration === "3 Months"
                  ? "8"
                  : selectedDuration === "6 Months"
                  ? "15"
                  : "22"}
                %
              </span>
            </p>

            {/* Chart */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData[selectedDuration]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="growthGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="10%"
                        stopColor="#10B981"
                        stopOpacity={0.3}
                      />
                      <stop offset="90%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6b7280" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "10px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="growth"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#growthGradient)"
                    animationDuration={900}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Most Used Lock Durations */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Most Used Lock Durations
          </h3>

          <div className="flex justify-center items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-2 w-full max-w-lg mx-auto">
            {["3 Months", "6 Months", "12 Months"].map((duration, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDuration(duration as DurationKey)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  selectedDuration === duration
                    ? "bg-emerald-100 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
