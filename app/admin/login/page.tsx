"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  loginFirstFactor,
  loginSecondFactor,
  send2FA_OTP,
} from "@/services/auth";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [tfaToken, setTfaToken] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!showOtp) {
        // Step 1: First factor login
        const data = await loginFirstFactor(formData.email, formData.password);

        // If 2FA required
        if (data.tfa_token) {
          setTfaToken(data.tfa_token);
          localStorage.setItem("tfa_token", data.tfa_token);

          // Send OTP
          await send2FA_OTP(data.tfa_token);
          toast.info("2FA code sent! Check your email.");
          setShowOtp(true);
          return;
        }

        // If login successful without 2FA
        if (data.access_token || data.access) {
          localStorage.setItem(
            "access_token",
            data.access_token || data.access
          );
          localStorage.setItem("refresh_token", data.refresh_token || "");
          toast.success("Login successful!");
          setTimeout(() => (window.location.href = "/admin/dashboard"), 1200);
          return;
        }

        throw new Error("Unexpected server response");
      }

      // Step 2: Second factor (2FA) login
      if (showOtp && tfaToken) {
        const data = await loginSecondFactor(tfaToken, formData.otp);
        if (!data.access_token && !data.access) {
          throw new Error("Invalid 2FA code");
        }

        localStorage.setItem("access_token", data.access_token || data.access);
        localStorage.setItem("refresh_token", data.refresh_token || "");
        toast.success("Login successful!");
        setTimeout(() => (window.location.href = "/admin/dashboard"), 1000);
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center px-4 py-8">
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar />
      <div className="bg-white backdrop-blur-sm rounded-3xl p-8 w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo_d.png"
            alt="Pristin Capital"
            width={60}
            height={60}
            className="mx-auto mb-4"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-slate-800 text-2xl font-bold">Admin Login</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!showOtp ? (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-slate-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg placeholder-slate-600 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-slate-700 font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg placeholder-slate-600 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  required
                />
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="otp"
                className="block text-slate-700 font-medium mb-2"
              >
                Enter 2FA Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter your 6-digit code"
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg placeholder-slate-600 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
                required
              />
            </div>
          )}

          {!showOtp && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-slate-800 bg-transparent border-2 border-slate-600 rounded focus:ring-slate-800 focus:ring-2"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-slate-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/admin/forgot-password"
                className="text-sm text-slate-700 hover:text-slate-800 underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors mt-6"
          >
            {loading
              ? showOtp
                ? "Verifying..."
                : "Please wait..."
              : showOtp
              ? "Verify 2FA"
              : "Login"}
          </button>
        </form>

        {!showOtp && (
          <div className="text-center mt-6">
            <p className="text-slate-700 text-sm">
              Don’t have an account?{" "}
              <Link
                href="/admin/signup"
                className="underline hover:text-slate-800 font-medium"
              >
                Create one here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
