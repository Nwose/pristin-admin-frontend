/**
 * DEPRECATED: This file has been refactored into multiple files.
 * This file is kept for backward compatibility and re-exports everything.
 * 
 * New structure:
 * - lib/api/types/loan/ - All type definitions
 * - lib/api/services/loan/ - All service classes
 * 
 * Please update your imports to use the new paths directly.
 */

// Re-export all types
export type {
  DecimalString,
  UUID,
  ISODateString,
  LoanStatus,
  Loan,
  LoanFilters,
  PaginatedLoans,
  ApplicationStatus,
  LoanApplication,
  LoanApplicationFilters,
  PaginatedLoanApplications,
  RepaymentStatus,
  LoanRepayment,
  LoanRepaymentFilters,
  PaginatedLoanRepayments,
  LoanProductRiskLevel,
  RepaymentFrequency,
  LoanProduct,
  LoanProductConfig,
  LoanProductFilters,
  PaginatedLoanProducts,
  DisbursementQueue,
  DisbursementQueueDetail,
  AddToDisbursementQueueResponse,
  ProcessDisbursementResponse,
  BulkProcessDisbursementsResponse,
  CancelDisbursementResponse,
  AddToDisbursementQueuePayload,
  ProcessDisbursementPayload,
  CancelDisbursementPayload,
  BulkProcessDisbursementPayload,
  DisbursementStatisticsItem,
  DisbursementStatistics,
  DisbursementStatisticsResponse,
  DisbursementQueueOrdering,
  DisbursementQueueFilter,
  PaginatedDisbursementQueue,
  PaginatedAnything,
  PublicUser,
  UserType,
} from "@/lib/api/types/loan";

export {
  DisbursementQueueStatusEnum,
  DisbursementMethodEnum,
} from "@/lib/api/types/loan";

export type { DisbursementQueueSerializer } from "@/lib/api/types/loan";

// Re-export all services
export { LoanService } from "@/lib/api/services/loan";
export { LoanApplicationService } from "@/lib/api/services/loan";
export { LoanProductService } from "@/lib/api/services/loan";
export { LoanRepaymentService } from "@/lib/api/services/loan";
export { DisbursementService } from "@/lib/api/services/loan";
