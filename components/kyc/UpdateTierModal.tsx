"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/api/auth/authContext";
import { useTierUpgrade } from "@/lib/api/contexts/TierUpgradeContext";
import LivenessCheckModal from "@/components/kyc/LivenessCheckModal";
import KYCModal from "@/components/kyc/KYCModal";
import { toast } from "react-toastify";
import { CheckCircle, ArrowRight } from "lucide-react";

type VerificationStep = "liveness" | "bvn" | "complete";

export default function UpdateTierModal() {
  const { user } = useAuth();
  const { isOpen, closeTierUpgrade, forceStep } = useTierUpgrade();
  const [currentStep, setCurrentStep] = useState<VerificationStep>("liveness");
  const [showCelebration, setShowCelebration] = useState(false);

  // Determine which step to show based on user verification status
  useEffect(() => {
    if (!user || !isOpen) return;

    // If forceStep is set, use that
    if (forceStep) {
      setCurrentStep(forceStep);
      return;
    }

    // Smart step detection: prioritize liveness check first (better UX - easier task first)
    if (!user.is_liveness_check_verified) {
      setCurrentStep("liveness");
    } else if (!user.is_bvn_verified) {
      setCurrentStep("bvn");
    } else {
      setCurrentStep("complete");
    }
  }, [user, isOpen, forceStep]);

  const handleLivenessSuccess = () => {
    toast.success("✅ Liveness check completed!");
    
    // Check if BVN verification is still needed
    if (!user?.is_bvn_verified) {
      // Smooth transition to next step
      setTimeout(() => {
        setCurrentStep("bvn");
        toast.info("📝 Next: Verify your BVN", { autoClose: 3000 });
      }, 1000);
    } else {
      // All done! Show celebration
      setShowCelebration(true);
      setTimeout(() => {
        closeTierUpgrade();
        setShowCelebration(false);
      }, 2500);
    }
  };

  const handleBVNSuccess = () => {
    toast.success("✅ BVN verification completed!");
    
    // Check if liveness check is still needed
    if (!user?.is_liveness_check_verified) {
      // Smooth transition to next step
      setTimeout(() => {
        setCurrentStep("liveness");
        toast.info("📸 Next: Complete liveness check", { autoClose: 3000 });
      }, 1000);
    } else {
      // All done! Show celebration
      setShowCelebration(true);
      setTimeout(() => {
        closeTierUpgrade();
        setShowCelebration(false);
      }, 2500);
    }
  };

  const handleClose = () => {
    // Don't allow closing if in the middle of verification flow
    if (currentStep === "complete" || showCelebration) {
      closeTierUpgrade();
      return;
    }

    // Warn user about incomplete verification
    const confirmClose = window.confirm(
      "You haven't completed verification. Your wallet features will remain limited. Close anyway?"
    );
    
    if (confirmClose) {
      closeTierUpgrade();
    }
  };

  if (!isOpen) return null;

  // Celebration screen when both verifications are complete
  if (showCelebration || currentStep === "complete") {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#012638] overflow-hidden">
        {/* Animated circles and rectangles */}
        <div className="hidden sm:block animate-float-1 z-60 bottom-[-24%] right-[36px] absolute w-[500px] h-[500px] opacity-25 rounded-full bg-gradient-to-r from-[#9ECAE0] to-[#566E7A00]" />
        <div className="hidden sm:block animate-float-2 z-60 top-[50%] left-[50%] translate-x-[-130%] translate-y-[-50%] opacity-25 absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#566E7A00] to-[#9ECAE0]" />
        <div className="hidden sm:block animate-float-3 z-60 blur-2xl top-[50%] left-[50%] translate-x-[-70%] translate-y-[-50%] opacity-25 absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r bg-black" />
        <div className="hidden sm:block animate-float-4 z-60 blur-2xl top-[50%] left-[50%] translate-x-[-10%] translate-y-[-50%] opacity-25 absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r bg-black" />
        <div className="hidden sm:block animate-float-5 z-60 bottom-[0%] left-[0%] absolute w-[500px] h-[200px] opacity-25 bg-gradient-to-r from-[#036B9E] to-[#012638]" />
        <div className="hidden sm:block animate-float-6 z-60 top-[0%] right-[0%] absolute w-[500px] h-[200px] opacity-25 bg-gradient-to-r from-[#036B9E] to-[#012638]" />
        
        <div className="absolute inset-0 z-65" />
        
        <div className="z-70 relative bg-[#012638] border border-[#019893]/30 max-w-[480px] rounded-2xl shadow-2xl w-[90%] p-8 text-center animate-in fade-in zoom-in duration-500">
          {/* Success Animation */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-[#019893] flex items-center justify-center animate-in zoom-in duration-700 delay-100">
            <CheckCircle className="w-16 h-16 text-white animate-in zoom-in duration-500 delay-300" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            🎉 Verification Complete!
          </h2>
          <p className="text-gray-300 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            Your account has been fully verified. You now have access to all wallet features!
          </p>
          
          {/* Feature badges */}
          <div className="space-y-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <div className="flex items-center gap-3 bg-[#019893]/10 border border-[#019893]/30 rounded-lg p-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm text-white">Unlimited deposits</span>
            </div>
            <div className="flex items-center gap-3 bg-[#019893]/10 border border-[#019893]/30 rounded-lg p-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm text-white">Instant withdrawals</span>
            </div>
            <div className="flex items-center gap-3 bg-[#019893]/10 border border-[#019893]/30 rounded-lg p-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm text-white">Full transaction history</span>
            </div>
          </div>
          
          <button
            onClick={closeTierUpgrade}
            className="w-full bg-gradient-to-r from-[#019893] to-[#017a76] text-white font-bold py-4 rounded-xl hover:from-[#017a76] hover:to-[#015d5c] transition-all shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Progress indicator
  const Progress = () => {
    const steps = [
      { id: "liveness", label: "Liveness", completed: user?.is_liveness_check_verified },
      { id: "bvn", label: "BVN", completed: user?.is_bvn_verified },
    ];

    return (
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-80 flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                step.completed
                  ? "bg-green-500/20 border border-green-500/50 text-green-300"
                  : currentStep === step.id
                  ? "bg-[#019893]/20 border border-[#019893] text-[#019893]"
                  : "bg-gray-500/10 border border-gray-500/30 text-gray-500"
              }`}
            >
              {step.completed && <CheckCircle className="w-3 h-3" />}
              <span>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-500" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Progress />
      
      {currentStep === "liveness" && (
        <LivenessCheckModal
          onSuccess={handleLivenessSuccess}
          onClose={handleClose}
        />
      )}
      
      {currentStep === "bvn" && (
        <KYCModal
          onSuccess={handleBVNSuccess}
          onClose={handleClose}
        />
      )}
    </>
  );
}