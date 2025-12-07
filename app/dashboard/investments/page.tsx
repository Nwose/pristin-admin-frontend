"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import InvestmentManagement from "@/components/admin/investments";

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Investment Plans
        </h1>
        <InvestmentManagement />
      </main>
    </div>
  );
}
