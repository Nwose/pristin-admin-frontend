"use client";

import React from "react";
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
  BarChart,
  Bar,
} from "recharts";

const growthData = [
  { month: "Jan", growth: 20 },
  { month: "Feb", growth: 40 },
  { month: "Mar", growth: 35 },
  { month: "Apr", growth: 50 },
  { month: "May", growth: 80 },
  { month: "Jun", growth: 60 },
];

const bondPopularity = [
  { name: "Bond A", popularity: 15 },
  { name: "Bond B", popularity: 15 },
  { name: "Bond C", popularity: 15 },
];

export default function BondPortfolioMetrics() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AdminHeader />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Bond Portfolio Metrics
          </h1>
          <GoBackButton />
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Total Bond Value", value: "₦1,250,000" },
            { title: "Active Bondholders", value: "450" },
            { title: "Top Bond Yield", value: "5.2%" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center"
            >
              <p className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Performance Trends */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Performance Trends
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Bond Popularity */}
            <div>
              <h3 className="text-base font-medium text-gray-700 mb-2">
                Bond Popularity
              </h3>
              <p className="text-3xl font-bold text-emerald-600 mb-1">+15%</p>
              <p className="text-sm text-gray-500 mb-6">
                Last 30 Days{" "}
                <span className="text-emerald-600 font-medium">+15%</span>
              </p>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bondPopularity} barSize={40}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
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
                    <Bar
                      dataKey="popularity"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8">
                <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-lg font-medium transition">
                  Explore Bond Options
                </button>
              </div>
            </div>

            {/* Monthly Growth */}
            <div>
              <h3 className="text-base font-medium text-gray-700 mb-2">
                Monthly Growth
              </h3>
              <p className="text-3xl font-bold text-emerald-600 mb-1">+8%</p>
              <p className="text-sm text-gray-500 mb-6">
                Last 12 Months{" "}
                <span className="text-emerald-600 font-medium">+8%</span>
              </p>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={growthData}
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
                        <stop
                          offset="90%"
                          stopColor="#10B981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6b7280" }}
                      interval={0} // ✅ show all months
                      padding={{ left: 10, right: 10 }} // ✅ prevent Jan clipping
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
        </section>
      </main>
    </div>
  );
}
