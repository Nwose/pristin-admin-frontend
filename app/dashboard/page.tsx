"use client";

import React from "react";
import StatsCards from "@/components/admin/StatsCards";
import RecentActivity from "@/components/admin/RecentActivity";
import DepositsWithdrawals from "@/components/admin/DepositsWithdrawals";
import { useAuth } from "@/lib/api/auth/authContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <>
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
    </>
  );
}
