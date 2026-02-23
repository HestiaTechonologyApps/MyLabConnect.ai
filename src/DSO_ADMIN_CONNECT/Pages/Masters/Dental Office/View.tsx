import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: number;
}

const fields: ViewField[] = [
  { name: "officeCode", label: "Office Code", colWidth: 6 },
  { name: "officeName", label: "Office Name", colWidth: 6 },
  { name: "dsoName", label: "DSO Master", colWidth: 6 },
  { name: "info", label: "Info", colWidth: 12, isTextarea: true },
  { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
];

const DSODentalOfficeViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View DSO Dental Office"
      subtitle="Dental office details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSODentalOfficeService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSODentalOfficeViewModal;