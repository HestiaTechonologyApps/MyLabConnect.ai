import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOProductService from "../../../Services/Masters/DsoProduct.services";

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: ViewField[] = [
  { name: "code", label: "Product Code", colWidth: 6 },
  { name: "name", label: "Product Name", colWidth: 6 },
  { name: "dsoProductGroupName", label: "Product Group", colWidth: 6 },
  { name: "dsoName", label: "DSO Master", colWidth: 6 },
  { name: "createdAt", label: "Created Date", colWidth: 6, isDate: true },
  { name: "updatedAt", label: "Updated Date", colWidth: 6, isDate: true },
  { name: "isActive", label: "Status", colWidth: 12, isToggle: true },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  recordId: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOProductViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Product"
      subtitle="Product details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOProductService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
      themeColor="#ef0d50"
    />
  );
};

export default DSOProductViewModal;