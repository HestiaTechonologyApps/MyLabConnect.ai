import React, { useRef } from "react";
import KiduCreateModal, { type Field } from "../../../KIDU_COMPONENTS/KiduCreateModal";
import DSORestorationTypeService from "../../Services/Restoration/Restoration.services";
import type { DSORestoration } from "../../Types/Restoration/Restoration.types";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import DSOProsthesisTypePopup from "../Prosthesis/ProsthesisTypePopup";
import { useState } from "react";
import type { PopupHandlers } from "../../../KIDU_COMPONENTS/KiduCreateModal";

// ── Props (matches AddModalComponent interface expected by KiduSelectPopup) ───

interface Props {
  show:        boolean;
  handleClose: () => void;
  onAdded:     (item: DSORestoration) => void;
}

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Restoration Name", required: true, maxLength: 100, colWidth: 12 } },
  { name: "dsoProthesisTypeId", rules: { type: "popup", label: "Prosthesis Type", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Component ─────────────────────────────────────────────────────────────────

const RestorationTypeCreateModal: React.FC<Props> = ({ show, handleClose, onAdded }) => {
  const [selectedProsthesis, setSelectedProsthesis] = useState<DSOProsthesisType | null>(null);
  const [prosthesisOpen, setProsthesisOpen] = useState(false);
  const createdDataRef = useRef<any>(null);

  const popupHandlers: PopupHandlers = {
    dsoProthesisTypeId: {
      value:   selectedProsthesis?.name ?? "",
      onOpen:  () => setProsthesisOpen(true),
      onClear: () => setSelectedProsthesis(null),
    },
  };

  const extraValues = {
    dsoProthesisTypeId: selectedProsthesis?.id ?? null,
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<DSORestoration> = {
      name: formData.name,
      dsoProthesisTypeId: Number(formData.dsoProthesisTypeId),
      isActive: formData.isActive ?? true,
    };

    const response = await DSORestorationTypeService.create(payload);
    createdDataRef.current = response;
  };

  const handleSuccess = () => {
    const response = createdDataRef.current;
    const newItem = response?.value || response?.data || response;
    if (newItem) onAdded(newItem);
    createdDataRef.current = null;
    setSelectedProsthesis(null);
    handleClose();
  };

  const handleHide = () => {
    setSelectedProsthesis(null);
    handleClose();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Add Restoration Type"
        subtitle="Create a new DSO Restoration Type"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Restoration Type created successfully!"
        onSuccess={handleSuccess}
      />

      <DSOProsthesisTypePopup
        show={prosthesisOpen}
        onClose={() => setProsthesisOpen(false)}
        onSelect={(prosthesis) => {
          setSelectedProsthesis(prosthesis);
          setProsthesisOpen(false);
        }}
      />
    </>
  );
};

export default RestorationTypeCreateModal;