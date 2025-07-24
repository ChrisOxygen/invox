// Unified business types used across features
export interface BusinessFormData {
  businessName: string;
  businessType?: string;
  email: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  logo?: string;
}

export interface BusinessAddressFormData {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
}

export interface BusinessUpdateData extends Partial<BusinessFormData> {}

// Business types enum (shared across features)
export const BusinessTypes = {
  SOLE_PROPRIETORSHIP: "Sole Proprietorship",
  PARTNERSHIP: "Partnership",
  LLC: "Limited Liability Company (LLC)",
  CORPORATION: "Corporation",
  S_CORPORATION: "S Corporation",
  NON_PROFIT: "Non-Profit Organization",
  FREELANCER: "Freelancer",
  CONSULTANT: "Consultant",
  OTHER: "Other",
} as const;

export type BusinessType = (typeof BusinessTypes)[keyof typeof BusinessTypes];

// Business settings interface
export interface BusinessSettings {
  defaultPaymentTerms?: string;
  defaultLateFee?: string;
  defaultInvoiceNotes?: string;
  invoicePrefix?: string;
  invoiceNumberStart?: number;
}
