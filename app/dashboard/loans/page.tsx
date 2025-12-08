"use client";

import React from "react";
import LoanTable from "@/components/admin/loans/LoanTable";
import { useAuth } from "@/lib/api/auth/authContext";

export default function AdminLoans() {
  const { user } = useAuth();
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Loan Management Dashboard
        </h1>
        <h3 className="text-gray-600 pt-4">Loan Applications</h3>
      </div>
      <LoanTable />
    </>
  );
}
