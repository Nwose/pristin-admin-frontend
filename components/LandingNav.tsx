"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // icons

export default function LandingNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-30 w-full bg-[#CDEBEB]">
      <div className="flex items-center justify-between px-6 md:px-14 h-20 md:h-24 max-w-[1300px] mx-auto">
        {/* Logo */}
        <div className="flex items-center h-full">
          <Link href="/" className="flex items-center h-full">
            <Image
              src="/images/PristinLogo.svg"
              alt="Pristin Capital"
              width={0}
              height={0}
              sizes="100vw"
              className="h-full w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className={`text-[#012638] font-bold text-lg ${
              pathname === "/" ? "border-b-4 border-[#012638] pb-1" : ""
            }`}
          >
            Home
          </Link>

          <Link
            href="/contact"
            className={`text-[#012638] font-bold text-lg ${
              pathname === "/contact" ? "border-b-4 border-[#012638] pb-1" : ""
            }`}
          >
            Contact Us
          </Link>

          <Link
            href="/about"
            className={`text-[#012638] font-bold text-lg ${
              pathname === "/about" ? "border-b-4 border-[#012638] pb-1" : ""
            }`}
          >
            About Us
          </Link>

          <Link
            href="/auth/login"
            className="bg-[#012638] text-white px-6 py-2 rounded font-semibold text-lg hover:bg-[#019893] transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center text-[#012638]"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 bg-[#CDEBEB] pb-6">
          <Link
            href="/"
            className={`text-[#012638] font-bold text-lg ${
              pathname === "/" ? "border-b-4 border-[#012638] pb-1" : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/contact"
            className={`text-[#012638] font-bold text-lg ${
              pathname === "/contact" ? "border-b-4 border-[#012638] pb-1" : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>

          <Link
            href="/about"
            className={`text-[#012638] font-bold text-lg ${
              pathname === "/about" ? "border-b-4 border-[#012638] pb-1" : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>

          <Link
            href="/auth/login"
            className="bg-[#012638] text-white px-6 py-2 rounded font-semibold text-lg hover:bg-[#019893] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
