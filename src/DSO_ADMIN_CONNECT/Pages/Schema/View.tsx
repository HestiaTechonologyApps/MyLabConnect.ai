import React from "react";
import type { ViewField } from "../../../KIDU_COMPONENTS/KiduViewModal";
import KiduViewModal from "../../../KIDU_COMPONENTS/KiduViewModal";
import DSOSchemaService from "../../Services/Schema/Schema.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "name",        label: "Schema Name",  colWidth: 12 },
  { name: "dsoName",     label: "DSO Master",   colWidth: 6 },
  { name: "dsoMasterId", label: "DSO Master ID", colWidth: 6 },
  { name: "isActive",    label: "Status",        colWidth: 6, isToggle: true },
  { name: "createdAt",   label: "Created At",    colWidth: 6, isDate: true },
  { name: "updatedAt",   label: "Updated At",    colWidth: 6, isDate: true },
];

const DSOSchemaViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Schema"
      subtitle="DSO Schema details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOSchemaService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSOSchemaViewModal;