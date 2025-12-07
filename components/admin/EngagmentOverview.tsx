"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const engagementData = [
  { day: "Mon", value: 150 },
  { day: "Tue", value: 220 },
  { day: "Wed", value: 190 },
  { day: "Thu", value: 260 },
  { day: "Fri", value: 300 },
  { day: "Sat", value: 320 },
  { day: "Sun", value: 280 },
];

const penaltyData = [
  { name: "Spam", value: 40 },
  { name: "Misuse", value: 60 },
  { name: "Fraud", value: 20 },
];

export default function EngagementOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Engagement over time */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Engagement Over Time
        </h3>
        <p className="text-sm text-emerald-600 mb-4">+12% this month</p>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0d9488"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Penalty distribution (3 bars) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Penalty Distribution
          </h3>
          <p className="text-sm text-red-500">-5%</p>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={penaltyData}
              layout="vertical"
              margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip />
              <Bar
                dataKey="value"
                barSize={18}
                radius={[8, 8, 8, 8]}
                fill="#f97316"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <div>
            <span className="font-semibold">Spam</span>
            <div className="text-xs text-gray-500">40 reports</div>
          </div>
          <div>
            <span className="font-semibold">Misuse</span>
            <div className="text-xs text-gray-500">60 reports</div>
          </div>
          <div>
            <span className="font-semibold">Fraud</span>
            <div className="text-xs text-gray-500">20 reports</div>
          </div>
        </div>
      </div>
    </div>
  );
}
