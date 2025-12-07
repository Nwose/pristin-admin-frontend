"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";


export interface OtpResult {
  ok: boolean;
  data?: any;
}

export interface OtpVerifierProps {
  length?: number;
  initialTarget?: string | null;
  timeBeforeResend?: number;
  autoSendOnMount?: boolean;
  onSubmit: (code: string) => Promise<OtpResult>;
  onResend: () => Promise<OtpResult | void>;
  heading?: string;
  description?: string;
  onSuccess?: (data?: any) => void;
  className?: string;
}

export const OtpVerifier: React.FC<OtpVerifierProps> = ({
  length = 6,
  initialTarget = null,
  timeBeforeResend = 59,
  autoSendOnMount = false,
  onSubmit,
  onResend,
  heading = "Verify Code",
  description = "We've sent a verification code. Enter it below.",
  onSuccess,
  className,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timeLeft, setTimeLeft] = useState<number>(timeBeforeResend);
  const [isExpired, setIsExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [showPasteHint, setShowPasteHint] = useState(true);

  const targetIsEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
    initialTarget || ""
  );
  const targetHref = targetIsEmail ? `mailto:${initialTarget}` : `tel:${initialTarget}`;
  useEffect(() => {
    if (autoSendOnMount && initialTarget) {
      handleResend();
    }
  }, [initialTarget]);

  useEffect(() => {
    if (timeLeft > 0 && !isSuccess) {
      const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(id);
    } else if (timeLeft <= 0) {
      setIsExpired(true);
    }
  }, [timeLeft, isSuccess]);

  useEffect(() => {
    if (isOtpComplete && !isExpired && !isSubmitting) {
      handleSubmit();
    }
  }, [otp]);

  const isOtpComplete = otp.every((d) => d !== "");

  const focusIndex = (index: number) => {
    if (index >= 0 && index < length) {
      setCurrentInputIndex(index);
      inputRefs.current[index]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    
    if (pastedData.length === 0) return;

    setShowPasteHint(false);
    
    const newOtp = [...otp];
    const startIndex = currentInputIndex;
    
    for (let i = 0; i < pastedData.length && startIndex + i < length; i++) {
      newOtp[startIndex + i] = pastedData[i];
    }
    
    setOtp(newOtp);
    setIsError(false);
    setServerMessage(null);
    
    const nextEmptyIndex = newOtp.findIndex((val, idx) => idx >= startIndex && val === "");
    if (nextEmptyIndex !== -1) {
      focusIndex(nextEmptyIndex);
    } else {
      focusIndex(length - 1);
    }
  };

  const handleOtpChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "");
    
    if (value.length === 0) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    if (value.length > 1) {
      const newOtp = [...otp];
      for (let i = 0; i < value.length && index + i < length; i++) {
        newOtp[index + i] = value[i];
      }
      setOtp(newOtp);
      setIsError(false);
      setServerMessage(null);
      
      const nextIndex = Math.min(index + value.length, length - 1);
      focusIndex(nextIndex);
      return;
    }

    setOtp((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    setIsError(false);
    setServerMessage(null);
    setShowPasteHint(false);

    if (value && index < length - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[index]) {
        setOtp((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        setOtp((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        focusIndex(index - 1);
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusIndex(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusIndex(index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusIndex(length - 1);
    } else if (e.key === "Enter" && isOtpComplete && !isExpired && !isSubmitting) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFocus = (index: number) => {
    setCurrentInputIndex(index);
    inputRefs.current[index]?.select();
  };

  const resetInputsForResend = () => {
    setOtp(Array(length).fill(""));
    setIsError(false);
    setIsSuccess(false);
    setServerMessage(null);
    setCurrentInputIndex(0);
    setShowPasteHint(true);
    inputRefs.current[0]?.focus();
  };

  const handleResend = async () => {
    try {
      setTimeLeft(timeBeforeResend);
      setIsExpired(false);
      resetInputsForResend();
      const result = await onResend();
      
      if (result && !result.ok) {
        setIsError(true);
        setServerMessage(result.data?.message || "Failed to resend code");
      }
    } catch (err: any) {
      setIsError(true);
      setServerMessage(err?.message || "Failed to resend code");
      console.error("[OtpVerifier] resend failed:", err);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!isOtpComplete || isExpired || isSubmitting) return;

    setIsSubmitting(true);
    setIsError(false);
    setServerMessage(null);

    const code = otp.join("");

    try {
      const result = await onSubmit(code);

      if (result?.ok) {
        setIsSuccess(true);
        setIsError(false);
        setServerMessage(typeof result.data?.message === "string" ? result.data.message : null);
        if (onSuccess) onSuccess(result.data);
      } else {
        setIsError(true);
        const fallback =
          result?.data?.message ||
          (typeof result?.data === "string" ? result.data : null) ||
          "Invalid verification code";
        setServerMessage(fallback);
        
        setOtp(Array(length).fill(""));
        setTimeout(() => focusIndex(0), 100);
      }
    } catch (err: any) {
      setIsError(true);
      const m =
        (err && (err.message || err?.response?.data?.message || err?.response?.data?.detail)) ||
        "Verification failed";
      setServerMessage(String(m));
      console.error("[OtpVerifier] submit error:", err);
      
      setOtp(Array(length).fill(""));
      setTimeout(() => focusIndex(0), 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={className}>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
          {/* <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg> */}
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-3">{heading}</h2>

      <p className="text-center text-gray-600 mb-2 text-sm sm:text-base px-2">
        {description}
      </p>
      
      {initialTarget && (
        <p className="text-center text-teal-600 font-semibold mb-6 text-sm sm:text-base">
          <Link href={targetHref}>{initialTarget}</Link>
        </p>
      )}

      {showPasteHint && !isSuccess && (
        <div className="text-center mb-6">
          <p className="text-xs sm:text-sm text-gray-500 inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            You can paste your code directly
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {Array.from({ length }).map((_, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp[idx] ?? ""}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onFocus={() => handleFocus(idx)}
                onPaste={handlePaste}
                aria-label={`OTP digit ${idx + 1}`}
                maxLength={2}
                disabled={isSuccess}
                className={`w-11 h-14 sm:w-14 sm:h-16 border-2 rounded-xl text-center text-xl sm:text-2xl font-bold focus:outline-none transition-all duration-200 ${
                  isSuccess
                    ? "border-green-400 bg-green-50 text-green-600"
                    : isError
                    ? "border-red-400 bg-red-50 text-red-600 animate-shake"
                    : otp[idx]
                    ? "border-teal-500 bg-white text-gray-800 shadow-md"
                    : currentInputIndex === idx
                    ? "border-teal-400 bg-white shadow-lg ring-2 ring-teal-200 text-gray-800"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                }`}
              />
            ))}
          </div>

          {isError && serverMessage && (
            <div className="flex items-center justify-center gap-2 text-red-600 font-medium mb-4 animate-fadeIn">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm sm:text-base">{serverMessage}</p>
            </div>
          )}

          {isSuccess && serverMessage && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium mb-4 animate-fadeIn">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm sm:text-base">{serverMessage}</p>
            </div>
          )}

          {timeLeft > 0 && !isSuccess && !isExpired && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-blue-50 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Code expires in{" "}
                  <span className={`font-bold ${timeLeft <= 10 ? "text-red-600" : "text-teal-600"}`}>
                    {formatTime(timeLeft)}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {!isSuccess && (
          <div className="space-y-3">
            <button
              type="submit"
              disabled={!isOtpComplete || isExpired || isSubmitting}
              className={`w-full py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 ${
                isOtpComplete && !isExpired && !isSubmitting
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </button>

            {isExpired && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm sm:text-base transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend Code
                </button>
              </div>
            )}

            {!isExpired && timeLeft > 0 && (
              <p className="text-center text-xs sm:text-sm text-gray-500 pt-2">
                Didn't receive the code? Wait for the timer to resend
              </p>
            )}
          </div>
        )}
      </form>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OtpVerifier;