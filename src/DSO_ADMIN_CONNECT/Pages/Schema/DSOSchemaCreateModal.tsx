import React, { useRef } from "react";
import KiduCreateModal, {
  type Field,
} from "../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOSchemaService from "../../Services/Schema/Schema.services";
import type { DSOSchema } from "../../Types/Schema/Schema.types";
import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../Services/AuthServices/APIErrorHandler.services";

// ── Props (matches AddModalComponent interface expected by KiduSelectPopup) ───
interface Props {
  show:        boolean;
  handleClose: () => void;
  onAdded:     (item: DSOSchema) => void;
}

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  {
    name: "name",
    rules: { type: "text", label: "Schema Name", required: true, maxLength: 100, colWidth: 12 },
  },
  {
    name: "isActive",
    rules: { type: "toggle", label: "Active", colWidth: 6 },
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
const SchemaCreateModal: React.FC<Props> = ({ show, handleClose, onAdded }) => {
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
      const payload: Partial<DSOSchema> = {
        name: formData.name,
        dsoMasterId: dsOMasterId,
        isActive: formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      // 3. Call API
      const result = await DSOSchemaService.create(payload);
      console.log("API Response:", result);
      
      // 4. Store result in ref for later use
      createdDataRef.current = result;

      // 5. Assert success
      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Schema.");
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create schema");
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
      title="Add Schema"
      subtitle="Create a new DSO Schema"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Schema created successfully!"
      onSuccess={handleSuccess}
    />
  );
};

export default SchemaCreateModal;