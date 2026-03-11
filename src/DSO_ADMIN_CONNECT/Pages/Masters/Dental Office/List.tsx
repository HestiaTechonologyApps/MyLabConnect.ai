import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import DSODentalOfficeCreateModal from "./Create";
import DSODentalOfficeEditModal from "./Edit";
import DSODentalOfficeViewModal from "./View";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";

// ── Table column definitions ──────────────────────────────────────────────────

const columns: KiduColumn[] = [
  {
    key: "officeCode",
    label: "Office Code",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "officeName",
    label: "Office Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "city",
    label: "City",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "country",
    label: "Country",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "mobileNum",
    label: "Mobile",
    enableSorting: false,
    enableFiltering: false,
  },
  {
    key: "dsoZoneName",
    label: "Zone",
    enableSorting: true,
    enableFiltering: false,
  },
  {
    key: "isActive",
    label: "Status",
    type: "badge",
    enableSorting: false,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Inactive", "Active"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const DSODentalOfficeList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [recordId, setRecordId] = useState<string | number>("");
  const tableKeyRef = useRef(0);
  const [tableKey, setTableKey] = useState(0);

  const refreshTable = () => {
    tableKeyRef.current += 1;
    setTableKey(tableKeyRef.current);
  };

  const handleEditClick = (row: any) => { setRecordId(row.id); setShowEdit(true); };
  const handleViewClick = (row: any) => { setRecordId(row.id); setShowView(true); };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This dental office will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await DSODentalOfficeService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "Dental Office has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Practices"
        subtitle="Manage dental practice master data"
        columns={columns}
        paginatedFetchService={DSODentalOfficeService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Practice"
        onAddClick={() => setShowCreate(true)}
        onEditClick={handleEditClick}
        onViewClick={handleViewClick}
        onDeleteClick={handleDeleteClick}
        showActions={true}
        showSearch={true}
        showFilters={true}
        showExport={true}
        showColumnToggle={true}
        defaultRowsPerPage={10}
        highlightOnHover={true}
        auditLogTableName="DSO_DentalOffice"
      />

      <DSODentalOfficeCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <DSODentalOfficeEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <DSODentalOfficeViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSODentalOfficeList;