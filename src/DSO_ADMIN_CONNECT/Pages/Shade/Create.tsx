import React from "react";
import KiduCreateModal,{
    type Field,
} from "../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOShadeService from "../../Services/Shade/Shade.services";
import type { DSOShade } from "../../Types/Shade/Shade.types";

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
}

const DSOShadeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<DSOShade> = {
      name: formData.name,
      isActive: formData.isActive ?? true,
    };
    return await DSOShadeService.create(payload);
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Shade"
      subtitle="Add a new DSO Shade"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Shade created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSOShadeCreateModal;