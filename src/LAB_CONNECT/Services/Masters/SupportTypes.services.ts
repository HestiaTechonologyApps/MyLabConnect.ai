import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { LabSupportType } from "../../Types/Masters/SupportTypes.types";

export default class LabSupportTypeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<LabSupportType>> {
    
    // Build query parameters - only include if they have values
    const queryParams = new URLSearchParams();
    
    // Always include pagination params
    queryParams.append('pageNumber', params.pageNumber.toString());
    queryParams.append('pageSize', params.pageSize.toString());
    
    // Optional params - only append if they have values
    if (params.searchTerm) {
      queryParams.append('searchTerm', params.searchTerm);
    }
    
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    
    if (params.sortDescending !== undefined) {
      queryParams.append('sortDescending', params.sortDescending.toString());
    }
    
    // Always include showDeleted with default false
    queryParams.append('showDeleted', 'false');
    
    // Handle status filter - map "Active"/"Inactive" to showInactive boolean
    const statusFilter = params["isActive"];
    if (statusFilter === "Active") {
      queryParams.append('showInactive', 'false');
    } else if (statusFilter === "Inactive") {
      queryParams.append('showInactive', 'true');
    }
    
    // Column filters - only append if they have values
    if (params["labSupportTypeName"]) {
      queryParams.append('labSupportTypeName', params["labSupportTypeName"]);
    }
    
    if (params["labMasterId"]) {
      queryParams.append('labMasterId', params["labMasterId"].toString());
    }

    const url = `${API_ENDPOINTS.LAB_SUPPORT_TYPE.GET_PAGINATION}?${queryParams.toString()}`;
    console.log("GET URL:", url);

    const response = await HttpService.callApi<any>(
      url,
      "GET"
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
      API_ENDPOINTS.LAB_SUPPORT_TYPE.GET_BY_ID(id), 
      "GET"
    );
    console.log("GetById Response:", response);
    return response;
  }

  static async create(data: Partial<LabSupportType>): Promise<any> {
    const payload = {
      labSupportTypeName: data.labSupportTypeName,
      escalationDays: data.escalationDays ? Number(data.escalationDays) : 0,
      labMasterId: Number(data.labMasterId),
      isActive: data.isActive ?? true,
      isDeleted: false,
    };
    
    console.log("Create Payload:", payload);
    
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_SUPPORT_TYPE.CREATE, 
      "POST", 
      payload
    );
    
    console.log("Create Response:", response);
    return response;
  }

  static async update(id: number, data: Partial<LabSupportType>): Promise<any> {
    const payload = {
      id,
      labSupportTypeName: data.labSupportTypeName,
      escalationDays: data.escalationDays ? Number(data.escalationDays) : 0,
      labMasterId: Number(data.labMasterId),
      isActive: data.isActive ?? true,
    };
    
    console.log("Update Payload:", payload);
    
    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.LAB_SUPPORT_TYPE.UPDATE(id), 
      "PUT", 
      payload
    );
    
    console.log("Update Response:", response);
    return response;
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(
      API_ENDPOINTS.LAB_SUPPORT_TYPE.DELETE(id), 
      "DELETE"
    );
    console.log(`Deleted Lab Support Type with id ${id}`);
  }
}