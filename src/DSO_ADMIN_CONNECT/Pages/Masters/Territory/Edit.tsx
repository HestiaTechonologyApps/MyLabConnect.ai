import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOTerritoryService from "../../../Services/Masters/DsoTerritory.services";
import type { DSOTerritory } from "../../../Types/Masters/DsoTerritory.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

const fields: Field[] = [
  { name: "name",     rules: { type: "text",   label: "Territory Name", required: true, minLength: 3, maxLength: 200, colWidth: 12 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSOTerritoryEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId }               = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Fetch handler ─────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    return await DSOTerritoryService.getById(Number(id));
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
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
      id:          Number(id),
      name:        formData.name,
      dsoMasterId: dsOMasterId,
      isActive:    formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSOTerritoryService.update(Number(id), payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to update Territory.");

    return result;
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Territory"
      subtitle="Update Territory details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Territory updated successfully!"
      onSuccess={onSuccess}
      submitButtonText="Update Territory"
    />
  );
};

export default DSOTerritoryEditModal;