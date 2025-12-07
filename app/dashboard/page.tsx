"use client";

import { useEffect, useState } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import UpcomingPayments from "../../components/dashboard/UpcomingPayments";
import QuickSettings from "../../components/dashboard/QuickSettings";
import { TrendingUp, FileText, Wallet as WalletIcon } from "lucide-react";
import {
  getDashboardData,
  Investment,
  Loan,
} from "@/services/dashboard.service";
import WalletService, {
  Wallet, 
  WalletList
} from "@/lib/api/services/Wallet.Service";

export default function Dashboard() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    WalletService.getMainWallet().then((mainWallet)=>{
      if (mainWallet){
        setWallet(mainWallet);
      }
    })
  };

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Investment Balance */}
        <DashboardCard
          title="Investment Balance"
          amount={`₦${investments[0]?.balance.toLocaleString() || "0"}`}
          trend={{
            value: "+6.1%",
            type: "positive",
            text: "from last month",
          }}
          icon={<TrendingUp className="w-6 h-6" />}
          hasAction
        />

        {/* Loan Status */}
        <DashboardCard
          title="Loan Status"
          amount={`₦${loans[0]?.amount.toLocaleString() || "0"}`}
          subtitle={loans[0] ? `Next due ${loans[0].nextDue}` : undefined}
          icon={<FileText className="w-6 h-6" />}
          hasAction
        />

        {/* Wallet Balance */}
        <DashboardCard
          title="Wallet Balance"
          wallet={wallet}
          amount={`₦${wallet?.balance.toLocaleString() || "0"}`}
          subtitle={
            wallet ? `Updated ${new Date().toLocaleDateString()}` : undefined
          }
          icon={<WalletIcon className="w-6 h-6" />}
          hasAction={true}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-8">
        <UpcomingPayments />
        <QuickSettings />
      </div>
    </div>
  );
}
