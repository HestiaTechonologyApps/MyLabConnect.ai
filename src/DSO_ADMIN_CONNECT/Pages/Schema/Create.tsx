import React, { useState } from "react";
import type { Field, PopupHandlers } from "../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOmaster } from "../../../ADMIN/Types/Master/Master.types";
import type { DSOSchema } from "../../Types/Schema/Schema.types";
import DSOSchemaService from "../../Services/Schema/Schema.services";
import KiduCreateModal from "../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOmasterSelectPopup from "../../../ADMIN/Pages/Master/PopUp";


const fields: Field[] = [
  {
    name: "name",
    rules: { type: "text", label: "Schema Name", required: true, maxLength: 100, colWidth: 12 },
  },
  {
    name: "dsoMasterId",
    rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 },
  },
  {
    name: "isActive",
    rules: { type: "toggle", label: "Active", colWidth: 6 },
  },
];

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const DSOSchemaCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
  const [masterOpen, setMasterOpen] = useState(false);

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
    const payload: Partial<DSOSchema> = {
      name:        formData.name,
      dsoMasterId: Number(formData.dsoMasterId),
      isActive:    formData.isActive ?? true,
    };
    await DSOSchemaService.create(payload);
  };

  const handleHide = () => {
    setSelectedMaster(null);
    onHide();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Schema"
        subtitle="Add a new DSO Schema"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Schema created successfully!"
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

export default DSOSchemaCreateModal;