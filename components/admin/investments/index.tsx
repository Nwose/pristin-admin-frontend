"use client";

import React, { useState } from "react";
import MaturityTable from "./MaturityTable";
import PlanManagementTable from "./PlanMangementTable";
import CreateEditPlanForm from "./CreateEditplanForm";
import InterestCalculator from "./InterestCalculator";
import UserInvestmentsTable from "./userInvestmentsTable";

/**
 * Root InvestmentManagement component
 * Holds mock data and CRUD handlers (in-memory).
 * Replace handlers with API calls later.
 */

type Plan = {
  id: string;
  name: string;
  rate: string; // e.g. "8.5"
  tenure: string; // e.g. "12 months"
  risk: "Low" | "Medium" | "High";
  status: "Active" | "Inactive";
  created: string;
  description?: string;
};

type UserInvestment = {
  id: string;
  user: string;
  planId: string;
  planName: string;
  amount: number;
  startDate: string;
  maturityDate: string;
  earnings: number;
};

type MaturityInvestment = {
  id: string;
  user: string;
  planName: string;
  maturityDate: string;
};

const initialPlans: Plan[] = [
  {
    id: "p-1",
    name: "Growth Fund",
    rate: "8.5",
    tenure: "12 months",
    risk: "Medium",
    status: "Active",
    created: "2023-08-15",
    description: "Balanced growth fund focused on mid-term yields.",
  },
  {
    id: "p-2",
    name: "Secure Savings",
    rate: "6.2",
    tenure: "24 months",
    risk: "Low",
    status: "Active",
    created: "2023-07-20",
    description: "Low risk savings product for conservative investors.",
  },
  {
    id: "p-3",
    name: "High Yield Bond",
    rate: "10.1",
    tenure: "6 months",
    risk: "High",
    status: "Inactive",
    created: "2023-06-05",
    description: "Short-term high yield instrument with higher risk.",
  },
];

const initialUserInvestments: UserInvestment[] = [
  {
    id: "ui-1",
    user: "Liam Carter",
    planId: "p-1",
    planName: "Growth Fund",
    amount: 10000,
    startDate: "2023-09-01",
    maturityDate: "2024-09-01",
    earnings: 850,
  },
  {
    id: "ui-2",
    user: "Olivia Bennett",
    planId: "p-2",
    planName: "Secure Savings",
    amount: 5000,
    startDate: "2023-08-15",
    maturityDate: "2025-08-15",
    earnings: 620,
  },
];

const initialMaturities: MaturityInvestment[] = [
  {
    id: "m-1",
    user: "Noah Foster",
    planName: "Short Term Deposit",
    maturityDate: "2023-08-12",
  },
  {
    id: "m-2",
    user: "Liam Carter",
    planName: "Growth Fund",
    maturityDate: "2024-09-01",
  },
];

export default function InvestmentManagement() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>(
    initialUserInvestments
  );
  const [maturities, setMaturities] =
    useState<MaturityInvestment[]>(initialMaturities);

  // Create or Update
  const handleSavePlan = (payload: Partial<Plan>) => {
    if (payload.id) {
      // Update
      setPlans((prev) =>
        prev.map((p) =>
          p.id === payload.id ? { ...p, ...(payload as Plan) } : p
        )
      );
      setSelectedPlan(null);
    } else {
      // Create
      const newPlan: Plan = {
        id: `p-${Date.now()}`,
        name: payload.name || "New Plan",
        rate: payload.rate || "0",
        tenure: payload.tenure || "0 months",
        risk: (payload.risk as Plan["risk"]) || "Low",
        status: (payload.status as Plan["status"]) || "Active",
        created: new Date().toISOString().split("T")[0],
        description: payload.description || "",
      };
      setPlans((prev) => [newPlan, ...prev]);
      // Optionally scroll to top or highlight
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    const el = document.getElementById("plan-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeletePlan = (id: string) => {
    if (!confirm("Delete this plan? This action cannot be undone.")) return;
    setPlans((prev) => prev.filter((p) => p.id !== id));
    setUserInvestments((prev) => prev.filter((ui) => ui.planId !== id));
  };

  const handleClearSelected = () => {
    setSelectedPlan(null);
  };

  return (
    <section className="space-y-10 max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Plan Management
        </h2>
        <button
          onClick={() => {
            setSelectedPlan(null);
            const formSection = document.getElementById("plan-form");
            if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-teal-500 text-white px-5 py-2 rounded-md text-sm hover:bg-teal-600"
        >
          Create Plan
        </button>
      </div>

      {/* Plan Management Section */}
      <PlanManagementTable
        plans={plans}
        onEdit={handleEditPlan}
        onDelete={handleDeletePlan}
      />

      {/* Create / Edit Form */}
      <div id="plan-form">
        <CreateEditPlanForm
          selectedPlan={selectedPlan}
          onSave={handleSavePlan}
          onClear={handleClearSelected}
        />
      </div>

      {/* Other Sections */}
      <InterestCalculator />

      <UserInvestmentsTable investments={userInvestments} />

      <MaturityTable maturities={maturities} />
    </section>
  );
}
