// ================================================================
// Marketplace Types — {my}labconnect
// ================================================================

export interface PricingRow {
  materialGroup: string;
  materialType: string;
  eta: string;
  caseType: string;
  minPrice: number;
  maxPrice: number;
}

export interface LabTechnology {
  compatibleScanners: string[];
  cadCamSoftware: string[];
  premiumMaterials: string[];
  certifications: string[];
  fileFormats: string[];
}

export interface LabOperationalMetrics {
  monthlyCapacity: number;
  onTimeDelivery: number;   // %
  remakeRate: number;       // %
  totalTechnicians: number;
  avgExperience: number;    // years
  cdtCertified: number;     // %
}

export interface LabQualityMetrics {
  remakeRate: number;
  fitAccuracy: number;
  shadeMatching: number;
  satisfaction: number;     // out of 5
  surveyResponses: number;
}

export interface LabTurnaround {
  standardTat: number;      // days
  rushTat: number;          // days
  onTimeRate: number;       // %
  note?: string;
}

export interface LabPricing {
  basePrice?: number;
  price50Plus?: number;
  price200Plus?: number;
  freeRemakes: boolean;
  remakeWindow?: string;
  shippingIncluded: boolean;
  shippingMethod?: string;
}

export interface LabSupport {
  portal24x7: boolean;
  accountManager: boolean;
  freeConsultations: boolean;
  chairsideSupport: boolean;
  responseTimeHours: number;
}

export interface LabPartnership {
  freeSampleAvailable: boolean;
  firstOrderDiscount: number; // %
  discountCode?: string;
  partnershipBenefits: string[];
}

export interface Lab {
  id: string;
  name: string;
  shortCode: string;
  logoUrl?: string;
  location: string;
  city?: string;
  country: string;
  establishedYear: number;
  status: 'Active' | 'Inactive' | 'Pending';
  rating: number;
  reviewCount: number;
  email: string;
  website?: string;
  phone?: string;
  restorationTypes: string[];
  eta?: string;
  basePrice: number;
  pricingRows: PricingRow[];
  technology: LabTechnology;
  operationalMetrics: LabOperationalMetrics;
  qualityMetrics: LabQualityMetrics;
  turnaround: LabTurnaround;
  pricing: LabPricing;
  support: LabSupport;
  partnership: LabPartnership;
  tags: string[];
  featured?: boolean;
}

export type SortKey = 'price' | 'rating' | 'eta';
export type SortDir = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  dir: SortDir;
}

export interface MarketplaceFilters {
  workflowType: string;
  practiceType: string;
  product: string;
  search: string;
  sort: SortState[];
}

export type ProfileSection =
  | 'overview'
  | 'operational'
  | 'quality'
  | 'technology'
  | 'turnaround'
  | 'pricing'
  | 'support'
  | 'partnership';

export interface ProfileSidebarItem {
  key: ProfileSection;
  label: string;
  icon: string; // SVG path or component name
}