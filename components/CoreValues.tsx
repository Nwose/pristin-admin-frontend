import React from "react";
import { CheckCircle, Eye, Users, Calendar } from "lucide-react";

export default function CoreValues() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Mission
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              To empower individuals and businesses with innovative financial
              tools.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Vision
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              To be the global leader in secure and accessible financial
              technology.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Values
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Trust, Innovation, Simplicity, Customer-Centricity
            </p>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Milestones
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              2018: Founded, 2020: Launched first product, 2022: Reached 1M
              users
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
