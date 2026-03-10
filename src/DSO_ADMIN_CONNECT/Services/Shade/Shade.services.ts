import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOShade } from "../../Types/Shade/Shade.types";


export default class DSOShadeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOShade>> {
    
    // Map "Active"/"Inactive" select filter to showInactive boolean
    let showInactive: boolean | undefined = undefined;
    const statusFilter = params["isActive"];
    if (statusFilter === "Active")   showInactive = true;
    if (statusFilter === "Inactive") showInactive = false;

    const payload = {
      pageNumber:     params.pageNumber,
      pageSize:       params.pageSize,
      searchTerm:     params.searchTerm     ?? "",
      sortBy:         params.sortBy         ?? "",
      sortDescending: params.sortDescending  ?? false,
      showDeleted:    false,
      showInactive:   showInactive,          // undefined = backend default (show all)

      // Column filters — keys match DSOShadePaginationParams exactly
      Name: params["Name"]  ?? "",
      dsoMasterId:  params["dsoMasterId"]  ? Number(params["dsoMasterId"]) : undefined,
    };

    console.log("DSOShade pagination payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_SHADE.UPDATE_PAGINATION,
      "POST",
      payload
    );

    const result = response?.value ?? response;

    return {
      data:       result.data         ?? result.items ?? [],
      total:      result.totalRecords  ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_SHADE.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<DSOShade>): Promise<any> {
    const payload = {
      ...data,
      isActive:  data.isActive ?? true,
      isDeleted: false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_SHADE.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<DSOShade>): Promise<any> {
    const payload = {
      id,
      ...data,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_SHADE.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.DSO_SHADE.DELETE(id), "DELETE");
  }

  static async getAll(): Promise<DSOShade[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.DSO_SHADE.GET_ALL, "GET");
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }
}