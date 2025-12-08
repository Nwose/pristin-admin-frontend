// lib/api/services/Loan.Service.ts
import { apiClient } from "../ApiClient";
import { BackendRoutes } from "../BackendRoutes";
import { ApiResponse } from "../ApiClient";
import { UserType } from "../types/auth";

export interface Loan {
  id: string;
  user: UserType;
  application: LoanApplication;
  principal_amount: string;
  interest_rate: string;
  total_payable: string;
  tenure_months: number;
  start_date: string; // ISO date (YYYY-MM-DD)
  end_date: string; // ISO date (YYYY-MM-DD)
  status: LoanStatus;
  status_display: string;
  total_interest: string;
  remaining_balance: string;
  progress: string;
  repayments: LoanRepayment[];
  created_at: string; // ISO timestamp
}

/* -------------------- APPLICATION -------------------- */
export interface LoanApplication {
  id: string;
  user: MinimalUser;
  product: LoanProduct;
  status: ApplicationStatus;
  status_display: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  product_id: string;
  created_at: string;
  amount_requested: string;
  tenure_months: number;
  reason: string;
}

/* -------------------- REPAYMENTS -------------------- */
export interface LoanRepayment {
  id: string;
  loan: string; // loan ID
  amount_due: string;
  amount_paid: string;
  due_date: string; // YYYY-MM-DD
  paid_at: string | null; // may be null
  status: RepaymentStatus;
  status_display: string;
  payment_reference: string;
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  interest_rate: string;
  min_amount: string;
  max_amount: string;
  min_tenure_months: number;
  max_tenure_months: number;
  repayment_frequency: RepaymentFrequency;
  risk_level: LoanProductRiskLevel;
  risk_level_display: string;
  is_active: boolean;
  created_at: string;
}

export interface LoanProductConfig {
  MAX_MONTHS_FOR_LOAN: number;
  MIN_AMOUNT_LOANABLE: string;
  MAX_AMOUNT_LOANABLE: string;
}

export interface MinimalUser {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export interface PaginatedAnything<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginatedLoans extends PaginatedAnything<Loan> {}

export interface PaginatedLoanApplications
  extends PaginatedAnything<LoanApplication> {}

export interface PaginatedLoanProducts extends PaginatedAnything<LoanProduct> {}

export interface PaginatedLoanRepayments
  extends PaginatedAnything<LoanRepayment> {}

/* -------------------- ENUMS -------------------- */
export type LoanStatus =
  | "UNDISBURSED"
  | "ACTIVE"
  | "PAID"
  | "DEFAULTED"
  | "CANCELLED";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type RepaymentStatus = "PENDING" | "PAID" | "OVERDUE";

export type LoanProductRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type RepaymentFrequency = "NONE" | "MONTHLY" | "WEEKLY" | "BIWEEKLY";

/* -------------------- FILTERS -------------------- */
export interface LoanFilters {
  status?: string; // LoanStatus
  is_overdue?: boolean;
  is_near_overdue?: boolean;
  days_ahead?: number;
  user?: string; // UUID
  min_amount?: number;
  max_amount?: number;
  page?: number;
}

export interface LoanApplicationFilters {
  status?: string; // ApplicationStatus
  user?: string;
  product?: string;
  min_amount?: number;
  max_amount?: number;
  created_after?: string; // ISO timestamp
  created_before?: string; // ISO timestamp
  page?: number;
}

export interface LoanProductFilters {
  is_active?: boolean;
  search?: string;
  risk_level?: string;
  repayment_frequency?: string;
  min_interest_rate?: number;
  max_interest_rate?: number;
  min_amount?: number;
  max_amount?: number;
  page?: number;
}

export interface LoanRepaymentFilters {
  status?: string; // RepaymentStatus
  loan?: string;
  is_overdue?: boolean;
  due_date_after?: string; // YYYY-MM-DD
  due_date_before?: string;
  page?: number;
}

/* -------------------- SERVICES -------------------- */

export class LoanService {
  static async getLoans(filters?: LoanFilters): Promise<PaginatedLoans> {
    const res = await apiClient.get<PaginatedLoans>(BackendRoutes.getLoans, {
      requiresAuth: true,
      params: filters,
    });

    return res.data;
  }

