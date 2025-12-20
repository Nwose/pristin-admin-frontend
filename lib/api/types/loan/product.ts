/**
 * Loan product types and related filters
 */
import { UUID, ISODateString } from "./common";

export type LoanProductRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type RepaymentFrequency = "NONE" | "MONTHLY" | "WEEKLY" | "BIWEEKLY";

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

export interface PaginatedLoanProducts {
  count: number;
  next: string | null;
  previous: string | null;
  results: LoanProduct[];
}
