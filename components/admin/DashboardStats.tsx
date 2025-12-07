"use client";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";

const stats = [
  {
    title: "Active Users",
    value: "1,204",
    icon: Users,
    color: "bg-teal-100 text-teal-600",
  },
  {
    title: "Total Revenue",
    value: "$58,430",
    icon: DollarSign,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Growth Rate",
    value: "12.4%",
    icon: TrendingUp,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Daily Activity",
    value: "320",
    icon: Activity,
    color: "bg-indigo-100 text-indigo-600",
  },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >
          <div>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <h3 className="text-xl font-semibold text-gray-800">
              {stat.value}
            </h3>
          </div>
          <div className={`p-3 rounded-full ${stat.color}`}>
            <stat.icon size={22} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
