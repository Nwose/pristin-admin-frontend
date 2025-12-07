import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image with gradient overlay */}
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
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-[1300px] px-4 sm:px-6 lg:px-12 py-12 md:py-20 gap-10">
        {/* Left: Hero Text */}
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-snug sm:leading-tight mb-6 text-white break-words">
            <span className="text-[#1CC5AE]">Pristin</span>, Your Financial{" "}
            <br className="hidden sm:block" />
            Growth Platform — Built <br className="hidden sm:block" />
            for Speed, Trust, and <br className="hidden sm:block" />
            Control
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-8 font-medium break-words">
            Simplify deposits, loans, and investments on a secure{" "}
            <br className="hidden sm:block" />
            and transparent digital platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start">
            {/* Link to Sign Up */}
            <Link href="/coming-soon">
              <button className="w-full sm:w-auto bg-[#012638] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow hover:bg-[#019893] transition-colors">
                Get Started Now &rarr;
              </button>
            </Link>

            <button className="w-full sm:w-auto border border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg bg-transparent hover:bg-white hover:text-[#012638] transition-colors">
              Watch How It Works
            </button>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="flex-1 flex items-center justify-center md:justify-end relative mt-10 md:mt-0 w-full sm:w-[90%] md:w-auto">
          <div className="bg-[#012638] rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 relative w-full max-w-[550px] h-[250px] sm:h-[350px] lg:h-[400px] flex items-center justify-center">
            <Image
              src="/images/laptop.png"
              alt="Dashboard Preview"
              fill
              className="rounded-xl shadow-lg object-contain w-full h-full"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 550px"
            />

            {/* Live Dashboard Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow flex items-center gap-2 sm:gap-3">
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full inline-block"></span>
              <span className="text-[#012638] font-medium text-sm sm:text-base lg:text-lg">
                Live Dashboard
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
