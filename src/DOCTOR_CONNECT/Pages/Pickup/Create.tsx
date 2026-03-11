// src/Pages/CasePickup/Create.tsx

import React, { useEffect, useState } from "react";
import type { LabLookupItem } from "../../../Types/Auth/Lookup.types";
import LookupService from "../../../Services/Common/Lookup.services";
import type {
  PickupAddressDetails,
  PickupCreateFormData,
} from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import CasePickupService, {
  type CaseLookupItem,
  type DoctorPracticeItem,
} from "../../Service/Pickup/Pickup.services";
import PickupScheduleModal from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CasePickupCreate: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { dsoDoctorId } = useCurrentUser();

  const [labs,      setLabs]      = useState<LabLookupItem[]>([]);
  const [practices, setPractices] = useState<DoctorPracticeItem[]>([]);
  const [cases,     setCases]     = useState<CaseLookupItem[]>([]);

  // ── Fetch all three lists when the modal opens ───────────────────────────
  useEffect(() => {
    if (!show || !dsoDoctorId) return;

    Promise.all([
      LookupService.getLabs(),
      CasePickupService.getPracticesByDoctor(dsoDoctorId),
      CasePickupService.getCasesByDoctor(dsoDoctorId),
    ]).then(([labList, practiceList, caseList]) => {
      setLabs(labList);
      setPractices(practiceList);
      setCases(caseList);
    });
  }, [show, dsoDoctorId]);

  // ── Paginated address fetch — client-side over the doctor's practices ─────
  const fetchPickupAddresses = async (p: {
    pageNumber: number;
    pageSize:   number;
    searchTerm: string;
  }) => {
    const term     = p.searchTerm.toLowerCase();
    const filtered = term
      ? practices.filter(
          (pr) =>
            pr.officeName?.toLowerCase().includes(term) ||
            pr.officeCode?.toLowerCase().includes(term) ||
            pr.city?.toLowerCase().includes(term)
        )
      : practices;
    const start = (p.pageNumber - 1) * p.pageSize;
    return { data: filtered.slice(start, start + p.pageSize), total: filtered.length };
  };

  const mapPickupAddress = (row: DoctorPracticeItem) => ({
    value: row.id,
    label: `${row.officeName}${row.city ? ` — ${row.city}` : ""}`,
  });

  const fetchAddressDetails = async (
    addressId: string | number
  ): Promise<PickupAddressDetails> => {
    const p = practices.find((pr) => String(pr.id) === String(addressId));
    if (!p) return {};
    return {
      practiceName: p.officeName,
      address:      [p.address, p.city, p.postCode].filter(Boolean).join(", "),
      email:        undefined,
      mobileNo:     undefined,
    };
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (data: PickupCreateFormData) => {
    await CasePickupService.create({
      labMasterId:               Number(data.labMasterId),
      pickUpDate:                data.pickUpDate,
      pickUpEarliestTime:        data.pickUpEarliestTime,
      pickUpLateTime:            data.pickUpLateTime,
      pickUpAddress:             data.pickUpAddress!,
      caseRegistrationMasterIds: data.caseRegistrationMasterIds,
      trackingNum:               data.trackingNum || undefined,
    });
  };

  // ── Column definitions ────────────────────────────────────────────────────

  const labColumns = [
    { key: "labName",     label: "Lab Name",     filterType: "text"   as const },
    { key: "labCode",     label: "Code",         filterType: "text"   as const },
    { key: "displayName", label: "Display Name", filterType: "text"   as const },
    { key: "lmsSystem",   label: "LMS",          filterType: "text"   as const },
    {
      key: "isActive",
      label: "Status",
      filterType: "select" as const,
      filterOptions: ["true", "false"],
      render: (value: boolean) => (
        <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const caseColumns = [
    { key: "caseId",      label: "Case ID",      filterType: "text" as const },
    { key: "patientName", label: "Patient Name", filterType: "text" as const },
    { key: "doctorName",  label: "Doctor",       filterType: "text" as const },
    { key: "status",      label: "Status",       filterType: "text" as const },
  ];

  return (
    <PickupScheduleModal
      show={show}
      onHide={onHide}
      onSuccess={onSuccess}
      // Lab
      labSelectData={labs}
      labColumns={labColumns}
      labIdKey="id"
      labLabelKey="labName"
      labSearchKeys={["labName", "labCode", "displayName"]}
      // Pickup address — this doctor's linked practices only
      fetchPickupAddresses={fetchPickupAddresses}
      mapPickupAddress={mapPickupAddress}
      fetchAddressDetails={fetchAddressDetails}
      // Cases — this doctor's cases only
      casesSelectData={cases}
      caseColumns={caseColumns}
      caseIdKey="id"
      caseLabelKey="patientName"
      caseSearchKeys={["caseId", "patientName", "doctorName", "status"]}
      // Submit
      onSubmit={handleSubmit}
      title="Schedule Pickup"
      submitLabel="Schedule Pickup"
    />
  );
};

export default CasePickupCreate;