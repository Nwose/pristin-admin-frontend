"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BsFillBellFill } from "react-icons/bs";
import { Menu, User } from "lucide-react";
import Notification from "./Notification";
import Customer from "./Customer";
import { useAuth } from "@/lib/api/auth/authContext";
import {
  getNotifications,
  NotificationType,
} from "@/services/notification.service";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const openNotifications = async () => {
    if (loadingNotifications) return;
    setLoadingNotifications(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setShowNotifications(true);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-2 relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 text-[#001B2E]"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex h-16 items-center">
            <img
              src="/images/logo_1.png"
              alt="Pristin Capital"
              className="w-auto h-12"
            />
          </div>
        </div>

        <div className="flex-1 flex justify-center px-6">
          <div className="relative w-full max-w-3xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center">
              <FaSearch className="text-[#667085] w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="block w-full py-3 rounded-full bg-[#F2F3F5] border border-[#C9CED4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 text-left pl-16 pr-6"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.first_name || "User"}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="text-gray-500 w-6 h-6" />
            )}
          </div>

          <span className="text-[#001B2E] font-semibold hidden lg:block uppercase mr-8">
            HI, {user?.first_name?.toUpperCase() || "USER"}
          </span>

          <button
            className="flex items-center gap-1 text-[#001B2E] hover:underline"
            onClick={() => setShowSupport(true)}
          >
            <span className="hidden md:block font-medium">Support</span>
            <div className="w-5 h-5 hidden md:block mr-1">
              <img
                src="/images/icons/support-icon.png"
                alt="Support Icon"
                className="object-contain w-full h-full"
              />
            </div>
          </button>

          <div className="relative cursor-pointer" onClick={openNotifications}>
            <BsFillBellFill className="text-[#001B2E] w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-semibold">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {showSupport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            <button
              onClick={() => setShowSupport(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
            <Customer />
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="relative bg-white w-full sm:w-[450px] max-w-[450px] h-full shadow-lg animate-slideInRight">
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
            <div className="p-4 overflow-y-auto h-full">
              {loadingNotifications ? (
                <p className="text-center text-gray-500 mt-10">
                  Loading notifications...
                </p>
              ) : (
                <Notification notifications={notifications} />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
