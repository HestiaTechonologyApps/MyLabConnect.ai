import React from "react";
import type { ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import KiduViewModal from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";


// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: ViewField[] = [
  { name: "officeCode",  label: "Office Code",     colWidth: 6 },
  { name: "officeName",  label: "Office Name",      colWidth: 6 },
  { name: "email",       label: "Email",            colWidth: 6 },
  { name: "mobileNum",   label: "Mobile Number",    colWidth: 6 },
  { name: "postCode",    label: "Post Code",        colWidth: 6 },
  { name: "country",     label: "Country",          colWidth: 6 },
  { name: "city",        label: "City",             colWidth: 6 },
  { name: "dsoZoneName", label: "Zone",             colWidth: 6 },
  { name: "address",     label: "Address",          colWidth: 12 },
  { name: "info",        label: "Additional Info",  colWidth: 12 },
  { name: "isActive",    label: "Status",           colWidth: 6, isToggle: true },
];

// ── Component ─────────────────────────────────────────────────────────────────

const DSODentalOfficeViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Dental Office"
      subtitle="Dental Office details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSODentalOfficeService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSODentalOfficeViewModal;