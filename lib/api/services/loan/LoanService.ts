/**
 * Loan Service - Handles core loan operations
 */
import { apiClient } from "../../ApiClient";
import { BackendRoutes } from "../../BackendRoutes";
import { Loan, LoanFilters, PaginatedLoans } from "../../types/loan";

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
