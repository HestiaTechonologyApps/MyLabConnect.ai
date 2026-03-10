import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSOProduct {
  id?: number;
  code?: string;
  name?: string;
  dsoMasterId?: number;
  dsoName?: string;
  dsoProductGroupId?: number;
  dsoProductGroupName?: string;
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
  auditlog?: AuditTrails[];
};