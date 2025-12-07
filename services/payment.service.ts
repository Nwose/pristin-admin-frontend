export interface UpcomingPayment {
  id: string;
  title: string;
  dueDate: string; // ISO string or formatted date
  amount: number;
  type: "loan" | "investment" | "wallet";
}

import { getWalletTransactions, Transaction } from "./wallet.service";

export async function getUpcomingPayments(): Promise<UpcomingPayment[]> {
  try {
    const transactions: Transaction[] = await getWalletTransactions();
    // Filter only future or pending transactions (example)
    const upcoming: UpcomingPayment[] = transactions
      .filter((t) => t.status.toLowerCase() === "pending")
      .map((t) => ({
        id: t.id || "",
        title: t.description || "Wallet Transaction",
        dueDate: t.date,
        amount: Number(t.amount.replace(/[^0-9.-]+/g, "")), // remove ₦ etc
        type: "wallet",
      }));
    return upcoming;
  } catch (error) {
    console.error("Error fetching upcoming payments:", error);
    return [];
  }
}
