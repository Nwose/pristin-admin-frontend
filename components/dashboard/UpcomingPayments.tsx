"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, FileStack, TrendingUp, Wallet } from "lucide-react";
import {
  getUpcomingPayments,
  UpcomingPayment,
} from "@/services/payment.service";

export default function UpcomingPayments() {
  const [payments, setPayments] = useState<UpcomingPayment[]>([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    // try {
    //   const data = await getUpcomingPayments();
    //   setPayments(data);
    // } catch (err) {
    //   console.error("Error fetching upcoming payments:", err);
    // }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "loan":
        return <FileStack className="w-5 h-5 text-[#001B2E]" />;
      case "investment":
        return <TrendingUp className="w-5 h-5 text-[#001B2E]" />;
      default:
        return <Wallet className="w-5 h-5 text-[#001B2E]" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#ccEaE9] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#001B2E]">
          Upcoming Payments
        </h3>
        <button className="text-[#019893] text-sm font-medium hover:text-teal-700 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5" /> See all
        </button>
      </div>

      <div className="space-y-4">
        {payments.map((payment, index) => (
          <div
            key={payment.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 pb-4 ${
              index < payments.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#CCEAE9] rounded-lg flex items-center justify-center mr-4">
                {getIcon(payment.type)}
              </div>
              <div>
                <p className="font-medium text-[#001B2E]">{payment.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(payment.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center self-start sm:self-auto">
              <span className="font-semibold text-gray-900 mr-2">
                ₦{payment.amount.toLocaleString()}
              </span>
              <span className="text-gray-400 w-5 h-5 flex items-center justify-center">
                &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
