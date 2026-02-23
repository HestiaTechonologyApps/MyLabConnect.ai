import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";

interface Props {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    recordId: number;
}

const fields: Field[] = [
    { name: "officeCode", rules: { type: "text", label: "Office Code", required: true, minLength: 3, maxLength: 50, colWidth: 6 } },
    { name: "officeName", rules: { type: "text", label: "Office Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
    { name: "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 } },
    { name: "info", rules: { type: "textarea", label: "Info", required: false, minLength: 5, maxLength: 500, colWidth: 12 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

const DSODentalOfficeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
    const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
    const [masterOpen, setMasterOpen] = useState(false);

    useEffect(() => {
        if (!show) {
            setSelectedMaster(null);
        }
    }, [show]);

    const handleFetch = async (id: string | number) => {
        const response = await DSODentalOfficeService.getById(Number(id));
        console.log("Fetch Response:", response);
        
        const data = response?.value || response;
        
        // Set the selected master from the fetched data
        if (data?.dsoMasterId && data?.dsoName) {
            setSelectedMaster({
                id: data.dsoMasterId,
                name: data.dsoName,
                description: "",
                isActive: true
            } as DSOmaster);
        }
        
        return response;
    };

    const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
        const payload: Partial<DSODentalOffice> = {
            id: Number(id),
            officeCode: formData.officeCode,
            officeName: formData.officeName,
            info: formData.info,
            dsoMasterId: Number(formData.dsoMasterId),
            isActive: formData.isActive ?? true,
        };
        await DSODentalOfficeService.update(Number(id), payload);
        return { isSucess: true, value: payload };
    };

    const popupHandlers = {
        dsoMasterId: {
            value: selectedMaster?.name ?? "",
            actualValue: selectedMaster?.id,
            onOpen: () => setMasterOpen(true),
            onClear: () => setSelectedMaster(null),
        },
    };

    return (
        <>
            <KiduEditModal
                show={show}
                onHide={onHide}
                title="Edit DSO Dental Office"
                subtitle="Update dental office details"
                fields={fields}
                recordId={recordId}
                onFetch={handleFetch}
                onUpdate={handleUpdate}
                popupHandlers={popupHandlers}
                successMessage="Dental office updated successfully!"
                onSuccess={onSuccess}
                submitButtonText="Update Office"
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

export default DSODentalOfficeEditModal;