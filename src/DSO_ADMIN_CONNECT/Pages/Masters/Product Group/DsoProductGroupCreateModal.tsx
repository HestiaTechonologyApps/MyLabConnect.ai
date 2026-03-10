import React, { useRef } from "react";
import KiduCreateModal, { 
  type Field, 
  type PopupHandlers 
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";
import { useState } from "react";

// ── Props (matches AddModalComponent interface expected by KiduSelectPopup) ───
interface Props {
  show:        boolean;
  handleClose: () => void;
  onAdded:     (item: DSOProductGroup) => void;
}

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { name: "code", rules: { type: "text", label: "Code", required: true, minLength: 3, maxLength: 20, colWidth: 6 } },
  { name: "name", rules: { type: "text", label: "Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
  { name: "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Component ─────────────────────────────────────────────────────────────────
const ProductGroupCreateModal: React.FC<Props> = ({ show, handleClose, onAdded }) => {
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
  const [masterOpen, setMasterOpen] = useState(false);
  const createdDataRef = useRef<any>(null);

  const popupHandlers: PopupHandlers = {
    dsoMasterId: {
      value:   selectedMaster?.name ?? "",
      onOpen:  () => setMasterOpen(true),
      onClear: () => setSelectedMaster(null),
    },
  };

  const extraValues = {
    dsoMasterId: selectedMaster?.id ?? null,
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<DSOProductGroup> = {
      code: formData.code,
      name: formData.name,
      dsoMasterId: Number(formData.dsoMasterId),
      isActive: formData.isActive ?? true,
    };

    const response = await DSOProductGroupService.create(payload);
    createdDataRef.current = response;
  };

  const handleSuccess = () => {
    const response = createdDataRef.current;
    const newItem = response?.value || response?.data || response;
    if (newItem) {
      // Ensure the new item has the DSO name for display
      onAdded({
        ...newItem,
        dsoName: selectedMaster?.name
      });
    }
    createdDataRef.current = null;
    setSelectedMaster(null);
    handleClose();
  };

  const handleHide = () => {
    setSelectedMaster(null);
    handleClose();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Add Product Group"
        subtitle="Create a new DSO Product Group"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Product Group created successfully!"
        onSuccess={handleSuccess}
      />

      <DSOmasterSelectPopup
        show={masterOpen}
        onClose={() => setMasterOpen(false)}
        onSelect={(master) => {
          setSelectedMaster(master);
          setMasterOpen(false);
        }}
      />
    </>
  );
};

export default ProductGroupCreateModal;