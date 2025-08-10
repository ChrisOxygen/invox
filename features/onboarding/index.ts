// Main exports for the onboarding feature
export { OnboardingProvider } from "./context/OnboardingProvider";

// Separate context exports for granular control
export {
  OnboardingStateProvider,
  useOnboardingState,
} from "./context/OnboardingStateContext";
export {
  OnboardingActionsProvider,
  useOnboardingActions as useOnboardingActionsContext,
} from "./context/OnboardingActionsContext";

// Action exports
export * from "./actions";

// Hook exports
export * from "./hooks";

// Type exports
export type * from "./types";

// Constants
export * from "./constants";
