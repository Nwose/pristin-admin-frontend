// app/auth/login/2ndfactor
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react"; 
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast as toastFn } from "react-toastify";
import OtpVerifier, { OtpResult } from "@/components/auth/OTPVerifier";
import { api, ApiError } from "@/lib/api/ApiClient";
import { BackendRoutes } from "@/lib/api/BackendRoutes";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";
import { useAuth, PartialUser } from "@/lib/api/auth/authContext";
import { authUtils, TokenResponse } from "@/lib/api/auth/TokenManager";

const DEFAULT_TIMER = 59;

export default function SecondFactorOTPPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const sendOTPRoute = BackendRoutes.send2faOtp;
  const login2FA = BackendRoutes.loginSecondFactor;
  
  // Zustand store hooks
  const { partialUser, fetchCurrentUser, updatePartialUser } = useAuth();

  useEffect(() => {
    // Get email from Zustand store
    if (authUtils.isAuthenticated()){
      toastFn.success("User is already logged in, redirecting to dashboard.");
      router.push(FrontendRoutes.dashboard);
    }

    const email = partialUser?.email ?? null;
    console.log('Email bro', email);
    setEmail(email);
    // if (!email) {
    //   router.push(FrontendRoutes.login);
    // }
  }, [partialUser]);


  // Handler to call backend
  const handleSend = useCallback(async (): Promise<OtpResult> => {
    try {

      if (!email) {
        toastFn.error("handleSend: No email available to send OTP to.");
        return { ok: false };
      }

      const response = await api.post(sendOTPRoute, { 
        email: email,
        tfa_token: partialUser?.tfa_token
      });

      const data = response?.data;
      toastFn.success("Verification code sent to your email.");
      return { ok: true, data };
    } catch (err) {
      const error: ApiError = err as ApiError;
      if ( error.message.includes("expired tfa token")){
        // delete tfa code
        toastFn.error("Your session has expired. Please log in again.");
        updatePartialUser({ tfa_token: undefined } as PartialUser);
        router.push(FrontendRoutes.login);
      }
      return { ok: false, data: error.message };
    }
  }, [email]);

  // Handler to verify OTP
  const handleVerify = useCallback(async (code: string): Promise<OtpResult> => {
    try {
      if (!email) {
        return { ok: false, data: { message: "handleVerify: No email available to verify." } };
      }

      if (!partialUser?.tfa_token){
        return { ok: false, data: {message: "handleVerify: User has not logged in."}}
      }

      const response = await api.post(login2FA, { 
        otp: code,
        tfa_token: partialUser.tfa_token
       });

      const data = response.data;

      return { ok: true, data };
    } catch (err: any) {
      const error: ApiError = err as ApiError;
      return { ok: false, data: error.message };
    }
  }, [email]);

  const onSuccess = async (data?: TokenResponse) => {
    console.log("onSuccess data:", data);
    authUtils.initializeAuth(data as TokenResponse);
    fetchCurrentUser();
    router.push(FrontendRoutes.dashboard);
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left hero section */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/loginImage.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/30 to-[#012638]"></div>
        </div>
        <div className="relative z-20 flex flex-col justify-between pt-[12px] text-white w-full">
          <div className="flex items-center justify-center">
            <Image src="/images/logo_1.png" alt="Logo" width={200} height={60} priority />
          </div>
          <div className="flex-2 flex items-start justify-start pl-[27px] pt-8">
            <Image src="/images/loginFrame.png" alt="frame" width={184} height={278} priority />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-full lg:w-2/3 flex flex-col bg-gray-50">
        <div className="flex justify-between lg:justify-end items-center p-4 lg:p-6 space-x-4 lg:space-x-8 bg-white shadow-sm">
          <div className="lg:hidden flex items-center">
            <div className="rounded-sm flex items-center justify-center">
              <Image src="/images/logo_1.png" alt="Logo" width={100} height={30} priority />
            </div>
          </div>
          <div className="flex space-x-4 lg:space-x-8">
            <button className="text-gray-600 hover:text-teal-600 font-medium text-sm lg:text-base">About</button>
            <button className="text-gray-600 hover:text-teal-600 font-medium text-sm lg:text-base">Help</button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-8">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 lg:p-12 border border-gray-100">
              {/* Use the OtpVerifier component */}
              <OtpVerifier
                length={6}
                initialTarget={email}
                timeBeforeResend={DEFAULT_TIMER}
                autoSendOnMount={true}
                heading="Verify Your Email"
                description="We've sent a 6-digit verification code to your email address. Please check your inbox and enter the code."
                onResend={handleSend}
                onSubmit={handleVerify}
                onSuccess={onSuccess}
              />

              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
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

        <div className="bg-white text-teal-600 py-4 sm:py-6 text-center shadow-xl">
          <p className="text-xs sm:text-sm mb-3 sm:mb-4 px-4">© 2025 FintechApp. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}