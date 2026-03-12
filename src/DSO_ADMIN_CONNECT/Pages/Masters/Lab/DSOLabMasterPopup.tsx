import React from "react";
import KiduSelectPopup from "../../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { LabMaster } from "../../../Types/Masters/Lab.types";
import LabMasterCreateModal from "./DSOLabMasterCreateModal";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
    show: boolean;
    onClose: () => void;
    onSelect: (item: LabMaster) => void;
    showAddButton?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOLabMasterPopup: React.FC<Props> = ({
    show,
    onClose,
    onSelect,
    showAddButton = true,
}) => {
    return (
        <KiduSelectPopup<LabMaster>
            show={show}
            onClose={onClose}
            title="Select Lab"
            subtitle="Search and pick a lab"
            fetchEndpoint={API_ENDPOINTS.LAB_MASTER.GET_ALL}
            columns={[
                {
                    key: "labCode",
                    label: "Lab Code",
                    filterType: "text",
                },
                {
                    key: "labName",
                    label: "Lab Name",
                    filterType: "text",
                },
                {
                    key: "displayName",
                    label: "Display Name",
                    filterType: "text",
                },
                {
                    key: "email",
                    label: "Email",
                    filterType: "text",
                },
                {
                    key: "isActive",
                    label: "Status",
                    filterType: "select",
                    filterOptions: ["true", "false"],
                    render: (value: boolean) => (
                        <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
                            {value ? "Active" : "Inactive"}
                        </span>
                    ),
                },
            ]}
            onSelect={onSelect}
            idKey="id"
            labelKey="labName"
            searchKeys={["labCode", "labName", "displayName", "email"]}
            rowsPerPage={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            themeColor="#ef0d50"
            multiSelect={false}
            showAddButton={showAddButton}
            AddModalComponent={LabMasterCreateModal}
            addButtonLabel="Add Lab"
        />
    );
};

export default DSOLabMasterPopup;