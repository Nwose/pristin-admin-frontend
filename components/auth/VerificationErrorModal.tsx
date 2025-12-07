"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";

export interface VerificationStatus {
  email_verified: string | boolean;
  phone_number_verified: string | boolean;
}

interface VerificationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationStatus: VerificationStatus;
}

export default function VerificationErrorModal({
  isOpen,
  onClose,
  verificationStatus,
}: VerificationErrorModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Convert string "False"/"True" to boolean
  const emailVerified =
    verificationStatus.email_verified === true ||
    verificationStatus.email_verified === "True";
  const phoneVerified =
    verificationStatus.phone_number_verified === true ||
    verificationStatus.phone_number_verified === "True";

  const needsEmailVerification = !emailVerified;
  const needsPhoneVerification = !phoneVerified;
  const bothUnverified = needsEmailVerification && needsPhoneVerification;

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Trigger animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.style.overflow = "unset";
      setIsVisible(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route);
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-white/60 backdrop-blur-md bg-opacity-50" : "bg-transparent"
      }`}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-full p-1"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with icon */}
        <div className="pt-8 pb-6 px-6 sm:px-8 text-center border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
              <AlertCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h2
            id="verification-modal-title"
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Verification Required
          </h2>
          <p className="text-gray-600 text-sm">
            {bothUnverified
              ? "Please verify your account to continue"
              : needsEmailVerification
              ? "Please verify your email address to continue"
              : "Please verify your phone number to continue"}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-6 space-y-4">
          {/* Email verification status */}
          <div
            className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${
              emailVerified
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200 hover:border-red-300"
            }`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                emailVerified
                  ? "bg-green-100"
                  : "bg-red-100 animate-pulse-slow"
              }`}
            >
              {emailVerified ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Mail className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-sm mb-1 ${
                  emailVerified ? "text-green-800" : "text-red-800"
                }`}
              >
                Email Verification
              </h3>
              <p
                className={`text-xs mb-2 ${
                  emailVerified ? "text-green-700" : "text-red-700"
                }`}
              >
                {emailVerified ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Your email has been verified
                  </span>
                ) : (
                  "Your email needs verification"
                )}
              </p>
              {!emailVerified && (
                <button
                  onClick={() => handleNavigate(FrontendRoutes.verifyEmailOTP)}
                  className="text-xs font-semibold text-red-700 hover:text-red-800 underline underline-offset-2 hover:underline-offset-4 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                >
                  Verify Email Now →
                </button>
              )}
            </div>
          </div>

          {/* Phone verification status */}
          <div
            className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${
              phoneVerified
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200 hover:border-red-300"
            }`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                phoneVerified
                  ? "bg-green-100"
                  : "bg-red-100 animate-pulse-slow"
              }`}
            >
              {phoneVerified ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Phone className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-sm mb-1 ${
                  phoneVerified ? "text-green-800" : "text-red-800"
                }`}
              >
                Phone Verification
              </h3>
              <p
                className={`text-xs mb-2 ${
                  phoneVerified ? "text-green-700" : "text-red-700"
                }`}
              >
                {phoneVerified ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Your phone number has been verified
                  </span>
                ) : (
                  "Your phone number needs verification"
                )}
              </p>
              {!phoneVerified && (
                <button
                  onClick={() => handleNavigate(FrontendRoutes.verifyPhoneOTP)}
                  className="text-xs font-semibold text-red-700 hover:text-red-800 underline underline-offset-2 hover:underline-offset-4 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                >
                  Verify Phone Now →
                </button>
              )}
            </div>
          </div>

          {/* Info box */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-teal-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-teal-800 leading-relaxed">
                  {bothUnverified
                    ? "For your security, both your email and phone number must be verified before you can access your account."
                    : needsEmailVerification
                    ? "For your security, your email must be verified before you can access your account."
                    : "For your security, your phone number must be verified before you can access your account."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            I'll Verify Later
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-bounce-slow,
          .animate-pulse-slow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}