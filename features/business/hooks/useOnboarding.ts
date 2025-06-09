"use client";

import { useBusiness } from "./useBusiness";

export function useOnboarding() {
  const { hasBusiness, isLoading, isPending, isError, error } = useBusiness();
  const onboardingDataPending = isPending || isLoading;
  const onboardingDataError = isError && error;

  return {
    hasBusiness,
    onboardingDataPending,
    onboardingDataError,
  };
}
