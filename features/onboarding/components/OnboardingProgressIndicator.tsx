import { useOnboardingState } from "../context/OnboardingStateContext";
import { useOnboardingComputedValues } from "../hooks/useOnboardingComputedValues";

function OnboardingProgressIndicator() {
  const state = useOnboardingState();
  const { progressPercentage } = useOnboardingComputedValues(state);

  return (
    <div className="space-y-4 w-full max-w-lg mx-auto px-2 sm:px-4">
      {/* Step Counter */}
      <div className="flex items-center justify-center">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg shadow-blue-200/50">
          <span className="text-sm sm:text-base font-semibold tracking-wide">
            Step {state.currentStep} of {state.totalSteps}
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full">
        {/* Progress Track */}
        <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-sm relative"
            style={{
              width: `${progressPercentage}%`,
            }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="flex justify-center mt-2 sm:mt-3">
          <span className="text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 pt-2">
        {Array.from({ length: state.totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < state.currentStep;
          const isCurrent = stepNumber === state.currentStep;

          return (
            <div
              key={stepNumber}
              className={`
                w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300
                ${
                  isCompleted
                    ? "bg-gradient-to-r from-blue-600 to-cyan-400 shadow-sm"
                    : isCurrent
                    ? "bg-gradient-to-r from-blue-600 to-cyan-400 ring-2 ring-blue-200 ring-offset-1"
                    : "bg-gray-300"
                }
              `}
            />
          );
        })}
      </div>
    </div>
  );
}

export default OnboardingProgressIndicator;
