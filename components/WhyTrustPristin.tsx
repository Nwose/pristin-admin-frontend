import React from "react";

export default function WhyTrustPristin() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Trust Pristin?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500">
            Built with security and reliability at its core
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Bank-Level Security */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 mx-auto">
              <img
                src="/icons/sheildIcon.svg"
                alt="Shield"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-teal-600 mb-3 sm:mb-4">
              Bank-Level Security
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Advanced encryption and OTP-secured actions protect your financial
              data.
            </p>
          </div>

          {/* Automated Workflows */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 mx-auto">
              <img
                src="/icons/settingsIcon.svg"
                alt="Settings"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-teal-600 mb-3 sm:mb-4">
              Automated Workflows
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Reduce human errors with intelligent automation and smart
              processes.
            </p>
          </div>

          {/* SME Scalability */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 mx-auto">
              <img
                src="/icons/layersIcon.svg"
                alt="Layers"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-teal-600 mb-3 sm:mb-4">
              SME Scalability
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Built specifically for small and medium enterprises to scale
              efficiently.
            </p>
          </div>

          {/* Real-Time Insights */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 mx-auto">
              <img
                src="/icons/fileTextIcon.svg"
                alt="File Text"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-teal-600 mb-3 sm:mb-4">
              Real-Time Insights
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Access live data and comprehensive admin controls for informed
              decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
