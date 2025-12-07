import React, { useState } from "react";

interface QueueItem {
  user: string;
  amount: string;
  approvedDate: string;
}

interface DisbursementQueueProps {
  loanId: string;
  queue: QueueItem[];
  token: string;
  refreshData: () => Promise<void>;
}

const DisbursementQueue: React.FC<DisbursementQueueProps> = ({
  loanId,
  queue,
  token,
  refreshData,
}) => {
  const [otp, setOtp] = useState("");

  const handleDisburseSelected = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/loan/disburse/${loanId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp }),
        }
      );
      if (!res.ok) throw new Error("Failed to disburse");
      await refreshData();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Disbursement Queue
      </h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="py-3 px-6 font-medium">User</th>
              <th className="py-3 px-6 font-medium">Amount</th>
              <th className="py-3 px-6 font-medium">Approved Date</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item, i) => (
              <tr
                key={i}
                className={`text-sm text-gray-800 ${
                  i !== queue.length - 1 ? "border-b border-gray-100" : ""
                } hover:bg-gray-50 transition`}
              >
                <td className="py-3 px-6">{item.user}</td>
                <td className="py-3 px-6">{item.amount}</td>
                <td className="py-3 px-6">{item.approvedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          OTP
        </label>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <button
        onClick={handleDisburseSelected}
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition mt-3"
      >
        Disburse Selected
      </button>
    </section>
  );
};

export default DisbursementQueue;
