"use client";
import React from "react";

type StatusProps = {
  status: "pending" | "completed" | "failed";
};

const StatusBadge: React.FC<StatusProps> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500 text-white ",
    completed: "bg-emerald-500 text-white ",
    failed: "bg-red-500 text-white ",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
