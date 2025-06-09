import { OnboardingProvider } from "@/features/onboarding/context/OnboardingProvider";
import React from "react";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}

export default OnboardingLayout;
