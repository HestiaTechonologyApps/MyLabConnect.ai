import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOMaterialService from "../../../Services/Masters/DsoMaterial.services";
import type { DSOMaterial } from "../../../Types/Masters/DsoMaterial.types";
import type { DSORestoration } from "../../../Types/Restoration/Restoration.types";
import DSORestorationTypePopup from "../../Restoration/DSORestorationTypePopup";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: number;
}

const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Material Name", required: true, maxLength: 100, colWidth: 6 } },
  { name: "dsoRestorationTypeId", rules: { type: "popup", label: "Restoration Type", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

const DSOMaterialEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [selectedRestorationType, setSelectedRestorationType] = useState<DSORestoration | null>(null);
  const [restorationTypeOpen, setRestorationTypeOpen] = useState(false);

  useEffect(() => {
    if (!show) {
      setSelectedRestorationType(null);
    }
  }, [show]);

  const handleFetch = async (id: string | number) => {
    const response = await DSOMaterialService.getById(Number(id));
    console.log("Fetch Response:", response);
    
    const data = response?.value || response;
    
    // Set the selected restoration type from the fetched data
    if (data?.dsoRestorationTypeId && data?.restorationTypeName) {
      setSelectedRestorationType({
        id: data.dsoRestorationTypeId,
        name: data.restorationTypeName,
        // Add other required fields
      } as DSORestoration);
    }
    
    return response;
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<DSOMaterial> = {
      id: Number(id),
      name: formData.name,
      dsoRestorationTypeId: Number(formData.dsoRestorationTypeId),
      isActive: formData.isActive ?? true,
    };
    await DSOMaterialService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  const popupHandlers = {
    dsoRestorationTypeId: {
      value: selectedRestorationType?.name ?? "",
      actualValue: selectedRestorationType?.id,
      onOpen: () => setRestorationTypeOpen(true),
      onClear: () => setSelectedRestorationType(null),
    },
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit Material"
        subtitle="Update material details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Material updated successfully!"
        onSuccess={onSuccess}
        submitButtonText="Update Material"
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

export default DSOMaterialEditModal;