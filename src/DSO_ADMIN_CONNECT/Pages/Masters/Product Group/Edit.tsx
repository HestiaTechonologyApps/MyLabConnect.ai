import React, { useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { name: "code", rules: { type: "text", label: "Code", required: true, minLength: 3, maxLength: 20, colWidth: 6 } },
  { name: "name", rules: { type: "text", label: "Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
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
const DSOProductGroupEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  useEffect(() => {
    if (!show) {
      // Any cleanup if needed
    }
  }, [show]);

  // ── Fetch handler ─────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    try {
      const response = await DSOProductGroupService.getById(Number(id));
      console.log("Fetch Response:", response);
      return response;
    } catch (error) {
      console.error("Error in handleFetch:", error);
      throw error;
    }
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    console.log("Update formData:", formData);

    try {
      // Get DSO Master ID from session
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        throw err;
      }

      const payload: Partial<DSOProductGroup> = {
        id: Number(id),
        code: formData.code,
        name: formData.name,
        dsoMasterId: dsoMasterId,
        isActive: formData.isActive ?? true,
      };

      console.log("Update payload:", payload);

      const result = await DSOProductGroupService.update(Number(id), payload);
      console.log("Update response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to update Product Group.");
        return { isSucess: true, value: payload };
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to update product group");
      }
    } catch (err: any) {
      console.error("Error in handleUpdate:", err);
      throw err;
    }
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Product Group"
      subtitle="Update DSO Product Group details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Product group updated successfully!"
      onSuccess={onSuccess}
      submitButtonText="Update Product Group"
      themeColor="#ef0d50"
    />
  );
};

export default DSOProductGroupEditModal;