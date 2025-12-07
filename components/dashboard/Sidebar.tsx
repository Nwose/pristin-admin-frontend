"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut, ArrowUp } from "lucide-react";
import { useAuth } from "@/lib/api/auth/authContext";
import { useTierUpgrade } from "@/lib/api/contexts/TierUpgradeContext";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: "/images/icons/ov.svg" },
  {
    name: "Wallet",
    href: FrontendRoutes.wallet,
    icon: "/images/icons/Vector.svg",
  },
  {
    name: "Investments",
    href: FrontendRoutes.investments,
    icon: "/images/icons/investments.svg",
  },
  {
    name: "Loans",
    href: FrontendRoutes.loans,
    icon: "/images/icons/loans.svg"
  },
  {
    name: "Payments",
    href: FrontendRoutes.payments,
    icon: "/images/icons/payments.svg",
  },
  {
    name: "Settings",
    href: FrontendRoutes.settings,
    icon: "/images/icons/settings.svg",
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { openTierUpgrade } = useTierUpgrade();

  const needsVerification = !user?.is_bvn_verified || !user?.is_liveness_check_verified;

  return (
    <div className="relative h-full">
      <div
        className={`${isCollapsed ? "w-20 md:w-[165px] xl:w-[200px]" : "w-64 xl:w-[272px]"
          } bg-[#1e293b] text-white flex flex-col transition-all duration-300 ease-in-out h-full pb-12`}
      >
        <button
          onClick={onToggle}
          className="absolute -right-4 top-20 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all duration-200 text-gray-600 hover:text-gray-900"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Welcome Message */}
        <div className="p-6 pb-4">
          <h2 className="text-lg font-medium text-white leading-tight">
            YOU'RE WELCOME
            <br />
            BACK
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6">
          <ul className="space-y-2 mb-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center ${isCollapsed ? "justify-center px-2" : "px-4"
                      } py-3 text-sm font-medium rounded-sm transition-all duration-200 ${isActive
                        ? "bg-[#CCEAE933] text-white shadow-lg border-r-[5px] border-[#019893]"
                        : "text-gray-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    {isActive && !isCollapsed && (
                      <div className="absolute right-0 top-0 bottom-0 w-1  rounded-l-lg"></div>
                    )}
                    <span className={`text-lg ${isCollapsed ? "" : "mr-3"}`}>
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={16}
                        height={16}
                        className={`object-contain${isActive
                          ? " [filter:brightness(0)_saturate(100%)_invert(48%)_sepia(97%)_saturate(749%)_hue-rotate(134deg)_brightness(97%)_contrast(101%)]"
                          : ""
                          }`}
                        style={
                          isActive
                            ? {
                              filter:
                                "brightness(0) saturate(100%) invert(48%) sepia(97%) saturate(749%) hue-rotate(134deg) brightness(97%) contrast(101%)",
                            }
                            : undefined
                        }
                      />
                    </span>
                    {!isCollapsed && (
                      <span className="transition-opacity duration-200 text-[14px] font-[400]">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 mt-auto">
          <div
            className={`flex flex-col items-center mb-6 ${isCollapsed ? "justify-center" : ""
              }`}
          >
            <div className="w-[62px] h-[62px] rounded-full overflow-hidden flex justify-center items-center">
              <Image
                src={user?.avatar || "/default_user.webp"}
                alt="Samuel"
                width={62}
                height={62}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="text-center">
              <p className="text-white font-medium">{user?.first_name} {user?.last_name}</p>
              <p className="text-gray-400 text-sm">Tier: {user?.tier}</p>
            </div>
          </div>

          {/* Upgrade Button */}
          {(!isCollapsed && needsVerification) && (
            <div className="relative mb-6">
              <span className="absolute -top-3 left-0 rounded-r-lg rounded-tl-lg bg-yellow-500 text-[#FD2828] text-xs px-2 py-1 font-medium z-10">
                <span className="bg-red-500 text-white px-1 rounded text-xs">
                  !
                </span>{" "}
                Please Upgrade
              </span>
              <button 
                className="w-full bg-[#10b981] text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-[#059669] transition-colors"
                onClick={openTierUpgrade}
              >
                <ArrowUp className="mr-2 text-[16px]" />
                Upgrade Tier
              </button>
            </div>
          )}

          {/* Collapsed Upgrade Button */}
          {(isCollapsed && needsVerification) && (
            <div className="mb-4 flex justify-center">
              <button
                className="w-12 h-12 relative focus:outline-none"
                title="Upgrade Tier"
                onClick={openTierUpgrade}
              >
                {/* Ochre box */}
                <div className="w-5 h-5 bg-[#CFA32A] rounded-lg absolute top-0 left-0 z-10 flex items-center justify-center shadow-md">
                  {/* Red diamond */}
                  <div className="w-3 h-3 bg-[#C7352B] transform rotate-45 flex items-center justify-center">
                    <span className="text-white font-bold text-[10px] transform -rotate-45">
                      !
                    </span>
                  </div>
                </div>
                {/* Teal box */}
                <div className="w-10 h-10 mr-1 bg-[#258580] rounded-sm absolute bottom-0 right-0 flex items-center justify-center shadow-md">
                  {/* Arrow up */}
                  <ArrowUp className="text-white text-2xl" />
                </div>
              </button>
            </div>
          )}

          {/* Logout Button */}
          <div className="mb-0 flex justify-center">
            <button
              className={`${isCollapsed ? "bg-transparent" : "w-full"
                } bg-[#374151] text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-[#4b5563] transition-colors`}
              onClick={() => {
                logout();
              }}
            >
              <LogOut
                className={isCollapsed ? "text-[20px]" : "text-[16px] mr-2"}
              />
              {!isCollapsed && "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
