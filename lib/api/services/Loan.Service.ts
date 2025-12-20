// lib/api/services/Loan.Service.ts
import { apiClient } from "../ApiClient";
import { BackendRoutes } from "../BackendRoutes";
import { UserType } from "../types/auth";


/* -------------------- ENUMS -------------------- */
export type LoanStatus =
  | "UNDISBURSED"
  | "ACTIVE"
  | "PAID"
  | "DEFAULTED"
  | "CANCELLED";

export type DecimalString = string;

export type UUID = string;

export type ISODateString = string;


export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type RepaymentStatus = "PENDING" | "PAID" | "OVERDUE";

export type LoanProductRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type RepaymentFrequency = "NONE" | "MONTHLY" | "WEEKLY" | "BIWEEKLY";


export enum DisbursementQueueStatusEnum {
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  DISBURSED = "DISBURSED",
  CANCELLED = "CANCELLED",
}

export enum DisbursementMethodEnum {
  WALLET = "WALLET",
  BANK = "BANK",
  MANUAL = "MANUAL",
}



/* -------------------- USER -------------------- */
export interface PublicUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
}

/* -------------------- LOAN -------------------- */

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

/* -------------------- LOAN PRODUCT -------------------- */

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


// -------------------- DISBURSEMENT QUEUE --------------------

export interface DisbursementQueueSerializer {
  loan_id: string;
}


