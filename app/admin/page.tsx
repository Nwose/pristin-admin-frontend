import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminWelcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-600 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-12">
        <Image
          src="/images/logo_d.png"
          alt="Pristin Capital"
          width={100}
          height={100}
          className="mx-auto"
        />
      </div>

      {/* Main Content */}
      <div className="text-center mb-12">
        {/* Illustration */}
        <div className="mb-8">
          <Image
            src="/images/loginFrame.png"
            alt="Admin Dashboard Illustration"
            width={300}
            height={250}
            className="mx-auto"
          />
        </div>

        {/* Welcome Text */}
        <h1 className="text-white text-3xl font-normal mb-2">Welcome to</h1>
        <h2 className="text-slate-800 text-4xl font-bold">
          Pristin Admin Dashboard
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          href="/admin/login"
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 px-8 rounded-lg font-semibold text-center transition-colors"
        >
          Login
        </Link>
        <Link
          href="/admin/signup"
          className="flex-1 bg-white hover:bg-gray-50 text-slate-800 py-4 px-8 rounded-lg font-semibold text-center transition-colors border border-white"
        >
          Create Account
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-white/80 text-sm">
          Secure admin access for Pristin Capital
        </p>
      </div>
    </div>
  );
}
