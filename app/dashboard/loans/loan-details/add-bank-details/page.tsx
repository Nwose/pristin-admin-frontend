"use client";

import { useState } from "react";

export default function AddBankDetails() {
  const [form, setForm] = useState({
    name: "",
    number: "",
    bank: "",
    branch: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-center">Add Bank Details</h2>
      <p className="text-gray-500 text-center text-sm">
        Securely add your bank account to receive your loan
      </p>

      <form className="space-y-4">
        <div>
          <label className="text-sm text-gray-700">Account Holder Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#019893]"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Account Number</label>
          <input
            type="text"
            name="number"
            value={form.number}
            onChange={handleChange}
            placeholder="Enter account number"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#019893]"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Bank Name</label>
          <input
            type="text"
            name="bank"
            value={form.bank}
            onChange={handleChange}
            placeholder="Enter bank name"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#019893]"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Branch (Optional)</label>
          <input
            type="text"
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="Enter branch name"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#019893]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#019893] text-white py-2 rounded-lg hover:bg-[#01817f] transition"
        >
          + Add Bank Details
        </button>
      </form>
    </div>
  );
}
