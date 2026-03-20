'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface ProfilePreview {
  businessName: string
  logoUrl: string | null
}

interface OnboardingContextValue {
  step: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (n: number) => void
  profilePreview: ProfilePreview
  setProfilePreview: (data: ProfilePreview) => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1)
  const [profilePreview, setProfilePreview] = useState<ProfilePreview>({
    businessName: '',
    logoUrl: null,
  })

  function nextStep() {
    setStep((s) => s + 1)
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1))
  }

  function goToStep(n: number) {
    setStep(n)
  }

  return (
    <OnboardingContext.Provider
      value={{ step, nextStep, prevStep, goToStep, profilePreview, setProfilePreview }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext)
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return ctx
}
