"use client";

import React from "react";
import { Search, Download } from "lucide-react";

export default function KYCFilterBar() {
  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative w-full max-w-3xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name, email, or ID"
          className="w-full bg-white shadow-sm border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {["Status", "Date", "Country"].map((filter) => (
          <select
            key={filter}
            className="bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
          >
            <option value="">{filter}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        ))}
      </div>

      {/* Download Icon */}
      <div>
        <button
          className="flex items-center bg-teal-600 text-white rounded-lg px-3 py-2 shadow-sm hover:bg-teal-700 transition"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
