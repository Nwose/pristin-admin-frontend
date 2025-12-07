"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Check } from "lucide-react";

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 ${className}`}>{children}</div>;

const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline";
  className?: string;
}) => {
  const base =
    "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none";
  const styles =
    variant === "outline"
      ? "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-800"
      : "bg-[#001B2E] text-white hover:bg-[#003049]";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}{" "}
    </button>
  );
};

export default function LoanConfirmPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    setShowModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-screen bg-gray-50 relative"
    >
      {" "}
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        {/* Step indicator */}{" "}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {" "}
          <div className="flex items-center space-x-2">
            {" "}
            <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center font-medium">
              1{" "}
            </div>{" "}
            <span className="text-sm text-gray-500">Amount</span>{" "}
          </div>{" "}
          <div className="h-[2px] w-12 bg-gray-300"></div>
          ```
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center font-medium">
              2
            </div>
            <span className="text-sm text-gray-500">Summary</span>
          </div>
          <div className="h-[2px] w-12 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#009688] text-white flex items-center justify-center font-medium">
              3
            </div>
            <span className="font-semibold text-[#009688] text-sm">
              Confirm
            </span>
          </div>
        </div>
        {/* Loan Summary Card */}
        <Card className="w-full max-w-4xl">
          <CardContent>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              {/* Interest Rate and Interest */}
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Interest Rate</p>
                  <p className="text-gray-900 font-semibold text-lg">5%</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Interest</p>
                  <p className="text-gray-900 font-semibold text-lg">₦2,240</p>
                </div>
              </div>

              {/* Repayment Info */}
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Repayment</p>
                  <p className="text-gray-900 font-semibold text-lg">
                    &lt; 90 days
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Repayment Duration</p>
                  <p className="text-gray-900 font-semibold text-lg">
                    August 15, 2025
                  </p>
                </div>
              </div>

              {/* Purpose */}
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Purpose</p>
                  <p className="text-gray-900 font-semibold text-lg">
                    For Rent
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Total Amount Due */}
            <div className="text-center">
              <p className="text-gray-700 text-base mb-2">Total Amount Due</p>
              <p className="text-3xl font-semibold text-[#001B2E]">₦44,800</p>
            </div>

            {/* Button */}
            <div className="flex justify-center mt-8">
              <Button onClick={handleSubmit} className="w-full sm:w-auto">
                Proceed to get your Loan
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Footer */}
        <p className="mt-10 text-gray-400 text-sm">© 2025 Fintech Dashboard</p>
      </div>
      {/* ✅ Success Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-8 text-center relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col items-center space-y-4">
                  <Check className="text-[#009688]" size={48} />
                  <h2 className="text-lg font-medium text-gray-800">
                    You’ve{" "}
                    <span className="font-semibold text-gray-900">
                      Successfully Applied
                    </span>{" "}
                    for a loan of{" "}
                    <span className="font-semibold text-gray-900">₦44,800</span>
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Your{" "}
                    <span className="font-medium text-[#009688]">Loan</span>{" "}
                    will arrive soon before{" "}
                    <span className="font-semibold">24 hours</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
