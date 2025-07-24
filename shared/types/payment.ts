// Unified payment types used across features
export interface PaymentAccountData {
  id?: string;
  gatewayType: "stripe" | "paypal" | "bank";
  accountName: string;
  isActive: boolean;
  accountData: Record<string, string>;
}

export interface PaymentMethodFormData {
  accountName: string;
  accountData: Record<string, string>;
}

// Payment gateway specific data interfaces
export interface StripeAccountData {
  publicKey?: string;
  secretKey?: string;
  webhookSecret?: string;
}

export interface PayPalAccountData {
  clientId?: string;
  clientSecret?: string;
  environment?: "sandbox" | "production";
}

export interface BankAccountData {
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
}

// Unified payment method details (used in onboarding)
export interface PaymentMethodDetails {
  stripe?: StripeAccountData;
  paypal?: PayPalAccountData;
  bank?: BankAccountData;
}

// Payment rules for business settings
export interface PaymentRules {
  acceptCreditCards?: boolean;
  acceptPayPal?: boolean;
  acceptBankTransfers?: boolean;
  defaultPaymentTerms?: string;
  lateFeePercentage?: number;
  gracePeriodDays?: number;
}

// Payment method selection types
export type PaymentMethodType = "stripe" | "paypal" | "bank";

export interface PaymentMethodOption {
  value: PaymentMethodType;
  label: string;
  description: string;
  icon: string;
}
