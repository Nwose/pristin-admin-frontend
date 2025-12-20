/**
 * Loan repayment types and related filters
 */
import { UUID, ISODateString } from "./common";

export type RepaymentStatus = "PENDING" | "PAID" | "OVERDUE";

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

export interface LoanRepaymentFilters {
  status?: string; // RepaymentStatus
  loan?: string;
  is_overdue?: boolean;
  due_date_after?: string; // YYYY-MM-DD
  due_date_before?: string;
  page?: number;
}

export interface PaginatedLoanRepayments {
  count: number;
  next: string | null;
  previous: string | null;
  results: LoanRepayment[];
}
