import React from "react";
import KiduViewModal,  { type ViewField } from "../../../KIDU_COMPONENTS/KiduViewModal";
import DSOShadeService from "../../Services/Shade/Shade.services";


interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "name", label: "Shade Name",  colWidth: 12 },
  { name: "isActive",       label: "Status",      colWidth: 6, isToggle: true },
  
];

const DSOShadeViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Shade"
      subtitle="DSO Shade details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOShadeService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSOShadeViewModal;