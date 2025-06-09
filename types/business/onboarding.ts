import { BusinessFormValues } from "./index";

export type CurrencyType =
  | "USD"
  | "EUR"
  | "GBP"
  | "NGN"
  | "JPY"
  | "CAD"
  | "AUD";

export interface PaymentMethodDetails {
  nigerianBank?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
  };
  paypal?: {
    email: string;
  };
  wise?: {
    email: string;
  };
  bankTransfer?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountHolderName: string;
  };
}

export interface PaymentRules {
  paymentTerms: string;
  lateFee: string;
  invoiceNotes: string;
}

export interface OnboardingData {
  currency?: CurrencyType;
  businessInfo?: BusinessFormValues;
  paymentMethods?: string[];
  paymentMethodDetails?: PaymentMethodDetails;
  paymentRules?: PaymentRules;
}

export interface CompleteOnboardingRequest {
  currency: CurrencyType;
  businessInfo: BusinessFormValues;
  paymentMethods: string[];
  paymentMethodDetails: PaymentMethodDetails;
  paymentRules: PaymentRules;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  component: string;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  data: OnboardingData;
}
