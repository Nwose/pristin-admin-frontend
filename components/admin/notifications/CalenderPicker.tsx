"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-6">
      {/* Calendar header */}
      <div className="flex items-center justify-between w-full mb-4">
        <button className="p-2 text-gray-500 hover:text-gray-800">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-semibold text-gray-800">July 2024</h3>
        <button className="p-2 text-gray-500 hover:text-gray-800">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Mock calendar grid */}
      <div className="grid grid-cols-7 gap-2 text-sm text-gray-700 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="font-semibold text-gray-500">
            {d}
          </div>
        ))}
        {Array.from({ length: 30 }, (_, i) => (
          <button
            key={i}
            onClick={() => setSelectedDate(new Date(2024, 6, i + 1))}
            className={`w-8 h-8 rounded-full ${
              selectedDate?.getDate() === i + 1
                ? "bg-teal-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
