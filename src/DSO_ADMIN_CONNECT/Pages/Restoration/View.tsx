import React from "react";
import KiduViewModal, { type ViewField } from "../../../KIDU_COMPONENTS/KiduViewModal";
import DSORestorationTypeService from "../../Services/Restoration/Restoration.services";

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
    show: boolean;
    onHide: () => void;
    recordId: string | number;
}

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: ViewField[] = [
    { name: "name", label: "Restoration Name", colWidth: 6 },
    { name: "dsoProthesisname", label: "Prosthesis Type", colWidth: 6 },
    { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
];

// ── Component ─────────────────────────────────────────────────────────────────

const DSORestorationTypeViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
    return (
        <KiduViewModal
            show={show}
            onHide={onHide}
            title="View Restoration Type"
            subtitle="Restoration Type details"
            fields={fields}
            recordId={recordId}
            onFetch={(id) => DSORestorationTypeService.getById(Number(id))}
            showBadge={true}
            badgeText="Read Only"
        />
    );
};

export default DSORestorationTypeViewModal;