export interface DisbursementQueue {
  id: UUID;
  loan: Loan;
  user: PublicUser;
  added_by: PublicUser;
  status: DisbursementQueueStatusEnum;
  status_display: string;
  amount: string;
  method: DisbursementMethodEnum;
  method_display: string;
  notes?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface DisbursementQueueDetail {
  id: UUID;
  loan: Loan;

  status: string;
  status_display: string;

  method: string;
  method_display: string;

  notes?: string;

  added_by: PublicUser;

  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface AddToDisbursementQueueResponse {
  status: "success";
  message: string;
  queue_entry: DisbursementQueueDetail;
}

export interface ProcessDisbursementResponse {
  status: "success";
  message: string;
  disbursement: DisbursementQueueDetail;
}

export interface BulkProcessDisbursementsResponse {
  status: string;
  message: string;
  results: {
    total: number;
    successful: ({
      queue_id: UUID;
      loan_id: UUID;
      reference: string;
    })[];
    failed: ({
      queue_id: UUID;
      error: string;
    })[];
  };
}

export interface CancelDisbursementResponse {
  status: "success";
  message: string; // disbursment for ... has been cancelled
}
// -------------------- DISBURSEMENT QUEUE PAYLOADS --------------------

export interface AddToDisbursementQueuePayload {
  loan_id: UUID;
  method?: DisbursementMethodEnum;
  notes?: string;
}

export interface ProcessDisbursementPayload {
  confirm?: boolean;
}

export interface CancelDisbursementPayload {
  reason: string;
}

export interface BulkProcessDisbursementPayload {
  queue_entry_ids: UUID[];
}

// -------------------- DISBURSEMENT STATISTICS --------------------
export interface DisbursementStatisticsItem {
  amount: string; // decimal
  count: number;
}

export interface DisbursementStatistics {
  total_disbursed: DisbursementStatisticsItem;
  pending: DisbursementStatisticsItem;
  today: DisbursementStatisticsItem;
}

export interface DisbursementStatisticsResponse {
  status: "success";
  statistics: DisbursementStatistics;
}

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

export type DisbursementQueueOrdering =
  | "created_at"
  | "-created_at"
  | "updated_at"
  | "-updated_at"
  | "amount"
  | "-amount"
  | "status"
  | "-status";

export interface DisbursementQueueFilter {
  method?: DisbursementMethodEnum;

  /** UUID of user who added to queue */
  added_by?: string;

  /** UUID of borrower */
  user_id?: string;

  /** UUID of loan */
  loan_id?: string;

  /** Created date range */
  created_after?: string;   // ISO datetime
  created_before?: string;  // ISO datetime

  /** Updated date range */
  updated_after?: string;   // ISO datetime
  updated_before?: string;  // ISO datetime

  /** Loan amount range */
  amount_min?: number;
  amount_max?: number;

  status?: DisbursementQueueStatusEnum;

  /** Multiple statuses (comma-separated on backend) */
  statuses?: DisbursementQueueStatusEnum[];

  /** Full-text search (name, email, notes) */
  search?: string;

  /** Ordering */
  ordering?: DisbursementQueueOrdering;
}


// -------------------- PAGINATION --------------------

export interface PaginatedAnything<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginatedLoans
  extends PaginatedAnything<Loan> { }

export interface PaginatedLoanApplications
  extends PaginatedAnything<LoanApplication> { }

export interface PaginatedLoanProducts
  extends PaginatedAnything<LoanProduct> { }

export interface PaginatedLoanRepayments
  extends PaginatedAnything<LoanRepayment> { }

export interface PaginatedDisbursementQueue
  extends PaginatedAnything<DisbursementQueue> { }


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
      BackendRoutes.createLoanApplication,
      {
        ...payload,
        product_id: payload.product,
      },
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



export class DisbursementService {
  /**
   * List disbursement queue entries (paginated).
   * Mirrors: GET /disbursements/ (list)
   */
  static async getDisbursements(
    filters?: DisbursementQueueFilter
  ): Promise<PaginatedDisbursementQueue> {
    const res = await apiClient.get<PaginatedDisbursementQueue>(
      BackendRoutes.getDisbursements,
      {
        requiresAuth: true,
        params: filters,
      }
    );

    return res.data;
  }

  /**
   * Retrieve a single disbursement queue entry.
   * Mirrors: GET /disbursements/{id}/ (retrieve)
   */
  static async getDisbursement(id: UUID): Promise<DisbursementQueueDetail> {
    const res = await apiClient.get<DisbursementQueueDetail>(
      BackendRoutes.getDisbursement(id),
      { requiresAuth: true }
    );

    return res.data;
  }

  /**
   * Add a loan to the disbursement queue.
   * Mirrors: POST /disbursements/add-to-queue/
   * Backend responds with { status, message, queue_entry: DisbursementQueueDetail }
   */
  static async addToQueue(
    payload: AddToDisbursementQueuePayload
  ): Promise<DisbursementQueueDetail> {
    const res = await apiClient.post<AddToDisbursementQueueResponse>(
      BackendRoutes.addToDisbursementQueue, 
      payload, 
      { requiresAuth: true }
    );

    return res.data.queue_entry;
  }

  /**
   * Process a queued disbursement.
   * Mirrors: POST /disbursements/{id}/process/
   * Backend responds with { status, message, disbursement: <result> }
   */
  static async processDisbursement(
    id: UUID,
    payload: ProcessDisbursementPayload
  ): Promise<ProcessDisbursementResponse> {
    const res = await apiClient.post<ProcessDisbursementResponse>(
      BackendRoutes.processDisbursement(id),
      payload,
      { requiresAuth: true }
    );

    return res.data;
  }

  /**
   * Cancel a queued disbursement.
   * Mirrors: POST /disbursements/{id}/cancel/
   * Backend responds with { status, message }
   */
  static async cancelDisbursement(
    id: UUID,
    payload: CancelDisbursementPayload
  ): Promise<CancelDisbursementResponse> {
    const res = await apiClient.post<CancelDisbursementResponse>(
      BackendRoutes.cancelDisbursement(id),
      payload,
      { requiresAuth: true }
    );

    return res.data;
  }

  /**
   * Bulk process disbursements.
   * Mirrors: POST /disbursements/bulk-process/
   * Backend responds with { status, message, results }
   */
  static async bulkProcessDisbursements(
    payload: BulkProcessDisbursementPayload
  ): Promise<BulkProcessDisbursementsResponse> {
    const res = await apiClient.post<BulkProcessDisbursementsResponse>(
      BackendRoutes.bulkProcessDisbursement,
      payload,
      { requiresAuth: true }
    );

    return res.data;
  }

  /**
   * Get disbursement statistics.
   * Mirrors: GET /disbursements/statistics/
   * Backend responds with { status, statistics: DisbursementStatistics }
   */
  static async getStatistics(): Promise<DisbursementStatisticsResponse> {
    const res = await apiClient.get<DisbursementStatisticsResponse>(
      BackendRoutes.getDisbursementStatistics,
      { requiresAuth: true }
    );

    return res.data;
  }
}
