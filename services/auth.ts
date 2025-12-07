import { send } from "./base";

// 🔹 Registration
export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
) {
  return await send("POST", "api/v1/users/register/", {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
  });
}

// 🔹 Send Email OTP
export async function sendEmailOTP(email: string) {
  return await send("POST", "api/v1/users/send_email_verification_otp/", {
    email,
  });
}

// 🔹 Send Phone OTP
export async function sendPhoneOTP(phoneNumber: string) {
  return await send("POST", "api/v1/users/send_phone_verification_otp/", {
    phone_number: phoneNumber,
  });
}

// 🔹 Send 2FA OTP
export async function send2FA_OTP(tfa_token: string) {
  return await send("POST", "api/v1/users/send_2fa_otp/", { tfa_token });
}

// 🔹 Verify Email OTP
export async function verifyEmailOTP(email: string, otp: string) {
  return await send("POST", "api/v1/users/check_email_verification_otp/", {
    email,
    otp,
  });
}

// 🔹 Verify Phone OTP
export async function verifyPhoneOTP(phoneNumber: string, otp: string) {
  return await send("POST", "api/v1/users/check_phone_verification_otp/", {
    phone_number: phoneNumber,
    otp,
  });
}

// 🔹 Verify 2FA OTP
export async function verify2FA_OTP(tfa_token: string, otp: string) {
  return await send("POST", "api/v1/users/check_2fa_otp/", {
    tfa_token,
    otp,
  });
}

// 🔹 Login – First Factor
export async function loginFirstFactor(email: string, password: string) {
  return await send("POST", "api/v1/login/token/1stfactor/", {
    email,
    password,
  });
}

// 🔹 Login – Second Factor
export async function loginSecondFactor(tfa_token: string, otp: string) {
  return await send("POST", "api/v1/login/token/2stfactor/", {
    tfa_token,
    otp,
  });
}
