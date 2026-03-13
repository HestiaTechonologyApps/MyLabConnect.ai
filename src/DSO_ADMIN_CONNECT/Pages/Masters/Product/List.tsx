import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import DSOProductService from "../../../Services/Masters/DsoProduct.services";
import DSOProductCreateModal from "./Create";
import DSOProductEditModal from "./Edit";
import DSOProductViewModal from "./View";

const columns: KiduColumn[] = [
  {
    key: "code",
    label: "Product Code",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  {
    key: "name",
    label: "Product Name",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
  },
  // {
  //   key: "rate",
  //   label: "Rate",
  //   enableSorting: true,
  //   enableFiltering: true,
  //   filterType: "number",
  //   render: (value) => <span>${Number(value).toFixed(2)}</span>,
  // },
  {
    key: "restorationTypeName",
    label: "Restoration Type",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
    render: (value, row) => <span>{value || `Type #${row.dsoRestorationTypeId}`}</span>,
  },
  {
    key: "schemaName",
    label: "Schema",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
    render: (value, row) => <span>{value || `Schema #${row.dsoSchemaId}`}</span>,
  },
  {
    key: "indicationName",
    label: "Indication",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
    render: (value, row) => <span>{value || `Indication #${row.dsoIndicationId}`}</span>,
  },
  {
    key: "productGroupName",
    label: "Product Group",
    enableSorting: true,
    enableFiltering: true,
    filterType: "text",
    render: (value, row) => <span>{value || `Group #${row.dsoProductGroupId}`}</span>,
  },
  {
    key: "isActive",
    label: "Status",
    type: "badge",
    enableSorting: false,
    enableFiltering: true,
    filterType: "select",
    filterOptions: ["Active", "Inactive"],
    render: (value) => (
      <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const DSOProductList: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [recordId, setRecordId] = useState<number>(0);
  const tableKeyRef = useRef(0);
  const [tableKey, setTableKey] = useState(0);

  const refreshTable = () => {
    tableKeyRef.current += 1;
    setTableKey(tableKeyRef.current);
  };

  const handleEditClick = (row: any) => {
    setRecordId(row.id);
    setShowEdit(true);
  };

  const handleViewClick = (row: any) => {
    setRecordId(row.id);
    setShowView(true);
  };

  const handleDeleteClick = async (row: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef0d50",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await DSOProductService.delete(row.id);
        refreshTable();
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete product.", "error");
      }
    }
  };

  return (
    <>
      <KiduServerTableList
        key={tableKey}
        title="Products"
        subtitle="Manage product master data"
        columns={columns}
        paginatedFetchService={DSOProductService.getPaginatedList}
        rowKey="id"
        showAddButton={true}
        addButtonLabel="Add Product"
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
        auditLogTableName="dso_product"
      />

      <DSOProductCreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => {
          setShowCreate(false);
          refreshTable();
        }}
      />

      {recordId > 0 && (
        <>
          <DSOProductEditModal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            onSuccess={() => {
              setShowEdit(false);
              refreshTable();
            }}
            recordId={recordId}
          />
          <DSOProductViewModal
            show={showView}
            onHide={() => setShowView(false)}
            recordId={recordId}
          />
        </>
      )}
    </>
  );
};

export default DSOProductList;