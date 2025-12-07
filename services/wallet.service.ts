import { makeRequest } from "./base";

export interface Wallet {
  id: string;
  balance: number;
  currency?: string;
}

export interface FundWalletPayload {
  amount: number;
  payment_method?: string; // e.g., "bank_transfer" or "paystack"
}

export interface WithdrawPayload {
  amount: number;
  bank_account_id: string;
}

export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code?: string;
  created_at?: string;
}

export interface Bank {
  name: string;
  code: string;
}

export interface Transaction {
  id?: string;
  date: string;
  type: "Credit" | "Debit";
  description: string;
  amount: string;
  status: string;
}

// ✅ Get all user wallets
export async function getUserWallets(): Promise<Wallet[]> {
  try {
    const data = await makeRequest("api/v1/wallets/get_user_wallets/", "GET");
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("❌ Error fetching wallets:", error);
    throw error;
  }
}

// ✅ Fund wallet
export async function fundWallet(payload: FundWalletPayload) {
  try {
    return await makeRequest("api/v1/wallets/fund/", "POST", payload);
  } catch (error) {
    console.error("❌ Error funding wallet:", error);
    throw error;
  }
}

// ✅ Withdraw funds from wallet
export async function withdrawFunds(payload: WithdrawPayload) {
  try {
    return await makeRequest("api/v1/wallets/withdraw/", "POST", payload);
  } catch (error) {
    console.error("❌ Error withdrawing funds:", error);
    throw error;
  }
}

// ✅ Get user’s linked bank accounts
export async function getUserBanks(): Promise<BankAccount[]> {
  try {
    const data = await makeRequest("api/v1/bank_account/my_banks/", "GET");
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("❌ Error fetching user banks:", error);
    throw error;
  }
}

// ✅ Get available banks for selection
export async function getAllBanks(): Promise<Bank[]> {
  try {
    const data = await makeRequest("api/v1/bank_account/get_banks/", "GET");
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("❌ Error fetching banks:", error);
    throw error;
  }
}

// ✅ Add a new bank account
export async function addBankAccount(payload: {
  account_number: string;
  bank_code: string;
}) {
  try {
    return await makeRequest(
      "api/v1/bank_account/add_bank_account/",
      "POST",
      payload
    );
  } catch (error) {
    console.error("❌ Error adding bank account:", error);
    throw error;
  }
}

// ✅ Resolve NUBAN (get account name before adding)
export async function resolveBankAccount(payload: {
  account_number: string;
  bank_code: string;
}) {
  try {
    return await makeRequest(
      "api/v1/bank_account/resolve_nuban/",
      "POST",
      payload
    );
  } catch (error) {
    console.error("❌ Error resolving bank account:", error);
    throw error;
  }
}

// ✅ Remove a linked bank account
export async function removeBankAccount(bank_account_id: string) {
  try {
    return await makeRequest(
      `api/v1/bank_account/remove_bank_account/?id=${bank_account_id}`,
      "DELETE"
    );
  } catch (error) {
    console.error("❌ Error removing bank account:", error);
    throw error;
  }
}

// ✅ Get wallet transactions (sample endpoint for transaction history)
export async function getWalletTransactions(): Promise<Transaction[]> {
  try {
    const data = await makeRequest("api/v1/admin/just_testing/", "GET");
    const list = Array.isArray(data) ? data : data.results || [];

    return list.map((item: any) => ({
      id: item.id,
      date: item.created_at || new Date().toISOString(),
      type:
        item.transaction_type?.toLowerCase() === "debit" ? "Debit" : "Credit",
      description: item.description || "Wallet transaction",
      amount: `₦${Number(item.amount || 0).toLocaleString()}`,
      status: item.status || "Successful",
    }));
  } catch (error) {
    console.error("❌ Error fetching wallet transactions:", error);
    throw error;
  }
}
