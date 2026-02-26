/* ============================================================
   data/roleConfig.ts
   Defines per-role tab visibility, default active tab,
   and card interaction mode.
   ============================================================ */

import type { StatusKey } from "../KIDU_COMPONENTS/KiduCaseStatusbar";
import type { CardMode, LoginRole } from "../Types/IndexPage.types";


// ─────────────────────────────────────────────────────────────
// Tab visibility matrix
// true  = tab shown for this role
// false = tab hidden
// ─────────────────────────────────────────────────────────────
export interface RoleTabConfig {
  visible: StatusKey[];   // tabs shown (in display order)
  defaultTab: StatusKey;  // which tab is active on page load
  cardMode: CardMode;     // controls action buttons on cards
  showPrescription: boolean;
  showPickup: boolean;
  pageTitle: string;
}

export const ROLE_CONFIG: Record<LoginRole, RoleTabConfig> = {
  // ── Doctor: all 6 tabs, scan rejected included ──────────────
  doctor: {
    visible: ['rejected', 'hold', 'transit', 'production', 'submitted', 'recent'],
    defaultTab: 'hold',
    cardMode: 'doctor',
    showPrescription: false,
    showPickup: false,
    pageTitle: 'Doctor Dashboard',
  },

  // ── Practice: all 6 tabs ────────────────────────────────────
  practice: {
    visible: ['rejected', 'hold', 'transit', 'production', 'submitted', 'recent'],
    defaultTab: 'submitted',
    cardMode: 'practice',
    showPrescription: true,
    showPickup: true,
    pageTitle: 'Practice Dashboard',
  },

  // ── DSO: all 6 tabs, view-only ──────────────────────────────
  dso: {
    visible: ['rejected', 'hold', 'transit', 'production', 'submitted', 'recent'],
    defaultTab: 'submitted',
    cardMode: 'dso',
    showPrescription: false,
    showPickup: false,
    pageTitle: 'DSO Dashboard',
  },

  // ── Lab: rejected NOT shown (labs handle, not see rejections)
  //   update-status + help buttons
  lab: {
    visible: ['hold', 'transit', 'production', 'submitted', 'recent'],
    defaultTab: 'hold',
    cardMode: 'lab',
    showPrescription: false,
    showPickup: false,
    pageTitle: 'Lab Dashboard',
  },

  // ── Admin: all 6 tabs, view-only ────────────────────────────
  admin: {
    visible: ['rejected', 'hold', 'transit', 'production', 'submitted', 'recent'],
    defaultTab: 'submitted',
    cardMode: 'admin',
    showPrescription: false,
    showPickup: false,
    pageTitle: 'Admin Dashboard',
  },

  // ── Integrator: rejected NOT shown, view-only ────────────────
  integrator: {
    visible: ['hold', 'transit', 'production', 'submitted', 'recent'],
    defaultTab: 'submitted',
    cardMode: 'integrator',
    showPrescription: false,
    showPickup: false,
    pageTitle: 'Integrator Dashboard',
  },
};

// ── Human-readable tab labels ──────────────────────────────────
export const TAB_LABELS: Record<StatusKey, string> = {
  rejected:   'Scan Rejected',
  hold:       'Case on Hold',
  transit:    'In Transit',
  production: 'In Production',
  submitted:  'Submitted',
  recent:     'Recent',
};

// ── Tab icons ──────────────────────────────────────────────────
export const TAB_ICONS: Record<StatusKey, string> = {
  rejected:   '✕',
  hold:       '⚠',
  transit:    '🚚',
  production: '⚙',
  submitted:  '✓',
  recent:     '🕐',
};