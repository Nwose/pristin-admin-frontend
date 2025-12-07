"use client";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { Check, Clock, Info } from "lucide-react";

const KYCDocPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Admin Header */}
      <AdminHeader />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Page Title + Back Button */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Review KYC Submission</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </header>

        {/* Tabs */}
        <div className="flex gap-8 border-b mb-8 text-sm font-medium">
          <button
            onClick={() => router.push("/admin/kyc/Review")}
            className="text-gray-500 hover:text-gray-700 pb-2"
          >
            User Details
          </button>
          <button className="border-b-2 border-[#003366] text-[#003366] pb-2">
            KYC Documents
          </button>
          <button
            onClick={() => router.push("/admin/kyc/Review/Review-history")}
            className="text-gray-500 hover:text-gray-700 pb-2"
          >
            Review History
          </button>
        </div>

        {/* Onboarding Tier Section */}
        <section>
          <h2 className="font-semibold text-lg mb-4">Onboarding Tier</h2>

          {/* Progress Bar */}
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Tier 2</p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-[#009688] h-2 rounded-full"
                style={{ width: "66%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-yellow-500 text-sm">Pending</span>
              <span className="text-sm text-gray-700">66%</span>
            </div>
          </div>

          {/* Tier Cards */}
          <div className="mt-8 space-y-4">
            {/* Tier 1 */}
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#009688] p-2 rounded-md text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">Tier 1: Basic Details</p>
                  <p className="text-sm text-gray-500">Email, Name</p>
                </div>
              </div>
              <Info className="w-5 h-5 text-gray-600" />
            </div>

            {/* Tier 2 */}
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="border p-2 rounded-md">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold">Tier 2: ID Verification</p>
                  <p className="text-sm text-gray-500">ID + Selfie</p>
                </div>
              </div>
              <Info className="w-5 h-5 text-gray-600" />
            </div>

            {/* Tier 3 */}
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="border p-2 rounded-md">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold">Tier 3: Address Verification</p>
                  <p className="text-sm text-gray-500">
                    BVN/NIN + Utility Bill
                  </p>
                </div>
              </div>
              <Info className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default KYCDocPage;
