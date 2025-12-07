import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import BankService, { SuppportedBank, SuppportedBankList } from '../services/Bank.Service';

interface BankStore {
  supportedBanks: SuppportedBankList;
  loading: boolean;
  lastFetched: number | null;
  fetchBanks: () => Promise<void>;
  refreshBanks: () => Promise<void>;
}

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export const useBankStore = create<BankStore>()(
  persist(
    (set, get) => ({
      supportedBanks: [],
      loading: false,
      lastFetched: null,

      fetchBanks: async () => {
        const { lastFetched, supportedBanks } = get();
        const now = Date.now();

        // If data exists and is fresh, don't refetch
        if (lastFetched && supportedBanks.length > 0 && now - lastFetched < CACHE_DURATION) {
          return;
        }

        set({ loading: true });
        try {
          const banks = await BankService.getSupportedBanks();
          set({ 
            supportedBanks: banks, 
            lastFetched: now,
            loading: false 
          });
        } catch (err) {
          console.error('Failed to fetch supported banks:', err);
          set({ loading: false });
        }
      },

      refreshBanks: async () => {
        set({ loading: true });
        try {
          const banks = await BankService.getSupportedBanks();
          set({ 
            supportedBanks: banks, 
            lastFetched: Date.now(),
            loading: false 
          });
        } catch (err) {
          console.error('Failed to refresh supported banks:', err);
          set({ loading: false });
        }
      },
    }),
    {
      name: 'bank-storage', // localStorage key
      partialize: (state) => ({ 
        supportedBanks: state.supportedBanks,
        lastFetched: state.lastFetched,
      }), // Only persist these fields
    }
  )
);