"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import GoBackButton from "@/components/admin/GoBackButton";
import EngagementOvderview from "@/components/admin/EngagmentOverview";
import FinancialOverview from "@/components/admin/FInancialOverview";
import DepositsWithdrawals from "@/components/admin/DepositsWithdrawals";

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      {/* Centered container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <GoBackButton />
        </div>

        {/* Content */}
        <StatsCards />
        <DepositsWithdrawals isSubPage />

        {/* Charts */}
        <div className="mt-8">
          <EngagementOvderview />
        </div>

        {/* Revenue Trend */}
        <div className="mt-8">
          <FinancialOverview />
        </div>
      </main>
    </div>
  );
}
