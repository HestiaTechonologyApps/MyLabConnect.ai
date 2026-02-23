import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSODentalOffice {
  // Core Identity Fields
  id?: number;
  officeCode?: string;
  officeName?: string;
  info?: string;
  
  // DSO Master Relationship
  dsoMasterId?: number;
  dsoName?: string;
  
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