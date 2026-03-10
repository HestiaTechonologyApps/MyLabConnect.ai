import React from "react";
import KiduEditModal, {
    type Field,
} from "../../../KIDU_COMPONENTS/KiduEditModal";
import DSOShadeService from "../../Services/Shade/Shade.services";


const fields: Field[] = [
  {
    name: "name",
    rules: { type: "text", label: "Shade Name", required: true, maxLength: 100, colWidth: 12 },
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

const DSOShadeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {

  const handleFetch = async (id: string | number) => {
    return await DSOShadeService.getById(Number(id));
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    return await DSOShadeService.update(Number(id), formData);
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Shade"
      subtitle="Update DSO Shade details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Shade updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSOShadeEditModal;