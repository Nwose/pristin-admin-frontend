"use client";

import React from "react";

interface LoanDetailsHeaderProps {
  amount: string;
  tenure: string;
  interestRate: string;
  creditScore: number;
}

const LoanDetailsHeader: React.FC<LoanDetailsHeaderProps> = ({
  amount,
  tenure,
  interestRate,
  creditScore,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Loan Details Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Loan Amount</p>
          <p className="text-lg font-semibold text-gray-800">{amount}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Tenure</p>
          <p className="text-lg font-semibold text-gray-800">{tenure}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Interest Rate</p>
          <p className="text-lg font-semibold text-gray-800">{interestRate}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Credit Score</p>
          <p className="text-lg font-semibold text-gray-800">{creditScore}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsHeader;
