import React, { useRef } from "react";
import KiduCreateModal, { type Field } from "../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProsthesisTypeService from "../../Services/Prosthesis/Prosthesis.services";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import type { DSOmaster } from "../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../ADMIN/Pages/Master/PopUp";
import { useState } from "react";
import type { PopupHandlers } from "../../../KIDU_COMPONENTS/KiduCreateModal";

// ── Props (matches AddModalComponent interface expected by KiduSelectPopup) ───

interface Props {
  show:        boolean;
  handleClose: () => void;
  onAdded:     (item: DSOProsthesisType) => void;
}

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "name",        rules: { type: "text",   label: "Prosthesis Type Name", required: true, maxLength: 100, colWidth: 12 } },
  { name: "dsoMasterId", rules: { type: "popup",  label: "DSO Master",           required: true,                 colWidth: 6 } },
  { name: "isActive",    rules: { type: "toggle", label: "Active",                                               colWidth: 6 } },
];

// ── Component ─────────────────────────────────────────────────────────────────

const ProsthesisTypeCreateModal: React.FC<Props> = ({ show, handleClose, onAdded }) => {
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
    const payload: Partial<DSOProsthesisType> = {
      name:        formData.name,
      dsoMasterId: Number(formData.dsoMasterId),
      isActive:    formData.isActive ?? true,
    };

    const response = await DSOProsthesisTypeService.create(payload);
    createdDataRef.current = response;
  };

  const handleSuccess = () => {
    const response = createdDataRef.current;
    const newItem = response?.value || response?.data || response;
    if (newItem) onAdded(newItem);
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
        title="Add Prosthesis Type"
        subtitle="Create a new DSO Prosthesis Type"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Prosthesis Type created successfully!"
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

export default ProsthesisTypeCreateModal;