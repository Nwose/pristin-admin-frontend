"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function AddBusinessDetails() {
  const [form, setForm] = useState({
    businessName: "",
    signatoryName: "",
    businessEmail: "",
    phoneNumber: "",
    bvn: "",
    businessAddress: "",
    guarantorPhone: "",
    guarantorName: "",
    guarantorAddress: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-center">
        Add Business Details
      </h2>
      <p className="text-gray-500 text-center text-sm">
        Securely add your Business Details
      </p>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left side */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Enter Business Name"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#019893]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Signatory Name</label>
            <input
              type="text"
              name="signatoryName"
              value={form.signatoryName}
              onChange={handleChange}
              placeholder="Enter Signatory Name"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#019893]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Business Email</label>
            <input
              type="email"
              name="businessEmail"
              value={form.businessEmail}
              onChange={handleChange}
              placeholder="Enter Email Address"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#019893]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Enter Phone No."
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#019893]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">BVN</label>
            <input
              type="text"
              name="bvn"
              value={form.bvn}
              onChange={handleChange}
              placeholder="Enter 10 Digit Number"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#019893]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Business Address</label>
            <input
              type="text"
              name="businessAddress"
              value={form.businessAddress}
              onChange={handleChange}
              placeholder="Enter Address"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#019893]"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">
              Guarantor Phone Number
            </label>
            <input
              type="text"
              name="guarantorPhone"
              value={form.guarantorPhone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#019893]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Guarantor Name</label>
            <input
              type="text"
              name="guarantorName"
              value={form.guarantorName}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#019893]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Guarantor Address</label>
            <input
              type="text"
              name="guarantorAddress"
              value={form.guarantorAddress}
              onChange={handleChange}
              placeholder="Enter Address"
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#019893]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Signatory Passport</label>
            <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-24 cursor-pointer hover:border-[#019893]">
              <Upload className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">
              National ID or Passport Upload
            </label>
            <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-24 cursor-pointer hover:border-[#019893]">
              <Upload className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Full width button */}
        <div className="col-span-1 sm:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-[#001F3F] text-white py-2 rounded-lg hover:bg-[#003060] transition"
          >
            + Add Business Details
          </button>
        </div>
      </form>
    </div>
  );
}
