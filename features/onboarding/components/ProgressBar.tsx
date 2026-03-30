interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const fillPercent = (currentStep / (totalSteps + 1)) * 100

  return (
    <div className="mb-8">
      {/* Track */}
      <div
        className="relative w-full h-[6px] overflow-hidden rounded-(--r-sm) bg-(--ink-100)"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        {/* Fill */}
        <div
          className="h-full rounded-(--r-sm) bg-(--blue-600) transition-[width] duration-[350ms] ease-[ease]"
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      {/* Step label */}
      <p className="mt-2 text-right font-[family-name:var(--font-body)] text-[11px] text-(--ink-300)">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  )
}
