import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import LoanTable from "@/components/admin/loans/LoanTable";

export default function AdminLoans() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Management Dashboard
          </h1>
          <h3 className="text-gray-600 pt-4">Loan Applications</h3>
        </div>
        <LoanTable />
      </main>
    </div>
  );
}
