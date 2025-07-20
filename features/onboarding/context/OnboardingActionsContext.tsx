"use client";

import React, { createContext, useContext, ReactNode } from "react";
import type { BusinessFormValues } from "@/types/business";
import type {
  PaymentMethodDetails,
  PaymentRules,
} from "@/types/business/onboarding";
import type { CurrencyType } from "@/types";

interface OnboardingActionsContextType {
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
  completeOnboarding: () => void;
}

const OnboardingActionsContext = createContext<
  OnboardingActionsContextType | undefined
>(undefined);

interface OnboardingActionsProviderProps {
  children: ReactNode;
  value: OnboardingActionsContextType;
}

export function OnboardingActionsProvider({
  children,
  value,
}: OnboardingActionsProviderProps) {
  return (
    <OnboardingActionsContext.Provider value={value}>
      {children}
    </OnboardingActionsContext.Provider>
  );
}

export function useOnboardingActions() {
  const context = useContext(OnboardingActionsContext);
  if (context === undefined) {
    throw new Error(
      "useOnboardingActions must be used within an OnboardingActionsProvider"
    );
  }
  return context;
}
