"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { api, ApiError } from "@/lib/api/ApiClient";
import { useAuth } from "@/lib/api/auth/authContext";
import { authUtils } from "@/lib/api/auth/TokenManager";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";
import RegisterService from "@/lib/api/services/Register.Service";
import OtpVerifier, { OtpResult } from "@/components/auth/OTPVerifier";
import { X } from "lucide-react";

export default function VerifyPhone() {
  const router = useRouter();
  const { user, isAuthenticated, partialUser, updatePartialUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [modalPhone, setModalPhone] = useState<string>("");
  const [modalError, setModalError] = useState("");
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && authUtils.isAuthenticated()) {
      router.push(FrontendRoutes.dashboard);
    }
  }, [user, router, isAuthenticated]);

  // Check if we have phone number, if not show modal
  useEffect(() => {
    if (!partialUser?.phone) {
      setShowPhoneModal(true);
    } else {
      setPhoneNumber(partialUser.phone);
      setShowPhoneModal(false);
    }
  }, [partialUser]);

  const handlePhoneModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    // Validate phone number (should be in E.164 format)
    if (!modalPhone || modalPhone.length < 10) {
      setModalError("Please enter a valid phone number");
      return;
    }

    setIsModalSubmitting(true);

    try {
      // Send OTP to the provided phone number
      await RegisterService.sendPhoneOTP({ phone_number: modalPhone.trim() });

      // Update partial user with the phone number
      updatePartialUser({ phone: modalPhone.trim() });

      // Close modal
      setShowPhoneModal(false);
      setModalError("");
    } catch (error: any) {
      console.error("Error sending phone OTP:", error);
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
    if (!partialUser?.phone) {
      setShowPhoneModal(true);
      return { ok: false, data: { message: "Phone number is required" } };
    }

    try {
      const result = await RegisterService.sendPhoneOTP({
        phone_number: partialUser.phone,
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
    if (!partialUser?.phone) {
      setShowPhoneModal(true);
      return { ok: false, data: { message: "Phone number is required" } };
    }

    try {
      const result = await RegisterService.verifyPhoneOTP({
        phone_number: partialUser.phone,
        otp: code,
      });

      // Update partial user to mark phone as verified
      updatePartialUser({ is_phone_verified: true });

      // Check if email verification is needed based on the response
      if (result.need_email_verification) {
        // Navigate to email verification after a short delay
        setTimeout(() => {
          router.push(FrontendRoutes.verifyEmailOTP);
        }, 1500);

        return {
          ok: true,
          data: {
            message: "Phone verified! Redirecting to email verification...",
          },
        };
      } else {
        // No email verification needed, go to login
        setTimeout(() => {
          router.push(FrontendRoutes.login);
        }, 1500);

        return {
          ok: true,
          data: {
            message: "Phone verified successfully! Redirecting to login...",
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
          <div className="bg-white">
            {partialUser?.phone && !showPhoneModal ? (
              <OtpVerifier
                length={6}
                initialTarget={phoneNumber}
                timeBeforeResend={59}
                autoSendOnMount={true}
                onSubmit={handleSubmitOTP}
                onResend={handleResendOTP}
                heading="Verify Your Phone Number"
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
                  href={FrontendRoutes.verifyEmailOTP}
                  className="text-teal-600 hover:underline font-semibold"
                >
                  Verify Email
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Collection Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-slideUp">
            <button
              onClick={() => {
                setShowPhoneModal(false);
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Enter Your Phone Number
            </h2>
            <p className="text-center text-gray-600 mb-6 text-sm">
              We need your phone number to send you a verification code
            </p>

            <form onSubmit={handlePhoneModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <PhoneInput
                  international
                  defaultCountry="NG"
                  value={modalPhone}
                  onChange={(value) => {
                    setModalPhone(value || "");
                    setModalError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all phone-input"
                  placeholder="Enter phone number"
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

      <style jsx global>{`
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

        .phone-input input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          transition: all 0.2s;
        }

        .phone-input input:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .phone-input .PhoneInputCountry {
          margin-right: 0.5rem;
          padding: 0.75rem 0.5rem;
        }

        .phone-input .PhoneInputCountrySelect {
          border: none;
          outline: none;
        }

        .phone-input .PhoneInputCountrySelectArrow {
          opacity: 0.5;
        }
      `}</style>
    </>
  );
}
