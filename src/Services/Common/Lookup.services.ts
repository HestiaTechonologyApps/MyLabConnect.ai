// src/Services/LookupService/Lookup.service.ts

import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import type { DoctorLookupItem, DSOLookupItem, LabLookupItem, LookupEntityName, PracticeLookupItem } from "../../Types/Auth/Lookup.types";
import HttpService from "../Common/HttpService";


async function fetchLookup<T>(entityName: LookupEntityName, recordId = 0): Promise<T[]> {
  try {
    const url = API_ENDPOINTS.LOOKUP.GET(entityName, recordId);
    const res = await HttpService.callApi<any>(url, "GET", null, false);
    if (!res?.isSucess) return [];
    if (Array.isArray(res.value)) return res.value as T[];
    if (Array.isArray(res.value?.data)) return res.value.data as T[];
    return [];
  } catch {
    return [];
  }
}

const LookupService = {
  getLabs: ()                        => fetchLookup<LabLookupItem>("lab"),
  getPractices: ()                   => fetchLookup<PracticeLookupItem>("practice"),
  getDoctors: ()                     => fetchLookup<DoctorLookupItem>("doctor"),
  getDSOList: ()                     => fetchLookup<DSOLookupItem>("dso"),
  /** Generic — use when you need a raw lookup by entity name */
  get: <T = any>(entityName: LookupEntityName, recordId = 0) =>
    fetchLookup<T>(entityName, recordId),
};

export default LookupService;