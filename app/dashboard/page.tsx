"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import RecentActivity from "@/components/admin/RecentActivity";
import DepositsWithdrawals from "@/components/admin/DepositsWithdrawals";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      {/* Centered main container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Recent Activity */}
        <div className="mt-8">
          <RecentActivity />
        </div>

        {/* Deposits/Withdrawals Chart and Actions */}
        <div className="mt-8">
          <DepositsWithdrawals />
        </div>
      </main>
    </div>
  );
}
