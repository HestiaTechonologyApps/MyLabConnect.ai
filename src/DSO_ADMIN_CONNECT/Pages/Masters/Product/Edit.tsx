import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
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
  recordId: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOProductEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  const [selectedProductGroup, setSelectedProductGroup] = useState<DSOProductGroup | null>(null);
  const [productGroupOpen, setProductGroupOpen] = useState(false);

  useEffect(() => {
    if (!show) {
      setSelectedProductGroup(null);
    }
  }, [show]);

  // ── Fetch handler — pre-fills the popup pill ──────────────────────────────
  const handleFetch = async (id: string | number) => {
    try {
      const response = await DSOProductService.getById(Number(id));
      console.log("Fetch Response:", response);
      
      const data = response?.value || response;

      // Set the selected product group from the fetched data
      if (data?.dsoProductGroupId && data?.dsoProductGroupName) {
        setSelectedProductGroup({
          id: data.dsoProductGroupId,
          name: data.dsoProductGroupName,
        } as DSOProductGroup);
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
    console.log("Selected Product Group:", selectedProductGroup);

    if (!selectedProductGroup?.id) {
      toast.error("Please select a product group");
      throw new Error("No product group selected");
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
        throw err;
      }

      // Build payload with all required fields
      const payload: Partial<DSOProduct> = {
        id: Number(id),
        code: formData.code,
        name: formData.name,
        dsoMasterId: dsoMasterId,
        dsoProductGroupId: Number(selectedProductGroup.id),
        isActive: formData.isActive ?? true,
      };

      console.log("Update payload:", payload);

      const result = await DSOProductService.update(Number(id), payload);
      console.log("Update response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to update Product.");
        return { isSucess: true, value: payload };
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to update product");
      }
    } catch (err: any) {
      console.error("Error in handleUpdate:", err);
      throw err;
    }
  };

  // ── Popup handlers ────────────────────────────────────────────────────────
  const popupHandlers = {
    dsoProductGroupId: {
      value: selectedProductGroup?.name ?? "",
      actualValue: selectedProductGroup?.id,
      onOpen: () => setProductGroupOpen(true),
      onClear: () => setSelectedProductGroup(null),
    },
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit Product"
        subtitle="Update product details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Product updated successfully!"
        onSuccess={onSuccess}
        submitButtonText="Update Product"
        themeColor="#ef0d50"
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

export default DSOProductEditModal;