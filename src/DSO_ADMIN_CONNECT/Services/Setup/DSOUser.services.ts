import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSOUser } from "../../Types/Setup/DSOUser.types";

export default class DSOUserService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSOUser>> {

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
      showInactive:   showInactive,

      // Column filters — keys match DSO_UsersPaginationParams exactly
      firstName:   params["fullName"]      ?? params["firstName"]   ?? "",
      lastName:    params["lastName"]      ?? "",
      email:       params["email"]         ?? "",
      phoneNumber: params["phoneNumber"]   ?? "",
      userId:      params["userId"]        ? Number(params["userId"]) : undefined,
      dsoMasterId: params["dsoMasterId"]   ? Number(params["dsoMasterId"]) : undefined,
    };

    const response = await HttpService.callApi<any>(
      API_ENDPOINTS.DSO_USER.GET_PAGINATED,
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
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_USER.GET_BY_ID(id), "GET");
  }

  static async create(data: Partial<DSOUser>): Promise<any> {
    const payload = {
      ...data,
      fullName:  `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
      isActive:  data.isActive ?? true,
      isDeleted: false,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_USER.CREATE, "POST", payload);
  }

  static async update(id: number, data: Partial<DSOUser>): Promise<any> {
    const payload = {
      id,
      ...data,
      fullName: data.firstName && data.lastName
        ? `${data.firstName} ${data.lastName}`.trim()
        : data.fullName,
    };
    return await HttpService.callApi<any>(API_ENDPOINTS.DSO_USER.UPDATE(id), "PUT", payload);
  }

  static async delete(id: number): Promise<void> {
    await HttpService.callApi<void>(API_ENDPOINTS.DSO_USER.DELETE(id), "DELETE");
  }
}