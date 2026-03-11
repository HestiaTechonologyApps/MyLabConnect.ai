import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: number;
}

const fields: ViewField[] = [
  { name: "code", label: "Code", colWidth: 6 },
  { name: "name", label: "Name", colWidth: 6 },
  { name: "isActive", label: "Status", colWidth: 12, isToggle: true },
];

const DSOProductGroupViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Product Group"
      subtitle="DSO Product Group details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOProductGroupService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
      themeColor="#ef0d50"
    />
  );
};

export default DSOProductGroupViewModal;