import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { TableRequestParams, TableResponse } from "../../../KIDU_COMPONENTS/KiduServerTable";
import HttpService from "../../../Services/Common/HttpService";
import type { DSODoctor } from "../../Types/Masters/DsoDoctor.types";

export default class DSODoctorService {

  static async getPaginatedList(params: TableRequestParams): Promise<TableResponse<DSODoctor>> {
    
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
      firstName: params["firstName"] ?? "",
      lastName: params["lastName"] ?? "",
      fullName: params["fullName"] ?? "",
      email: params["email"] ?? "",
      phoneNumber: params["phoneNumber"] ?? "",
      licenseNo: params["licenseNo"] ?? "",
      doctorCode: params["doctorCode"] ?? "",
      dsoMasterId: params["dsoMasterId"] ? Number(params["dsoMasterId"]) : undefined,
    };

    console.log("DSODoctor pagination payload:", payload);

    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_DOCTOR.UPDATE_PAGINATION,
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
        API_ENDPOINTS.DSO_DOCTOR.GET_BY_ID(id), 
        "GET"
      );
      console.log("GetById Response:", response);
      return response;
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  }

  static async create(data: Partial<DSODoctor>): Promise<any> {
    try {
      // Generate fullName if not provided
      const fullName = data.fullName || 
        (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}`.trim() : "");

      // Ensure dsoDentalDoctors is properly formatted with type assertion
      const dsoDentalDoctors = (data.dsoDentalDoctors || []).map((doctor: any) => ({
        id: doctor.id ?? 0,
        dsoDentalOfficeId: doctor.dsoDentalOfficeId,
        dsoDoctorId: 0, // Will be set by server
        isPrimary: doctor.isPrimary === undefined ? false : doctor.isPrimary,
        isActive: doctor.isActive === undefined ? true : doctor.isActive,
        isDeleted: false,
      }));

      // Ensure labMappings is properly formatted
      const labMappings = (data.labMappings || []).map((mapping: any) => ({
        id: mapping.id ?? 0,
        labMasterId: mapping.labMasterId,
        labName: mapping.labName ?? "",
        labDescription: mapping.labDescription ?? "",
        dsoDoctorId: 0, // Will be set by server
        isActive: mapping.isActive === undefined ? true : mapping.isActive,
        isDeleted: false,
      }));

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: fullName,
        email: data.email ?? "",
        phoneNumber: data.phoneNumber ?? "",
        address: data.address ?? "",
        licenseNo: data.licenseNo,
        doctorCode: data.doctorCode,
        info: data.info ?? "",
        dsoMasterId: Number(data.dsoMasterId),
        dsoDentalDoctors: dsoDentalDoctors,
        labMappings: labMappings,
        isActive: data.isActive ?? true,
        isDeleted: false,
      };
      
      console.log("Create Payload:", payload);
      console.log("Create Endpoint:", API_ENDPOINTS.DSO_DOCTOR.CREATE);
      
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_DOCTOR.CREATE, 
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

  static async update(id: number, data: Partial<DSODoctor>): Promise<any> {
    try {
      // Generate fullName if not provided
      const fullName = data.fullName || 
        (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}`.trim() : "");

      // Ensure dsoDentalDoctors is properly formatted with type assertion
      const dsoDentalDoctors = (data.dsoDentalDoctors || []).map((doctor: any) => ({
        id: doctor.id ?? 0,
        dsoDentalOfficeId: doctor.dsoDentalOfficeId,
        dsoDoctorId: id,
        isPrimary: doctor.isPrimary === undefined ? false : doctor.isPrimary,
        isActive: doctor.isActive === undefined ? true : doctor.isActive,
        isDeleted: false,
      }));

      // Ensure labMappings is properly formatted
      const labMappings = (data.labMappings || []).map((mapping: any) => ({
        id: mapping.id ?? 0,
        labMasterId: mapping.labMasterId,
        labName: mapping.labName ?? "",
        labDescription: mapping.labDescription ?? "",
        dsoDoctorId: id,
        isActive: mapping.isActive === undefined ? true : mapping.isActive,
        isDeleted: false,
      }));

      const payload = {
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: fullName,
        email: data.email ?? "",
        phoneNumber: data.phoneNumber ?? "",
        address: data.address ?? "",
        licenseNo: data.licenseNo,
        doctorCode: data.doctorCode,
        info: data.info ?? "",
        dsoMasterId: Number(data.dsoMasterId),
        dsoDentalDoctors: dsoDentalDoctors,
        labMappings: labMappings,
        isActive: data.isActive ?? true,
      };
      
      console.log("Update Payload:", payload);
      
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_DOCTOR.UPDATE(id), 
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
        API_ENDPOINTS.DSO_DOCTOR.DELETE(id), 
        "DELETE"
      );
      console.log(`Deleted DSO Doctor with id ${id}`);
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }

  static async getAll(): Promise<DSODoctor[]> {
    try {
      const response = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_DOCTOR.GET_ALL, 
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

  // Additional method for getting doctors by dental office
  static async getByDentalOfficeId(officeId: number): Promise<DSODoctor[]> {
    try {
      const response = await HttpService.callApi<any>(
        `${API_ENDPOINTS.DSO_DOCTOR.GET_ALL}?dsoDentalOfficeId=${officeId}`, 
        "GET"
      );
      console.log(`Get Doctors for Office ${officeId}:`, response);
      
      const result = response?.value ?? response?.data ?? response;
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error in getByDentalOfficeId:", error);
      throw error;
    }
  }

  // Additional method for getting doctors by lab
  static async getByLabId(labId: number): Promise<DSODoctor[]> {
    try {
      const response = await HttpService.callApi<any>(
        `${API_ENDPOINTS.DSO_DOCTOR.GET_ALL}?labMasterId=${labId}`, 
        "GET"
      );
      console.log(`Get Doctors for Lab ${labId}:`, response);
      
      const result = response?.value ?? response?.data ?? response;
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error in getByLabId:", error);
      throw error;
    }
  }
}