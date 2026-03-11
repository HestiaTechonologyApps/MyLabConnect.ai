// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/DOCTOR_CONNECT/Service/Prescription/Prescription.services.ts
// ─────────────────────────────────────────────────────────────────────────────

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import AuthService from "../../../Services/AuthServices/Auth.services";
import HttpService from "../../../Services/Common/HttpService";
import type { DentalOfficeItem } from "../../Pages/Analog Case Prescription/DentalOfficePopup";

export interface IdNameOption {
  id: number;
  name: string;
}

// ── Safe GET → always returns array ──────────────────────────────────────────
async function getArray<T>(url: string): Promise<T[]> {
  try {
    const res = await HttpService.callApi<any>(url, "GET", null, false);
    if (!res?.isSucess) return [];
    if (Array.isArray(res.value)) return res.value as T[];
    if (Array.isArray(res.value?.data)) return res.value.data as T[];
    return [];
  } catch {
    return [];
  }
}

// ── Safe POST paginated → always returns array ────────────────────────────────
async function postPaginated<T>(url: string, body: object): Promise<T[]> {
  try {
    const res = await HttpService.callApi<any>(url, "POST", body, false);
    if (!res?.isSucess) return [];
    if (Array.isArray(res.value?.data)) return res.value.data as T[];
    if (Array.isArray(res.value)) return res.value as T[];
    return [];
  } catch {
    return [];
  }
}

// ── Normalize a raw API row: handle both camelCase and PascalCase ─────────────
function normalizeDoctor(r: any): { id: number; email: string } {
  // email field can be a string or array (duplicate JWT claims edge-case)
  let email = r.email ?? r.Email ?? r.userEmail ?? r.UserEmail ?? "";
  if (Array.isArray(email)) email = email[0] ?? "";
  return {
    id: r.id ?? r.Id ?? 0,
    email: String(email),
  };
}

// ── Safely extract userEmail from AuthUser (guards against Array) ─────────────
function getSafeUserEmail(user: any): string | null {
  let email = user?.userEmail ?? user?.email ?? null;
  if (Array.isArray(email)) email = email[0] ?? null;
  if (!email || typeof email !== "string") return null;
  return email.toLowerCase().trim();
}

