import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOProductService from "../../../Services/Masters/DsoProduct.services";
import type { DSOProduct } from "../../../Types/Masters/DsoProduct.types";
import type { DSORestoration } from "../../../Types/Restoration/Restoration.types";
import type { DSOSchema } from "../../../Types/Schema/Schema.types";
import type { DSOIndication } from "../../../Types/Setup/DSOIndication.types";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import DSORestorationTypePopup from "../../Restoration/DSORestorationTypePopup";
import DSOSchemaPopup from "../../Schema/DSOSchemaPopup";
import DSOIndicationPopup from "../../Indication/DSOIndicationPopup";
import DSOProductGroupPopup from "../Product Group/DsoProductGroupPopup";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import toast from "react-hot-toast";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { name: "code", rules: { type: "text", label: "Product Code", required: true, minLength: 3, maxLength: 10, colWidth: 6 } },
  { name: "name", rules: { type: "text", label: "Product Name", required: true, minLength: 3, maxLength: 200, colWidth: 6 } },
  { name: "rate", rules: { type: "number", label: "Rate", required: true, minLength: 1, maxLength: 100, colWidth: 6 } },
  { name: "dsoRestorationTypeId", rules: { type: "popup", label: "Restoration Type", required: true, colWidth: 6 } },
  { name: "dsoSchemaId", rules: { type: "popup", label: "Schema", required: true, colWidth: 6 } },
  { name: "dsoIndicationId", rules: { type: "popup", label: "Indication", required: true, colWidth: 6 } },
  { name: "dsoProductGroupId", rules: { type: "popup", label: "Product Group", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
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

  // State for all popup selections
  const [selectedRestorationType, setSelectedRestorationType] = useState<DSORestoration | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<DSOSchema | null>(null);
  const [selectedIndication, setSelectedIndication] = useState<DSOIndication | null>(null);
  const [selectedProductGroup, setSelectedProductGroup] = useState<DSOProductGroup | null>(null);

  // Popup open states
  const [restorationTypeOpen, setRestorationTypeOpen] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [indicationOpen, setIndicationOpen] = useState(false);
  const [productGroupOpen, setProductGroupOpen] = useState(false);

  useEffect(() => {
    if (!show) {
      setSelectedRestorationType(null);
      setSelectedSchema(null);
      setSelectedIndication(null);
      setSelectedProductGroup(null);
    }
  }, [show]);

  // ── Fetch handler — pre-fills the popup pills ──────────────────────────────
  const handleFetch = async (id: string | number) => {
    try {
      const response = await DSOProductService.getById(Number(id));
      console.log("Fetch Response:", response);
      
      const data = response?.value || response;

      // Set all selected items from the fetched data
      if (data?.dsoRestorationTypeId && data?.restorationTypeName) {
        setSelectedRestorationType({
          id: data.dsoRestorationTypeId,
          name: data.restorationTypeName,
        } as DSORestoration);
      }

      if (data?.dsoSchemaId && data?.schemaName) {
        setSelectedSchema({
          id: data.dsoSchemaId,
          name: data.schemaName,
        } as DSOSchema);
      }

      if (data?.dsoIndicationId && data?.indicationName) {
        setSelectedIndication({
          id: data.dsoIndicationId,
          name: data.indicationName,
        } as DSOIndication);
      }

      if (data?.dsoProductGroupId && data?.productGroupName) {
        setSelectedProductGroup({
          id: data.dsoProductGroupId,
          name: data.productGroupName,
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
    console.log("Selected Restoration Type:", selectedRestorationType);
    console.log("Selected Schema:", selectedSchema);
    console.log("Selected Indication:", selectedIndication);
    console.log("Selected Product Group:", selectedProductGroup);

    // Validate all selections
    if (!selectedRestorationType?.id) {
      toast.error("Please select a restoration type");
      throw new Error("No restoration type selected");
    }
    if (!selectedSchema?.id) {
      toast.error("Please select a schema");
      throw new Error("No schema selected");
    }
    if (!selectedIndication?.id) {
      toast.error("Please select an indication");
      throw new Error("No indication selected");
    }
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
        rate: Number(formData.rate),
        dsoRestorationTypeId: Number(selectedRestorationType.id),
        dsoSchemaId: Number(selectedSchema.id),
        dsoIndicationId: Number(selectedIndication.id),
        dsoProductGroupId: Number(selectedProductGroup.id),
        dsoMasterId: dsoMasterId,
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
    dsoRestorationTypeId: {
      value: selectedRestorationType?.name ?? "",
      actualValue: selectedRestorationType?.id,
      onOpen: () => setRestorationTypeOpen(true),
      onClear: () => setSelectedRestorationType(null),
    },
    dsoSchemaId: {
      value: selectedSchema?.name ?? "",
      actualValue: selectedSchema?.id,
      onOpen: () => setSchemaOpen(true),
      onClear: () => setSelectedSchema(null),
    },
    dsoIndicationId: {
      value: selectedIndication?.name ?? "",
      actualValue: selectedIndication?.id,
      onOpen: () => setIndicationOpen(true),
      onClear: () => setSelectedIndication(null),
    },
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

      <DSORestorationTypePopup
        show={restorationTypeOpen}
        onClose={() => setRestorationTypeOpen(false)}
        onSelect={(type) => {
          console.log("Selected restoration type:", type);
          setSelectedRestorationType(type);
          setRestorationTypeOpen(false);
        }}
      />

      <DSOSchemaPopup
        show={schemaOpen}
        onClose={() => setSchemaOpen(false)}
        onSelect={(schema) => {
          console.log("Selected schema:", schema);
          setSelectedSchema(schema);
          setSchemaOpen(false);
        }}
      />

      <DSOIndicationPopup
        show={indicationOpen}
        onClose={() => setIndicationOpen(false)}
        onSelect={(indication) => {
          console.log("Selected indication:", indication);
          setSelectedIndication(indication);
          setIndicationOpen(false);
        }}
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