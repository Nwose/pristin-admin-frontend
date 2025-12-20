/**
 * Loan Application Service - Handles loan application operations
 */
import { apiClient } from "../../ApiClient";
import { BackendRoutes } from "../../BackendRoutes";
import {
  LoanApplication,
  LoanApplicationFilters,
  PaginatedLoanApplications,
} from "../../types/loan";

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
