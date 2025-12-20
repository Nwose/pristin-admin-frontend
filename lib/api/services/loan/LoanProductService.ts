/**
 * Loan Product Service - Handles loan product operations
 */
import { apiClient } from "../../ApiClient";
import { BackendRoutes } from "../../BackendRoutes";
import {
  LoanProduct,
  LoanProductConfig,
  LoanProductFilters,
  PaginatedLoanProducts,
} from "../../types/loan";

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
