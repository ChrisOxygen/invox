import { useCallback } from "react";
import type { OnboardingState, StorageData } from "../types";
import { STORAGE_KEY, EXPIRY_DAYS } from "../constants";

export function useOnboardingStorage() {
  // Save to localStorage with expiry
  const saveToStorage = useCallback((state: OnboardingState) => {
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
      console.error(
        "Failed to save onboarding progress to localStorage:",
        error
      );
    }
  }, []);

  // Load from localStorage with expiry check
  const loadFromStorage = useCallback((): OnboardingState | null => {
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
  }, []);

  // Clear storage
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear onboarding storage:", error);
    }
  }, []);

  return {
    saveToStorage,
    loadFromStorage,
    clearStorage,
  };
}
