// services/dashboard.service.ts
import {
  getUserWallets,
  getWalletTransactions,
  Wallet,
  Transaction,
} from "./wallet.service";

// Re-export Wallet and Transaction for easy imports elsewhere
export type { Wallet, Transaction } from "./wallet.service";

// Dashboard-specific interfaces
export interface Loan {
  id: string;
  amount: number;
  nextDue: string; // ISO date
  status: "active" | "paid" | "overdue";
}

export interface Investment {
  id: string;
  balance: number;
  updatedAt: string; // ISO date
}

// Fetch all dashboard data
export async function getDashboardData() {
  try {
    // Fetch wallets and transactions from wallet.service
    const wallets: Wallet[] = await getUserWallets();
    const transactions: Transaction[] = await getWalletTransactions();

    // Mock loans and investments for now
    // Replace these with actual API calls when available
    const loans: Loan[] = [
      { id: "1", amount: 8500200, nextDue: "2025-06-15", status: "active" },
    ];

    const investments: Investment[] = [
      { id: "1", balance: 23680540, updatedAt: new Date().toISOString() },
    ];

    return { wallets, transactions, loans, investments };
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    return { wallets: [], transactions: [], loans: [], investments: [] };
  }
}
