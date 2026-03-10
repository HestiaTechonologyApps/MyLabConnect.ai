import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProductService from "../../../Services/Masters/DsoProduct.services";
import type { DSOProduct } from "../../../Types/Masters/DsoProduct.types";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import toast from "react-hot-toast";
import DSOProductGroupPopup from "../Product Group/DsoProductGroupPopup";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { 
    name: "code", 
    rules: { 
      type: "text", 
      label: "Product Code", 
      required: true, 
      minLength: 3, 
      maxLength: 50, 
      colWidth: 6 
    } 
  },
  { 
    name: "name", 
    rules: { 
      type: "text", 
      label: "Product Name", 
      required: true, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "dsoProductGroupId", 
    rules: { 
      type: "popup", 
      label: "Product Group", 
      required: true, 
      colWidth: 6 
    } 
  },
  { 
    name: "isActive", 
    rules: { 
      type: "toggle", 
      label: "Active", 
      colWidth: 6 
    } 
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOProductCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  const [selectedProductGroup, setSelectedProductGroup] = useState<DSOProductGroup | null>(null);
  const [productGroupOpen, setProductGroupOpen] = useState(false);

  // ── Popup handlers ────────────────────────────────────────────────────────
  const popupHandlers: PopupHandlers = {
    dsoProductGroupId: {
      value: selectedProductGroup?.name ?? "",
      onOpen: () => setProductGroupOpen(true),
      onClear: () => setSelectedProductGroup(null),
    },
  };

  const extraValues = {
    dsoProductGroupId: selectedProductGroup?.id ?? null,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);
    console.log("Selected Product Group:", selectedProductGroup);

    if (!selectedProductGroup?.id) {
      toast.error("Please select a product group");
      return;
    }

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
      const payload: Partial<DSOProduct> = {
        code: formData.code,
        name: formData.name,
        dsoMasterId: dsoMasterId,
        dsoProductGroupId: Number(selectedProductGroup.id),
        isActive: formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      const result = await DSOProductService.create(payload);
      console.log("API Response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Product.");
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create product");
      }

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleHide = () => {
    setSelectedProductGroup(null);
    onHide();
  };

  // ── Handle successful creation ────────────────────────────────────────────
  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    setSelectedProductGroup(null);
    onSuccess();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Product"
        subtitle="Add a new DSO Product"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Product created successfully!"
        onSuccess={handleSuccess}
      />

      <DSOProductGroupPopup
        show={productGroupOpen}
        onClose={() => setProductGroupOpen(false)}
        onSelect={(group) => {
          console.log("Selected product group:", group);
          setSelectedProductGroup(group);
          setProductGroupOpen(false);
        }}
      />
    </>
  );
};

export default DSOProductCreateModal;