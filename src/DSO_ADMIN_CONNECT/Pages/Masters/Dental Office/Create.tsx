import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type DropdownHandlers,
  type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import DSOZonePopup from "../../Setup/Zone/DSOZonePopup";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import COUNTRIES from "../../../../Configs/Country";
import CITIES from "../../../../Configs/City";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { name: "officeCode", rules: { type: "text", label: "Office Code", required: true, maxLength: 50, colWidth: 6 } },
  { name: "officeName", rules: { type: "text", label: "Office Name", required: true, maxLength: 100, colWidth: 6 } },
  { name: "email", rules: { type: "email", label: "Email", required: true, maxLength: 150, colWidth: 6 } },
  { name: "mobileNum", rules: { type: "number", label: "Mobile Number", required: true, maxLength: 20, colWidth: 6 } },
  { name: "postCode", rules: { type: "number", label: "Post Code", required: true, maxLength: 20, colWidth: 6 } },
  { name: "country", rules: { type: "smartdropdown", label: "Country", required: true, colWidth: 6 } },
  { name: "city", rules: { type: "smartdropdown", label: "City", required: true, colWidth: 6 } },
  { name: "dsoZoneId", rules: { type: "popup", label: "Zone", required: true, colWidth: 6 } }, // Changed to popup
  { name: "address", rules: { type: "textarea", label: "Address", required: true, maxLength: 255, colWidth: 6 } },
  { name: "info", rules: { type: "textarea", label: "Additional Info", required: false, maxLength: 500, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODentalOfficeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // State for zone popup
  const [selectedZone, setSelectedZone] = useState<DSOZone | null>(null);
  const [zonePopupOpen, setZonePopupOpen] = useState(false);

  // ── dropdownHandlers — for smartdropdown fields ───────────────────────────
  const dropdownHandlers: DropdownHandlers = {
    // Country — static JSON list
    country: {
      staticOptions: COUNTRIES,
      placeholder: "Select Country...",
    },

    // City — static JSON list
    city: {
      staticOptions: CITIES,
      placeholder: "Select City...",
    },
  };

  // ── popupHandlers — for popup fields ───────────────────────────────────────
  const popupHandlers: PopupHandlers = {
    dsoZoneId: {
      value: selectedZone?.name ?? "",
      onOpen: () => setZonePopupOpen(true),
      onClear: () => setSelectedZone(null),
    },
  };

  // ── extraValues — carries the actual ID for popup fields ───────────────────
  const extraValues = {
    dsoZoneId: selectedZone?.id ?? null,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data:", formData);
    console.log("Selected Zone:", selectedZone);

    // Validate zone selection
    if (!selectedZone?.id) {
      console.error("No zone selected");
      // The modal will handle validation via popupHandlers
    }

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
      officeCode: formData.officeCode,
      officeName: formData.officeName,
      email: formData.email ?? "",
      mobileNum: formData.mobileNum ?? "",
      postCode: formData.postCode ?? "",
      country: formData.country ?? "",
      city: formData.city ?? "",
      dsoZoneId: selectedZone?.id ? Number(selectedZone.id) : undefined, // Use selectedZone
      address: formData.address ?? "",
      info: formData.info ?? "",
      dsoMasterId: dsOMasterId,
      isActive: formData.isActive ?? true,
    };

    console.log("Submitting payload:", payload);

    // 3. Call API
    let result: any;
    try {
      result = await DSODentalOfficeService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to create DSO Dental Office.");
  };

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleHide = () => {
    setSelectedZone(null);
    onHide();
  };

  // ── Handle successful creation ────────────────────────────────────────────
  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    setSelectedZone(null);
    onSuccess();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Dental Office"
        subtitle="Add a new DSO Dental Office"
        fields={fields}
        onSubmit={handleSubmit}
        dropdownHandlers={dropdownHandlers}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Dental Office created successfully!"
        onSuccess={handleSuccess}
      />

      <DSOZonePopup
        show={zonePopupOpen}
        onClose={() => setZonePopupOpen(false)}
        onSelect={(zone) => {
          console.log("Selected zone:", zone);
          setSelectedZone(zone);
          setZonePopupOpen(false);
        }}
        showAddButton={true}
      />
    </>
  );
};

export default DSODentalOfficeCreateModal;