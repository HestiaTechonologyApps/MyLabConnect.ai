import type { AuditTrails } from "../../../Types/Auditlog.types";

export interface DSOProduct {
  // Core Identity Fields
  id?: number;
  code?: string;
  name?: string;
  rate?: number;
  
  // Foreign Key Relationships
  dsoRestorationTypeId?: number;
  restorationTypeName?: string;
  
  dsoSchemaId?: number;
  schemaName?: string;
  
  dsoIndicationId?: number;
  indicationName?: string;
  
  dsoProductGroupId?: number;
  productGroupName?: string;
  
  // DSO Master Relationship
  dsoMasterId?: number;
  dsoName?: string;
  
  // Status Fields
  isActive?: boolean;
  isDeleted?: boolean;
  
  // Audit Fields
  createdAt?: string;
  updatedAt?: string | null;
  
  // Pagination/Filtering Fields (for API requests)
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