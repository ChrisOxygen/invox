import type { BusinessFormValues } from "@/types/business";
import type {
  PaymentMethodDetails,
  PaymentRules,
} from "@/types/business/onboarding";
import type { CurrencyType } from "@/types";

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  businessType?: string;
  currency?: CurrencyType;
  businessInfo?: BusinessFormValues;
  paymentMethods?: string[];
  paymentMethodDetails?: PaymentMethodDetails;
  paymentRules?: PaymentRules;
}