  static async getLoan(id: string): Promise<Loan> {
    const res = await apiClient.get<Loan>(BackendRoutes.getLoan(id), {
      requiresAuth: true,
    });

    return res.data;
  }
}

export class LoanApplicationService {
  static async getLoanApplications(
    filters?: LoanApplicationFilters
  ): Promise<PaginatedLoanApplications> {
    const res = await apiClient.get<PaginatedLoanApplications>(
      BackendRoutes.getLoanApplications,
      {
        requiresAuth: true,
        params: filters,
      }
    );

    return res.data;
  }

  static async getLoanApplication(id: string): Promise<LoanApplication> {
    const res = await apiClient.get<LoanApplication>(
      BackendRoutes.getLoanApplication(id),
      {
        requiresAuth: true,
      }
    );

    return res.data;
  }

  static async createLoanApplication(payload: {
    product: string;
    amount_requested: string;
    tenure_months: number;
    reason: string;
  }): Promise<LoanApplication> {
    const res = await apiClient.post<LoanApplication>(
      BackendRoutes.creaetLoanApplication,
      payload,
      { requiresAuth: true }
    );

    return res.data;
  }

  static async approveLoanApplication(id: string) {
    const res = await apiClient.post(
      BackendRoutes.approveLoanApplication(id),
      {},
      { requiresAuth: true }
    );

    return res.data;
  }

  static async rejectLoanApplication(
    id: string,
    data: { rejection_reason: string }
  ) {
    const res = await apiClient.post(
      BackendRoutes.rejectLoanApplication(id),
      data,
      { requiresAuth: true }
    );

    return res.data;
  }
}

export class LoanProductService {
  static async getLoanProducts(
    filters?: LoanProductFilters
  ): Promise<PaginatedLoanProducts> {
    const res = await apiClient.get<PaginatedLoanProducts>(
      BackendRoutes.getLoanProducts,
      {
        requiresAuth: true,
        params: filters,
      }
    );

    return res.data;
  }

  static async getLoanProduct(id: string): Promise<LoanProduct> {
    const res = await apiClient.get<LoanProduct>(
      BackendRoutes.getLoanProduct(id),
      { requiresAuth: true }
    );

    return res.data;
  }

  static async createLoanProduct(payload: any): Promise<LoanProduct> {
    const res = await apiClient.post<LoanProduct>(
      BackendRoutes.createLoanProduct,
      payload,
      { requiresAuth: true }
    );

    return res.data;
  }

  static async updateLoanProduct(
    id: string,
    payload: any
  ): Promise<LoanProduct> {
    const res = await apiClient.put<LoanProduct>(
      BackendRoutes.updateLoanProduct(id),
      payload,
      { requiresAuth: true }
    );

    return res.data;
  }

  static async deleteLoanProduct(id: string) {
    const res = await apiClient.delete(BackendRoutes.deleteLoanProduct(id), {
      requiresAuth: true,
    });

    return res.data;
  }

  static async getLoanProductConfig(): Promise<LoanProductConfig> {
    const res = await apiClient.get<LoanProductConfig>(
      BackendRoutes.getLoanProductConfig,
      { requiresAuth: true }
    );

    return res.data;
  }
}

export class LoanRepaymentService {
  static async getLoanRepayments(
    filters?: LoanRepaymentFilters
  ): Promise<PaginatedLoanRepayments> {
    const res = await apiClient.get<PaginatedLoanRepayments>(
      BackendRoutes.getLoanRepayments,
      {
        requiresAuth: true,
        params: filters,
      }
    );

    return res.data;
  }

  static async getLoanRepayment(id: string): Promise<LoanRepayment> {
    const res = await apiClient.get<LoanRepayment>(
      BackendRoutes.getLoanRepayment(id),
      {
        requiresAuth: true,
      }
    );

    return res.data;
  }
}

export default LoanService;
