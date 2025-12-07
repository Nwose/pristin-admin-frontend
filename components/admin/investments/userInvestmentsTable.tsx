"use client";

import React from "react";

type UserInvestment = {
  id: string;
  user: string;
  planName: string;
  amount: number;
  startDate: string;
  maturityDate: string;
  earnings: number;
};

export default function UserInvestmentsTable({
  investments,
}: {
  investments: UserInvestment[];
}) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          User Investments
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-100 text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left font-medium">
            <tr>
              <th className="px-6 py-3 border-b">User</th>
              <th className="px-6 py-3 border-b">Plan</th>
              <th className="px-6 py-3 border-b">Amount</th>
              <th className="px-6 py-3 border-b">Start Date</th>
              <th className="px-6 py-3 border-b">Maturity Date</th>
              <th className="px-6 py-3 border-b">Earnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {investments.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-800">
                  {inv.user}
                </td>
                <td className="px-6 py-3 text-gray-700">{inv.planName}</td>
                <td className="px-6 py-3 text-gray-700">
                  ₦{inv.amount.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-gray-700">{inv.startDate}</td>
                <td className="px-6 py-3 text-gray-700">{inv.maturityDate}</td>
                <td className="px-6 py-3 text-gray-700">
                  ₦{inv.earnings.toLocaleString()}
                </td>
              </tr>
            ))}
            {investments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
                  No user investments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 mt-5">
        <button className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white hover:bg-gray-50">
          Export Data (CSV)
        </button>
        <button className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white hover:bg-gray-50">
          Export Data (Excel)
        </button>
      </div>
    </div>
  );
}
