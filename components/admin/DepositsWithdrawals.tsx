"use client";
import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Link from "next/link";

const data = [
  { name: "Jul 1", value: 2200 },
  { name: "Jul 8", value: 3200 },
  { name: "Jul 15", value: 2600 },
  { name: "Jul 22", value: 4200 },
  { name: "Jul 29", value: 3800 },
];

const formatNaira = (n: number) => `₦${n.toLocaleString()}`;

interface DepositsWithdrawalsProps {
  isSubPage?: boolean; // if true, show dropdown instead of link
}

const DepositsWithdrawals: React.FC<DepositsWithdrawalsProps> = ({
  isSubPage = false,
}) => {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");

  return (
    <section className="bg-white border border-teal-50 rounded-lg p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Deposits/Withdrawals
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatNaira(5643870)}
          </p>
          <p className="text-sm text-green-600 mt-1">
            {selectedRange} <span className="font-medium">+15%</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          {!isSubPage ? (
            // ✅ Show "Check Full Analytics" when NOT on subpage
            <Link
              href="/admin/dashboard/AnalyticsPage"
              className="text-sm text-teal-600 hover:underline"
            >
              Check Full Analytics →
            </Link>
          ) : (
            // ✅ Show dropdown when on subpage
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="border border-teal-200 text-sm text-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>Last 7 Days</option>
              <option>Last 14 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          )}
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }} className="mb-6">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f4f3"
            />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <Tooltip formatter={(value: any) => formatNaira(Number(value))} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={3}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-4 py-2 rounded-md bg-teal-700 text-white text-sm hover:bg-teal-800">
          Add User
        </button>
        <button className="px-4 py-2 rounded-md bg-teal-50 text-teal-700 text-sm hover:bg-teal-100">
          Create Investment Plan
        </button>
      </div>
    </section>
  );
};

export default DepositsWithdrawals;
