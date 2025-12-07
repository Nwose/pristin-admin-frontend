import React from "react";

interface LoanDetailsHeaderProps {
  amount?: string;
  tenure?: string;
  interestRate?: string;
  creditScore?: number;
}

const LoanDetailsHeader: React.FC<LoanDetailsHeaderProps> = ({
  amount = "₦0",
  tenure = "N/A",
  interestRate = "0%",
  creditScore = 0,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-lg font-semibold text-gray-900">{amount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tenure</p>
          <p className="text-lg font-semibold text-gray-900">{tenure}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Interest Rate</p>
          <p className="text-lg font-semibold text-gray-900">{interestRate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Credit Score</p>
          <p className="text-lg font-semibold text-gray-900">{creditScore}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsHeader;
