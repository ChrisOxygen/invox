"use client";

import React, { createContext, useContext, ReactNode } from "react";
import type { OnboardingState } from "../types";

const OnboardingStateContext = createContext<OnboardingState | undefined>(
  undefined
);

interface OnboardingStateProviderProps {
  children: ReactNode;
  value: OnboardingState;
}

export function OnboardingStateProvider({
  children,
  value,
}: OnboardingStateProviderProps) {
  return (
    <OnboardingStateContext.Provider value={value}>
      {children}
    </OnboardingStateContext.Provider>
  );
}

export function useOnboardingState() {
  const context = useContext(OnboardingStateContext);
  if (context === undefined) {
    throw new Error(
      "useOnboardingState must be used within an OnboardingStateProvider"
    );
  }
  return context;
}
