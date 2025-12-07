"use client";

import React from "react";

type Plan = {
  id: string;
  name: string;
  rate: string;
  tenure: string;
  risk: "Low" | "Medium" | "High";
  status: "Active" | "Inactive";
  created: string;
  description?: string;
};

export default function PlanManagementTable({
  plans,
  onEdit,
  onDelete,
}: {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700">
          <option>Risk</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700">
          <option>Tenure</option>
          <option>3 months</option>
          <option>6 months</option>
          <option>12 months</option>
        </select>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700">
          <option>Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-600 font-medium">
            <tr>
              <th className="py-3 px-4 text-left">Plan Name</th>
              <th className="py-3 px-4 text-left">Rate</th>
              <th className="py-3 px-4 text-left">Tenure</th>
              <th className="py-3 px-4 text-left">Risk Level</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Created Date</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{plan.name}</td>
                <td className="py-3 px-4">{plan.rate}%</td>
                <td className="py-3 px-4">{plan.tenure}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                      plan.risk === "High"
                        ? "bg-orange-500"
                        : plan.risk === "Medium"
                        ? "bg-gray-600"
                        : "bg-gray-400"
                    }`}
                  >
                    {plan.risk}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                      plan.status === "Active" ? "bg-teal-500" : "bg-yellow-500"
                    }`}
                  >
                    {plan.status}
                  </span>
                </td>
                <td className="py-3 px-4">{plan.created}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEdit(plan)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(plan.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 px-4 text-center text-gray-500">
                  No plans available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
