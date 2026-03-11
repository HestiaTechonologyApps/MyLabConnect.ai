// src/Services/CasePickup/CasePickup.service.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { CasePickup, CasePickupCreatePayload, CasePickupDetail, CasePickupUpdatePayload } from "../../Types/Pickup.type";


export default class CasePickupService {
  // ── Paginated list (for KiduServerTableList) ──────────────────────────────
  static async getPaginatedList(
    params: TableRequestParams
  ): Promise<TableResponse<CasePickup>> {
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active") showInactive = true;
    if (statusFilter === "Inactive") showInactive = false;

    const payload = {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      searchTerm: params.searchTerm ?? "",
      sortBy: params.sortBy ?? "",
      sortDescending: params.sortDescending ?? false,
      showDeleted: false,
      showInactive,
      // Column-level filters
      labName: params["labName"] ?? "",
      pickUpDate: params["pickUpDate"] ?? "",
      trackingNum: params["trackingNum"] ?? "",
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.GET_PAGINATED,
      "POST",
      payload
    );

    const result = response?.value ?? response;

    return {
      data: result.data ?? result.items ?? [],
      total: result.totalRecords ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

  // ── Get by ID ─────────────────────────────────────────────────────────────
  static async getById(id: number): Promise<CasePickupDetail> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.GET_BY_ID(id),
      "GET"
    );
  }

  // ── Create ────────────────────────────────────────────────────────────────
  static async create(data: CasePickupCreatePayload): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.CREATE,
      "POST",
      data
    );
  }

  // ── Update ────────────────────────────────────────────────────────────────
  static async update(id: number, data: CasePickupUpdatePayload): Promise<any> {
    return await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.UPDATE(id),
      "PUT",
      data
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.CASEPICKUP.DELETE(id),
      "DELETE"
    );
  }

  // ── Get all (non-paginated) ───────────────────────────────────────────────
  static async getAll(): Promise<CasePickup[]> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.CASEPICKUP.GET_ALL,
      "GET"
    );
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }
}