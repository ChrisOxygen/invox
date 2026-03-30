'use client'

import { useTransition } from 'react'
import { CheckCircle2, FileText, LayoutDashboard, Loader2, Users } from 'lucide-react'
import { useOnboarding } from '@/features/onboarding/context/OnboardingContext'
import { _completeOnboarding } from '@/features/onboarding/server'
import { Button } from '@/shared/components/ui/button'

const QUICK_ACCESS_CARDS = [
  {
    icon: FileText,
    label: 'Create invoice',
    bgClass: 'bg-(--blue-50)',
    iconClass: 'text-(--ink-500)',
  },
  {
    icon: Users,
    label: 'Add a client',
    bgClass: 'bg-(--ink-50)',
    iconClass: 'text-(--ink-500)',
  },
  {
    icon: LayoutDashboard,
    label: 'View dashboard',
    bgClass: 'bg-(--ink-50)',
    iconClass: 'text-(--ink-500)',
  },
] as const

export function StepDone() {
  const { profilePreview } = useOnboarding()
  const [isPending, startTransition] = useTransition()

  // Extract first word as first name
  const firstName = profilePreview.businessName
    ? profilePreview.businessName.split(' ')[0]
    : null

  function handleGoToDashboard() {
    startTransition(async () => {
      await _completeOnboarding()
    })
  }

  return (
    <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-2">
      {/* Success circle */}
      <div
        className="flex items-center justify-center w-20 h-20 rounded-full mb-5"
        style={{ backgroundColor: 'color-mix(in srgb, var(--success) 12%, transparent)' }}
      >
        <CheckCircle2 size={40} className="text-(--success)" aria-hidden="true" />
      </div>

      {/* Heading */}
      <h2 className="font-display font-extrabold text-[28px] text-(--ink-900) tracking-h2 mb-2">
        {firstName ? `You're all set, ${firstName}! 🎉` : "You're all set! 🎉"}
      </h2>

      {/* Body */}
      <p className="font-body text-[15px] text-(--ink-400) max-w-75 leading-[1.55] mx-auto">
        Your Invox account is ready. Time to send your first invoice.
      </p>

      {/* Quick-access cards */}
      <div className="grid grid-cols-3 w-full mt-8 gap-3">
        {QUICK_ACCESS_CARDS.map(({ icon: Icon, label, bgClass, iconClass }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 bg-(--surface-base) border border-(--border-default) rounded-lg p-4"
          >
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-md ${bgClass}`}
            >
              <Icon size={18} className={iconClass} aria-hidden="true" />
            </div>
            <span className="font-display font-semibold text-[12px] text-(--ink-700) leading-[1.3]">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        className="w-full h-11 font-display font-semibold mt-8"
        onClick={handleGoToDashboard}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Taking you there…
          </>
        ) : (
          'Go to Dashboard'
        )}
      </Button>
    </div>
  )
}
