import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface LabGroup {
  // Core Fields
  id?: number;
  code?: string;
  name?: string;

  // Audit Fields
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?: boolean;

  // Pagination/Filtering Fields
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;

  // Optional Audit Trail
  auditlog?: AuditTrails[];
}