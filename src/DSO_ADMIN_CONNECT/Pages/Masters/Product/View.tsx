import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOProductService from "../../../Services/Masters/DsoProduct.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: number;
}

const fields: ViewField[] = [
  { name: "code", label: "Product Code", colWidth: 6 },
  { name: "name", label: "Product Name", colWidth: 6 },
  { name: "rate", label: "Rate", colWidth: 6, formatter: (value) => `$${Number(value).toFixed(2)}` },
  { name: "restorationTypeName", label: "Restoration Type", colWidth: 6 },
  { name: "schemaName", label: "Schema", colWidth: 6 },
  { name: "indicationName", label: "Indication", colWidth: 6 },
  { name: "productGroupName", label: "Product Group", colWidth: 6 },
  { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
];

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