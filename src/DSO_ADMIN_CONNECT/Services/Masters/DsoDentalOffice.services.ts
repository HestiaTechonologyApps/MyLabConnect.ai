import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSODentalOffice } from "../../Types/Masters/DsoDentalOffice.types";

export default class DSODentalOfficeService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSODentalOffice>> {
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
      showInactive:   showInactive,

      // Column filters
      officeCode:  params["officeCode"]  ?? "",
      officeName:  params["officeName"]  ?? "",
      city:        params["city"]        ?? "",
      country:     params["country"]     ?? "",
      dsoZoneId:   params["dsoZoneId"]   ? Number(params["dsoZoneId"]) : undefined,
      dsoMasterId: params["dsoMasterId"] ? Number(params["dsoMasterId"]) : undefined,
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_DENTAL_OFFICE.UPDATE_PAGINATION,
      "POST",
      payload
    );

    const result = response?.value ?? response;

    return {
      data:       result.data        ?? result.items ?? [],
      total:      result.totalRecords ?? result.total ?? 0,
      totalPages: result.totalPages,
    };
  }

  static async getById(id: number): Promise<any> {
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<DSODentalOffice>): Promise<any> {
    const payload = {
      ...data,
      isActive:  data.isActive ?? true,
      isDeleted: false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_DENTAL_OFFICE.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<DSODentalOffice>): Promise<any> {
    const payload = { id, ...data };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_DENTAL_OFFICE.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.DSO_DENTAL_OFFICE.DELETE(id), "DELETE");
  }

  static async getAll(): Promise<DSODentalOffice[]> {
    const response = await HttpService.callApi<any>(API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_ALL, "GET");
    const result = response?.value ?? response?.data ?? response;
    return Array.isArray(result) ? result : [];
  }
}