import React from "react";

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            What You Can Do with Pristin
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500">
            Powerful tools for your financial growth
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Get Funding Easily */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <div className="mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Get Funding Easily
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Quick loan applications with automated scoring and instant
                approvals for your business needs.
              </p>
            </div>
            <div className="mt-6 sm:mt-8">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-gray-600 text-sm sm:text-base">
                  Loan Amount
                </span>
                <span className="font-bold text-gray-900 text-base sm:text-lg">
                  ₦500,000
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Grow Your Money */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <div className="mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Grow Your Money
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Smart investment tracking with real-time ROI monitoring and
                portfolio insights.
              </p>
            </div>
            <div className="mt-6 sm:mt-8">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-gray-600 text-sm sm:text-base">
                  Monthly ROI
                </span>
                <span className="font-bold text-green-600 text-base sm:text-lg">
                  +12.5%
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-500 font-medium text-sm sm:text-base">
                  Trending up
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Verify & Manage Users */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <div className="mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Verify & Manage Users
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Streamlined KYC process with automated verification and
                compliance management.
              </p>
            </div>
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-600 font-medium text-sm sm:text-base">
                  ID Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
