import { useMemo } from "react";
import type { OnboardingState } from "../types";

export function useOnboardingComputedValues(state: OnboardingState) {
  const canGoToNextStep = useMemo(
    () => state.currentStep < state.totalSteps,
    [state.currentStep, state.totalSteps]
  );

  const canGoToPreviousStep = useMemo(
    () => state.currentStep > 1,
    [state.currentStep]
  );

  const progressPercentage = useMemo(
    () => ((state.currentStep - 1) / state.totalSteps) * 100,
    [state.currentStep, state.totalSteps]
  );

  const isValidForCompletion = useMemo(
    () =>
      Boolean(
        state.currency &&
          state.businessInfo &&
          state.paymentMethods &&
          state.paymentMethodDetails
      ),
    [
      state.currency,
      state.businessInfo,
      state.paymentMethods,
      state.paymentMethodDetails,
    ]
  );

  return {
    canGoToNextStep,
    canGoToPreviousStep,
    progressPercentage,
    isValidForCompletion,
  };
}
