"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import KYCFilterBar from "@/components/admin/kyc/KYCFilterBar";
import KYCTable from "@/components/admin/kyc/KYCTable";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KYCPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KYC</h1>
            <p className="text-sm text-gray-500">
              Manage user identity verification submissions
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <KYCFilterBar />

        {/* Table */}
        <KYCTable />
      </main>
    </div>
  );
}
