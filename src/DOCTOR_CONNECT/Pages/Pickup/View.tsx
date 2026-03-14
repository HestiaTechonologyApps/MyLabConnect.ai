// src/DOCTOR_CONNECT/Pages/CasePickup/View.tsx

import React, { useEffect, useState } from "react";
import CasePickupService from "../../Service/Pickup/Pickup.services";
import type { DoctorPracticeItem } from "../../Service/Pickup/Pickup.services";
import type { PickupViewRecord } from "../../../KIDU_COMPONENTS/PickUp/PickupViewModal";
import type { PickupAddressDetails } from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import PickupViewModal from "../../../KIDU_COMPONENTS/PickUp/PickupViewModal";
import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: number | string;
 
  rowData?: any;
}

const CasePickupView: React.FC<Props> = ({ show, onHide, recordId, rowData }) => {
  const { dsoDoctorId } = useCurrentUser();
  const [practices, setPractices] = useState<DoctorPracticeItem[]>([]);

  // ── Pre-load doctor's practices when modal opens ──────────────────────────
 
  useEffect(() => {
    if (!show || !dsoDoctorId) return;
    CasePickupService.getPracticesByDoctor(dsoDoctorId).then(setPractices);
  }, [show, dsoDoctorId]);

  // ── Fetch record ──────────────────────────────────────────────────────────
  const fetchRecord = async (id: number | string): Promise<PickupViewRecord> => {
    const data = await CasePickupService.getById(Number(id));

    
    const labName =
      (data.labMasterName && data.labMasterName.trim() !== "")
        ? data.labMasterName
        : (rowData?.labMasterName ?? "");

    const cases = (data.casePickUpDetails ?? [])
      .filter((d: any) => !d.isDeleted)
      .map((d: any) => ({
        id:    d.caseRegistrationMasterId,
        label: d.patientName
          ? d.caseNo
            ? `${d.patientName} (${d.caseNo})`
            : d.patientName
          : String(d.caseRegistrationMasterId),
      }));

    return {
      id:                 data.id ?? 0,
      labName,                              // ✅ FIX: from rowData fallback
      pickUpDate:         data.pickUpDate,
      pickUpEarliestTime: data.pickUpEarliestTime,
      pickUpLateTime:     data.pickUpLateTime,
      pickUpAddress:      data.pickUpAddress,
      pickUpAddressId:    undefined,        // not returned by backend
      cases,
      trackingNum:        data.trackingNum,
      isActive:           data.isActive,
      createdAt:          data.createdAt,
      updatedAt:          data.updatedAt,
    };
  };

  // ── fetchAddressDetails — unused: we pass practicesData directly ──────────
  const fetchAddressDetails = async (
    _addressId: string | number
  ): Promise<PickupAddressDetails> => {
    return {};
  };

  return (
    <PickupViewModal
      show={show}
      onHide={onHide}
      recordId={recordId}
      fetchRecord={fetchRecord}
      fetchAddressDetails={fetchAddressDetails}
      practicesData={practices}   // ✅ FIX: pass practices for right-panel address lookup
      title="Pickup Details"
    />
  );
};

export default CasePickupView;