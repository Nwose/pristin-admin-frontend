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
    } else {
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
          message: error.message || "Failed to resend code. Please try again.",
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
            err.message || "Invalid verification code. Please try again.",
        },
      };
    }
  };

  return (
    <>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-white ">
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
                <Link
                  href={FrontendRoutes.login}
                  className="text-teal-600 hover:underline font-semibold"
                >
                  Log in
                </Link>
              </p>

              <div className="mt-4">
                <Link
                  href={FrontendRoutes.verifyPhoneOTP}
                  className="text-teal-600 hover:underline font-semibold"
                >
                  Verify Phone
                </Link>
              </div>
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
    </>
  );
}
