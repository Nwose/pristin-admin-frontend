"use client";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useAuth } from "@/lib/api/auth/authContext";

const ReviewKYCPage: FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <>
      {/* Page Header */}
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
        <button className="border-b-2 border-[#003366] text-[#003366] pb-2">
          User Details
        </button>
        <button
          onClick={() => router.push("/admin/kyc/Review/kyc-doc")}
          className="text-gray-500 hover:text-gray-700 pb-2"
        >
          KYC Documents
        </button>
        <button
          onClick={() => router.push("/admin/kyc/Review/Review-history")}
          className="text-gray-500 hover:text-gray-700 pb-2"
        >
          Review History
        </button>
      </div>

      {/* Personal Info */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-3">Personal Information</h2>
        <div className="grid md:grid-cols-2 border-t border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">Adebayo Salami</p>
          </div>
          <div className="border-b border-gray-200 p-4">
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">1985-08-15</p>
          </div>
          <div className="border-b border-gray-200 p-4">
            <p className="text-sm text-gray-500">Country</p>
            <p className="font-medium">United States</p>
          </div>
          <div className="border-b border-gray-200 p-4">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">
              123 Alaye Street, Alagbaka, Akure, Ondo State
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-3">Contact Information</h2>
        <div className="grid md:grid-cols-2 border-t border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <p className="text-sm text-gray-500">Email</p>
            <a
              href="mailto:sophia.carter@email.com"
              className="font-medium text-blue-600 hover:underline"
            >
              sophia.carter@email.com
            </a>
          </div>
          <div className="border-b border-gray-200 p-4">
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium">+234-70555 123-456</p>
          </div>
        </div>
      </section>

      {/* Account Info */}
      <section>
        <h2 className="font-semibold text-lg mb-3">Account Information</h2>
        <div className="grid md:grid-cols-2 border-t border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <p className="text-sm text-gray-500">Account ID</p>
            <p className="font-medium">AC12345678</p>
          </div>
          <div className="border-b border-gray-200 p-4">
            <p className="text-sm text-gray-500">Registration Date</p>
            <p className="font-medium">2025-06-10</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewKYCPage;
