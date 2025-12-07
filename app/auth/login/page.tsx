"use client";

import Image from "next/image";
import Link from "next/link";
import VerificationErrorModal, {
  VerificationStatus,
} from "@/components/auth/VerificationErrorModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth/authContext";
import { authUtils, TokenResponse } from "@/lib/api/auth/TokenManager";
import { ApiError } from "@/lib/api/ApiClient";
import { toast as toastFn } from "react-toastify";
import { Routes } from "@/lib/api/FrontendRoutes";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";

function isDetailsObject(
  details: unknown
): details is { detail?: string; message?: string; error?: string } {
  return typeof details === "object" && details !== null;
}

interface VerificationErrorShape {
  error: "user email or phone number not verified";
  details: {
    email_verified: string;
    phone_number_verified: string;
  };
}

function isAboutResourceVerification(
  data: unknown
): data is VerificationErrorShape {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    (data as any).error === "user email or phone number not verified" &&
    "details" in data &&
    typeof (data as any).details === "object" &&
    (data as any).details !== null &&
    "email_verified" in (data as any).details &&
    typeof (data as any).details.email_verified === "string" &&
    "phone_number_verified" in (data as any).details &&
    typeof (data as any).details.phone_number_verified === "string"
  ) {
    return true;
  }

  return false;
}

export default function Login() {
  const router = useRouter();
  const auth = useAuth();
  const {
    user,
    login,
    isLoading,
    error,
    clearError,
    partialUser,
    updatePartialUser,
  } = auth;

  const [email, setEmail] = useState(partialUser?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showVerificationErrorModal, setShowVerificationErrorModal] =
    useState(false);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>({
      email_verified: "",
      phone_number_verified: "",
    });

  // If a tfa flow was started previously, AuthProvider stores the tfa_token in localStorage.
  // We detect that and advise the user to continue on the dedicated 2FA page.
  const [hasTfaToken, setHasTfaToken] = useState(false);

  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      toastFn.success("User is already logged in, redirecting to dashboard.");
      router.push(FrontendRoutes.dashboard);
    }
    const t =
      typeof window !== "undefined" ? localStorage.getItem("tfa_token") : null;
    const k = t && partialUser?.tfa_token === t;
    setHasTfaToken(Boolean(k));
  }, []);

  // Clear context error when user edits inputs
  useEffect(() => {
    if (error) {
      let msg: string;

      if (error.details && isDetailsObject(error.details)) {
        msg = (error.details.detail ||
          error.details.message ||
          error.details.error) as string;
        setErrorMsg(msg);
      }

      // do something with msg...
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      // simple UX guard
      return;
    }

    updatePartialUser({ email, phone: "" });

    try {
      // pass shape your backend expects (email/password). AuthProvider will handle first-factor,
      // tfa redirect, token storage, and user fetch as implemented there.
      await login({ email, password });
      // if login completes without 2FA, AuthProvider will have fetched user and you can redirect (optional)
      // but avoid double-redirect: if the provider already redirects, this push will be harmless.
      if (!localStorage.getItem("tfa_token") || user) {
        // send user to dashboard/home after successful full-login
        router.push(Routes.dashboard);
      } else {
        // provider probably redirected to 2FA already; ensure user lands on the 2FA page
        router.push(Routes.loginSecondFactor);
      }
    } catch (err) {
      // auth.login already sets error in context; we only log here for debugging
      console.error("[Login] login failed:", err);
      const error = err as ApiError;
      setErrorMsg(error.message);
      const errRes = error.details;
      if (isAboutResourceVerification(errRes)) {
        const details = errRes.details;
        setVerificationStatus({
          email_verified: details.email_verified,
          phone_number_verified: details.phone_number_verified,
        });
        setShowVerificationErrorModal(true);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) clearError();
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) clearError();
    setPassword(e.target.value);
  };

  return (
    <>
      {/* the actuall auth view */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-8">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 lg:p-12 border border-gray-100">
            <div className="flex justify-center mb-8">
              <Image
                src="/images/logo_2.jpg"
                alt="Pristin Capital Logo"
                width={120}
                height={40}
                className="h-10"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-3">
              Welcome Back
            </h2>

            <p className="text-center text-teal-600 mb-8 lg:mb-10 text-sm sm:text-base">
              Welcome back, Let's continue where you left off!
            </p>

            {hasTfaToken && (
              <div className="mb-6 p-4 border-l-4 border-teal-500 bg-teal-50 text-sm text-teal-800 rounded">
                We detected an in-progress two-factor authentication flow.
                <div className="mt-2">
                  <button
                    onClick={() =>
                      router.push(Routes.loginSecondFactor ?? "/auth/2fa")
                    }
                    className="underline font-medium"
                  >
                    Continue to Two-Factor Authentication
                  </button>
                </div>
              </div>
            )}

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3"
                >
                  Email or Phone Number
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Samuel@thehiveincubator.com"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition-all text-gray-700 placeholder-gray-400 bg-gray-50 text-sm sm:text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    className={`w-full px-3 sm:px-4 py-3 sm:py-4 border-2 rounded-lg focus:ring-2 focus:ring-teal-200 outline-none transition-all text-gray-700 bg-gray-50 text-sm sm:text-base ${
                      error
                        ? "border-red-500 focus:border-red-500"
                        : "border-teal-500 focus:border-teal-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 sm:py-4 rounded-sm font-semibold text-base sm:text-lg transition-colors shadow-lg ${
                  isLoading
                    ? "bg-gray-300 text-gray-500"
                    : "bg-slate-800 hover:bg-slate-900 text-white"
                }`}
              >
                {isLoading ? "Logging In..." : "Log In"}
              </button>
            </form>
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  href={FrontendRoutes.register}
                  className="text-teal-600 hover:underline font-semibold"
                >
                  Create an account
                </Link>
              </p>
              <p className="text-center text-gray-400 text-sm mt-4">
                <Link
                  href={FrontendRoutes.verifyEmailOTP}
                  className="text-teal-600 cursor-pointer hover:underline font-semibold transition-colors"
                >
                  {" "}
                  Verify Email{" "}
                </Link>{" "}
                |
                <Link
                  href={FrontendRoutes.verifyPhoneOTP}
                  className="text-teal-600 cursor-pointer hover:underline font-semibold transition-colors"
                >
                  {" "}
                  Verify Phone{" "}
                </Link>
              </p>

              {/* <div className="mt-4">
                  <Link href={ FrontendRoutes.verifyPhoneOTP } className="text-teal-600 hover:underline font-semibold">
                    Verify Phone
                  </Link>
                </div> */}
            </div>
          </div>
        </div>
      </div>
      {showVerificationErrorModal && (
        <VerificationErrorModal
          isOpen={showVerificationErrorModal}
          onClose={() => setShowVerificationErrorModal(false)}
          verificationStatus={verificationStatus}
        />
      )}
    </>
  );
}
