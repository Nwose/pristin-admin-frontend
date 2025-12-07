"use client";

import React, { useEffect, useState } from "react";

type PlanForm = {
  id?: string;
  name: string;
  rate: string;
  tenure: string;
  risk: "Low" | "Medium" | "High";
  status: "Active" | "Inactive";
  description?: string;
};

export default function CreateEditPlanForm({
  selectedPlan,
  onSave,
  onClear,
}: {
  selectedPlan: PlanForm | null;
  onSave: (payload: Partial<PlanForm>) => void;
  onClear: () => void;
}) {
  const defaultForm: PlanForm = {
    name: "",
    rate: "",
    tenure: "",
    risk: "Low",
    status: "Active",
    description: "",
  };

  const [form, setForm] = useState<PlanForm>(defaultForm);

  useEffect(() => {
    if (selectedPlan) {
      setForm({
        id: selectedPlan.id,
        name: selectedPlan.name || "",
        rate: selectedPlan.rate || "",
        tenure: selectedPlan.tenure || "",
        risk: selectedPlan.risk || "Low",
        status: selectedPlan.status || "Active",
        description: selectedPlan.description || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [selectedPlan]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) {
      alert("Plan name is required.");
      return;
    }
    onSave(form);
    setForm(defaultForm);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {form.id ? "Edit Plan" : "Create New Plan"}
      </h3>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        {/* Plan Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Plan Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Growth Fund"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Rate */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Interest Rate (%)
          </label>
          <input
            type="text"
            name="rate"
            value={form.rate}
            onChange={handleChange}
            placeholder="e.g. 8.5"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Tenure */}
        <div>
          <label className="text-sm font-medium text-gray-700">Tenure</label>
          <input
            type="text"
            name="tenure"
            value={form.tenure}
            onChange={handleChange}
            placeholder="e.g. 12 months"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Risk Level */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Risk Level
          </label>
          <select
            name="risk"
            value={form.risk}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm text-gray-700 focus:ring-2 focus:ring-teal-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm text-gray-700 focus:ring-2 focus:ring-teal-500"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Description (full width) */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional description..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-teal-500"
            rows={3}
          />
        </div>
      </form>

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-teal-500 text-white px-5 py-2 rounded-md text-sm hover:bg-teal-600"
        >
          {form.id ? "Update Plan" : "Save Plan"}
        </button>

        {form.id && (
          <button
            type="button"
            onClick={() => {
              onClear();
              setForm(defaultForm);
            }}
            className="border border-gray-300 px-5 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
