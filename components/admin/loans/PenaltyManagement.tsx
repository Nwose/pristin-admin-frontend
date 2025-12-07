"use client";

import React, { useState } from "react";

interface Penalty {
  user: string;
  loanId: string;
  penaltyAmount: string;
  status: "Late" | "On Time";
}

interface PenaltyManagementProps {
  penalties: Penalty[];
  loanId: string;
  token: string;
}

const PenaltyManagement: React.FC<PenaltyManagementProps> = ({
  penalties,
  loanId,
  token,
}) => {
  const [autoPenalty, setAutoPenalty] = useState(false);

  const handleToggleAutoPenalty = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/loan/toggle_auto_penalty/${loanId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAutoPenalty(!autoPenalty);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Penalty Management
      </h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="py-3 px-6 font-medium">User</th>
              <th className="py-3 px-6 font-medium">Loan ID</th>
              <th className="py-3 px-6 font-medium">Penalty Amount</th>
              <th className="py-3 px-6 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {penalties.map((p, i) => (
              <tr
                key={i}
                className={`text-sm text-gray-800 ${
                  i !== penalties.length - 1 ? "border-b border-gray-100" : ""
                } hover:bg-gray-50 transition`}
              >
                <td className="py-3 px-6">{p.user}</td>
                <td className="py-3 px-6">{p.loanId}</td>
                <td className="py-3 px-6">{p.penaltyAmount}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-md ${
                      p.status === "Late"
                        ? "bg-yellow-400 text-black"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm">
        <div>
          <h3 className="font-medium text-gray-900">Auto-Penalty</h3>
          <p className="text-sm text-gray-500">
            Enable or disable automatic penalty for late payments.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={autoPenalty}
            onChange={handleToggleAutoPenalty}
          />
          <div
            className={`w-11 h-6 rounded-full transition ${
              autoPenalty ? "bg-emerald-600" : "bg-gray-300"
            }`}
          />
          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
              autoPenalty ? "translate-x-5" : ""
            }`}
          />
        </label>
      </div>
    </section>
  );
};

export default PenaltyManagement;
