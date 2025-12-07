"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth/authContext";

export default function IssueBanPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <>
      {/* Top Section: Title + Back button */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold">Issue Ban or Restriction</h1>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          ← Back
        </button>
      </div>

      {/* ===== User Email Input ===== */}
      <div className="mb-12">
        <label className="block text-gray-700 font-medium mb-2">
          User Email
        </label>
        <input
          type="email"
          placeholder="SophiaCarter@gmail.com"
          className="w-full md:w-[420px] px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent font-medium text-gray-600"
        />
      </div>

      {/* ===== User Profile Section ===== */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          User Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 text-gray-700">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">Ethan Carter</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">+1 (555) 123-4567</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="font-medium text-green-700">Active</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium">iPhone 13, IP: 192.168.1.100</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">ethan.carter@email.com</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="font-medium">$5,250.75</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">KYC Status</p>
              <p className="font-medium text-green-700">Verified</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-10"></div>
      </section>
    </>
  );
}
