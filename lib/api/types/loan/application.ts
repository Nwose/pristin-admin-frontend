/**
 * Loan application types and related filters
 */
import { PublicUser } from "./user";
import { LoanProduct } from "./product";
import { UUID, ISODateString } from "./common";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LoanApplication {
  id: string;
  user: PublicUser;
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

export interface PaginatedLoanApplications {
  count: number;
  next: string | null;
  previous: string | null;
  results: LoanApplication[];
}
