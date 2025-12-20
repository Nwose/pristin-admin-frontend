/**
 * Disbursement Service - Handles disbursement queue operations
 */
import { apiClient } from "../../ApiClient";
import { BackendRoutes } from "../../BackendRoutes";
import {
  UUID,
  DisbursementQueueFilter,
  DisbursementQueueDetail,
  PaginatedDisbursementQueue,
  AddToDisbursementQueueResponse,
  AddToDisbursementQueuePayload,
  ProcessDisbursementPayload,
  ProcessDisbursementResponse,
  CancelDisbursementPayload,
  CancelDisbursementResponse,
  BulkProcessDisbursementPayload,
  BulkProcessDisbursementsResponse,
  DisbursementStatisticsResponse,
} from "../../types/loan";

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
