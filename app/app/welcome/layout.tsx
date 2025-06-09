import { OnboardingProvider } from "@/features/onboarding/context/OnboardingProvider";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}

export default OnboardingLayout;
