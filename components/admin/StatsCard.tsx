"use client";
import React from "react";

interface Props {
  title: string;
  value: string | number;
}

const StatsCard: React.FC<Props> = ({ title, value }) => {
  return (
    <div className="bg-white border border-teal-50 rounded-lg p-4 shadow-sm">
      <p className="text-xs text-teal-600 font-medium">{title}</p>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
