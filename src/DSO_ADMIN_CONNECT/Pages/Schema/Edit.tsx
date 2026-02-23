import React, { useState } from "react";
import type { Field } from "../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOmaster } from "../../../ADMIN/Types/Master/Master.types";
import type { PopupHandler } from "../../../KIDU_COMPONENTS/KiduEditModal";
import DSOSchemaService from "../../Services/Schema/Schema.services";
import KiduEditModal from "../../../KIDU_COMPONENTS/KiduEditModal";
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
  recordId: string | number;
}

const DSOSchemaEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
  const [masterOpen, setMasterOpen] = useState(false);

  const popupHandlers: Record<string, PopupHandler> = {
    dsoMasterId: {
      value:       selectedMaster?.name ?? "",
      actualValue: selectedMaster?.id ?? undefined,
      onOpen:      () => setMasterOpen(true),
      onClear:     () => setSelectedMaster(null),
    },
  };

  const handleFetch = async (id: string | number) => {
    const response = await DSOSchemaService.getById(Number(id));
    // Pre-fill the pill label when the record loads
    if (response?.isSucess && response?.value?.dsoName) {
      setSelectedMaster({
        id:   response.value.dsoMasterId,
        name: response.value.dsoName,
      } as DSOmaster);
    }
    return response;
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    return await DSOSchemaService.update(Number(id), formData);
  };

  const handleHide = () => {
    setSelectedMaster(null);
    onHide();
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={handleHide}
        title="Edit Schema"
        subtitle="Update DSO Schema details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Schema updated successfully!"
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

export default DSOSchemaEditModal;