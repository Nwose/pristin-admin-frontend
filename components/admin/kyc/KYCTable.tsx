"use client";

import React from "react";
import { useRouter } from "next/navigation";

const users = [
  {
    id: "ethan-carter",
    name: "Ethan Carter",
    date: "2023-09-15",
    credit: "₦256,000",
    status: "Finished",
  },
  {
    id: "olivia-bennett",
    name: "Olivia Bennett",
    date: "2023-09-14",
    credit: "₦140,000",
    status: "Finished",
  },
  {
    id: "noah-thompson",
    name: "Noah Thompson",
    date: "2023-09-13",
    credit: "₦490,000",
    status: "Pending",
  },
  {
    id: "ava-martinez",
    name: "Ava Martinez",
    date: "2023-09-12",
    credit: "₦256,000",
    status: "Pending",
  },
  {
    id: "liam-harris",
    name: "Liam Harris",
    date: "2023-09-11",
    credit: "₦500,000",
    status: "Pending",
  },
  {
    id: "isabella-clark",
    name: "Isabella Clark",
    date: "2023-09-10",
    credit: "₦100,000",
    status: "Finished",
  },
  {
    id: "jackson-lewis",
    name: "Jackson Lewis",
    date: "2023-09-09",
    credit: "₦256,000",
    status: "Finished",
  },
  {
    id: "sophia-walker",
    name: "Sophia Walker",
    date: "2023-09-08",
    credit: "₦456,000",
    status: "Finished",
  },
  {
    id: "aiden-hall",
    name: "Aiden Hall",
    date: "2023-09-07",
    credit: "₦56,000",
    status: "Pending",
  },
  {
    id: "mia-young",
    name: "Mia Young",
    date: "2023-09-06",
    credit: "₦56,000",
    status: "Pending",
  },
];

export default function KYCTable() {
  const router = useRouter();

  const handleReviewClick = (user: {
    id: string;
    name: string;
    date: string;
    credit: string;
    status: string;
  }) => {
    // // ✅ Fixed route path
    // router.push(`/admin/kyc/violation-details/${user.id}`);
    router.push(`/admin/kyc/Review`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left py-3 px-5 font-medium">User</th>
            <th className="text-left py-3 px-5 font-medium">Submission Date</th>
            <th className="text-left py-3 px-5 font-medium">Credit Score</th>
            <th className="text-left py-3 px-5 font-medium">Status</th>
            <th className="text-left py-3 px-5 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="hover:bg-gray-50 border-t border-gray-100 transition"
            >
              <td className="py-3 px-5">{u.name}</td>
              <td className="py-3 px-5 text-gray-500">{u.date}</td>
              <td className="py-3 px-5 font-medium text-gray-900">
                {u.credit}
              </td>
              <td className="py-3 px-5">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    u.status === "Finished"
                      ? "bg-[#10B981] text-white"
                      : "bg-[#FACC15] text-white"
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td className="py-3 px-5">
                <button
                  onClick={() => handleReviewClick(u)}
                  className="text-[#0D9488] font-medium hover:underline"
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 py-4 text-sm text-gray-600">
        <button className="px-2 hover:text-teal-600">&lt;</button>
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            className={`px-3 py-1.5 rounded-md ${
              p === 1
                ? "bg-teal-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {p}
          </button>
        ))}
        <span className="text-gray-400">…</span>
        <button className="px-3 py-1.5 hover:bg-gray-100 rounded-md">10</button>
        <button className="px-2 hover:text-teal-600">&gt;</button>
      </div>
    </div>
  );
}
