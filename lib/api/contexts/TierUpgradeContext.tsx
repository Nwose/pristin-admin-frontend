"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface TierUpgradeContextType {
  isOpen: boolean;
  openTierUpgrade: () => void;
  closeTierUpgrade: () => void;
  forceStep?: "liveness" | "bvn" | null;
  setForceStep: (step: "liveness" | "bvn" | null) => void;
}

const TierUpgradeContext = createContext<TierUpgradeContextType | undefined>(undefined);

export function TierUpgradeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [forceStep, setForceStep] = useState<"liveness" | "bvn" | null>(null);

  const openTierUpgrade = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeTierUpgrade = useCallback(() => {
    setIsOpen(false);
    setForceStep(null);
  }, []);

  return (
    <TierUpgradeContext.Provider
      value={{
        isOpen,
        openTierUpgrade,
        closeTierUpgrade,
        forceStep,
        setForceStep,
      }}
    >
      {children}
    </TierUpgradeContext.Provider>
  );
}

export function useTierUpgrade() {
  const context = useContext(TierUpgradeContext);
  if (!context) {
    throw new Error("useTierUpgrade must be used within TierUpgradeProvider");
  }
  return context;
}