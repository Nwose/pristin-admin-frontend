"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();

  const user = {
    name: "Sophia Carter",
    username: "@sophia_c",
    email: "sophia.carter@email.com",
    phone: "+234-7055-123-4567",
    role: "Investor",
    joined: "Oct 15, 2025",
    image: "/images/avatarPro.png",
    accountSummary: [
      {
        title: "Total Wallet Balance",
        amount: "₦1,342,500",
        change: "+5%",
      },
      {
        title: "Total Investment Amount",
        amount: "₦560,980",
        change: "+10%",
      },
      {
        title: "Outstanding Loan",
        amount: "₦554,500",
        change: "-2%",
      },
      {
        title: "Safe Lock Funds",
        amount: "₦265,000",
        change: "+3%",
      },
    ],
    activity: {
      lastLogin: "2024-01-20 14:30 (IP: 192.168.1.100)",
      transactionCount: "150",
      loanRequests: "5 (3 approved, 2 pending)",
      investmentActions: "20 investments",
      device: "Chrome on macOS",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <button
            onClick={() => router.push("/admin/kyc")}
            className="hover:text-teal-600"
          >
            KYC
          </button>
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          <button
            onClick={() => router.push("/admin/violation-details")}
            className="hover:text-teal-600"
          >
            Violation Details
          </button>
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          <span className="text-gray-800 font-medium">User Profile</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-1">User Profile</h1>
        <p className="text-sm text-teal-600 font-medium mb-8">Active</p>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-10">
          <img
            src={user.image}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.username}</p>
            <p className="text-sm text-gray-500">
              {user.email} · {user.phone} · {user.role} · Joined {user.joined}
            </p>
          </div>
        </div>

        {/* Account Summary */}
        <section className="mb-12">
          <h3 className="font-semibold text-gray-800 mb-4">Account Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {user.accountSummary.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {item.title}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {item.amount}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    item.change.startsWith("-")
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {item.change}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Account Activity */}
        <section className="mb-12">
          <h3 className="font-semibold text-gray-800 mb-4">Account Activity</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p>
                <span className="font-medium">Last Login:</span>{" "}
                {user.activity.lastLogin}
              </p>
              <p>
                <span className="font-medium">Loan Requests:</span>{" "}
                {user.activity.loanRequests}
              </p>
              <p>
                <span className="font-medium">Device/Browser:</span>{" "}
                {user.activity.device}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Transaction Count:</span>{" "}
                {user.activity.transactionCount}
              </p>
              <p>
                <span className="font-medium">Investment Actions:</span>{" "}
                {user.activity.investmentActions}
              </p>
            </div>
          </div>
        </section>

        {/* Penalties */}
        <section className="mb-10">
          <h3 className="font-semibold text-gray-800 mb-3">Penalties</h3>
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="font-medium text-gray-700 mb-1">No Penalties Found</p>
            <p className="text-sm text-gray-500 mb-4">
              This user has no penalties on record.
            </p>
            <button
              onClick={() => router.push("/admin/violation-details")}
              className="px-4 py-2 text-sm rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
            >
              View Violation Details
            </button>
          </div>
        </section>

        {/* Documents */}
        <section className="mb-10">
          <h3 className="font-semibold text-gray-800 mb-3">Documents</h3>
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="font-medium text-gray-700 mb-1">
              No Documents Uploaded
            </p>
            <p className="text-sm text-gray-500 mb-4">
              This user has not uploaded any documents.
            </p>
            <button className="px-4 py-2 text-sm rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50">
              Download
            </button>
          </div>
        </section>

        {/* Notes */}
        <section className="mb-10">
          <h3 className="font-semibold text-gray-800 mb-3">Notes</h3>
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="font-medium text-gray-700 mb-1">No Notes Available</p>
            <p className="text-sm text-gray-500 mb-4">
              There are no notes for this user.
            </p>
            <button className="px-4 py-2 text-sm rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50">
              Add New Note
            </button>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-3">
          <button className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-700 bg-white shadow-sm hover:bg-gray-50">
            Suspend Account
          </button>
          <button className="px-4 py-2 text-sm rounded-md bg-teal-500 text-white hover:bg-teal-600 shadow-sm">
            Send Message
          </button>
          <button className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-700 bg-white shadow-sm hover:bg-gray-50">
            Export User Data
          </button>
        </div>
      </main>
    </div>
  );
}
