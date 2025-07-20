import { useCallback } from "react";
import { showSuccessToast, showErrorToast } from "@/components/toast-templates";
import { useCompleteUserOnboarding } from "@/hooks/useCompleteUserOnboarding";
import type { OnboardingState } from "../types";

interface UseOnboardingCompletionProps {
  state: OnboardingState;
  goToStep: (step: number) => void;
  clearStorage: () => void;
  resetOnboarding: () => void;
}

export function useOnboardingCompletion({
  state,
  goToStep,
  clearStorage,
  resetOnboarding,
}: UseOnboardingCompletionProps) {
  const {
    mutate: completeOnboardingMutation,
    isPending: isCompletingOnboarding,
    isError,
    error,
  } = useCompleteUserOnboarding({
    onSuccess: () => {
      // Clear local storage and reset state
      clearStorage();
      resetOnboarding();

      // Show success toast
      showSuccessToast("Welcome aboard!", "Onboarding completed successfully!");

      // Navigate to the final step (step 8)
      goToStep(8);

      console.log("Onboarding completed successfully");
    },
    onError: (error) => {
      console.error("Onboarding completion failed:", error);

      // Show error toast with the error message
      showErrorToast(
        "Onboarding Failed",
        error || "Onboarding completion failed. Please try again."
      );
    },
  });

  const completeOnboarding = useCallback(() => {
    // Validate that all required data is present
    if (
      !state.currency ||
      !state.businessInfo ||
      !state.paymentMethods ||
      !state.paymentMethodDetails
    ) {
      console.error("Missing required onboarding data");
      showErrorToast(
        "Incomplete Data",
        "Please complete all required fields before proceeding."
      );
      return;
    }

    // Call the mutation with all collected data
    completeOnboardingMutation({
      currency: state.currency,
      businessInfo: state.businessInfo,
      paymentMethods: state.paymentMethods,
      paymentMethodDetails: state.paymentMethodDetails,
    });
  }, [state, completeOnboardingMutation]);

  const onboardingError = isError
    ? error?.message || "An error occurred"
    : null;

  return {
    completeOnboarding,
    isCompletingOnboarding,
    onboardingError,
  };
}
