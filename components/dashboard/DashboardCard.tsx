"use client";

import { CalendarCheck2 } from "lucide-react";
import { useRef, useState } from "react";
import CalendarPopover from "../common/CalendarPopover";
import { ReactNode } from "react";
import { Wallet } from "@/lib/api/services/Wallet.Service";


interface DashboardCardProps {
  title: string;
  amount: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    type: "positive" | "negative" | "neutral";
    text: string;
  };
  hasAction?: boolean;
  wallet?: Wallet | null;
  onDateSelect?: (date: Date) => void;
}

export default function DashboardCard({
  title,
  amount,
  subtitle,
  icon,
  trend,
  hasAction = false,
  onDateSelect,
  wallet,
}: DashboardCardProps) {
  const [openCal, setOpenCal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="bg-white rounded-lg border border-[#ccEaE9] p-4 sm:p-6 relative">
      {/* Top */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold text-[#012638]">{title}</h3>
        {icon && <span className="text-[#001B2E] text-xl">{icon}</span>}
      </div>

      {/* Amount */}
      <p className="font-semibold text-[#00080B] text-2xl md:text-3xl mb-4">
        ₦{ wallet?.balance || "0.0" }
      </p>

      {/* Subtitle or Trend */}
      {trend ? (
        <div className="flex items-center gap-1">
          <span className="text-base">{trend.value}</span>
          <span className="text-sm">{trend.text}</span>
        </div>
      ) : (
        subtitle && (
          <p className="text-sm text-[#019893] font-medium">{subtitle}</p>
        )
      )}

      {/* Calendar Action Icon */}
      {/* {hasAction && (
        <>
          <button
            ref={buttonRef}
            onClick={() => setOpenCal(!openCal)}
            className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6"
          >
            <CalendarCheck2 className="text-[#001B2E] w-5 h-5" />
          </button>

          <CalendarPopover
            isOpen={openCal}
            onClose={() => setOpenCal(false)}
            onSelect={(date) => onDateSelect?.(date)}
            anchorRef={buttonRef}
          />
        </>
      )} */}
    </div>
  );
}
