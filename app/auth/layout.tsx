"use client";

import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/loginImage.png')" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.3) 10%, #012638 100%)",
            }}
          ></div>
        </div>

        <div className="relative z-20 flex flex-col justify-between pt-3 text-white w-full">
          <div className="flex items-center justify-center">
            <Image
              src="/images/logo_1.png"
              alt="Pristin Capital Logo"
              width={200}
              height={60}
              className="max-w-xs"
              priority
            />
          </div>

          <div className="flex-2 flex items-start justify-start pl-[27px] pt-8">
            <Image
              src="/images/loginFrame.png"
              alt="Access. Loans. Grow Wealth. All in One App."
              width={184}
              height={278}
              className="max-w-sm"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-2/3 flex flex-col bg-gray-50">
        {/* Top Nav */}
        <div className="flex justify-between lg:justify-end items-center p-4 lg:p-6 space-x-4 lg:space-x-8 bg-white shadow-sm">
          <div className="lg:hidden flex items-center">
            <div className="rounded-sm flex items-center justify-center">
              <Image
                src="/images/logo_1.png"
                alt="Pristin Capital Logo"
                width={100}
                height={30}
                className="max-w-xs"
                priority
              />
            </div>
          </div>
          <div className="flex space-x-4 lg:space-x-8">
            <button className="text-gray-600 hover:text-teal-600 transition-colors font-medium text-sm lg:text-base">
              About
            </button>
            <button className="text-gray-600 hover:text-teal-600 transition-colors font-medium text-sm lg:text-base">
              Help
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-8">
          {children}
        </div>

        {/* Footer */}
        <div className="bg-white text-teal-600 py-4 sm:py-6 text-center shadow-xl">
          <p className="text-xs sm:text-sm mb-3 sm:mb-4 px-4">
            © 2025 Pristin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
