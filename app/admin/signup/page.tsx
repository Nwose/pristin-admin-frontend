"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { register } from "@/services/auth";

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const nameParts = formData.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const response = await register(
        formData.email,
        formData.password,
        firstName,
        lastName,
        "08000000000"
      );
      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Account created successfully. You can now login.");
        setFormData({
          email: "",
          name: "",
          password: "",
          agreeToTerms: false,
        });
      } else {
        setErrorMsg(data?.detail || "Unable to create account. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center px-4 py-8">
      <div className="bg-teal-200/50 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md shadow-2xl">
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
          <h1 className="text-slate-800 text-2xl font-bold">Create Account</h1>
        </div>

        {/* Messages */}
        {errorMsg && (
          <p className="text-red-700 text-center mb-4 font-medium">
            {errorMsg}
          </p>
        )}
        {successMsg && (
          <p className="text-green-700 text-center mb-4 font-medium">
            {successMsg}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-teal-300/50 border-none rounded-lg placeholder-slate-600 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-slate-700 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Samuel Blessing Daudu"
              className="w-full px-4 py-3 bg-teal-300/50 border-none rounded-lg placeholder-slate-600 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
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
              placeholder="Your password"
              className="w-full px-4 py-3 bg-teal-300/50 border-none rounded-lg placeholder-slate-600 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="w-4 h-4 text-slate-800 bg-transparent border-2 border-slate-600 rounded focus:ring-slate-800 focus:ring-2"
              required
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 text-sm text-slate-700"
            >
              I agree to the{" "}
              <Link href="#" className="underline hover:text-slate-800">
                Terms and Conditions
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors mt-6 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-700 text-sm">
            Already have an account?{" "}
            <Link
              href="/admin/login"
              className="underline hover:text-slate-800 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
