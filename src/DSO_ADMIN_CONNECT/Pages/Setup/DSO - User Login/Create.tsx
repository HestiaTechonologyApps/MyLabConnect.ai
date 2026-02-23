import React, { useState } from "react";
import KiduCreateModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";

import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import MasterPopup from "../../../../ADMIN/Pages/Master/MasterPopup";
import type { DSOUser } from "../../../Types/Setup/DSOUser.types";
import DSOUserService from "../../../Services/Setup/DSOUser.services";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "userId",      rules: { type: "number",   label: "User ID",        required: true,  maxLength: 20,  colWidth: 6 } },
  { name: "firstName",   rules: { type: "text",     label: "First Name",     required: true,  maxLength: 50,  colWidth: 6 } },
  { name: "lastName",    rules: { type: "text",     label: "Last Name",      required: true,  maxLength: 50,  colWidth: 6 } },
  { name: "email",       rules: { type: "email",    label: "Email",          required: true,  maxLength: 100, colWidth: 6 } },
  { name: "phoneNumber", rules: { type: "text",     label: "Phone Number",   required: false, maxLength: 20,  colWidth: 6 } },
  { name: "address",     rules: { type: "textarea", label: "Address",        required: false, maxLength: 500, colWidth: 12 } },
  { name: "dsoMasterId", rules: { type: "popup",    label: "DSO Master",     required: true,  colWidth: 6 } },
  { name: "isActive",    rules: { type: "toggle",   label: "Active",         colWidth: 6 } },
];

const DSOUserCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [showMasterPopup, setShowMasterPopup] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedMaster) {
      throw new Error("Please select a DSO Master");
    }

    const payload: Partial<DSOUser> = {
      userId:      Number(formData.userId),
      firstName:   formData.firstName,
      lastName:    formData.lastName,
      fullName:    `${formData.firstName} ${formData.lastName}`.trim(),
      email:       formData.email,
      phoneNumber: formData.phoneNumber,
      address:     formData.address,
      dsoMasterId: selectedMaster.id,
      isActive:    formData.isActive ?? true,
      isDeleted:   false,
    };

    await DSOUserService.create(payload);
  };

  const popupHandlers = {
    dsoMasterId: {
      value:   selectedMaster?.name || "",
      onOpen:  () => setShowMasterPopup(true),
      onClear: () => setSelectedMaster(null),
    },
  };

  const extraValues = {
    dsoMasterId: selectedMaster?.id,
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={onHide}
        title="Create User"
        subtitle="Add new DSO User"
        fields={fields}
        onSubmit={handleSubmit}
        successMessage="User created successfully!"
        onSuccess={onSuccess}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
      />

      <MasterPopup
        show={showMasterPopup}
        handleClose={() => setShowMasterPopup(false)}
        onSelect={(master: DSOmaster) => {
          setSelectedMaster(master);
          setShowMasterPopup(false);
        }}
        showAddButton={true}
      />
    </>
  );
};

export default DSOUserCreateModal;