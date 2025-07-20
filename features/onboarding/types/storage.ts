import type { OnboardingState } from "./state";

export interface StorageData {
  state: OnboardingState;
  timestamp: number;
  expiryDate: number;
}
