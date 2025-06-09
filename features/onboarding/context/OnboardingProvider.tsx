"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useCompleteUserOnboarding } from "@/hooks/useCompleteUserOnboarding";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Import types from the new type structure
import { BusinessFormValues } from "@/types/business";
import {
  PaymentMethodDetails,
  PaymentRules,
} from "@/types/business/onboarding";
import { CurrencyType } from "@/types";

// Types
interface OnboardingState {
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

interface StorageData {
  state: OnboardingState;
  timestamp: number;
  expiryDate: number;
}

type OnboardingAction =
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

interface OnboardingContextType {
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

// Initial state
const initialState: OnboardingState = {
  currentStep: 1,
  totalSteps: 8, // Updated from 7 to 8
  isCompleted: false,
};

// Storage key
const STORAGE_KEY = "invox_onboarding_progress";
const EXPIRY_DAYS = 4;

// Reducer
function onboardingReducer(
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

    // Remove SET_LOCATION case entirely

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

// Save to localStorage with expiry
function saveToStorage(state: OnboardingState) {
  try {
    const now = Date.now();
    const expiryDate = now + EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 4 days from now

    const storageData: StorageData = {
      state,
      timestamp: now,
      expiryDate,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error("Failed to save onboarding progress to localStorage:", error);
  }
}

// Load from localStorage with expiry check
function loadFromStorage(): OnboardingState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedData: StorageData = JSON.parse(stored);
      const now = Date.now();

      // Check if data has expired
      if (now > parsedData.expiryDate) {
        console.log("Onboarding data expired, removing from storage");
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      // Validate the loaded state structure
      const parsedState = parsedData.state;
      if (
        typeof parsedState.currentStep === "number" &&
        typeof parsedState.totalSteps === "number" &&
        typeof parsedState.isCompleted === "boolean"
      ) {
        return parsedState;
      }
    }
  } catch (error) {
    console.error(
      "Failed to load onboarding progress from localStorage:",
      error
    );
    // Remove corrupted data
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

// Context
const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

// Provider
interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  const queryClient = useQueryClient();

  // Complete onboarding hook
  const {
    mutate: completeOnboardingMutation,
    isPending: isCompletingOnboarding,
    isError,
    error,
  } = useCompleteUserOnboarding({
    onSuccess: () => {
      // Clear local storage and reset state
      localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "RESET_ONBOARDING" });

      // Invalidate queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["business"] });
      queryClient.invalidateQueries({ queryKey: ["paymentAccounts"] });

      // Show success toast
      toast.success("Onboarding completed successfully!");

      // Navigate to the final step (step 8)
      dispatch({ type: "GO_TO_STEP", payload: 8 });

      console.log("Onboarding completed successfully");
    },
    onError: (error) => {
      console.error("Onboarding completion failed:", error);

      // Show error toast with the error message
      toast.error(error || "Onboarding completion failed. Please try again.");
    },
  });

  // Load from storage on mount
  useEffect(() => {
    const storedState = loadFromStorage();
    if (storedState) {
      dispatch({ type: "LOAD_FROM_STORAGE", payload: storedState });
    }
  }, []);

  // Save to storage whenever state changes (but not when loading)
  useEffect(() => {
    if (state.currentStep > 1 || state.businessType) {
      saveToStorage(state);
    }
  }, [state]);

  // Action creators - now synchronous
  const nextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const previousStep = () => {
    dispatch({ type: "PREVIOUS_STEP" });
  };

  const goToStep = (step: number) => {
    dispatch({ type: "GO_TO_STEP", payload: step });
  };

  const setBusinessType = (businessType: string) => {
    dispatch({ type: "SET_BUSINESS_TYPE", payload: businessType });
  };

  const setCurrency = (currency: CurrencyType) => {
    dispatch({ type: "SET_CURRENCY", payload: currency });
  };

  // Remove setLocation function entirely

  const setBusinessInfo = (businessInfo: BusinessFormValues) => {
    dispatch({ type: "SET_BUSINESS_INFO", payload: businessInfo });
  };

  const setPaymentMethods = (methods: string[]) => {
    dispatch({ type: "SET_PAYMENT_METHODS", payload: methods });
  };

  const setPaymentMethodDetails = (details: PaymentMethodDetails) => {
    dispatch({ type: "SET_PAYMENT_METHOD_DETAILS", payload: details });
  };

  const setPaymentRules = (rules: {
    paymentTerms: string;
    lateFee: string;
    invoiceNotes: string;
  }) => {
    dispatch({ type: "SET_PAYMENT_RULES", payload: rules });
  };

  const resetOnboarding = () => {
    dispatch({ type: "RESET_ONBOARDING" });
    localStorage.removeItem(STORAGE_KEY);
  };

  // Complete onboarding function
  const completeOnboarding = () => {
    // Validate that all required data is present
    if (
      !state.currency ||
      !state.businessInfo ||
      !state.paymentMethods ||
      !state.paymentMethodDetails ||
      !state.paymentRules
    ) {
      console.error("Missing required onboarding data");
      toast.error("Please complete all required fields before proceeding.");
      return;
    }

    // Call the mutation with all collected data
    completeOnboardingMutation({
      // Remove country from here
      currency: state.currency,
      businessInfo: state.businessInfo,
      paymentMethods: state.paymentMethods,
      paymentMethodDetails: state.paymentMethodDetails,
      paymentRules: state.paymentRules,
    });
  };

  // Computed values - simplified progress calculation
  const canGoToNextStep = state.currentStep < state.totalSteps;
  const canGoToPreviousStep = state.currentStep > 1;

  // Progress based on current step (more accurate than completed steps)
  const progressPercentage = ((state.currentStep - 1) / state.totalSteps) * 100;

  const value: OnboardingContextType = {
    state,
    nextStep,
    previousStep,
    goToStep,
    setBusinessType,
    setCurrency,
    // Remove setLocation from value
    setBusinessInfo,
    setPaymentMethods,
    setPaymentMethodDetails,
    setPaymentRules,
    resetOnboarding,
    canGoToNextStep,
    canGoToPreviousStep,
    progressPercentage,
    // Onboarding completion
    completeOnboarding,
    isCompletingOnboarding,
    onboardingError: isError ? error?.message || "An error occurred" : null,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Hook
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
