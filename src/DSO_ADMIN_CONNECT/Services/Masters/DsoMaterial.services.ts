import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOMaterial } from "../../Types/Masters/DsoMaterial.types";

export default class DSOMaterialService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOMaterial>> {
    
    // Map "Active"/"Inactive" select filter to showInactive boolean
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
      showInactive: showInactive,

      // Column filters
      name: params["name"] ?? "",
      dsoRestorationTypeId: params["dsoRestorationTypeId"] ? Number(params["dsoRestorationTypeId"]) : undefined,
    };

    console.log("Paginated Request Payload:", payload);

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_MATERIAL.UPDATE_PAGINATION,
      "POST",
      payload
    );

    console.log("Paginated Response:", response);

    const result = response?.value ?? response;

    return {
      data: result.data ?? result.items ?? [],
      total: result.totalRecords ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

  static async getById(id: number): Promise<any> {
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_MATERIAL.GET_BY_ID(id), 
      "GET"
    );
    console.log("GetById Response:", response);
    return response;
  }

  static async create(data: Partial<DSOMaterial>): Promise<any> {
    const payload = {
      name: data.name,
      dsoRestorationTypeId: Number(data.dsoRestorationTypeId),
      isActive: data.isActive ?? true,
      isDeleted: false,
    };
    
    console.log("Create Payload:", payload);
    
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_MATERIAL.CREATE, 
      "POST", 
      payload
    );
    
    console.log("Create Response:", response);
    return response;
  }

  static async update(id: number, data: Partial<DSOMaterial>): Promise<any> {
    const payload = {
      id,
      name: data.name,
      dsoRestorationTypeId: Number(data.dsoRestorationTypeId),
      isActive: data.isActive ?? true,
    };
    
    console.log("Update Payload:", payload);
    
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_MATERIAL.UPDATE(id), 
      "PUT", 
      payload
    );
    
    console.log("Update Response:", response);
    return response;
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.DSO_MATERIAL.DELETE(id), 
      "DELETE"
    );
    console.log(`Deleted DSO Material with id ${id}`);
  }
}