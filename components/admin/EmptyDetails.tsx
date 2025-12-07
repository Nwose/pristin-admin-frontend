"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function EmptyDetails() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          {/* Dropdown (not functional yet, ready for backend connection) */}
          <select className="border border-gray-200 text-sm text-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>

        {/* Stat Cards (show zeros) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Total Users", value: 0 },
            { title: "Active Loans", value: 0 },
            { title: "Investment Volume", value: "₦0" },
            { title: "Pending KYC", value: 0 },
          ].map((stat) => (
            <div
              key={stat.title}
              className="bg-white border border-teal-50 rounded-lg p-4 shadow-sm"
            >
              <p className="text-xs text-teal-600 font-medium">{stat.title}</p>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Deposits/Withdrawals empty state */}
        <section className="bg-white border border-teal-50 rounded-lg p-6 mb-8">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Deposits/Withdrawals
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">₦0</p>
              <p className="text-sm text-green-600 mt-1">
                Last 30 Days <span className="font-medium">0%</span>
              </p>
            </div>

            <Link
              href="#"
              className="text-sm text-teal-600 hover:underline flex items-center"
            >
              Go Back <span className="ml-2">←</span>
            </Link>
          </div>

          {/* Empty data visual */}
          <div className="flex items-center justify-center h-[340px] bg-[#f6fbfa] rounded-lg border border-transparent">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <Image
                  src="/images/emptyDetails.png"
                  alt="No data yet"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-sm text-gray-500">No data yet</p>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex items-center justify-between text-sm text-gray-500 px-3 pt-4">
            <span>Jul 1</span>
            <span>Jul 8</span>
            <span>Jul 15</span>
            <span>Jul 22</span>
            <span>Jul 29</span>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-md bg-teal-700 text-white text-sm hover:bg-teal-800 transition">
            Send
          </button>
          <button className="px-4 py-2 rounded-md bg-teal-50 text-teal-700 text-sm hover:bg-teal-100 transition">
            Create Investment Plan
          </button>
        </div>
      </main>
    </div>
  );
}
