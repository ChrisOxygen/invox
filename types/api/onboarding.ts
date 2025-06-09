import { BaseResponse } from "./index";
import { CompleteOnboardingRequest } from "@/types/business/onboarding";

export interface OnboardingResponse extends BaseResponse {
  user?: {
    id: string;
    email: string;
    name: string;
    currency?: string;
    onboardingCompleted: boolean;
  };
}

export interface CompleteOnboardingApiRequest
  extends CompleteOnboardingRequest {}

export interface UpdateOnboardingStepRequest {
  step: string;
  data: Record<string, any>;
}

export interface GetOnboardingStatusResponse extends BaseResponse {
  currentStep?: string;
  completedSteps?: string[];
  data?: Record<string, any>;
}
