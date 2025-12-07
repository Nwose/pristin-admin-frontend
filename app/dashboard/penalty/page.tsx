"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth/authContext";
import { MoreVertical } from "lucide-react";

interface Penalty {
  name: string;
  email: string;
  violation: string;
  date: string;
  status: "Pending" | "Issued" | "Appealed";
}

export default function PenaltyManagementPage() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const penalties: Penalty[] = [
    {
      name: "Ethan Carter",
      email: "ethan.carter@email.com",
      violation: "Spam",
      date: "2024-01-15",
      status: "Pending",
    },
    {
      name: "Olivia Bennett",
      email: "olivia.bennett@email.com",
      violation: "Misuse",
      date: "2024-02-20",
      status: "Issued",
    },
    {
      name: "Liam Harper",
      email: "liam.harper@email.com",
      violation: "Fraud",
      date: "2024-03-10",
      status: "Appealed",
    },
    {
      name: "Ava Foster",
      email: "ava.foster@email.com",
      violation: "Other",
      date: "2024-04-05",
      status: "Pending",
    },
    {
      name: "Noah Clark",
      email: "noah.clark@email.com",
      violation: "Spam",
      date: "2024-05-12",
      status: "Issued",
    },
    {
      name: "Isabella Reed",
      email: "isabella.reed@email.com",
      violation: "Misuse",
      date: "2024-06-18",
      status: "Appealed",
    },
    {
      name: "Jackson Hayes",
      email: "jackson.hayes@email.com",
      violation: "Fraud",
      date: "2024-07-22",
      status: "Pending",
    },
    {
      name: "Sophia Morgan",
      email: "sophia.morgan@email.com",
      violation: "Other",
      date: "2024-08-30",
      status: "Issued",
    },
    {
      name: "Aiden Cooper",
      email: "aiden.cooper@email.com",
      violation: "Spam",
      date: "2024-09-03",
      status: "Appealed",
    },
    {
      name: "Mia Parker",
      email: "mia.parker@email.com",
      violation: "Misuse",
      date: "2024-10-11",
      status: "Pending",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Issued":
        return "bg-red-100 text-red-700";
      case "Appealed":
        return "bg-green-100 text-green-700";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Top row */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Penalty Management</h1>
        <button
          onClick={() => {
            alert("Router working!");
            router.push("/admin/penalty/Issue-penalty");
          }}
          className="bg-[#009688] text-white px-4 py-2 rounded-md hover:bg-[#00796B] transition"
        >
          Issue New Penalty
        </button>

        {/* <button
            onClick={() => router.push("/admin/penalty/Issue-penalty")}
            className="bg-[#009688] text-white px-4 py-2 rounded-md hover:bg-[#00796B] transition"
          >
            Issue New Penalty
          </button> */}
      </div>

      {/* Search + Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
        <div className="p-4 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search by user email or name"
            className="flex-1 border rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#009688] outline-none"
          />
          <select className="border rounded-md px-3 py-2 text-sm text-gray-700">
            <option>Violation Type</option>
          </select>
          <select className="border rounded-md px-3 py-2 text-sm text-gray-700">
            <option>Status</option>
          </select>
          <select className="border rounded-md px-3 py-2 text-sm text-gray-700">
            <option>Date</option>
          </select>
          <select className="border rounded-md px-3 py-2 text-sm text-gray-700">
            <option>Other Filters</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600 font-medium">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Violation</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {penalties.map((p, i) => (
              <tr
                key={i}
                className={`border-b hover:bg-gray-50 transition ${
                  i === 1 ? "bg-[#E6F7F6]" : ""
                }`}
              >
                <td className="py-3 px-4">{p.name}</td>
                <td className="py-3 px-4 text-[#009688]">{p.email}</td>
                <td className="py-3 px-4">{p.violation}</td>
                <td className="py-3 px-4">{p.date}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-md font-medium text-xs ${getStatusColor(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </td>

                {/* Actions: View + three-dot */}
                <td className="py-3 px-4 text-right relative flex items-center justify-end gap-3">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Viewing ${p.name}`);
                    }}
                    className="text-[#0B5FFF] text-sm font-medium hover:underline"
                  >
                    View
                  </a>

                  {/* three-dot button */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === i ? null : i)}
                      className="p-2 hover:bg-gray-100 rounded-md"
                      aria-haspopup="true"
                      aria-expanded={openMenu === i}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === i && (
                      <div
                        className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg text-sm z-20"
                        onMouseLeave={() => setOpenMenu(null)}
                      >
                        <button
                          onClick={() => {
                            alert(`Resolved ${p.name}`);
                            setOpenMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => {
                            alert(`Deleted ${p.name}`);
                            setOpenMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center py-4 gap-2">
          <button className="px-3 py-1 rounded-md text-gray-500 hover:bg-gray-100">
            ‹
          </button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`px-3 py-1 rounded-md ${
                n === 1
                  ? "bg-[#009688] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {n}
            </button>
          ))}
          <button className="px-3 py-1 rounded-md text-gray-500 hover:bg-gray-100">
            ›
          </button>
        </div>
      </div>
    </>
  );
}
