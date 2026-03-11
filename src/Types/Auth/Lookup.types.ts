// src/Types/Lookup/Lookup.types.ts

export type LookupEntityName = "dso" | "doctor" | "practice" | "lab";

export interface LabLookupItem {
  id: number;
  labCode: string;
  labName: string;
  displayName: string;
  email: string;
  lmsSystem: string;
  isActive: boolean;
}

export interface PracticeLookupItem {
  id: number;
  officeName: string;
  officeCode: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  isActive: boolean;
}

export interface DoctorLookupItem {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  licenseNo: string;
  doctorCode: string;
  dsoMasterId: number;
  dsoName: string;
  isActive: boolean;
}

export interface DSOLookupItem {
  id: number;
  name: string;
  isActive: boolean;
}