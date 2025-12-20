/**
 * Disbursement queue types, enums, filters, and payloads
 */
import { Loan } from "./loan";
import { PublicUser } from "./user";
import { UUID, ISODateString } from "./common";

/* -------- ENUMS -------- */
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

/* -------- INTERFACES -------- */
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

/* -------- RESPONSES -------- */
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
  message: string;
}

/* -------- PAYLOADS -------- */
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

/* -------- STATISTICS -------- */
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

/* -------- FILTERS & ORDERING -------- */
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
  added_by?: string; // UUID of user who added to queue
  user_id?: string; // UUID of borrower
  loan_id?: string; // UUID of loan
  created_after?: string; // ISO datetime
  created_before?: string; // ISO datetime
  updated_after?: string; // ISO datetime
  updated_before?: string; // ISO datetime
  amount_min?: number;
  amount_max?: number;
  status?: DisbursementQueueStatusEnum;
  statuses?: DisbursementQueueStatusEnum[]; // Multiple statuses
  search?: string; // Full-text search (name, email, notes)
  ordering?: DisbursementQueueOrdering;
}

/* -------- PAGINATION -------- */
export interface PaginatedDisbursementQueue {
  count: number;
  next: string | null;
  previous: string | null;
  results: DisbursementQueue[];
}
