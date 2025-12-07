
import { apiClient } from "../ApiClient";
import { BackendRoutes } from "../BackendRoutes";

export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  created_at?: string;
}

export interface AddBankIn {
  bank_code: string;
  account_number: string;
}

export interface AddBankOut {
  bank_code: string,
  account_number: string,
  account_name: string,
  is_primary: Boolean
}

export interface SuppportedBank {
  bank_code: string;
  bank_name: string;
  bank_label: string;
}

export interface ResolveNubanIn {
  bank_code: string;
  account_number: string;
}

export interface ResolveNubanOut {
  bank_code: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_label: string;
}

export type BankAccountList = BankAccount[];
export type SuppportedBankList = SuppportedBank[];


class BankService {
  static async getBanks(): Promise<BankAccountList> {
    const res = await apiClient.get<BankAccountList>(BackendRoutes.myBanks, {
      requiresAuth: true,
    });

    return res.data;
  }
  
  static async addBank(bankIn: AddBankIn): Promise<AddBankOut> {
    const res = await apiClient.post<AddBankOut>(BackendRoutes.addBankAccount, bankIn, {
      requiresAuth: true,
    });
    
    return res.data;
  }
  
  static async resolveNuban(resolveNubanIn: ResolveNubanIn): Promise<ResolveNubanOut> {
    const res = await apiClient.post<ResolveNubanOut>(BackendRoutes.resolveNuban, resolveNubanIn, {
      requiresAuth: true,
    });
    
    return res.data;
  }
  
  static async getSupportedBanks(): Promise<SuppportedBankList> {
    const res = await apiClient.get<SuppportedBankList>(BackendRoutes.getBanks, {
      requiresAuth: true,
    });

    return res.data;
  }

  
}

export default BankService;
