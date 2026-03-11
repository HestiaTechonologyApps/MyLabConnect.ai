import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { DropdownHandlers } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import DSOZonePopup from "../../Setup/Zone/DSOZonePopup";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import COUNTRIES from "../../../../Configs/Country";
import CITIES from "../../../../Configs/City";
import toast from "react-hot-toast";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { name: "officeCode", rules: { type: "text", label: "Office Code", required: true, maxLength: 50, colWidth: 6 } },
  { name: "officeName", rules: { type: "text", label: "Office Name", required: true, maxLength: 100, colWidth: 6 } },
  { name: "email", rules: { type: "email", label: "Email", required: true, maxLength: 150, colWidth: 6 } },
  { name: "mobileNum", rules: { type: "number", label: "Mobile Number", required: true, maxLength: 20, colWidth: 6 } },
  { name: "postCode", rules: { type: "number", label: "Post Code", required: true, maxLength: 20, colWidth: 6 } },
  { name: "country", rules: { type: "smartdropdown", label: "Country", required: true, colWidth: 6 } },
  { name: "city", rules: { type: "smartdropdown", label: "City", required: true, colWidth: 6 } },
  { name: "dsoZoneId", rules: { type: "popup", label: "Zone", required: true, colWidth: 6 } },
  { name: "address", rules: { type: "textarea", label: "Address", required: true, maxLength: 255, colWidth: 6 } },
  { name: "info", rules: { type: "textarea", label: "Additional Info", required: false, maxLength: 500, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODentalOfficeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // State for zone popup - only need selectedZone
  const [selectedZone, setSelectedZone] = useState<DSOZone | null>(null);
  const [zonePopupOpen, setZonePopupOpen] = useState(false);

  useEffect(() => {
    if (!show) {
      setSelectedZone(null);
    }
  }, [show]);

  // ── dropdownHandlers ──────────────────────────────────────────────────────
  const dropdownHandlers: DropdownHandlers = {
    country: {
      staticOptions: COUNTRIES,
      placeholder: "Select Country...",
    },
    city: {
      staticOptions: CITIES,
      placeholder: "Select City...",
    },
  };

  // ── popupHandlers ────────────────────────────────────────────────────────
  const popupHandlers: Record<string, {
    value: string;
    onOpen: () => void;
    onClear: () => void;
    actualValue?: any;
  }> = {
    dsoZoneId: {
      value: selectedZone?.name ?? "", // This will show only the name
      actualValue: selectedZone?.id,
      onOpen: () => setZonePopupOpen(true),
      onClear: () => setSelectedZone(null),
    },
  };

  // ── Fetch handler — pre-fills the popup pill ──────────────────────────────
  const handleFetch = async (id: string | number) => {
    try {
      const response = await DSODentalOfficeService.getById(Number(id));
      console.log("Fetch Response:", response);
      
      const data = response?.value || response;

      // Set the selected zone from the fetched data - only need name for display
      if (data?.dsoZoneId) {
        const zoneData: DSOZone = {
          id: data.dsoZoneId,
          name: data.zoneName || `${data.dsoZoneName}`, // Fallback if name not available
        };
        
        setSelectedZone(zoneData);
        console.log("Selected zone set:", zoneData);
      }

      return response;
    } catch (error) {
      console.error("Error in handleFetch:", error);
      throw error;
    }
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    console.log("Update formData:", formData);
    console.log("Selected Zone:", selectedZone);

    // Validate zone selection
    if (!selectedZone?.id) {
      toast.error("Please select a zone");
      throw new Error("No zone selected");
    }

    try {
      // 1. Get DSOMasterId from token
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        throw err;
      }

      // 2. Build payload
      const payload: Partial<DSODentalOffice> = {
        id: Number(id),
        officeCode: formData.officeCode,
        officeName: formData.officeName,
        email: formData.email ?? "",
        mobileNum: formData.mobileNum ?? "",
        postCode: formData.postCode ?? "",
        country: formData.country ?? "",
        city: formData.city ?? "",
        dsoZoneId: Number(selectedZone.id), // Only send the ID to API
        address: formData.address ?? "",
        info: formData.info ?? "",
        dsoMasterId: dsoMasterId,
        isActive: formData.isActive ?? true,
      };

      console.log("Update payload:", payload);

      // 3. Call API
      const result = await DSODentalOfficeService.update(Number(id), payload);
      console.log("Update response:", result);

      // 4. Assert success
      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to update DSO Dental Office.");
        return { isSucess: true, value: payload };
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to update dental office");
      }
    } catch (err: any) {
      console.error("Error in handleUpdate:", err);
      throw err;
    }
  };

  // ── Reset on close ───────────────────────────────────────────────────
  const handleHide = () => {
    setSelectedZone(null);
    onHide();
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={handleHide}
        title="Edit Dental Office"
        subtitle="Update DSO Dental Office details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        dropdownHandlers={dropdownHandlers}
        popupHandlers={popupHandlers}
        successMessage="Dental Office updated successfully!"
        onSuccess={onSuccess}
        submitButtonText="Update Dental Office"
        themeColor="#ef0d50"
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

export default DSODentalOfficeEditModal;