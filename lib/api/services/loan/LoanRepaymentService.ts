/**
 * Loan Repayment Service - Handles loan repayment operations
 */
import { apiClient } from "../../ApiClient";
import { BackendRoutes } from "../../BackendRoutes";
import {
  LoanRepayment,
  LoanRepaymentFilters,
  PaginatedLoanRepayments,
} from "../../types/loan";

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
