// "use client";
// import { FC } from "react";
// import { ArrowLeft, Ban, CreditCard } from "lucide-react";

// interface ModalProps {
//   onClose: () => void;
// }

// const LoanDetailsModal: FC<ModalProps> = ({ onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
//         <button
//           onClick={onClose}
//           className="absolute left-4 top-4 text-gray-600 hover:text-black"
//         >
//           <ArrowLeft className="w-5 h-5" />
//         </button>

//         <div className="mt-10 space-y-5">
//           {/* Add Bank Details */}
//           <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
//             <div className="flex items-center gap-3">
//               <Ban className="w-5 h-5 text-gray-700" />
//               <span className="text-gray-900 font-semibold">
//                 Add Bank Details
//               </span>
//             </div>
//             <input type="radio" name="details" defaultChecked />
//           </div>

//           {/* Add Business Details */}
//           <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
//             <div className="flex items-center gap-3">
//               <CreditCard className="w-5 h-5 text-gray-700" />
//               <span className="text-gray-900 font-semibold">
//                 Add Business Details
//               </span>
//             </div>
//             <input type="radio" name="details" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoanDetailsModal;

// "use client";

// import { FC, useState } from "react";
// import { ArrowLeft, CreditCard, Briefcase, Check } from "lucide-react";
// import AddBankDetails from "./AddBankDetails";
// import AddBusinessDetails from "./AddBusinessDetails";

// interface ModalProps {
//   onClose: () => void;
// }

// const LoanDetailsModal: FC<ModalProps> = ({ onClose }) => {
//   const [step, setStep] = useState<"select" | "bank" | "business">("select");

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative transition-all duration-300">
//         {/* Back Button */}
//         <button
//           onClick={() => {
//             if (step === "select") onClose();
//             else setStep("select");
//           }}
//           className="absolute left-4 top-4 text-gray-600 hover:text-black"
//           aria-label="Back"
//         >
//           <ArrowLeft className="w-5 h-5" />
//         </button>

//         {/* Main Content */}
//         <div className="mt-10">
//           {step === "select" && (
//             <div className="space-y-4">
//               {/* Add Bank Details */}
//               <div
//                 onClick={() => setStep("bank")}
//                 className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 border-gray-200 transition-all duration-200"
//               >
//                 <div className="flex items-center gap-3">
//                   <CreditCard className="w-5 h-5 text-gray-800" />
//                   <span className="text-gray-900 font-semibold">
//                     Add Bank Details
//                   </span>
//                 </div>
//                 <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
//                   <Check className="w-3 h-3 text-transparent" />
//                 </div>
//               </div>

//               {/* Add Business Details */}
//               <div
//                 onClick={() => setStep("business")}
//                 className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 border-gray-200 transition-all duration-200"
//               >
//                 <div className="flex items-center gap-3">
//                   <Briefcase className="w-5 h-5 text-gray-800" />
//                   <span className="text-gray-900 font-semibold">
//                     Add Business Details
//                   </span>
//                 </div>
//                 <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
//                   <Check className="w-3 h-3 text-transparent" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Add Bank Details Form */}
//           {step === "bank" && <AddBankDetails />}

//           {/* You can add a similar component for business later */}

//           {step === "business" && <AddBusinessDetails />}
//           {/* {step === "business" && (
//             <div className="text-center text-gray-600 py-10">
//               <p>Business details form coming soon...</p>
//             </div>
//           )} */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoanDetailsModal;

"use client";

import { FC } from "react";
import { ArrowLeft, CreditCard, Briefcase, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModalProps {
  onClose: () => void;
}

const LoanDetailsModal: FC<ModalProps> = ({ onClose }) => {
  const router = useRouter();

  const handleBankDetails = () => {
    onClose(); // Close modal first
    router.push("/dashboard/loans/loan-details/add-bank-details");
  };

  const handleBusinessDetails = () => {
    onClose(); // Close modal first
    router.push("/dashboard/loans/loan-details/add-business-details");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative transition-all duration-300">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-600 hover:text-black"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Main Content */}
        <div className="mt-10">
          <div className="space-y-4">
            {/* Add Bank Details */}
            <div
              onClick={handleBankDetails}
              className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 border-gray-200 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-800" />
                <span className="text-gray-900 font-semibold">
                  Add Bank Details
                </span>
              </div>
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <Check className="w-3 h-3 text-transparent" />
              </div>
            </div>

            {/* Add Business Details */}
            <div
              onClick={handleBusinessDetails}
              className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 border-gray-200 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gray-800" />
                <span className="text-gray-900 font-semibold">
                  Add Business Details
                </span>
              </div>
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <Check className="w-3 h-3 text-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsModal;
