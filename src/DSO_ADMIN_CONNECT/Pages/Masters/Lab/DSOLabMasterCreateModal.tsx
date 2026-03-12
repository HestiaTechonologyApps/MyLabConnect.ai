import React, { useRef } from "react";
import KiduCreateModal, {
    type Field,
    type DropdownHandlers
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import LabMasterService from "../../../Services/Masters/Lab.services";
import LabGroupService from "../../../Services/Masters/Labgroup.services";
import type { LabMaster } from "../../../Types/Masters/Lab.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services"; 

// ── Authentication type static options ────────────────────────────────────────
const AUTHENTICATION_TYPE_OPTIONS = [
    { value: 1, label: "Normal" },
    { value: 2, label: "SSO" },
    { value: 3, label: "Basic" },
];

// ── Props (matches AddModalComponent interface expected by KiduSelectPopup) ───
interface Props {
    show: boolean;
    handleClose: () => void;
    onAdded: (item: LabMaster) => void;
}

const fields: Field[] = [
    { name: "labCode", rules: { type: "text", label: "Lab Code", required: true, minLength: 3, maxLength: 20, colWidth: 6 } },
    { name: "labName", rules: { type: "text", label: "Lab Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
    { name: "displayName", rules: { type: "text", label: "Display Name", required: false, minLength: 3, maxLength: 100, colWidth: 6 } },
    { name: "email", rules: { type: "email", label: "Email", required: false, minLength: 3, maxLength: 100, colWidth: 6 } },
    { name: "labGroupId", rules: { type: "smartdropdown", label: "Lab Group", required: true, colWidth: 6 } },
    { name: "authenticationType", rules: { type: "smartdropdown", label: "Authentication Type", required: true, colWidth: 6 } },
    { name: "logoforRX", rules: { type: "text", label: "Logo for RX", required: false, minLength: 3, maxLength: 200, colWidth: 6 } },
    { name: "lmsSystem", rules: { type: "text", label: "LMS System", required: false, minLength: 3, maxLength: 100, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

const LabMasterCreateModalForPopup: React.FC<Props> = ({ show, handleClose, onAdded }) => {
    const { requireDSOMasterId } = useCurrentUser();
    const { handleApiError, assertApiSuccess } = useApiErrorHandler(); // ✅ Now works with correct import
    const createdDataRef = useRef<any>(null);

    // ── Dropdown handlers for smartdropdown ─────────────────────────────────
    const dropdownHandlers: DropdownHandlers = {
        labGroupId: {
            paginatedFetch: async (params) => {
                const result = await LabGroupService.getPaginatedList({
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    searchTerm: params.searchTerm,
                    sortBy: "",
                    sortDescending: false,
                });
                return { data: result.data, total: result.total };
            },
            mapOption: (row) => ({ value: row.id, label: row.name ?? row.groupName ?? String(row.id) }),
            pageSize: 10,
            placeholder: "Select Lab Group...",
        },
        authenticationType: {
            staticOptions: AUTHENTICATION_TYPE_OPTIONS,
            mapOption: (option) => ({ value: option.value, label: option.label }),
            placeholder: "Select Authentication Type...",
        },
    };

    const handleSubmit = async (formData: Record<string, any>) => {
        // Get DSO Master ID from session
        let dsoMasterId: number;
        try {
            dsoMasterId = requireDSOMasterId();
            console.log("DSO Master ID:", dsoMasterId);
        } catch (err) {
            console.error("Failed to get DSO Master ID:", err);
            await handleApiError(err, "session");
            return;
        }

        // Build payload - Check if LabMaster type needs dsoMasterId
        const payload: Partial<LabMaster> = {
            labCode: formData.labCode,
            labName: formData.labName,
            displayName: formData.displayName,
            email: formData.email,
            labGroupId: formData.labGroupId ? Number(formData.labGroupId) : undefined,
            authenticationType: formData.authenticationType ? Number(formData.authenticationType) : undefined,
            logoforRX: formData.logoforRX,
            lmsSystem: formData.lmsSystem,
            isActive: formData.isActive ?? true,
            // dsoMasterId: dsoMasterId, // Comment out if LabMaster type doesn't have this field
        };

        console.log("Submitting payload:", payload);

        try {
            const response = await LabMasterService.create(payload);
            console.log("API Response:", response);
            createdDataRef.current = response;
            
            // Assert success using the error handler
            await assertApiSuccess(response, "Failed to create Lab");
        } catch (err) {
            console.error("Error in API call:", err);
            await handleApiError(err, "network");
        }
    };

    const handleSuccess = () => {
        const response = createdDataRef.current;
        const newItem = response?.value || response?.data || response;
        if (newItem) {
            console.log("Item created successfully:", newItem);
            onAdded(newItem);
        }
        createdDataRef.current = null;
        handleClose();
    };

    const handleHide = () => {
        handleClose();
    };

    return (
        <KiduCreateModal
            show={show}
            onHide={handleHide}
            title="Add Lab"
            subtitle="Create a new Lab Master"
            fields={fields}
            onSubmit={handleSubmit}
            dropdownHandlers={dropdownHandlers}
            successMessage="Lab created successfully!"
            onSuccess={handleSuccess}
            themeColor="#ef0d50"
        />
    );
};

export default LabMasterCreateModalForPopup;