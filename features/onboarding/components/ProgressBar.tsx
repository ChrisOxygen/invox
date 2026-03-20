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
        className="relative w-full overflow-hidden"
        style={{
          height: '6px',
          borderRadius: 'var(--r-sm)',
          backgroundColor: 'var(--ink-100)',
        }}
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        {/* Fill */}
        <div
          style={{
            height: '100%',
            width: `${fillPercent}%`,
            borderRadius: 'var(--r-sm)',
            backgroundColor: 'var(--blue-600)',
            transition: 'width 350ms ease',
          }}
        />
      </div>

      {/* Step label */}
      <p
        className="mt-2 text-right font-[family-name:var(--font-body)]"
        style={{
          fontSize: '11px',
          color: 'var(--ink-300)',
        }}
      >
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  )
}
