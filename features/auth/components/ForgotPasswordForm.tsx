'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { EmailSentConfirmation } from './EmailSentConfirmation'
import { _sendResetEmail } from '@/features/auth/server'

const ZForgotPasswordSchema = z.object({
  email: z.email(),
})

type ZForgotPassword = z.infer<typeof ZForgotPasswordSchema>

type FormState = 'form' | 'sent'

export function ForgotPasswordForm() {
  const [formState, setFormState] = useState<FormState>('form')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZForgotPassword>({
    resolver: zodResolver(ZForgotPasswordSchema),
  })

  const onSubmit = async (data: ZForgotPassword) => {
    setServerError(null)
    const result = await _sendResetEmail(data.email)
    if (result?.error) {
      setServerError(result.error)
    } else {
      setSubmittedEmail(data.email)
      setFormState('sent')
    }
  }

  const handleResend = () => {
    setFormState('form')
  }

  if (formState === 'sent') {
    return <EmailSentConfirmation email={submittedEmail} onResend={handleResend} />
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Back link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 font-[family-name:var(--font-body)] transition-colors w-fit"
        style={{ fontSize: 13, color: 'var(--ink-400)', textDecoration: 'none' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-900)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-400)')}
      >
        <ArrowLeft size={13} strokeWidth={2} />
        Back to sign in
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1
          className="font-[family-name:var(--font-display)]"
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--ink-900)',
            lineHeight: 1.15,
          }}
        >
          Forgot your password?
        </h1>
        <p
          className="font-[family-name:var(--font-body)]"
          style={{ fontSize: 15, color: 'var(--ink-400)', lineHeight: 1.6 }}
        >
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {serverError && (
          <div className="rounded-[var(--r-md)] bg-[color-mix(in_srgb,var(--error)_10%,transparent)] border border-[color-mix(in_srgb,var(--error)_30%,transparent)] px-4 py-3">
            <p className="text-[13px] font-[family-name:var(--font-body)] text-[var(--error)]">{serverError}</p>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="email"
            className="font-[family-name:var(--font-display)]"
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-900)' }}
          >
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="font-[family-name:var(--font-body)]"
            style={{
              height: 42,
              borderRadius: 'var(--r-md)',
              borderColor: errors.email ? 'var(--error)' : 'var(--border-default)',
              fontSize: 14,
              color: 'var(--ink-900)',
              paddingLeft: 14,
              paddingRight: 14,
            }}
            {...register('email')}
          />
          {errors.email && (
            <p
              className="font-[family-name:var(--font-body)]"
              style={{ fontSize: 11, color: 'var(--error)', marginTop: 2 }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-[family-name:var(--font-display)]"
          style={{
            height: 42,
            borderRadius: 'var(--r-md)',
            backgroundColor: 'var(--blue-600)',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
          }}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>
    </div>
  )
}
