'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { _signUp, _signInWithGoogle } from '@/features/auth/server'

const ZRegisterSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms: z.literal(true, { error: 'You must accept the terms to continue' }),
})

type ZRegister = z.infer<typeof ZRegisterSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showVerification, setShowVerification] = useState(false)
  const [emailForVerification, setEmailForVerification] = useState('')
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZRegister>({
    resolver: zodResolver(ZRegisterSchema),
  })

  async function onSubmit(data: ZRegister) {
    setServerError(null)
    const result = await _signUp(data.email, data.password, data.name)
    if (result?.error) {
      setServerError(result.error)
    } else {
      setEmailForVerification(data.email)
      setShowVerification(true)
    }
  }

  function handleGoogleSignIn() {
    startTransition(async () => {
      const result = await _signInWithGoogle()
      if (result?.error) setServerError(result.error)
    })
  }

  if (showVerification) {
    return (
      <div className="w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
             style={{ background: 'color-mix(in srgb, var(--blue-600) 12%, transparent)' }}>
          <Mail className="w-7 h-7 text-[var(--blue-600)]" />
        </div>
        <div>
          <h2 className="text-[24px] font-[family-name:var(--font-display)] font-bold text-[var(--ink-900)] mb-2" style={{ letterSpacing: '-0.02em' }}>
            Check your inbox
          </h2>
          <p className="text-[14px] font-[family-name:var(--font-body)] text-[var(--ink-400)] leading-relaxed">
            We sent a verification link to <span className="font-semibold text-[var(--ink-700)]">{emailForVerification}</span>.<br />
            Click the link to activate your account.
          </p>
        </div>
        <Link href="/login" className="inline-block text-[13px] font-[family-name:var(--font-body)] text-[var(--blue-600)] hover:text-[var(--blue-700)]">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <h1
          className="text-[32px] font-[family-name:var(--font-display)] font-extrabold text-[var(--ink-900)] leading-tight mb-2"
          style={{ letterSpacing: '-0.03em' }}
        >
          Create your account
        </h1>
        <p
          className="text-[14px] font-[family-name:var(--font-body)] font-normal text-[var(--ink-400)]"
        >
          Start sending professional invoices today
        </p>
      </div>

      {/* Google OAuth button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 h-11 rounded-[var(--r-md)] border border-[var(--border-strong)] bg-[var(--surface-base)] text-[14px] font-[family-name:var(--font-body)] font-medium text-[var(--ink-700)] transition-colors duration-[200ms] hover:bg-[var(--surface-overlay)] hover:border-[var(--ink-300)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-600)] focus-visible:ring-offset-2"
      >
        {/* Google G SVG */}
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[var(--border-default)]" />
        <span
          className="text-[12px] font-[family-name:var(--font-body)] text-[var(--ink-300)] px-1"
        >
          or
        </span>
        <div className="flex-1 h-px bg-[var(--border-default)]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {serverError && (
          <div className="rounded-[var(--r-md)] bg-[color-mix(in_srgb,var(--error)_10%,transparent)] border border-[color-mix(in_srgb,var(--error)_30%,transparent)] px-4 py-3 mb-5">
            <p className="text-[13px] font-[family-name:var(--font-body)] text-[var(--error)]">{serverError}</p>
          </div>
        )}
        {/* Full name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="register-name"
            className="text-[12px] font-[family-name:var(--font-display)] font-semibold text-[var(--ink-700)] uppercase tracking-[0.06em]"
          >
            Full name
          </Label>
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Chidi Okeke"
            aria-invalid={!!errors.name}
            className="h-11 rounded-[var(--r-md)] border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] font-[family-name:var(--font-body)] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] focus-visible:ring-[var(--blue-600)] focus-visible:border-[var(--blue-600)] transition-colors duration-[100ms]"
            {...register('name')}
          />
          {errors.name && (
            <p
              className="text-[11px] font-[family-name:var(--font-body)] text-[var(--error)]"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="register-email"
            className="text-[12px] font-[family-name:var(--font-display)] font-semibold text-[var(--ink-700)] uppercase tracking-[0.06em]"
          >
            Email address
          </Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className="h-11 rounded-[var(--r-md)] border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] font-[family-name:var(--font-body)] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] focus-visible:ring-[var(--blue-600)] focus-visible:border-[var(--blue-600)] transition-colors duration-[100ms]"
            {...register('email')}
          />
          {errors.email && (
            <p
              className="text-[11px] font-[family-name:var(--font-body)] text-[var(--error)]"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="register-password"
            className="text-[12px] font-[family-name:var(--font-display)] font-semibold text-[var(--ink-700)] uppercase tracking-[0.06em]"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className="h-11 rounded-[var(--r-md)] border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 pr-10 text-[14px] font-[family-name:var(--font-body)] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] focus-visible:ring-[var(--blue-600)] focus-visible:border-[var(--blue-600)] transition-colors duration-[100ms]"
              {...register('password')}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-300)] hover:text-[var(--ink-500)] transition-colors duration-[100ms]"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p
              className="text-[11px] font-[family-name:var(--font-body)] text-[var(--error)]"
            >
              {errors.password.message}
            </p>
          ) : (
            <p
              className="text-[11px] font-[family-name:var(--font-body)] text-[var(--ink-300)]"
            >
              Minimum 8 characters
            </p>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="space-y-1.5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                id="register-terms"
                type="checkbox"
                aria-invalid={!!errors.terms}
                className="sr-only peer"
                {...register('terms')}
              />
              <div
                className="w-4 h-4 rounded-[4px] border-2 border-[var(--border-strong)] bg-[var(--surface-base)] transition-colors duration-[100ms] peer-checked:bg-[var(--blue-600)] peer-checked:border-[var(--blue-600)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--blue-600)] peer-focus-visible:ring-offset-1"
              />
              <svg
                className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-[100ms] pointer-events-none"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.5 8L6.5 11L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-[13px] font-[family-name:var(--font-body)] text-[var(--ink-500)] leading-snug"
            >
              I agree to the{' '}
              <Link
                href="/terms"
                className="font-medium text-[var(--blue-600)] hover:text-[var(--blue-700)] transition-colors duration-[100ms]"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="font-medium text-[var(--blue-600)] hover:text-[var(--blue-700)] transition-colors duration-[100ms]"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p
              className="text-[11px] font-[family-name:var(--font-body)] text-[var(--error)] pl-7"
            >
              {errors.terms.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="w-full h-11 rounded-[var(--r-md)] bg-[var(--blue-600)] hover:bg-[var(--blue-700)] text-white text-[14px] font-[family-name:var(--font-display)] font-semibold transition-colors duration-[200ms] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-600)] focus-visible:ring-offset-2"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating account…
            </span>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      {/* Bottom link */}
      <p
        className="mt-8 text-center text-[13px] font-[family-name:var(--font-body)] text-[var(--ink-400)]"
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-[var(--blue-600)] hover:text-[var(--blue-700)] transition-colors duration-[100ms]"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
