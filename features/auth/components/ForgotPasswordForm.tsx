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
        className="inline-flex items-center gap-1.5 font-sans text-[13px] text-(--ink-400) no-underline transition-colors w-fit hover:text-(--ink-900)"
      >
        <ArrowLeft size={13} strokeWidth={2} />
        Back to sign in
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-[800] tracking-[-0.025em] text-(--ink-900) leading-[1.15]">
          Forgot your password?
        </h1>
        <p className="font-sans text-[15px] text-(--ink-400) leading-[1.6]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {serverError && (
          <div className="rounded-md bg-[color-mix(in_srgb,var(--error)_10%,transparent)] border border-[color-mix(in_srgb,var(--error)_30%,transparent)] px-4 py-3">
            <p className="text-[13px] font-sans text-(--error)">{serverError}</p>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="email"
            className="font-display text-[12px] font-semibold text-(--ink-900)"
          >
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="font-sans text-[14px] text-(--ink-900) h-10.5 rounded-md pl-3.5 pr-3.5 border-(--border-default) aria-[invalid=true]:border-(--error)"
            {...register('email')}
          />
          {errors.email && (
            <p className="font-sans text-[11px] text-(--error) mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-display text-[14px] font-semibold bg-(--blue-600) text-white border-0 h-10.5 rounded-md"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>
    </div>
  )
}
