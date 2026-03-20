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
    bgColor: 'var(--blue-50)',
    iconColor: 'var(--blue-600)',
  },
  {
    icon: Users,
    label: 'Add a client',
    bgColor: 'var(--ink-50)',
    iconColor: 'var(--ink-500)',
  },
  {
    icon: LayoutDashboard,
    label: 'View dashboard',
    bgColor: 'var(--ink-50)',
    iconColor: 'var(--ink-500)',
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
    <div
      className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ paddingTop: '8px', paddingBottom: '8px' }}
    >
      {/* Success circle */}
      <div
        className="flex items-center justify-center"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'color-mix(in srgb, var(--success) 12%, transparent)',
          marginBottom: 'var(--s5)',
        }}
      >
        <CheckCircle2
          size={40}
          style={{ color: 'var(--success)' }}
          aria-hidden="true"
        />
      </div>

      {/* Heading */}
      <h2
        className="font-[family-name:var(--font-display)] font-extrabold"
        style={{
          fontSize: '28px',
          color: 'var(--ink-900)',
          letterSpacing: '-0.025em',
          marginBottom: 'var(--s2)',
        }}
      >
        {firstName ? `You're all set, ${firstName}! 🎉` : "You're all set! 🎉"}
      </h2>

      {/* Body */}
      <p
        className="font-[family-name:var(--font-body)] mx-auto"
        style={{
          fontSize: '15px',
          color: 'var(--ink-400)',
          maxWidth: '300px',
          lineHeight: '1.55',
        }}
      >
        Your Invox account is ready. Time to send your first invoice.
      </p>

      {/* Quick-access cards */}
      <div
        className="grid w-full mt-8"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s3)' }}
      >
        {QUICK_ACCESS_CARDS.map(({ icon: Icon, label, bgColor, iconColor }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2"
            style={{
              backgroundColor: 'var(--surface-base)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--r-lg)',
              padding: 'var(--s4)',
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--r-md)',
                backgroundColor: bgColor,
              }}
            >
              <Icon size={18} style={{ color: iconColor }} aria-hidden="true" />
            </div>
            <span
              className="font-[family-name:var(--font-display)] font-semibold"
              style={{ fontSize: '12px', color: 'var(--ink-700)', lineHeight: '1.3' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        className="w-full font-[family-name:var(--font-display)] font-semibold mt-8"
        style={{ height: '44px' }}
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
