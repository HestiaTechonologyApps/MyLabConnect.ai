import React from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOTerritoryService from "../../../Services/Masters/DsoTerritory.services";
import type { DSOTerritory } from "../../../Types/Masters/DsoTerritory.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Territory Name", required: true, minLength: 3, maxLength: 200, colWidth: 12 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSOTerritoryCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    // 1. Get DSOMasterId from token
    let dsOMasterId: number;
    try {
      dsOMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload
    const payload: Partial<DSOTerritory> = {
      name: formData.name,
      dsoMasterId: dsOMasterId,
      isActive: formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSOTerritoryService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to create Territory.");
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Territory"
      subtitle="Add a new Territory"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Territory created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSOTerritoryCreateModal;