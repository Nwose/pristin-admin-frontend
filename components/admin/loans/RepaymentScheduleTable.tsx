import React from "react";

interface Repayment {
  dueDate: string;
  amount: string;
  penalty: string;
}

interface RepaymentScheduleTableProps {
  schedule: Repayment[];
}

const RepaymentScheduleTable: React.FC<RepaymentScheduleTableProps> = ({
  schedule = [],
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-700 text-sm">
          <tr>
            <th className="py-3 px-6 font-medium">Due Date</th>
            <th className="py-3 px-6 font-medium">Amount</th>
            <th className="py-3 px-6 font-medium">Penalty</th>
          </tr>
        </thead>
        <tbody>
          {schedule.length > 0 ? (
            schedule.map((item, i) => (
              <tr
                key={i}
                className={`text-sm text-gray-800 ${
                  i !== schedule.length - 1 ? "border-b border-gray-100" : ""
                } hover:bg-gray-50 transition`}
              >
                <td className="py-3 px-6">{item.dueDate}</td>
                <td className="py-3 px-6">{item.amount}</td>
                <td className="py-3 px-6">{item.penalty}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-4 px-6 text-gray-500 text-center">
                No repayment data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RepaymentScheduleTable;
