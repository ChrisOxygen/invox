"use client";

import InBoxLoader from "@/components/InBoxLoader";
import Step1 from "@/features/onboarding/components/onboarding-steps/Step1";
import Step2 from "@/features/onboarding/components/onboarding-steps/Step2";
import Step3 from "@/features/onboarding/components/onboarding-steps/Step3";
import Step4 from "@/features/onboarding/components/onboarding-steps/Step4";
import Step5 from "@/features/onboarding/components/onboarding-steps/Step5";
import Step6 from "@/features/onboarding/components/onboarding-steps/Step6";
import Step7 from "@/features/onboarding/components/onboarding-steps/Step7";
import OnboardingProgressIndicator from "@/features/onboarding/components/OnboardingProgressIndicator";
import { useOnboarding } from "@/features/onboarding/context/OnboardingProvider";
import { useUser } from "@/hooks/useUser";

function UserOnboardingPage() {
  const { isPending: gettingUser, isError } = useUser();
  const { state } = useOnboarding();

  const currentStep = state.currentStep;

  if (gettingUser) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <InBoxLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <p className="font-inter text-gray-600 text-center">
          Error loading business data
        </p>
      </div>
    );
  }

  console.log("Onboarding state:", state);

  return (
    <main className="bg-[url('/assets/freelancer-bg-3.png')] bg-cover bg-center relative w-full min-h-screen">
      {/* Background overlay */}
      <span className="bg-white/95 absolute inset-0"></span>

      {/* Main container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Progress indicator - fixed height on mobile, responsive spacing */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-4 md:px-8 md:pt-8 md:pb-6 lg:px-12 lg:pt-12 lg:pb-8">
          <div className="flex justify-center">
            <OnboardingProgressIndicator state={state} />
          </div>
        </div>

        {/* Step content - takes remaining space */}
        <div className="flex-1 flex items-center justify-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:px-12 lg:pb-12">
          <div className="w-full flex justify-center max-w-4xl mx-auto">
            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 />}
            {currentStep === 4 && <Step4 />}
            {currentStep === 5 && <Step5 />}
            {currentStep === 6 && <Step6 />}
            {currentStep === 7 && <Step7 />}
          </div>
        </div>
      </div>
    </main>
  );
}

export default UserOnboardingPage;
