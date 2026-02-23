import type { AuditTrails } from "../../../Types/Auditlog.types";

// ── Use const object instead of enum (fixes erasableSyntaxOnly TS error) ──────
export const AuthenticationType = {
  Normal: 1,
  SSO:    2,
  Basic:  3,
} as const;

export type AuthenticationType = typeof AuthenticationType[keyof typeof AuthenticationType];

export const AuthenticationTypeOptions = [
  { value: 1, label: "Normal" },
  { value: 2, label: "SSO"    },
  { value: 3, label: "Basic"  },
];

export interface LabMaster {
  id?:                 number;
  labCode?:            string;
  labName?:            string;
  displayName?:        string;
  email?:              string;
  authenticationType?: number;
  logoforRX?:          string;
  lmsSystem?:          string;
  labGroupId?:         number;
  labGroupName?:       string;

  // Audit Fields
  createdAt?:  string;
  updatedAt?:  string | null;
  isDeleted?:  boolean;
  isActive?:   boolean;

  // Pagination
  pageNumber?:     number;
  pageSize?:       number;
  searchTerm?:     string;
  sortBy?:         string;
  sortDescending?: boolean;
  showDeleted?:    boolean;
  showInactive?:   boolean;

  auditlog?: AuditTrails[];
}