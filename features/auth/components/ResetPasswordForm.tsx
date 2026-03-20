'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { _resetPassword } from '@/features/auth/server'

const ZResetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ZResetPassword = z.infer<typeof ZResetPasswordSchema>

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZResetPassword>({
    resolver: zodResolver(ZResetPasswordSchema),
  })

  const onSubmit = async (data: ZResetPassword) => {
    setServerError(null)
    const result = await _resetPassword(data.password)
    if (result?.error) {
      setServerError(result.error)
    } else {
      setSuccess(true)
      // Server action redirects to /login on success — no client redirect needed
    }
  }

  return (
    <div className="flex flex-col gap-7">
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
          Set new password
        </h1>
        <p
          className="font-[family-name:var(--font-body)]"
          style={{ fontSize: 15, color: 'var(--ink-400)', lineHeight: 1.6 }}
        >
          Choose a strong password for your account.
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div
          className="flex items-center gap-2.5 rounded-lg px-4 py-3"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--success) 25%, transparent)',
          }}
        >
          <CheckCircle
            size={16}
            strokeWidth={2}
            style={{ color: 'var(--success)', flexShrink: 0 }}
          />
          <p
            className="font-[family-name:var(--font-body)]"
            style={{ fontSize: 13, color: 'var(--success)', fontWeight: 500 }}
          >
            Password updated! Redirecting...
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {serverError && (
          <div className="rounded-[var(--r-md)] bg-[color-mix(in_srgb,var(--error)_10%,transparent)] border border-[color-mix(in_srgb,var(--error)_30%,transparent)] px-4 py-3">
            <p className="text-[13px] font-[family-name:var(--font-body)] text-[var(--error)]">{serverError}</p>
          </div>
        )}
        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="password"
            className="font-[family-name:var(--font-display)]"
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-900)' }}
          >
            New password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="font-[family-name:var(--font-body)] pr-11"
              style={{
                height: 42,
                borderRadius: 'var(--r-md)',
                borderColor: errors.password ? 'var(--error)' : 'var(--border-default)',
                fontSize: 14,
                color: 'var(--ink-900)',
                paddingLeft: 14,
              }}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-colors"
              style={{
                color: 'var(--ink-300)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-400)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-300)')}
            >
              {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
            </button>
          </div>
          {errors.password ? (
            <p
              className="font-[family-name:var(--font-body)]"
              style={{ fontSize: 11, color: 'var(--error)', marginTop: 2 }}
            >
              {errors.password.message}
            </p>
          ) : (
            <p
              className="font-[family-name:var(--font-body)]"
              style={{ fontSize: 11, color: 'var(--ink-300)', marginTop: 2 }}
            >
              Must be at least 8 characters
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="confirmPassword"
            className="font-[family-name:var(--font-display)]"
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-900)' }}
          >
            Confirm password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              className="font-[family-name:var(--font-body)] pr-11"
              style={{
                height: 42,
                borderRadius: 'var(--r-md)',
                borderColor: errors.confirmPassword ? 'var(--error)' : 'var(--border-default)',
                fontSize: 14,
                color: 'var(--ink-900)',
                paddingLeft: 14,
              }}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-colors"
              style={{
                color: 'var(--ink-300)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-400)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-300)')}
            >
              {showConfirm ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              className="font-[family-name:var(--font-body)]"
              style={{ fontSize: 11, color: 'var(--error)', marginTop: 2 }}
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || success}
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
          Reset password
        </Button>
      </form>
    </div>
  )
}
