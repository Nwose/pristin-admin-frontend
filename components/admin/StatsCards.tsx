"use client";
import React from "react";
import StatsCard from "./StatsCard";

const StatsCards: React.FC = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard title="Total Users" value="12,345" />
      <StatsCard title="Active Loans" value="5,678" />
      <StatsCard title="Investment Volume" value="₦1,234,567" />
      <StatsCard title="Pending KYC" value="123" />
    </section>
  );
};

export default StatsCards;
