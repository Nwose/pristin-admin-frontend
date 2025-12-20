/**
 * Pagination types
 */

export interface PaginatedAnything<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Forward declarations - will be properly typed after individual domain imports
export interface PaginatedLoans extends PaginatedAnything<any> {}
export interface PaginatedLoanApplications extends PaginatedAnything<any> {}
export interface PaginatedLoanProducts extends PaginatedAnything<any> {}
export interface PaginatedLoanRepayments extends PaginatedAnything<any> {}
export interface PaginatedDisbursementQueue extends PaginatedAnything<any> {}
