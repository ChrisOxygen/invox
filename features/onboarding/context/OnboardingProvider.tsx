"use client";

import React, {
  useReducer,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { OnboardingStateProvider } from "./OnboardingStateContext";
import { OnboardingActionsProvider } from "./OnboardingActionsContext";
import { onboardingReducer, initialState } from "../reducers";
import { useOnboardingStorage } from "../hooks/useOnboardingStorage";
import { useOnboardingActions } from "../hooks/useOnboardingActions";
import { useOnboardingCompletion } from "../hooks/useOnboardingCompletion";

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  const { saveToStorage, loadFromStorage, clearStorage } =
    useOnboardingStorage();
  const hasLoadedFromStorageRef = useRef(false);
  const previousStateRef = useRef<typeof state | null>(null);

  const actions = useOnboardingActions(dispatch);

  const completion = useOnboardingCompletion({
    state,
    goToStep: actions.goToStep,
    clearStorage,
    resetOnboarding: actions.resetOnboarding,
  });

  // Enhanced reset function that also clears storage
  const resetOnboarding = useCallback(() => {
    actions.resetOnboarding();
    clearStorage();
  }, [actions, clearStorage]);

  // Load from storage on mount - only once
  useEffect(() => {
    if (!hasLoadedFromStorageRef.current) {
      const storedState = loadFromStorage();
      if (storedState) {
        actions.loadFromStorage(storedState);
      }
      hasLoadedFromStorageRef.current = true;
    }
  }, [loadFromStorage, actions, hasLoadedFromStorageRef]);

  // Save to storage whenever state changes (but not when loading)
  useEffect(() => {
    // Only save if we've loaded from storage and state has actually changed
    if (
      hasLoadedFromStorageRef.current &&
      (state.currentStep > 1 || state.businessType)
    ) {
      // Check if state has actually changed
      const hasStateChanged =
        previousStateRef.current === null ||
        JSON.stringify(previousStateRef.current) !== JSON.stringify(state);

      if (hasStateChanged) {
        saveToStorage(state);
        previousStateRef.current = state;
      }
    }
  }, [state, saveToStorage]);

  // Memoize actions to prevent unnecessary re-renders
  const memoizedActions = useMemo(
    () => ({
      ...actions,
      resetOnboarding,
      completeOnboarding: completion.completeOnboarding,
    }),
    [actions, resetOnboarding, completion.completeOnboarding]
  );

  return (
    <OnboardingStateProvider value={state}>
      <OnboardingActionsProvider value={memoizedActions}>
        {children}
      </OnboardingActionsProvider>
    </OnboardingStateProvider>
  );
}
