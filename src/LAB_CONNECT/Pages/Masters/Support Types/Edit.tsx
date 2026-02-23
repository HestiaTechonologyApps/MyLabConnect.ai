import React, { useState, useEffect } from "react";
import KiduTabbedFormModal, { 
  type TabbedFormField, 
  type TabConfig 
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormModal";
import type { LabSupportType } from "../../../Types/Masters/SupportTypes.types";
import LabSupportTypeService from "../../../Services/Masters/SupportTypes.services";
import LabSupportSubTypeService from "../../../Services/Masters/SupportSubTypes.services";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: number;
}

const LabSupportTypeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [loading, setLoading] = useState(false);
  const [initialHeaderData, setInitialHeaderData] = useState<Record<string, any>>({});
  const [initialTabData, setInitialTabData] = useState<Record<string, Record<string, any>[]>>({});

  // ── Header Fields ───────────────────────────────────────────────────────
  const headerFields: TabbedFormField[] = [
    {
      name: "labMasterId",
      label: "Lab",
      type: "select",
      required: true,
      placeholder: "Choose a lab...",
      options: [
        { value: 1, label: "Lab 1" },
        { value: 2, label: "Lab 2" },
        // This should come from an API/master data
      ],
      colWidth: 4,
    },
    {
      name: "labSupportTypeName",
      label: "Support Type",
      type: "text",
      required: true,
      placeholder: "Enter support type",
      colWidth: 4,
    },
    {
      name: "escalationDays",
      label: "Escalation in Days",
      type: "number",
      required: false,
      placeholder: "Enter escalation in days",
      colWidth: 4,
    },
  ];

  // ── Sub Types Tab Configuration ─────────────────────────────────────────
  const tabs: TabConfig[] = [
    {
      key: "subTypes",
      label: "Sub Types",
      columns: [
        {
          key: "labSupportSubTypeName",
          label: "Sub Type",
          type: "text",
          required: true,
          placeholder: "Enter Sub Type",
        },
      ],
    },
  ];

  // ── Fetch existing data when modal opens ─────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if (!show || !recordId) return;

      setLoading(true);
      try {
        // 1. Fetch main Support Type
        const mainResponse = await LabSupportTypeService.getById(recordId);
        console.log("Edit - Main Response:", mainResponse);
        
        const mainData = mainResponse?.value || mainResponse;

        setInitialHeaderData({
          labMasterId: mainData.labMasterId,
          labSupportTypeName: mainData.labSupportTypeName,
          escalationDays: mainData.escalationDays,
          isActive: mainData.isActive,
        });

        // 2. Fetch Sub Types for this Support Type
        // Note: You need to add this method to your service
        const subTypesResponse = await LabSupportSubTypeService.getBySupportTypeId(recordId);
        console.log("Edit - SubTypes Response:", subTypesResponse);
        
        const subTypes = subTypesResponse?.value || subTypesResponse || [];

        setInitialTabData({
          subTypes: subTypes.length > 0 ? subTypes : [{}],
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (show && recordId) {
      fetchData();
    }
  }, [show, recordId]);

  // ── Submit Handler ───────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    try {
      const { headerData, tabData } = data;

      console.log("Edit Submit Data:", { headerData, tabData });

      // 1. Update main Support Type
      const updatePayload: Partial<LabSupportType> = {
        id: recordId,
        labSupportTypeName: headerData.labSupportTypeName,
        escalationDays: headerData.escalationDays ? Number(headerData.escalationDays) : 0,
        labMasterId: Number(headerData.labMasterId),
        isActive: headerData.isActive ?? true,
      };

      console.log("Update Payload:", updatePayload);
      await LabSupportTypeService.update(recordId, updatePayload);

      // 2. Handle Sub Types
      const subTypes = tabData.subTypes || [];
      const validSubTypes = subTypes.filter(
        (row) => row.labSupportSubTypeName && row.labSupportSubTypeName.trim() !== ""
      );

      console.log("Valid SubTypes:", validSubTypes);

      // You need to implement sync logic based on your API requirements
      // Option 1: Delete all and recreate
      if (validSubTypes.length > 0) {
        // First delete existing sub types (you need to add this method)
        // await LabSupportSubTypeService.deleteBySupportTypeId(recordId);
        
        // Then create new ones
        await Promise.all(
          validSubTypes.map(async (subType) => {
            const subTypePayload = {
              labSupportSubTypeName: subType.labSupportSubTypeName,
              labSupportTypeId: recordId,
              isActive: true,
            };
            console.log("SubType Payload:", subTypePayload);
            return LabSupportSubTypeService.create(subTypePayload);
          })
        );
      } else {
        // If no valid subTypes, you might want to delete all existing ones
        // await LabSupportSubTypeService.deleteBySupportTypeId(recordId);
      }

      onSuccess();
    } catch (error) {
      console.error("Error updating Lab Support Type:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading data...</p>
      </div>
    );
  }

  return (
    <KiduTabbedFormModal
      show={show}
      onHide={onHide}
      title="Edit Support Type"
      headerFields={headerFields}
      tabs={tabs}
      onSubmit={handleSubmit}
      submitButtonText="Update"
      themeColor="#ef0d50"
    />
  );
};

export default LabSupportTypeEditModal;