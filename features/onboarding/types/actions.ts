import type { BusinessFormValues } from "@/types/business";
import type {
  PaymentMethodDetails,
  PaymentRules,
} from "@/types/business/onboarding";
import type { CurrencyType } from "@/types";
import type { OnboardingState } from "./state";

export type OnboardingAction =
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "RESET_ONBOARDING" }
  | { type: "LOAD_FROM_STORAGE"; payload: OnboardingState }
  | { type: "SET_BUSINESS_TYPE"; payload: string }
  | { type: "SET_CURRENCY"; payload: CurrencyType }
  | { type: "SET_BUSINESS_INFO"; payload: BusinessFormValues }
  | { type: "SET_PAYMENT_METHODS"; payload: string[] }
  | { type: "SET_PAYMENT_METHOD_DETAILS"; payload: PaymentMethodDetails }
  | { type: "SET_PAYMENT_RULES"; payload: PaymentRules };
