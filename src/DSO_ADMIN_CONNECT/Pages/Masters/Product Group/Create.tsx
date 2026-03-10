import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import toast from "react-hot-toast";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { name: "code", rules: { type: "text", label: "Code", required: true, minLength: 3, maxLength: 20, colWidth: 6 } },
  { name: "name", rules: { type: "text", label: "Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
  { name: "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DsoProductGroupCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
  const [masterOpen, setMasterOpen] = useState(false);

  // ── Popup handlers wired into KiduCreateModal ─────────────────────────────
  const popupHandlers: PopupHandlers = {
    dsoMasterId: {
      value: selectedMaster?.name ?? "",
      onOpen: () => setMasterOpen(true),
      onClear: () => setSelectedMaster(null),
    },
  };

  // extraValues carries the actual ID merged at submit time
  const extraValues = {
    dsoMasterId: selectedMaster?.id ?? null,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);
    console.log("Selected Master:", selectedMaster);

    if (!selectedMaster?.id) {
      toast.error("Please select a DSO Master");
      return;
    }

    try {
      // Get DSO Master ID from session (if needed as separate field)
      let userDsoMasterId: number;
      try {
        userDsoMasterId = requireDSOMasterId();
        console.log("User DSO Master ID:", userDsoMasterId);
      } catch (err) {
        console.error("Failed to get User DSO Master ID:", err);
        await handleApiError(err, "session");
        return;
      }

      // Build payload with all required fields
      const payload: Partial<DSOProductGroup> = {
        code: formData.code,
        name: formData.name,
        dsoMasterId: Number(selectedMaster.id), // The selected DSO master from popup
        isActive: formData.isActive ?? true,
        // You might also need to include the user's DSO master ID if the entity requires it
        // userDsoMasterId: userDsoMasterId, // Uncomment if needed
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
    setSelectedMaster(null);
    onHide();
  };

  // ── Handle successful creation ────────────────────────────────────────────
  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    setSelectedMaster(null);
    onSuccess();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Product Group"
        subtitle="Add a new DSO Product Group"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Product group created successfully!"
        onSuccess={handleSuccess}
      />

      <DSOmasterSelectPopup
        show={masterOpen}
        onClose={() => setMasterOpen(false)}
        onSelect={(master) => {
          console.log("Selected master:", master);
          setSelectedMaster(master);
          setMasterOpen(false);
        }}
      />
    </>
  );
};

export default DsoProductGroupCreateModal;