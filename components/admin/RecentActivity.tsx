"use client";
import React from "react";
import StatusBadge from "./StatusBadge";

type Activity = {
  date: string;
  user: string;
  action: string;
  status: "pending" | "completed" | "failed";
};

const data: Activity[] = [
  {
    date: "Jul 26, 2024",
    user: "Sophia Clark",
    action: "Loan Application",
    status: "pending",
  },
  {
    date: "Jul 25, 2024",
    user: "Ethan Carter",
    action: "Investment Deposit",
    status: "completed",
  },
  {
    date: "Jul 24, 2024",
    user: "Olivia Bennett",
    action: "KYC Verification",
    status: "completed",
  },
  {
    date: "Jul 23, 2024",
    user: "Liam Foster",
    action: "Loan Repayment",
    status: "completed",
  },
  {
    date: "Jul 22, 2024",
    user: "Ava Harper",
    action: "Investment Withdrawal",
    status: "failed",
  },
];

const RecentActivity: React.FC = () => {
  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-8">
      {/* Title */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        {/* <button className="text-sm text-teal-600 hover:underline">
          View All
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-500">
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">User</th>
              <th className="text-left py-2 px-4">Action</th>
              <th className="text-left py-2 px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
              >
                <td className="py-3 px-4 text-sm text-gray-700">{row.date}</td>
                <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                  {row.user}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {row.action}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentActivity;
