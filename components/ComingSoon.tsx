"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";


export default function ComingSoon() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#012638]">
      {/* Background with overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/background.png"
          alt="Background"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(1,38,56,0.9) 0%, rgba(1,152,147,0.9) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-snug">
          Something Exciting is Coming Soon
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          We’re building <span className="text-[#1CC5AE]">Pristin</span> — your
          financial growth platform designed for speed, trust, and control. Stay
          tuned!
        </p>

        {/* Single CTA Button */}
        <Link href="/">
          <button className="bg-[#1CC5AE] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow hover:bg-[#019893] transition-colors">
            Back to Home
          </button>
        </Link>

        {/* Optional message */}
        <div className="mt-12 text-white/70 text-sm sm:text-base">
          Be the first to know when we launch. 💡
        </div>
      </div>
    </section>
  );
}
