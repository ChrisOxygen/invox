import { useCallback, Dispatch } from "react";
import type { BusinessFormValues } from "@/types/business";
import type {
  PaymentMethodDetails,
  PaymentRules,
} from "@/types/business/onboarding";
import type { CurrencyType } from "@/types";
import type { OnboardingAction, OnboardingState } from "../types";

export function useOnboardingActions(dispatch: Dispatch<OnboardingAction>) {
  const nextStep = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, [dispatch]);

  const previousStep = useCallback(() => {
    dispatch({ type: "PREVIOUS_STEP" });
  }, [dispatch]);

  const goToStep = useCallback(
    (step: number) => {
      dispatch({ type: "GO_TO_STEP", payload: step });
    },
    [dispatch]
  );

  const setBusinessType = useCallback(
    (businessType: string) => {
      dispatch({ type: "SET_BUSINESS_TYPE", payload: businessType });
    },
    [dispatch]
  );

  const setCurrency = useCallback(
    (currency: CurrencyType) => {
      dispatch({ type: "SET_CURRENCY", payload: currency });
    },
    [dispatch]
  );

  const setBusinessInfo = useCallback(
    (businessInfo: BusinessFormValues) => {
      dispatch({ type: "SET_BUSINESS_INFO", payload: businessInfo });
    },
    [dispatch]
  );

  const setPaymentMethods = useCallback(
    (methods: string[]) => {
      dispatch({ type: "SET_PAYMENT_METHODS", payload: methods });
    },
    [dispatch]
  );

  const setPaymentMethodDetails = useCallback(
    (details: PaymentMethodDetails) => {
      dispatch({ type: "SET_PAYMENT_METHOD_DETAILS", payload: details });
    },
    [dispatch]
  );

  const setPaymentRules = useCallback(
    (rules: PaymentRules) => {
      dispatch({ type: "SET_PAYMENT_RULES", payload: rules });
    },
    [dispatch]
  );

  const resetOnboarding = useCallback(() => {
    dispatch({ type: "RESET_ONBOARDING" });
  }, [dispatch]);

  const loadFromStorage = useCallback(
    (state: OnboardingState) => {
      dispatch({ type: "LOAD_FROM_STORAGE", payload: state });
    },
    [dispatch]
  );

  return {
    nextStep,
    previousStep,
    goToStep,
    setBusinessType,
    setCurrency,
    setBusinessInfo,
    setPaymentMethods,
    setPaymentMethodDetails,
    setPaymentRules,
    resetOnboarding,
    loadFromStorage,
  };
}
