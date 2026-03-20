'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, Globe } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { _signIn, _signInWithGoogle } from '@/features/auth/server'

const ZLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

type ZLogin = z.infer<typeof ZLoginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZLogin>({
    resolver: zodResolver(ZLoginSchema),
  })

  async function onSubmit(data: ZLogin) {
    setServerError(null)
    const result = await _signIn(data.email, data.password)
    if (result?.error) {
      setServerError(result.error)
    }
  }

  function handleGoogleSignIn() {
    startTransition(async () => {
      const result = await _signInWithGoogle()
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <h1
          className="text-[32px] font-[family-name:var(--font-display)] font-extrabold text-[var(--ink-900)] leading-tight mb-2"
          style={{ letterSpacing: '-0.03em' }}
        >
          Welcome back
        </h1>
        <p
          className="text-[14px] font-[family-name:var(--font-body)] font-normal text-[var(--ink-400)]"
        >
          Sign in to your Invox account
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
        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="login-email"
            className="text-[12px] font-[family-name:var(--font-display)] font-semibold text-[var(--ink-700)] uppercase tracking-[0.06em]"
          >
            Email address
          </Label>
          <Input
            id="login-email"
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
          <div className="flex items-center justify-between">
            <Label
              htmlFor="login-password"
              className="text-[12px] font-[family-name:var(--font-display)] font-semibold text-[var(--ink-700)] uppercase tracking-[0.06em]"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[12px] font-[family-name:var(--font-body)] text-[var(--blue-600)] hover:text-[var(--blue-700)] transition-colors duration-[100ms]"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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
          {errors.password && (
            <p
              className="text-[11px] font-[family-name:var(--font-body)] text-[var(--error)]"
            >
              {errors.password.message}
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
              Signing in…
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Bottom link */}
      <p
        className="mt-8 text-center text-[13px] font-[family-name:var(--font-body)] text-[var(--ink-400)]"
      >
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-[var(--blue-600)] hover:text-[var(--blue-700)] transition-colors duration-[100ms]"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
