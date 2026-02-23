import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOMaterial } from "../../../Types/Masters/DsoMaterial.types";
import DSOMaterialService from "../../../Services/Masters/DsoMaterial.services";
import DSORestorationTypePopup from "../../Restoration/DSORestorationTypePopup";
import type { DSORestoration } from "../../../Types/Restoration/Restoration.types";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Material Name", required: true,minLength:3, maxLength: 100, colWidth: 6 } },
  { name: "dsoRestorationTypeId", rules: { type: "popup", label: "Restoration Type", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

const DSOMaterialCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [selectedRestorationType, setSelectedRestorationType] = useState<DSORestoration | null>(null);
  const [restorationTypeOpen, setRestorationTypeOpen] = useState(false);

  const popupHandlers: PopupHandlers = {
    dsoRestorationTypeId: {
      value: selectedRestorationType?.name ?? "",
      onOpen: () => setRestorationTypeOpen(true),
      onClear: () => setSelectedRestorationType(null),
    },
  };

  const extraValues = {
    dsoRestorationTypeId: selectedRestorationType?.id ?? null,
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<DSOMaterial> = {
      name: formData.name,
      dsoRestorationTypeId: Number(formData.dsoRestorationTypeId),
      isActive: formData.isActive ?? true,
    };
    await DSOMaterialService.create(payload);
  };

  const handleHide = () => {
    setSelectedRestorationType(null);
    onHide();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Material"
        subtitle="Add a new material"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Material created successfully!"
        onSuccess={onSuccess}
      />

      <DSORestorationTypePopup
        show={restorationTypeOpen}
        onClose={() => setRestorationTypeOpen(false)}
        onSelect={(type) => {
          setSelectedRestorationType(type);
          setRestorationTypeOpen(false);
        }}
      />
    </>
  );
};

export default DSOMaterialCreateModal;