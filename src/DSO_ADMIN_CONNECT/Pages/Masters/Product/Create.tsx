import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProductService from "../../../Services/Masters/DsoProduct.services";
import type { DSOProduct } from "../../../Types/Masters/DsoProduct.types";
import type { DSORestoration } from "../../../Types/Restoration/Restoration.types";
import type { DSOIndication } from "../../../Types/Setup/DSOIndication.types";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import type { DSOSchema } from "../../../Types/Schema/Schema.types";
import DSORestorationTypePopup from "../../Restoration/DSORestorationTypePopup";
import DSOSchemaPopup from "../../Schema/DSOSchemaPopup";
import DSOIndicationPopup from "../../Indication/DSOIndicationPopup";
import DSOProductGroupPopup from "../Product Group/DsoProductGroupPopup";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import toast from "react-hot-toast";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { name: "code", rules: { type: "text", label: "Product Code", required: true, minLength: 3, maxLength: 50, colWidth: 6 } },
  { name: "name", rules: { type: "text", label: "Product Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
  { name: "rate", rules: { type: "number", label: "Rate", required: true, minLength: 1, maxLength: 10, colWidth: 6 } },
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
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOProductCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
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

  // ── Popup handlers ────────────────────────────────────────────────────────
  const popupHandlers: PopupHandlers = {
    dsoRestorationTypeId: {
      value: selectedRestorationType?.name ?? "",
      onOpen: () => setRestorationTypeOpen(true),
      onClear: () => setSelectedRestorationType(null),
    },
    dsoSchemaId: {
      value: selectedSchema?.name ?? "",
      onOpen: () => setSchemaOpen(true),
      onClear: () => setSelectedSchema(null),
    },
    dsoIndicationId: {
      value: selectedIndication?.name ?? "",
      onOpen: () => setIndicationOpen(true),
      onClear: () => setSelectedIndication(null),
    },
    dsoProductGroupId: {
      value: selectedProductGroup?.name ?? "",
      onOpen: () => setProductGroupOpen(true),
      onClear: () => setSelectedProductGroup(null),
    },
  };

  const extraValues = {
    dsoRestorationTypeId: selectedRestorationType?.id ?? null,
    dsoSchemaId: selectedSchema?.id ?? null,
    dsoIndicationId: selectedIndication?.id ?? null,
    dsoProductGroupId: selectedProductGroup?.id ?? null,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);
    console.log("Selected Restoration Type:", selectedRestorationType);
    console.log("Selected Schema:", selectedSchema);
    console.log("Selected Indication:", selectedIndication);
    console.log("Selected Product Group:", selectedProductGroup);

    // Validate all selections
    if (!selectedRestorationType?.id) {
      toast.error("Please select a restoration type");
      return;
    }
    if (!selectedSchema?.id) {
      toast.error("Please select a schema");
      return;
    }
    if (!selectedIndication?.id) {
      toast.error("Please select an indication");
      return;
    }
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
        rate: Number(formData.rate),
        dsoRestorationTypeId: Number(selectedRestorationType.id),
        dsoSchemaId: Number(selectedSchema.id),
        dsoIndicationId: Number(selectedIndication.id),
        dsoProductGroupId: Number(selectedProductGroup.id),
        dsoMasterId: dsoMasterId,
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
    setSelectedRestorationType(null);
    setSelectedSchema(null);
    setSelectedIndication(null);
    setSelectedProductGroup(null);
    onHide();
  };

  // ── Handle successful creation ────────────────────────────────────────────
  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    setSelectedRestorationType(null);
    setSelectedSchema(null);
    setSelectedIndication(null);
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

export default DSOProductCreateModal;