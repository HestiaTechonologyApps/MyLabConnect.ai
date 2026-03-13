import React, { useRef } from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

interface Props {
  show: boolean;
  handleClose: () => void;
  onAdded: (item: DSOZone) => void;
}

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  {
    name: "name",
    rules: { type: "text", label: "Zone Name", required: true, maxLength: 100, colWidth: 12 },
  },
  {
    name: "isActive",
    rules: { type: "toggle", label: "Active", colWidth: 6 },
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
const ZoneCreateModal: React.FC<Props> = ({ show, handleClose, onAdded }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();
  const createdDataRef = useRef<any>(null);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);

    try {
      // 1. Get DSOMasterId from token
      let dsOMasterId: number;
      try {
        dsOMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsOMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        return;
      }

      // 2. Build payload
      const payload: Partial<DSOZone> = {
        name: formData.name,
        dsoMasterId: dsOMasterId,
        isActive: formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      // 3. Call API
      const result = await DSOZoneService.create(payload);
      console.log("API Response:", result);

      // 4. Store result in ref for later use
      createdDataRef.current = result;

      // 5. Assert success
      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Zone.");
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create zone");
      }

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };

  const handleSuccess = () => {
    const response = createdDataRef.current;
    const newItem = response?.value || response?.data || response;
    if (newItem) {
      onAdded(newItem);
    }
    createdDataRef.current = null;
    handleClose();
  };

  const handleHide = () => {
    handleClose();
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={handleHide}
      title="Add Zone"
      subtitle="Create a new Zone"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Zone created successfully!"
      onSuccess={handleSuccess}
    />
  );
};

export default ZoneCreateModal;