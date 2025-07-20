import { OnboardingState, OnboardingAction } from "../types";
import { TOTAL_STEPS } from "../constants";

export const initialState: OnboardingState = {
  currentStep: 1,
  totalSteps: TOTAL_STEPS,
  isCompleted: false,
};

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "NEXT_STEP":
      if (state.currentStep < state.totalSteps) {
        return {
          ...state,
          currentStep: state.currentStep + 1,
        };
      }
      return state;

    case "PREVIOUS_STEP":
      if (state.currentStep > 1) {
        return {
          ...state,
          currentStep: state.currentStep - 1,
        };
      }
      return state;

    case "GO_TO_STEP":
      if (action.payload >= 1 && action.payload <= state.totalSteps) {
        return {
          ...state,
          currentStep: action.payload,
        };
      }
      return state;

    case "RESET_ONBOARDING":
      return initialState;

    case "LOAD_FROM_STORAGE":
      return action.payload;

    case "SET_BUSINESS_TYPE":
      return {
        ...state,
        businessType: action.payload,
      };

    case "SET_CURRENCY":
      return {
        ...state,
        currency: action.payload,
        // Reset future steps when currency changes
        paymentMethods: undefined,
        paymentMethodDetails: undefined,
        paymentRules: undefined,
      };

    case "SET_BUSINESS_INFO":
      return {
        ...state,
        businessInfo: action.payload,
      };

    case "SET_PAYMENT_METHODS":
      return {
        ...state,
        paymentMethods: action.payload,
      };

    case "SET_PAYMENT_METHOD_DETAILS":
      return {
        ...state,
        paymentMethodDetails: action.payload,
      };

    case "SET_PAYMENT_RULES":
      return {
        ...state,
        paymentRules: action.payload,
        isCompleted: true,
      };

    default:
      return state;
  }
}
