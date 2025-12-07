"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import KYCFilterBar from "@/components/admin/kyc/KYCFilterBar";
import KYCTable from "@/components/admin/kyc/KYCTable";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth/authContext";

export default function KYCPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <>
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
    </>
  );
}
