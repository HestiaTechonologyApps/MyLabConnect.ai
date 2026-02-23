import React from "react";
import KiduCreateModal, {
    type Field,
    type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";
import { useState } from "react";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";

interface Props {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

const fields: Field[] = [
    { name: "officeCode", rules: { type: "text", label: "Office Code", required: true, minLength: 3, maxLength: 50, colWidth: 6 } },
    { name: "officeName", rules: { type: "text", label: "Office Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
    { name: "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 } },
    { name: "info", rules: { type: "textarea", label: "Info", required: true, minLength: 5, maxLength: 500, colWidth: 12 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

const DSODentalOfficeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
    const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
    const [masterOpen, setMasterOpen] = useState(false);

    const popupHandlers: PopupHandlers = {
        dsoMasterId: {
            value: selectedMaster?.name ?? "",
            onOpen: () => setMasterOpen(true),
            onClear: () => setSelectedMaster(null),
        },
    };

    const extraValues = {
        dsoMasterId: selectedMaster?.id ?? null,
    };

    const handleSubmit = async (formData: Record<string, any>) => {
        const payload: Partial<DSODentalOffice> = {
            officeCode: formData.officeCode,
            officeName: formData.officeName,
            info: formData.info,
            dsoMasterId: Number(formData.dsoMasterId),
            isActive: formData.isActive ?? true,
        };
        await DSODentalOfficeService.create(payload);
    };

    const handleHide = () => {
        setSelectedMaster(null);
        onHide();
    };

    return (
        <>
            <KiduCreateModal
                show={show}
                onHide={handleHide}
                title="Create DSO Dental Office"
                subtitle="Add a new dental office"
                fields={fields}
                onSubmit={handleSubmit}
                popupHandlers={popupHandlers}
                extraValues={extraValues}
                successMessage="Dental office created successfully!"
                onSuccess={onSuccess}
            />

            <DSOmasterSelectPopup
                show={masterOpen}
                onClose={() => setMasterOpen(false)}
                onSelect={(master) => {
                    setSelectedMaster(master);
                    setMasterOpen(false);
                }}
            />
        </>
    );
};

export default DSODentalOfficeCreateModal;