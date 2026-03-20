import { OnboardingProvider } from '@/features/onboarding/context/OnboardingContext'
import { OnboardingShell } from '@/features/onboarding/components/OnboardingShell'
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingShell>
        <OnboardingWizard />
      </OnboardingShell>
    </OnboardingProvider>
  )
}
