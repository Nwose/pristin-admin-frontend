import { apiClient } from "../ApiClient";
import { BackendRoutes } from "../BackendRoutes";
import { ApiResponse } from "../ApiClient"; 

export interface Wallet {
  wallet_name: string;
  balance: string;
  status: "active" | "inactive" | string;
  wallet_type: "main" | "savings" | "locked" | string;
  created_at: string;
  updated_at: string;
}

export interface WithdrawIn {
  amount: string;
  dest_bank_id: string; // uuid of bank
  password: string;
}

export interface WithdrawOut {
  message: string;
  // on error the apiClient is going to throw an error instead of returning the response with anything other than "withdraw_success"
  code: "withdraw_success" | "customer_not_found" | "dva_not_found" | "main_wallet_not_found" | "insufficient_funds" | "wallet_not_active" | "invalid_password" | "invalid_amount" | "bank_not_found" | string;
}
export type WalletList = Wallet[];


class WalletService {
  static async getWallets(): Promise<WalletList> {
    const res = await apiClient.get<WalletList>(BackendRoutes.getUserWallets, {
      requiresAuth: true,
    });

    return res.data;
  }

  static async getMainWallet(): Promise<Wallet | undefined> {
    const wallets = await this.getWallets();
    return wallets.find(w => w.wallet_type === "main");
  }

  static async withdraw(withdrawIn: WithdrawIn): Promise<WithdrawOut> {
    console.log("WITHDRAWING: ", withdrawIn);
    const res = await apiClient.post<WithdrawOut>(BackendRoutes.withdraw, withdrawIn, {
      requiresAuth: true
    })
    return res.data;
  }

  
}

export default WalletService;
