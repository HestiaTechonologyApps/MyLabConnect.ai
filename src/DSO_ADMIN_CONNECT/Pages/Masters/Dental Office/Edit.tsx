import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { DropdownHandlers } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import COUNTRIES from "../../../../Configs/Country";
import CITIES from "../../../../Configs/City";

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "officeCode", rules: { type: "text",          label: "Office Code",     required: true,  maxLength: 50,  colWidth: 6  } },
  { name: "officeName", rules: { type: "text",          label: "Office Name",     required: true,  maxLength: 100, colWidth: 6  } },
  { name: "email",      rules: { type: "text",          label: "Email",           required: false, maxLength: 150, colWidth: 6  } },
  { name: "mobileNum",  rules: { type: "text",          label: "Mobile Number",   required: false, maxLength: 20,  colWidth: 6  } },
  { name: "postCode",   rules: { type: "text",          label: "Post Code",       required: false, maxLength: 20,  colWidth: 6  } },
  { name: "country",    rules: { type: "smartdropdown", label: "Country",         required: false,                 colWidth: 6  } },
  { name: "city",       rules: { type: "smartdropdown", label: "City",            required: false,                 colWidth: 6  } },
  { name: "dsoZoneId",  rules: { type: "smartdropdown", label: "Zone",            required: false,                 colWidth: 6  } },
  { name: "address",    rules: { type: "text",          label: "Address",         required: false, maxLength: 255, colWidth: 12 } },
  { name: "info",       rules: { type: "text",          label: "Additional Info", required: false, maxLength: 500, colWidth: 12 } },
  { name: "isActive",   rules: { type: "toggle",        label: "Active",                                           colWidth: 6  } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSODentalOfficeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId }               = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── dropdownHandlers — each key matches a "smartdropdown" field name ──────
  //
  // KiduEditModal pre-populates dropdownValues[fieldName] from the fetched
  // record (via the savedId = data[f.name] logic in its useEffect), so the
  // KiduDropdown will show the correct selected label on open automatically.
  //
  const dropdownHandlers: DropdownHandlers = {
    // Country — static JSON list
    country: {
      staticOptions: COUNTRIES,
      placeholder:   "Select Country...",
    },

    // City — static JSON list
    city: {
      staticOptions: CITIES,
      placeholder:   "Select City...",
    },

    // Zone — paginated API call
    dsoZoneId: {
      paginatedFetch: async (params) => {
        const response = await DSOZoneService.getPaginatedList({
          pageNumber:     params.pageNumber,
          pageSize:       params.pageSize,
          searchTerm:     params.searchTerm,
          sortBy:         "zoneName",
          sortDescending: false,
        } as any);
        return { data: response.data, total: response.total };
      },
      mapOption: (row: DSOZone) => ({
        value: row.id!,
        label: row.name ?? String(row.id),
      }),
      pageSize:    10,
      placeholder: "Select Zone...",
    },
  };

  // ── Fetch handler ─────────────────────────────────────────────────────────
  //
  // KiduEditModal reads data[f.name] for each smartdropdown field and stores
  // it in dropdownValues automatically — so country, city, dsoZoneId all
  // pre-fill from the API response with no extra setState needed here.
  //
  const handleFetch = async (id: string | number) => {
    return await DSODentalOfficeService.getById(Number(id));
  };

  // ── Update handler ────────────────────────────────────────────────────────
  //
  // KiduEditModal merges dropdownValues into submitData before calling
  // onUpdate, so formData.country, formData.city, formData.dsoZoneId
  // are all available here.
  //
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    // 1. Get DSOMasterId from token
    let dsOMasterId: number;
    try {
      dsOMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload
    const payload: Partial<DSODentalOffice> = {
      id:          Number(id),
      officeCode:  formData.officeCode,
      officeName:  formData.officeName,
      email:       formData.email     ?? "",
      mobileNum:   formData.mobileNum ?? "",
      postCode:    formData.postCode  ?? "",
      country:     formData.country   ?? "",
      city:        formData.city      ?? "",
      dsoZoneId:   formData.dsoZoneId ? Number(formData.dsoZoneId) : undefined,
      address:     formData.address   ?? "",
      info:        formData.info      ?? "",
      dsoMasterId: dsOMasterId,
      isActive:    formData.isActive  ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSODentalOfficeService.update(Number(id), payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to update DSO Dental Office.");

    return result;
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Dental Office"
      subtitle="Update DSO Dental Office details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      dropdownHandlers={dropdownHandlers}
      successMessage="Dental Office updated successfully!"
      onSuccess={onSuccess}
      submitButtonText="Update Dental Office"
    />
  );
};

export default DSODentalOfficeEditModal;