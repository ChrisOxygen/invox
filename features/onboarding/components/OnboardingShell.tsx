'use client'

import type { ReactNode } from 'react'
import { useOnboarding } from '@/features/onboarding/context/OnboardingContext'
import { ProgressBar } from '@/features/onboarding/components/ProgressBar'

const TOTAL_STEPS = 4

interface OnboardingShellProps {
  children: ReactNode
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  const { step } = useOnboarding()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-(--surface-page)">
      {/* Top-left logo */}
      <div className="absolute left-0 top-0 p-6 flex items-center gap-2.5">
        <svg
          width="28"
          height="24"
          viewBox="0 0 28 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="0" y="14" width="6" height="10" rx="2" fill="var(--blue-600)" />
          <rect x="11" y="7" width="6" height="17" rx="2" fill="var(--blue-600)" />
          <rect x="22" y="0" width="6" height="24" rx="2" fill="var(--cyan-400)" />
        </svg>
        <span className="font-display font-extrabold tracking-tight text-[20px] text-(--ink-900)">
          Invox<span className="text-(--blue-600)">.</span>
        </span>
      </div>

      {/* Centered card */}
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-lg shadow-sm bg-(--surface-base) rounded-xl border border-(--border-default) p-8">
          {/* Only show progress bar during steps 1–4 */}
          {step >= 1 && step <= TOTAL_STEPS && (
            <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
