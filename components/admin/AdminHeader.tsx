"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [loanDropdownOpen, setLoanDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "Admin",
    avatar: "/images/profile.jpg",
  });

  // 🔥 Updated nav order — Loans is now 3rd
  const navLinks = [
    { name: "Dashboard", href: FrontendRoutes.dashboard },
    { name: "Users", href: FrontendRoutes.users },
    { name: "Loans", href: "#" }, // placeholder, dropdown replaces the click
    { name: "Investments", href: FrontendRoutes.investments },
    { name: "KYC", href: FrontendRoutes.kyc },
    { name: "Penalty", href: FrontendRoutes.penalty },
  ];

  // 🔥 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push(FrontendRoutes.login);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-2 sm:px-6 py-2 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/images/logo_d.png"
            alt="Pristin Capital"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            Pristin Capital
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 relative">
          {/* Dashboard + Users */}
          <Link
            href={FrontendRoutes.dashboard}
            className={`pb-1 transition ${
              pathname.startsWith(FrontendRoutes.dashboard)
                ? "text-teal-600 font-semibold border-b-2 border-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href={FrontendRoutes.users}
            className={`pb-1 transition ${
              pathname.startsWith(FrontendRoutes.users)
                ? "text-teal-600 font-semibold border-b-2 border-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Users
          </Link>

          {/* 🔥 LOANS DROPDOWN — Now Position 3 */}
          <div className="relative">
            <button
              onClick={() => setLoanDropdownOpen(!loanDropdownOpen)}
              className={`pb-1 flex items-center transition ${
                pathname.startsWith(FrontendRoutes.loans) ||
                pathname.startsWith(FrontendRoutes.loanProducts)
                  ? "text-teal-600 font-semibold border-b-2 border-teal-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Loans
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${
                  loanDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {loanDropdownOpen && (
              <div className="absolute bg-white border border-gray-200 rounded-md shadow-md mt-2 w-40 z-50">
                <Link
                  href={FrontendRoutes.loans}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setLoanDropdownOpen(false)}
                >
                  Loan Applications
                </Link>
                <Link
                  href={FrontendRoutes.loanProducts}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setLoanDropdownOpen(false)}
                >
                  Loan Products
                </Link>
              </div>
            )}
          </div>

          {/* Investments */}
          <Link
            href={FrontendRoutes.investments}
            className={`pb-1 transition ${
              pathname.startsWith(FrontendRoutes.investments)
                ? "text-teal-600 font-semibold border-b-2 border-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Investments
          </Link>

          {/* KYC */}
          <Link
            href={FrontendRoutes.kyc}
            className={`pb-1 transition ${
              pathname.startsWith(FrontendRoutes.kyc)
                ? "text-teal-600 font-semibold border-b-2 border-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            KYC
          </Link>

          {/* Penalty */}
          <Link
            href={FrontendRoutes.penalty}
            className={`pb-1 transition ${
              pathname.startsWith(FrontendRoutes.penalty)
                ? "text-teal-600 font-semibold border-b-2 border-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Penalty
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Notification */}
          <Link
            href={FrontendRoutes.notifications}
            className="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </Link>

          {/* Profile */}
          <div className="relative group">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer">
              <Image
                src={adminData.avatar}
                alt="Admin Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border border-gray-200 rounded-md shadow-md w-40 z-50">
              <div className="px-4 py-2 text-gray-700 text-sm font-medium">
                {adminData.name}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 🔥 Mobile Navigation (Loans still 3rd) */}
      {isOpen && (
        <div className="md:hidden mt-3 bg-gray-50 border-t border-gray-200 rounded-lg shadow-sm p-4 space-y-3 animate-fadeIn">
          <Link
            href={FrontendRoutes.dashboard}
            onClick={() => setIsOpen(false)}
            className={`block text-sm px-2 py-1 rounded transition ${
              pathname.startsWith(FrontendRoutes.dashboard)
                ? "text-teal-600 font-semibold bg-teal-50"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href={FrontendRoutes.users}
            onClick={() => setIsOpen(false)}
            className={`block text-sm px-2 py-1 rounded transition ${
              pathname.startsWith(FrontendRoutes.users)
                ? "text-teal-600 font-semibold bg-teal-50"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Users
          </Link>

          {/* Mobile Loans dropdown placement */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mt-2 mb-1">
              Loans
            </p>
            <Link
              href={FrontendRoutes.loans}
              onClick={() => setIsOpen(false)}
              className="block text-sm px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Loan Applications
            </Link>
            <Link
              href={FrontendRoutes.loanProducts}
              onClick={() => setIsOpen(false)}
              className="block text-sm px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Loan Products
            </Link>
          </div>

          <Link
            href={FrontendRoutes.investments}
            onClick={() => setIsOpen(false)}
            className={`block text-sm px-2 py-1 rounded transition ${
              pathname.startsWith(FrontendRoutes.investments)
                ? "text-teal-600 font-semibold bg-teal-50"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Investments
          </Link>

          <Link
            href={FrontendRoutes.kyc}
            onClick={() => setIsOpen(false)}
            className={`block text-sm px-2 py-1 rounded transition ${
              pathname.startsWith(FrontendRoutes.kyc)
                ? "text-teal-600 font-semibold bg-teal-50"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            KYC
          </Link>

          <Link
            href={FrontendRoutes.penalty}
            onClick={() => setIsOpen(false)}
            className={`block text-sm px-2 py-1 rounded transition ${
              pathname.startsWith(FrontendRoutes.penalty)
                ? "text-teal-600 font-semibold bg-teal-50"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Penalty
          </Link>
        </div>
      )}
    </header>
  );
}
