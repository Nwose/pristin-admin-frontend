"use client";

import React from "react";
import InvestmentManagement from "@/components/admin/investments";
import { useAuth } from "@/lib/api/auth/authContext";

export default function InvestmentsPage() {
  const { user } = useAuth();
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Investment Plans
      </h1>
      <InvestmentManagement />
    </>
  );
}
