"use client";
import React, { useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { ProtectedRoute } from "@/lib/api/auth/authContext";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
