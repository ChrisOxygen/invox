import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'
import { OnboardingProvider } from '@/features/onboarding/context/OnboardingContext'
import { OnboardingShell } from '@/features/onboarding/components/OnboardingShell'
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { onboardingDone: true },
  })

  if (profile?.onboardingDone) redirect('/dashboard')

  return (
    <OnboardingProvider>
      <OnboardingShell>
        <OnboardingWizard />
      </OnboardingShell>
    </OnboardingProvider>
  )
}
