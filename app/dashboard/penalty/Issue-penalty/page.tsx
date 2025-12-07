"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth/authContext";

const IssuePenaltyPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [violationType, setViolationType] = useState("");
  const [restrictionType, setRestrictionType] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      violationType,
      restrictionType,
      duration,
      description,
    });
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Issue Ban or Restriction</h1>

      {/* User Info */}
      <div className="space-y-6">
        {/* User Field */}
        <div>
          <label className="block text-sm font-medium mb-2">User</label>
          <input
            type="text"
            value="SophiaCarter@email.com"
            readOnly
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 focus:outline-none"
          />
        </div>

        {/* Profile Summary */}
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          <h2 className="font-semibold mb-3">Profile Summary</h2>
          <div className="text-sm space-y-1 text-gray-700">
            <p>
              <span className="font-semibold">Full Name:</span> Sophia Carter
            </p>
            <p>
              <span className="font-semibold">Plan Type:</span> Growth Portfolio
            </p>
            <p>
              <span className="font-semibold">Capital Invested:</span> ₦15,000
            </p>
            <p>
              <span className="font-semibold">Investment Start Date:</span>{" "}
              2022-05-15
            </p>
            <p>
              <span className="font-semibold">Penalty Start Date:</span>{" "}
              2023-01-10
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/penalty/Issue-ban")}
            className="mt-4 border border-gray-300 text-sm rounded-md px-3 py-1 hover:bg-gray-100 transition"
          >
            View Details
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Violation Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Violation Type
            </label>
            <select
              value={violationType}
              onChange={(e) => setViolationType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
            >
              <option value="">Select violation type</option>
              <option value="Misuse">Misuse</option>
              <option value="Fraud">Fraud</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Restriction Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Restriction Type
            </label>
            <select
              value={restrictionType}
              onChange={(e) => setRestrictionType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
            >
              <option value="">Select restriction type</option>
              <option value="Permanent">Permanent</option>
              <option value="Temporary">Temporary</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Duration (Days)
            </label>
            <input
              type="number"
              placeholder="Enter number of days"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none h-28 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#008060] text-white hover:bg-[#00694d] transition"
            >
              Confirm Action
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default IssuePenaltyPage;
