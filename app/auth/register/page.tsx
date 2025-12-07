"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth/authContext";
import { authUtils } from "@/lib/api/auth/TokenManager";
import { FrontendRoutes } from "@/lib/api/FrontendRoutes";
import { interpretServerError } from "@/lib/utils";
import RegisterService from "@/lib/api/services/Register.Service";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

export default function SignUp() {
  const router = useRouter();
  const { user, isAuthenticated, partialUser, updatePartialUser } = useAuth();

  useEffect(() => {
    if (user && authUtils.isAuthenticated()) {
      router.push(FrontendRoutes.dashboard);
    }
  }, [user, router, isAuthenticated]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(partialUser?.phone || "");
  const [email, setEmail] = useState(partialUser?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [showTermsTooltip, setShowTermsTooltip] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
  }>({});
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailFilled = email.length > 0;

  // Phone validation
  const isPhoneValid = phoneNumber ? isValidPhoneNumber(phoneNumber) : false;

  // Password validation
  const hasUpperAndLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;
  const isPasswordValid =
    hasUpperAndLower && hasNumber && hasSpecialChar && hasMinLength;

  // Name validation
  const isFirstNameValid = firstName.trim().length >= 2;
  const isLastNameValid = lastName.trim().length >= 2;

  // Form validity
  const isFormValid =
    isEmailValid &&
    isPasswordValid &&
    isTermsChecked &&
    isFirstNameValid &&
    isLastNameValid &&
    isPhoneValid;

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const errors: typeof fieldErrors = { ...fieldErrors };

    switch (field) {
      case "firstName":
        if (!firstName.trim()) {
          errors.firstName = "First name is required";
        } else if (firstName.trim().length < 2) {
          errors.firstName = "First name must be at least 2 characters";
        } else {
          delete errors.firstName; // Clear error if valid
        }
        break;
      case "lastName":
        if (!lastName.trim()) {
          errors.lastName = "Last name is required";
        } else if (lastName.trim().length < 2) {
          errors.lastName = "Last name must be at least 2 characters";
        } else {
          delete errors.lastName; // Clear error if valid
        }
        break;
      case "phoneNumber":
        if (!phoneNumber) {
          errors.phoneNumber = "Phone number is required";
        } else if (!isPhoneValid) {
          errors.phoneNumber = "Please enter a valid phone number";
        } else {
          delete errors.phoneNumber; // Clear error if valid
        }
        break;
      case "email":
        if (!email) {
          errors.email = "Email is required";
        } else if (!isEmailValid) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email; // Clear error if valid
        }
        break;
      case "password":
        if (!password) {
          errors.password = "Password is required";
        } else if (!isPasswordValid) {
          errors.password = "Please meet all password requirements";
        } else {
          delete errors.password; // Clear error if valid
        }
        break;
    }

    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouchedFields({
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
      password: true,
      terms: true,
    });

    // Validate all fields
    ["firstName", "lastName", "phoneNumber", "email", "password"].forEach(
      validateField
    );

    setApiErrors([]);

    if (!isTermsChecked) {
      setShowTermsTooltip(true);
      setTimeout(() => setShowTermsTooltip(false), 3000);
      return;
    }

    if (!isFormValid) {
      return;
    }

    updatePartialUser({ email: email.trim(), phone: phoneNumber });

    setLoading(true);

    try {
      // Step 1: Register user
      const registerData = await RegisterService.register({
        email: email.trim(),
        password: password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneNumber,
      });

      // Store registration data (without password)
      // const userDataForStorage = {
      //   id: registerData.id,
      //   email: registerData.email,
      //   phone_number: registerData.phone_number,
      //   first_name: registerData.first_name,
      //   last_name: registerData.last_name,
      //   is_email_verified: registerData.is_email_verified,
      //   is_phone_number_verified: registerData.is_phone_number_verified,
      // };

      // // sessionStorage.setItem(
      // //   "registration_data",
      // //   JSON.stringify(userDataForStorage)
      // // );

      // Step 2: Determine next verification step and send OTP
      updatePartialUser({
        email: email.trim(),
        phone: phoneNumber,
        is_email_verified: registerData.is_email_verified,
        is_phone_verified: registerData.is_phone_number_verified,
      });
      if (!registerData.is_email_verified) {
        router.push(FrontendRoutes.verifyEmailOTP);
      } else if (!registerData.is_phone_number_verified) {
        router.push(FrontendRoutes.verifyPhoneOTP);
      } else {
        // Both verified, go to login
        router.push(FrontendRoutes.login);
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle field-specific errors from Django
      const errorData = error?.response?.data || error?.data || error;

      // Check if error has field-specific validation errors
      if (errorData && typeof errorData === "object") {
        const newFieldErrors: typeof fieldErrors = {};
        let hasFieldErrors = false;

        // Map Django field errors to our field error state
        if (errorData.email) {
          newFieldErrors.email = Array.isArray(errorData.email)
            ? errorData.email[0]
            : errorData.email;
          hasFieldErrors = true;
        }
        if (errorData.phone_number) {
          newFieldErrors.phoneNumber = Array.isArray(errorData.phone_number)
            ? errorData.phone_number[0]
            : errorData.phone_number;
          hasFieldErrors = true;
        }
        if (errorData.first_name) {
          newFieldErrors.firstName = Array.isArray(errorData.first_name)
            ? errorData.first_name[0]
            : errorData.first_name;
          hasFieldErrors = true;
        }
        if (errorData.last_name) {
          newFieldErrors.lastName = Array.isArray(errorData.last_name)
            ? errorData.last_name[0]
            : errorData.last_name;
          hasFieldErrors = true;
        }
        if (errorData.password) {
          newFieldErrors.password = Array.isArray(errorData.password)
            ? errorData.password[0]
            : errorData.password;
          hasFieldErrors = true;
        }

        if (hasFieldErrors) {
          setFieldErrors(newFieldErrors);
          setApiErrors([]); // Clear general errors when we have field errors
        } else {
          // If no field-specific errors, show general error
          const errorMessages = interpretServerError(errorData) || [
            "Registration failed. Please try again.",
          ];
          setApiErrors(errorMessages);
        }
      } else {
        // Generic error handling
        const errorMessages = interpretServerError(error?.response?.data) ||
          interpretServerError(error) || [
            "Registration failed. Please try again.",
          ];
        setApiErrors(errorMessages);
      }
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({
    isValid,
    text,
  }: {
    isValid: boolean;
    text: string;
  }) => (
    <div className="flex items-center space-x-2 text-xs sm:text-sm">
      <div
        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
          isValid ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {isValid ? (
          <svg
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span
        className={`${
          isValid ? "text-green-600" : "text-red-500"
        } text-xs sm:text-sm transition-colors duration-200`}
      >
        {text}
      </span>
    </div>
  );

  const getInputBorderClass = (
    fieldName: string,
    isValid: boolean,
    isFilled: boolean
  ) => {
    if (!touchedFields[fieldName]) return "border-gray-200 focus:ring-teal-500";
    if (isFilled && isValid) return "border-green-500 focus:ring-green-500";
    if (isFilled && !isValid) return "border-red-500 focus:ring-red-500";
    return "border-gray-200 focus:ring-teal-500";
  };

  return (
    <>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-white ">
            <div className="flex justify-center mb-8">
              <Image
                src="/images/logo_2.jpg"
                alt="Pristin Capital Logo"
                width={188}
                height={58}
                className="rounded-sm"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-3">
              Welcome
            </h2>
            <p className="text-center text-gray-600 mb-8 lg:mb-10 text-sm sm:text-base">
              <Link
                href={FrontendRoutes.login}
                className="text-teal-600 cursor-pointer hover:underline font-medium transition-colors"
              >
                Sign In
              </Link>
              <span className="mx-2">or</span>
              <span className="text-teal-600 font-medium">
                Create an account
              </span>
            </p>
            <p className="text-slate-700 text-sm py-4">
              An admin would have to upgrade your account to admin before you
              can login.
            </p>

            <form className="space-y-6 lg:space-y-8" onSubmit={handleSubmit}>
              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (touchedFields.firstName) validateField("firstName");
                    }}
                    onBlur={() => handleBlur("firstName")}
                    placeholder="John"
                    className={`w-full px-6 py-4 border rounded-lg bg-gray-50 focus:ring-2 focus:border-transparent outline-none transition-all duration-200 ${getInputBorderClass(
                      "firstName",
                      isFirstNameValid,
                      firstName.length > 0
                    )}`}
                  />
                  {touchedFields.firstName && fieldErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (touchedFields.lastName) validateField("lastName");
                    }}
                    onBlur={() => handleBlur("lastName")}
                    placeholder="Doe"
                    className={`w-full px-6 py-4 border rounded-lg bg-gray-50 focus:ring-2 focus:border-transparent outline-none transition-all duration-200 ${getInputBorderClass(
                      "lastName",
                      isLastNameValid,
                      lastName.length > 0
                    )}`}
                  />
                  {touchedFields.lastName && fieldErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Phone Number
                </label>
                <PhoneInput
                  international
                  defaultCountry="NG"
                  value={phoneNumber}
                  onChange={(value) => {
                    setPhoneNumber(value || "");
                    if (touchedFields.phoneNumber) validateField("phoneNumber");
                  }}
                  onBlur={() => handleBlur("phoneNumber")}
                  placeholder="+234 812 345 6789"
                  className={`phone-input-wrapper w-full ${getInputBorderClass(
                    "phoneNumber",
                    isPhoneValid,
                    phoneNumber.length > 0
                  )}`}
                />
                {touchedFields.phoneNumber && fieldErrors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touchedFields.email) validateField("email");
                  }}
                  onBlur={() => handleBlur("email")}
                  placeholder="user@example.com"
                  className={`w-full px-6 py-4 border rounded-lg bg-gray-50 focus:ring-2 focus:border-transparent outline-none transition-all duration-200 ${getInputBorderClass(
                    "email",
                    isEmailValid,
                    isEmailFilled
                  )}`}
                />
                {touchedFields.email && fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touchedFields.password) validateField("password");
                    }}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter your password"
                    className={`w-full px-6 py-4 border rounded-lg bg-gray-50 focus:ring-2 focus:border-transparent outline-none transition-all duration-200 ${getInputBorderClass(
                      "password",
                      isPasswordValid,
                      password.length > 0
                    )}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {password && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <ValidationItem
                      isValid={hasUpperAndLower}
                      text="Capital + lowercase"
                    />
                    <ValidationItem isValid={hasNumber} text="Number" />
                    <ValidationItem
                      isValid={hasSpecialChar}
                      text="Special character"
                    />
                    <ValidationItem
                      isValid={hasMinLength}
                      text="Min 8 characters"
                    />
                  </div>
                )}
                {touchedFields.password && fieldErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Terms and conditions */}
              <div className="relative flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={isTermsChecked}
                  onChange={(e) => setIsTermsChecked(e.target.checked)}
                  className="mt-1.5 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                />
                <label className="text-base text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <span className="text-teal-600 cursor-pointer hover:underline font-medium transition-colors">
                    Terms and Conditions
                  </span>
                </label>
                {showTermsTooltip && (
                  <div className="absolute -top-12 left-0 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg animate-fade-in">
                    To proceed, please accept Terms & Conditions
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full py-4 rounded-sm font-semibold text-lg shadow-lg transition-all duration-200 ${
                  isFormValid && !loading
                    ? "bg-slate-800 hover:bg-slate-900 text-white hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Error messages */}
              {apiErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  {apiErrors.map((error, index) => (
                    <p key={index} className="text-red-600 text-sm">
                      {error}
                    </p>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="text-center text-gray-400 font-medium">or</div>

              {/* Login link */}
              <p className="text-center text-gray-600 text-base">
                Already have an account?{" "}
                <Link
                  href={FrontendRoutes.login}
                  className="text-teal-600 cursor-pointer hover:underline font-semibold transition-colors"
                >
                  Log in
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
