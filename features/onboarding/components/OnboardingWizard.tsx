'use client'

import { useOnboarding } from '@/features/onboarding/context/OnboardingContext'
import { Step1BusinessProfile } from '@/features/onboarding/components/Step1BusinessProfile'
import { Step2FirstClient } from '@/features/onboarding/components/Step2FirstClient'
import { Step3InvoicePreview } from '@/features/onboarding/components/Step3InvoicePreview'
import { Step4BankDetails } from '@/features/onboarding/components/Step4BankDetails'
import { StepDone } from '@/features/onboarding/components/StepDone'

export function OnboardingWizard() {
  const { step } = useOnboarding()

  return (
    <div>
      {step === 1 && <Step1BusinessProfile />}
      {step === 2 && <Step2FirstClient />}
      {step === 3 && <Step3InvoicePreview />}
      {step === 4 && <Step4BankDetails />}
      {step === 5 && <StepDone />}
    </div>
  )
}
