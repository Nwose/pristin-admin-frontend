"use client";
import { ReactNode, useEffect } from "react";
import { useBankStore } from "../stores/useBankStore";
import { useAuth } from "../auth/authContext";
import { authUtils } from "../auth/TokenManager";

export const BankProvider = ({ children }: { children: ReactNode }) => {
  const fetchBanks = useBankStore((state) => state.fetchBanks);
  const { user } = useAuth();

  useEffect(() => {
    if (user && authUtils.isAuthenticated()){
      fetchBanks();
    }
  }, [fetchBanks, user]);

  return <>{children}</>;
};

// Optional: Export a hook for easier access if you prefer
export const useBanks = () => {
  const supportedBanks = useBankStore((state) => state.supportedBanks);
  const loading = useBankStore((state) => state.loading);
  const refreshBanks = useBankStore((state) => state.refreshBanks);

  return { supportedBanks, loading, refreshBanks };
};