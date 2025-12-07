"use client";

import React, { useState } from "react";

export default function InterestCalculator() {
  const [amount, setAmount] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">("");
  const [months, setMonths] = useState<number | "">("");
  const [estimatedReturn, setEstimatedReturn] = useState<number>(0);

  const handleCalculate = () => {
    if (amount && rate && months) {
      const interest =
        Number(amount) * (Number(rate) / 100) * (Number(months) / 12);
      setEstimatedReturn(interest);
    } else {
      setEstimatedReturn(0);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Interest Calculator
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Investment Amount (₦)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Enter amount"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Rate */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Interest Rate (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) =>
              setRate(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Enter rate"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Tenure */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Tenure (months)
          </label>
          <input
            type="number"
            value={months}
            onChange={(e) =>
              setMonths(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Enter tenure"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Calculate button */}
      <div className="mt-5">
        <button
          onClick={handleCalculate}
          className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm hover:bg-teal-600"
        >
          Calculate
        </button>
      </div>

      {/* Result */}
      <div className="mt-3 text-gray-700 text-sm">
        Estimated Return:{" "}
        <span className="font-semibold text-gray-900">
          ₦
          {estimatedReturn.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
