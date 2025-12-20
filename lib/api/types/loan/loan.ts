/**
 * Loan types and related filters
 */
import { UserType } from "../auth";
import { LoanApplication } from "./application";
import { LoanRepayment } from "./repayment";
import { DecimalString, UUID, ISODateString } from "./common";

export type LoanStatus =
  | "UNDISBURSED"
  | "ACTIVE"
  | "PAID"
  | "DEFAULTED"
  | "CANCELLED";

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

export interface PaginatedLoans {
  count: number;
  next: string | null;
  previous: string | null;
  results: Loan[];
}