// ─────────────────────────────────────────────────────────────────────────────
const PrescriptionService = {

  // ── STEP 1: Resolve the logged-in doctor's DSODoctor entity ID ───────────
  async getMyDoctorId(): Promise<number | null> {
    const user = AuthService.getUser();

    const userEmail   = getSafeUserEmail(user);
    const dsoMasterId = user?.dsoMasterId ?? null;

    if (!userEmail || !dsoMasterId) {
      console.warn(
        "[PrescriptionService] Missing userEmail or dsoMasterId on session user.",
        "userEmail:", userEmail,
        "dsoMasterId:", dsoMasterId,
        "raw user:", user
      );
      return null;
    }

    // Fetch ALL doctors for this DSO in one call
    const rows = await postPaginated<any>(
      API_ENDPOINTS.DSO_DOCTOR.UPDATE_PAGINATION,
      {
        pageNumber:  1,
        pageSize:    200,
        dSOMasterId: dsoMasterId,
        getAll:      true,
        showDeleted: false,
      }
    );

    console.log("[PrescriptionService] Raw doctor rows (first 3):", rows.slice(0, 3));
    console.log("[PrescriptionService] Looking for email:", userEmail);

    // Match by email
    const match = rows.find((r: any) => {
      const { email } = normalizeDoctor(r);
      return email.toLowerCase().trim() === userEmail;
    });

    if (!match) {
      console.warn(
        "[PrescriptionService] Could not match doctor.",
        "userEmail:", userEmail,
        "emails in rows:", rows.map((r: any) => normalizeDoctor(r).email)
      );
      return null;
    }

    const doctorId = normalizeDoctor(match).id;
    console.log("[PrescriptionService] Matched doctorId:", doctorId);
    return doctorId;
  },

  // ── STEP 2: Get only the offices this doctor is mapped to ────────────────
  async getMyOffices(doctorId: number): Promise<DentalOfficeItem[]> {
    try {
      const res = await HttpService.callApi<any>(
        API_ENDPOINTS.DSO_DOCTOR.GET_BY_ID(doctorId),
        "GET",
        null,
        false
      );

      if (!res?.isSucess || !res.value) {
        console.warn("[PrescriptionService] getMyOffices: no data for doctorId", doctorId);
        return [];
      }

      console.log("[PrescriptionService] getMyOffices raw response value:", res.value);

      // ── Try every possible key the C# serializer might produce ────────────
      // GetDetailByIdAsync returns DSODoctorCreateUpdateDTO
      // with property: ICollection<DSODoctorDentalOfficeCreateUpdateDTO> DsoDentalDoctors
      // camelCase JSON → "dsoDentalDoctors"
      const mappings: any[] =
        res.value.dsoDentalDoctors   ??   // ← camelCase from C# DsoDentalDoctors
        res.value.DsoDentalDoctors   ??   // ← PascalCase fallback
        res.value.dsaDentalDoctors   ??
        res.value.DsaDentalDoctors   ??
        res.value.officeMappings     ??
        res.value.OfficeMappings     ??
        res.value.dentalOfficeMappings ??
        [];

      console.log("[PrescriptionService] getMyOffices raw mappings:", mappings);

      // Filter out soft-deleted mappings
      const activeMappings = mappings.filter(
        (m: any) => !(m.isDeleted ?? m.IsDeleted ?? false)
      );

      console.log("[PrescriptionService] getMyOffices active mappings:", activeMappings);

      if (activeMappings.length === 0) {
        console.warn("[PrescriptionService] No active office mappings for doctorId", doctorId);
        return [];
      }

      // Fetch each office's details in parallel
      const officeResults = await Promise.all(
        activeMappings.map((m: any) => {
          const officeId =
            m.dSODentalOfficeId ??
            m.DSODentalOfficeId ??
            m.dentalOfficeId    ??
            m.DentalOfficeId    ??
            null;

          console.log("[PrescriptionService] Fetching officeId:", officeId, "from mapping:", m);

          if (!officeId) return Promise.resolve(null);

          return HttpService.callApi<any>(
            API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_BY_ID(officeId),
            "GET",
            null,
            false
          ).then((r: any) => {
            console.log("[PrescriptionService] Office response for id", officeId, ":", r?.value);
            return r?.isSucess && r.value ? r.value : null;
          });
        })
      );

      const offices = officeResults
        .filter(Boolean)
        .map((o: any): DentalOfficeItem => ({
          id:         o.id         ?? o.Id         ?? 0,
          officeName: o.officeName ?? o.OfficeName ?? "",
          officeCode: o.officeCode ?? o.OfficeCode ?? "",
          address:    o.address    ?? o.Address    ?? "",
          city:       o.city       ?? o.City       ?? "",
          postCode:   o.postCode   ?? o.PostCode   ?? "",
          country:    o.country    ?? o.Country    ?? "",
          isActive:   o.isActive   ?? o.IsActive   ?? true,
        }));

      console.log("[PrescriptionService] Final offices:", offices);
      return offices;

    } catch (err) {
      console.error("[PrescriptionService] getMyOffices failed:", err);
      return [];
    }
  },

  // ── Build the Ship To string ──────────────────────────────────────────────
  buildShipTo(office: DentalOfficeItem): string {
    return [office.officeName, office.address, office.city, office.country, office.postCode]
      .filter((s) => s?.trim())
      .join(", ");
  },

  // ── Get first DSO Schema ──────────────────────────────────────────────────
  async getFirstSchema(dsoMasterId: number): Promise<IdNameOption | null> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_SCHEMA.GET_ALL);
    const match = all.find(
      (s: any) =>
        (s.dSOMasterId ?? s.DSOMasterId) === dsoMasterId &&
        !(s.isDeleted ?? s.IsDeleted ?? false)
    );
    if (!match) return null;
    return {
      id:   match.id   ?? match.Id,
      name: match.name ?? match.Name ?? "",
    };
  },

  // ── Restoration: Prothesis types ─────────────────────────────────────────
  async getProthesisTypes(dsoMasterId: number): Promise<IdNameOption[]> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_PROTHESIS_TYPE.GET_ALL);
    return all
      .filter(
        (p: any) =>
          (p.dSOMasterId ?? p.DSOMasterId) === dsoMasterId &&
          !(p.isDeleted  ?? p.IsDeleted  ?? false) &&
          (p.isActive    ?? p.IsActive   ?? true)
      )
      .map((p: any) => ({ id: p.id ?? p.Id, name: p.name ?? p.Name ?? "" }));
  },

  // ── Restoration: Restoration types ───────────────────────────────────────
  async getRestorationTypes(prothesisTypeId: number): Promise<IdNameOption[]> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_RESTORATION_TYPE.GET_ALL);
    return all
      .filter(
        (r: any) =>
          (r.dSOProthesisTypeId ?? r.DSOProthesisTypeId) === prothesisTypeId &&
          !(r.isDeleted ?? r.IsDeleted ?? false) &&
          (r.isActive   ?? r.IsActive  ?? true)
      )
      .map((r: any) => ({ id: r.id ?? r.Id, name: r.name ?? r.Name ?? "" }));
  },

  // ── Restoration: Indications ──────────────────────────────────────────────
  async getIndications(prothesisTypeId: number): Promise<IdNameOption[]> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_INDICATION.GET_ALL);
    return all
      .filter(
        (i: any) =>
          (i.dSOProthesisTypeId ?? i.DSOProthesisTypeId) === prothesisTypeId &&
          !(i.isDeleted ?? i.IsDeleted ?? false) &&
          (i.isActive   ?? i.IsActive  ?? true)
      )
      .map((i: any) => ({ id: i.id ?? i.Id, name: i.name ?? i.Name ?? "" }));
  },

  // ── Restoration: Materials ────────────────────────────────────────────────
  async getMaterials(restorationTypeId: number): Promise<IdNameOption[]> {
    const all = await getArray<any>(API_ENDPOINTS.DSO_MATERIAL.GET_ALL);
    return all
      .filter(
        (m: any) =>
          (m.dSORestorationTypeId ?? m.DSORestorationTypeId) === restorationTypeId &&
          !(m.isDeleted ?? m.IsDeleted ?? false) &&
          (m.isActive   ?? m.IsActive  ?? true)
      )
      .map((m: any) => ({ id: m.id ?? m.Id, name: m.name ?? m.Name ?? "" }));
  },

  // ── Shade guides (static fallback) ────────────────────────────────────────
  getShadeGuides(): IdNameOption[] {
    return [
      { id: 1, name: "Default"        },
      { id: 2, name: "VITAPAN"        },
      { id: 3, name: "VITA_CLASSICAL" },
    ];
  },
};

export default PrescriptionService;