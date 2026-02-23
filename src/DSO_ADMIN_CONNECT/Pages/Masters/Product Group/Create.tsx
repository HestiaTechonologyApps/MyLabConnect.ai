import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";

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
    const payload: Partial<DSOProductGroup> = {
      code: formData.code,
      name: formData.name,
      dsoMasterId: Number(formData.dsoMasterId),
      isActive: formData.isActive ?? true,
    };

    await DSOProductGroupService.create(payload);
  };

  // ── Reset local state when the modal closes ───────────────────────────────
  const handleHide = () => {
    setSelectedMaster(null);
    onHide();
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
        onSuccess={onSuccess}
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

export default DsoProductGroupCreateModal;