import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import LabGroupCreateModal from "./Create";
import LabGroupEditModal from "./Edit";
import LabGroupViewModal from "./View";
import LabGroupService from "../../../Services/Masters/Labgroup.services";

const columns: KiduColumn[] = [
  {
    key: "code",
    label: "Code",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "name",
    label: "Lab Group Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
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

const LabGroupList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [showView,   setShowView]   = useState(false);
  const [recordId,   setRecordId]   = useState<string | number>("");
  const tableKeyRef = useRef(0);
  const [tableKey,   setTableKey]   = useState(0);

  const refreshTable = () => {
    tableKeyRef.current += 1;
    setTableKey(tableKeyRef.current);
  };

  const handleEditClick  = (row: any) => { setRecordId(row.id); setShowEdit(true);  };
  const handleViewClick  = (row: any) => { setRecordId(row.id); setShowView(true);  };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This lab group will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await LabGroupService.delete(row.id);
      refreshTable();
      Swal.fire("Deleted!", "Lab group has been deleted.", "success");
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Lab Groups"
        subtitle="Manage lab group master data"
        columns={columns}
        paginatedFetchService={LabGroupService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Lab Group"
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
        auditLogTableName="labgroup"
      />

      <LabGroupCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); refreshTable(); }}
      />

      {recordId && (
        <>
          <LabGroupEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => { setShowEdit(false); refreshTable(); }}
            recordId={recordId}
          />
          <LabGroupViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default LabGroupList;