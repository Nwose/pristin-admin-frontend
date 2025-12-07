"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api, ApiError } from "@/lib/api/ApiClient";
import { useAuth } from "@/lib/api/auth/authContext";
import { authUtils } from "@/lib/api/auth/TokenManager";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";
import RegisterService from "@/lib/api/services/Register.Service";
import OtpVerifier, { OtpResult } from "@/components/auth/OTPVerifier";
import { X } from "lucide-react";

export default function VerifyEmail() {
  const router = useRouter();
  const { user, isAuthenticated, partialUser, updatePartialUser } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalError, setModalError] = useState("");
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && authUtils.isAuthenticated()) {
      router.push(FrontendRoutes.dashboard);
    }
  }, [user, router, isAuthenticated]);

  // Check if we have email, if not show modal
  useEffect(() => {
    if (!partialUser?.email) {
      setShowEmailModal(true);
    }
    else {
      setEmail(partialUser.email);
      setShowEmailModal(false);
    }
  }, [partialUser]);

  const handleEmailModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    // Validate email
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalEmail);
    if (!isEmailValid) {
      setModalError("Please enter a valid email address");
      return;
    }

    setIsModalSubmitting(true);

    try {
      // Send OTP to the provided email
      await RegisterService.sendEmailOTP({ email: modalEmail.trim() });

      // Update partial user with the email
      updatePartialUser({ email: modalEmail.trim() });

      // Close modal
      setShowEmailModal(false);
      setModalError("");
    } catch (error: any) {
      console.error("Error sending email OTP:", error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification code. Please try again.";
      setModalError(errorMessage);
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleResendOTP = async (): Promise<OtpResult> => {
    if (!partialUser?.email) {
      setShowEmailModal(true);
      return { ok: false, data: { message: "Email address is required" } };
    }

    try {
      const result = await RegisterService.sendEmailOTP({
        email: partialUser.email,
      });

      return {
        ok: true,
        data: {
          message: result.detail || "Verification code sent successfully!",
        },
      };
    } catch (err: any) {
      console.error("Error resending OTP:", err);
      const error = err as ApiError;
      return {
        ok: false,
        data: {
          message:
            error.message ||
            "Failed to resend code. Please try again.",
        },
      };
    }
  };

  const handleSubmitOTP = async (code: string): Promise<OtpResult> => {
    if (!partialUser?.email) {
      setShowEmailModal(true);
      return { ok: false, data: { message: "Email address is required" } };
    }

    try {
      const result = await RegisterService.verifyEmailOTP({
        email: partialUser.email,
        otp: code,
      });

      // Update partial user to mark email as verified
      updatePartialUser({ is_email_verified: true });

      // Check if phone verification is needed based on the response
      if (result.need_phone_verification) {
        // Navigate to phone verification after a short delay
        setTimeout(() => {
          router.push(FrontendRoutes.verifyPhoneOTP);
        }, 1500);

        return {
          ok: true,
          data: {
            message: "Email verified! Redirecting to phone verification...",
          },
        };
      } else {
        // No phone verification needed, go to login
        setTimeout(() => {
          router.push(FrontendRoutes.login);
        }, 1500);

        return {
          ok: true,
          data: {
            message: "Email verified successfully! Redirecting to login...",
          },
        };
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      const err = error as ApiError;
      return {
        ok: false,
        data: {
          message:
            err.message ||
            "Invalid verification code. Please try again.",
        },
      };
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Hero section */}
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
        <div className="relative z-20 flex flex-col justify-between pt-[12px] text-white w-full">
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

      {/* Right side - Verification form */}
      <div className="w-full lg:w-2/3 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="flex justify-between lg:justify-end items-center p-4 lg:p-6 space-x-4 lg:space-x-8 bg-white shadow-sm">
          <div className="lg:hidden flex items-center">
            <Image
              src="/images/logo_1.png"
              alt="Pristin Capital Logo"
              width={100}
              height={30}
              className="max-w-xs"
              priority
            />
          </div>
          <div className="flex space-x-4 lg:space-x-8">
            <button className="text-gray-600 hover:text-teal-600 font-medium text-sm lg:text-base transition-colors">
              About
            </button>
            <button className="text-gray-600 hover:text-teal-600 font-medium text-sm lg:text-base transition-colors">
              Help
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-8">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 lg:p-12 border border-gray-100">
              {/* <div className="flex justify-center mb-8">
                <Image
                  src="/images/logo_2.jpg"
                  alt="Pristin Capital Logo"
                  width={188}
                  height={58}
                  className="rounded-sm"
                />
              </div> */}

              {partialUser?.email && !showEmailModal ? (
                <OtpVerifier
                  length={6}
                  initialTarget={email}
                  timeBeforeResend={59}
                  autoSendOnMount={true}
                  onSubmit={handleSubmitOTP}
                  onResend={handleResendOTP}
                  heading="Verify Your Email"
                  description="We've sent a 6-digit verification code to"
                  className="w-full"
                />
              ) : (
                <div className="text-center py-8">
                  <div className="animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              )}

              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  Already Verified?{" "}
                  <Link href={ FrontendRoutes.login } className="text-teal-600 hover:underline font-semibold">
                    Log in
                  </Link>
                </p>

                <div className="mt-4">
                  <Link href={ FrontendRoutes.verifyPhoneOTP } className="text-teal-600 hover:underline font-semibold">
                    Verify Phone
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white text-teal-600 py-4 sm:py-6 text-center shadow-xl">
          <p className="text-xs sm:text-sm mb-3 sm:mb-4 px-4">
            © 2025 Pristin. All rights reserved.
          </p>
          <div className="flex justify-center space-x-3 sm:space-x-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
              <svg
                className="w-[16px] h-[16px] text-teal-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
              <svg
                className="w-[16px] h-[16px] text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
              <svg
                className="w-[16px] h-[16px] text-teal-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Email Collection Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-slideUp">
            <button
              onClick={() => {
                setShowEmailModal(false);
                router.push(FrontendRoutes.register);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Enter Your Email
            </h2>
            <p className="text-center text-gray-600 mb-6 text-sm">
              We need your email address to send you a verification code
            </p>

            <form onSubmit={handleEmailModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(e) => {
                    setModalEmail(e.target.value);
                    setModalError("");
                  }}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                  required
                />
                {modalError && (
                  <p className="text-red-500 text-xs mt-1">{modalError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isModalSubmitting}
                className={`w-full py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
                  isModalSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl"
                  }`}
              >
                {isModalSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending Code...
                  </span>
                ) : (
                  "Send Verification Code"
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push(FrontendRoutes.register)}
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}