import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOMaterialService from "../../../Services/Masters/DsoMaterial.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: number;
}

const fields: ViewField[] = [
  { name: "name", label: "Material Name", colWidth: 6 },
  { name: "restorationTypeName", label: "Restoration Type", colWidth: 6 },
  { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
];

const DSOMaterialViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Material"
      subtitle="Material details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOMaterialService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSOMaterialViewModal;