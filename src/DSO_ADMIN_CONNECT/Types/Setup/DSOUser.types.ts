import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSOUser {
  // Core Identity
  id?: number;
  userId?: number;
  dsoMasterId?: number;
  dsoName?: string;

  // Personal Info
  firstName?: string;
  lastName?: string;
  fullName?: string;

  // Contact
  email?: string;
  phoneNumber?: string;
  address?: string;

  // Status
  isActive?: boolean;
  isDeleted?: boolean;

  // Audit
  createdAt?: string;
  updatedAt?: string | null;

  // Pagination/Filtering
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;

  auditlog?: AuditTrails[];
}