import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOProduct } from "../../Types/Masters/DsoProduct.types";

export default class DSOProductService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOProduct>> {
    
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

      // Column filters — match API expected field names
      code: params["code"] ?? "",
      name: params["name"] ?? "",
      dsoRestorationTypeId: params["dsoRestorationTypeId"] ? Number(params["dsoRestorationTypeId"]) : undefined,
      dsoSchemaId: params["dsoSchemaId"] ? Number(params["dsoSchemaId"]) : undefined,
      dsoIndicationId: params["dsoIndicationId"] ? Number(params["dsoIndicationId"]) : undefined,
      dsoProductGroupId: params["dsoProductGroupId"] ? Number(params["dsoProductGroupId"]) : undefined,
      dsoMasterId: params["dsoMasterId"] ? Number(params["dsoMasterId"]) : undefined,
    };

    console.log("DSOProduct pagination payload:", payload);

    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_PRODUCT.UPDATE_PAGINATION,
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
    } catch (error) {
      console.error("Error in getPaginatedList:", error);
      throw error;
    }
  }

  static async getById(id: number): Promise<any> {
    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_PRODUCT.GET_BY_ID(id), 
        "GET"
      );
      console.log("GetById Response:", response);
      return response;
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  }

  static async create(data: Partial<DSOProduct>): Promise<any> {
    try {
      const payload = {
        code: data.code,
        name: data.name,
        rate: data.rate,
        dsoRestorationTypeId: Number(data.dsoRestorationTypeId),
        dsoSchemaId: Number(data.dsoSchemaId),
        dsoIndicationId: Number(data.dsoIndicationId),
        dsoProductGroupId: Number(data.dsoProductGroupId),
        dsoMasterId: Number(data.dsoMasterId),
        isActive: data.isActive ?? true,
        isDeleted: false,
      };
      
      console.log("Create Payload:", payload);
      console.log("Create Endpoint:", API_ENDPOINTS.DSO_PRODUCT.CREATE);
      
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_PRODUCT.CREATE, 
        "POST", 
        payload
      );
      
      console.log("Create Response:", response);
      return response;
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  static async update(id: number, data: Partial<DSOProduct>): Promise<any> {
    try {
      const payload = {
        id,
        code: data.code,
        name: data.name,
        rate: data.rate,
        dsoRestorationTypeId: Number(data.dsoRestorationTypeId),
        dsoSchemaId: Number(data.dsoSchemaId),
        dsoIndicationId: Number(data.dsoIndicationId),
        dsoProductGroupId: Number(data.dsoProductGroupId),
        dsoMasterId: Number(data.dsoMasterId),
        isActive: data.isActive ?? true,
      };
      
      console.log("Update Payload:", payload);
      
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_PRODUCT.UPDATE(id), 
        "PUT", 
        payload
      );
      
      console.log("Update Response:", response);
      return response;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      await HttpService.callApi<void>(
        API_ENDPOINTS.DSO_PRODUCT.DELETE(id), 
        "DELETE"
      );
      console.log(`Deleted DSO Product with id ${id}`);
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }

  static async getAll(): Promise<DSOProduct[]> {
    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_PRODUCT.GET_ALL, 
        "GET"
      );
      console.log("GetAll Response:", response);
      
      const result = response?.value ?? response?.data ?? response;
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  }
}