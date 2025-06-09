import { OnboardingState } from "../context/OnboardingProvider";

type OnboardingProgressIndicatorProps = {
  state: OnboardingState;
};

function OnboardingProgressIndicator({
  state,
}: OnboardingProgressIndicatorProps) {
  return (
    <div className="space-y-3 w-full max-w-[500px]">
      <div className="flex items-center justify-center gap-2 text-sm font-inter text-gray-500">
        <span>
          Step {state.currentStep} of {state.totalSteps}
        </span>
      </div>
      <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
        <div
          className="bg-gray-900 h-2 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${(state.currentStep / state.totalSteps) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

export default OnboardingProgressIndicator;
