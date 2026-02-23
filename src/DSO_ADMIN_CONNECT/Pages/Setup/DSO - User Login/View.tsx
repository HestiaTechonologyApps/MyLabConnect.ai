import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOUserService from "../../../Services/Setup/DSOUser.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "userId",      label: "User ID",        colWidth: 6 },
  { name: "fullName",    label: "Full Name",       colWidth: 6 },
  { name: "firstName",   label: "First Name",      colWidth: 6 },
  { name: "lastName",    label: "Last Name",       colWidth: 6 },
  { name: "email",       label: "Email",           colWidth: 6 },
  { name: "phoneNumber", label: "Phone Number",    colWidth: 6 },
  { name: "dsoName",     label: "DSO Master",      colWidth: 6 },
  { name: "isActive",    label: "Status",          colWidth: 6,  isToggle: true },
  { name: "address",     label: "Address",         colWidth: 12, isTextarea: true },
  { name: "createdAt",   label: "Created At",      colWidth: 6,  isDate: true },
  { name: "updatedAt",   label: "Updated At",      colWidth: 6,  isDate: true },
];

const DSOUserViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View User"
      subtitle="DSO User details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOUserService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSOUserViewModal;