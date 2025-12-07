// import React from "react";
// import Image from "next/image";
// import {
//   Monitor,
//   TrendingUp,
//   BarChart3,
//   User,
//   Wallet,
//   PieChart,
// } from "lucide-react";

// const HowItWorks = () => {
//   return (
//     <div className="bg-[#f9fafb] py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold text-gray-900 mb-4">
//             How It Works
//           </h2>
//           <p className="text-lg text-gray-600">
//             Simple steps to financial growth
//           </p>
//         </div>

//         {/* Steps */}
//         <div className="space-y-20">
//           {/* Step 1 */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-start space-x-8 flex-1">
//               <div className="flex-shrink-0">
//                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
//                   <span className="text-2xl font-bold text-white">1</span>
//                 </div>
//               </div>
//               <div className="flex-1 max-w-md">
//                 <h3 className="text-2xl font-semibold text-teal-600 mb-4">
//                   Sign Up & Verify
//                 </h3>
//                 <p className="text-gray-600 text-lg leading-relaxed">
//                   Complete email registration and verification tiers for secure
//                   access to all platform features.
//                 </p>
//               </div>
//             </div>
//             <div className="hidden lg:block flex-shrink-0 ml-8">
//               <Image
//                 src="/images/sign.png"
//                 alt="Sign Up & Verify illustration"
//                 width={160}
//                 height={128}
//                 className="rounded-lg"
//               />
//             </div>
//           </div>

//           {/* Step 2 */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-start space-x-8 flex-1">
//               <div className="flex-shrink-0">
//                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
//                   <span className="text-2xl font-bold text-white">2</span>
//                 </div>
//               </div>
//               <div className="flex-1 max-w-md">
//                 <h3 className="text-2xl font-semibold text-teal-600 mb-4">
//                   Fund, Apply & Invest
//                 </h3>
//                 <p className="text-gray-600 text-lg leading-relaxed">
//                   Fund your wallet, apply for loans, or start investing with our
//                   automated approval system.
//                 </p>
//               </div>
//             </div>
//             <div className="hidden lg:block flex-shrink-0 ml-8">
//               <Image
//                 src="/images/fund.png"
//                 alt="Fund, Apply & Invest illustration"
//                 width={160}
//                 height={128}
//                 className="rounded-lg"
//               />
//             </div>
//           </div>

//           {/* Step 3 */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-start space-x-8 flex-1">
//               <div className="flex-shrink-0">
//                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
//                   <span className="text-2xl font-bold text-white">3</span>
//                 </div>
//               </div>
//               <div className="flex-1 max-w-md">
//                 <h3 className="text-2xl font-semibold text-teal-600 mb-4">
//                   Track & Grow
//                 </h3>
//                 <p className="text-gray-600 text-lg leading-relaxed">
//                   Monitor your progress, receive notifications, and watch your
//                   financial portfolio grow in real-time.
//                 </p>
//               </div>
//             </div>
//             <div className="hidden lg:block flex-shrink-0 ml-8">
//               <Image
//                 src="/images/track.png"
//                 alt="Track & Grow illustration"
//                 width={160}
//                 height={128}
//                 className="rounded-lg"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HowItWorks;

import React from "react";
import Image from "next/image";

const HowItWorks = () => {
  return (
    <div className="bg-[#f9fafb] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Simple steps to financial growth
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16 sm:space-y-20">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            {/* Text */}
            <div className="flex items-start space-x-4 sm:space-x-6 flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    1
                  </span>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-3 sm:mb-4">
                  Sign Up & Verify
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Complete email registration and verification tiers for secure
                  access to all platform features.
                </p>
              </div>
            </div>
            {/* Image */}
            <div className="w-full sm:w-auto lg:block flex-shrink-0 lg:ml-8">
              <Image
                src="/images/sign.png"
                alt="Sign Up & Verify illustration"
                width={160}
                height={128}
                className="rounded-lg mx-auto lg:mx-0"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            <div className="flex items-start space-x-4 sm:space-x-6 flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    2
                  </span>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-3 sm:mb-4">
                  Fund, Apply & Invest
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Fund your wallet, apply for loans, or start investing with our
                  automated approval system.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto lg:block flex-shrink-0 lg:ml-8">
              <Image
                src="/images/fund.png"
                alt="Fund, Apply & Invest illustration"
                width={160}
                height={128}
                className="rounded-lg mx-auto lg:mx-0"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            <div className="flex items-start space-x-4 sm:space-x-6 flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    3
                  </span>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-3 sm:mb-4">
                  Track & Grow
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Monitor your progress, receive notifications, and watch your
                  financial portfolio grow in real-time.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto lg:block flex-shrink-0 lg:ml-8">
              <Image
                src="/images/track.png"
                alt="Track & Grow illustration"
                width={160}
                height={128}
                className="rounded-lg mx-auto lg:mx-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
