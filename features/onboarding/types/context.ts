import type { BusinessFormValues } from "@/types/business";
import type {
  PaymentMethodDetails,
  PaymentRules,
} from "@/types/business/onboarding";
import type { CurrencyType } from "@/types";
import type { OnboardingState } from "./state";

export interface OnboardingContextType {
  state: OnboardingState;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  setBusinessType: (businessType: string) => void;
  setCurrency: (currency: CurrencyType) => void;
  setBusinessInfo: (businessInfo: BusinessFormValues) => void;
  setPaymentMethods: (methods: string[]) => void;
  setPaymentMethodDetails: (details: PaymentMethodDetails) => void;
  setPaymentRules: (rules: PaymentRules) => void;
  resetOnboarding: () => void;
  canGoToNextStep: boolean;
  canGoToPreviousStep: boolean;
  progressPercentage: number;
  // Onboarding completion
  completeOnboarding: () => void;
  isCompletingOnboarding: boolean;
  onboardingError: string | null;
}
