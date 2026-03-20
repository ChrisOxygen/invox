'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useOnboarding } from '@/features/onboarding/context/OnboardingContext'
import { _createFirstClient } from '@/features/onboarding/server'

// ─── Schema ──────────────────────────────────────────────────────────────────

const ZStep2Schema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
})

type ZStep2 = z.infer<typeof ZStep2Schema>

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  id: string
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}

function Field({ id, label, optional, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-baseline gap-1.5 text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--ink-700)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {label}
        {optional && (
          <span
            className="text-[11px] font-[400] normal-case tracking-normal text-[var(--ink-300)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          className="text-[11px] text-[var(--error)]"
          style={{ fontFamily: 'var(--font-body)' }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Step2FirstClient() {
  const { nextStep } = useOnboarding()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZStep2>({
    resolver: zodResolver(ZStep2Schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
    },
  })

  async function onSubmit(values: ZStep2) {
    setServerError(null)
    const result = await _createFirstClient({
      name: values.name,
      ...(values.email ? { email: values.email } : {}),
      ...(values.phone ? { phone: values.phone } : {}),
      ...(values.company ? { company: values.company } : {}),
    })
    if (result.error) {
      setServerError(result.error)
      return
    }
    nextStep()
  }

  return (
    <div>
      {/* Heading block */}
      <h1
        className="text-[24px] font-[800] leading-[1.2] tracking-[-0.025em] text-[var(--ink-900)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Add your first client
      </h1>
      <p
        className="mt-1.5 text-[14px] text-[var(--ink-400)]"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        You&apos;ll need a client to create an invoice.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mt-8 flex flex-col gap-4">
          {/* Client name — required */}
          <Field id="clientName" label="Client name" error={errors.name?.message}>
            <input
              id="clientName"
              type="text"
              placeholder="Acme Corp"
              aria-describedby={errors.name ? 'clientName-error' : undefined}
              aria-invalid={!!errors.name}
              {...register('name')}
              className="h-[44px] w-full rounded-[var(--r-md)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] transition-colors duration-[var(--motion-fast)] focus:border-[var(--blue-600)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-600)]/20 aria-invalid:border-[var(--error)] aria-invalid:ring-2 aria-invalid:ring-[var(--error)]/20"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </Field>

          {/* Email — optional */}
          <Field id="clientEmail" label="Email" optional error={errors.email?.message}>
            <input
              id="clientEmail"
              type="email"
              placeholder="client@company.com"
              aria-describedby={errors.email ? 'clientEmail-error' : undefined}
              aria-invalid={!!errors.email}
              {...register('email')}
              className="h-[44px] w-full rounded-[var(--r-md)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] transition-colors duration-[var(--motion-fast)] focus:border-[var(--blue-600)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-600)]/20 aria-invalid:border-[var(--error)] aria-invalid:ring-2 aria-invalid:ring-[var(--error)]/20"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </Field>

          {/* Phone — optional */}
          <Field id="clientPhone" label="Phone" optional error={errors.phone?.message}>
            <input
              id="clientPhone"
              type="tel"
              placeholder="+234 800 000 0000"
              {...register('phone')}
              className="h-[44px] w-full rounded-[var(--r-md)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] transition-colors duration-[var(--motion-fast)] focus:border-[var(--blue-600)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-600)]/20"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </Field>

          {/* Company — optional */}
          <Field id="clientCompany" label="Company" optional error={errors.company?.message}>
            <input
              id="clientCompany"
              type="text"
              placeholder="Acme Corporation"
              {...register('company')}
              className="h-[44px] w-full rounded-[var(--r-md)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] transition-colors duration-[var(--motion-fast)] focus:border-[var(--blue-600)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-600)]/20"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </Field>
        </div>

        {/* Server error */}
        {serverError && (
          <div
            className="mt-4 rounded-[var(--r-md)] border border-[var(--error)]/20 bg-[var(--error)]/5 px-4 py-3"
            role="alert"
          >
            <p
              className="text-[13px] text-[var(--error)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {serverError}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[var(--r-md)] bg-[var(--blue-600)] text-[14px] font-[600] text-white transition-colors duration-[var(--motion-base)] hover:bg-[var(--blue-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-600)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={isSubmitting}
            className="text-[13px] text-[var(--ink-400)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--ink-700)] focus-visible:outline-none focus-visible:underline disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  )
}
