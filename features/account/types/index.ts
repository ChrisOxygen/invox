export interface User {
  id: string;
  name: string | null;
  email: string;
  currency?: string | null;
  onboardingCompleted: boolean;
  signature?: string | null;
}

export interface Business {
  id: string;
  businessName: string | null;
  email: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  logo?: string | null;
}

export interface PaymentAccount {
  id: string;
  gatewayType: string;
  accountName: string;
  isActive: boolean;
  isDefault: boolean;
  accountData?: Record<string, unknown> | null;
}
