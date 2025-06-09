// Re-export schema-derived types for backward compatibility
export type { BusinessFormInput as BusinessFormValues } from "../schemas/business";

// Note: BusinessUpdateValues is exported from main types/index.ts to avoid conflicts

// Business-specific domain types
export interface BusinessSettings {
  defaultPaymentTerms?: string;
  defaultLateFee?: string;
  defaultInvoiceNotes?: string;
  invoicePrefix?: string;
  invoiceNumberStart?: number;
}

export interface BusinessProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  currency: string;
  settings: BusinessSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessContactInfo {
  email: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface BusinessAddress {
  street: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
