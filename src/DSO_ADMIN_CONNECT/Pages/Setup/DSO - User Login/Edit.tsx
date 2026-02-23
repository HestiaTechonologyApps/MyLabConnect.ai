import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import MasterPopup from "../../../../ADMIN/Pages/Master/MasterPopup";
import DSOUserService from "../../../Services/Setup/DSOUser.services";
import type { DSOUser } from "../../../Types/Setup/DSOUser.types";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
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

const DSOUserEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [showMasterPopup, setShowMasterPopup] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);

  // Reset when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedMaster(null);
    }
  }, [show]);

  const handleFetch = async (id: string | number) => {
    const response = await DSOUserService.getById(Number(id));

    // Pre-populate selectedMaster display name from fetched data
    const user = response?.value || response?.data || response;
    if (user?.dsoMasterId && user?.dsoName) {
      setSelectedMaster({ id: user.dsoMasterId, name: user.dsoName } as DSOmaster);
    }

    return response;
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    if (!selectedMaster) {
      throw new Error("Please select a DSO Master");
    }

    const payload: Partial<DSOUser> = {
      id:          Number(id),
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

    await DSOUserService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  const popupHandlers = {
    dsoMasterId: {
      value:       selectedMaster?.name || "",
      actualValue: selectedMaster?.id,
      onOpen:      () => setShowMasterPopup(true),
      onClear:     () => setSelectedMaster(null),
    },
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit User"
        subtitle="Update DSO User details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        successMessage="User updated successfully!"
        onSuccess={onSuccess}
        popupHandlers={popupHandlers}
        submitButtonText="Update User"
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

export default DSOUserEditModal;