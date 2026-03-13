import React from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { name: "code", rules: { type: "text", label: "Code", required: true, minLength: 3, maxLength: 10, colWidth: 6 } },
  { name: "name", rules: { type: "text", label: "Name", required: true, minLength: 3, maxLength: 200, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOProductGroupCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);

    try {
      // Get DSO Master ID from session
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        return;
      }

      // Build payload with all required fields
      const payload: Partial<DSOProductGroup> = {
        code: formData.code,
        name: formData.name,
        dsoMasterId: dsoMasterId,
        isActive: formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      const result = await DSOProductGroupService.create(payload);
      console.log("API Response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Product Group.");
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create product group");
      }

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };

  // ── Reset local state when the modal closes ───────────────────────────────
  const handleHide = () => {
    onHide();
  };

  // ── Handle successful creation ────────────────────────────────────────────
  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    onSuccess();
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={handleHide}
      title="Create Product Group"
      subtitle="Add a new Product Group"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Product group created successfully!"
      onSuccess={handleSuccess}
    />
  );
};

export default DSOProductGroupCreateModal;