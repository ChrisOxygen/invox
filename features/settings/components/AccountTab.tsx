'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, TriangleAlert } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'
import { ZUpdatePasswordSchema, type ZUpdatePassword } from '@/features/settings/schemas'
import { useUpdatePassword } from '@/features/settings/hooks/use-update-password'
import { useDeleteAccount } from '@/features/settings/hooks/use-delete-account'

const labelClass = 'text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--ink-700)]'
const inputClass =
  'h-[44px] w-full rounded-[var(--r-md)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] transition-colors duration-200 focus:border-[var(--blue-600)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-600)]/20'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      className="text-[11px] text-[var(--error)]"
      style={{ fontFamily: 'var(--font-body)' }}
      role="alert"
    >
      {message}
    </p>
  )
}

// ─── Change Password Section ──────────────────────────────────────────────────

function ChangePasswordSection() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { mutate, isPending } = useUpdatePassword({
    onSuccess: () => {
      toast.success('Password updated')
      reset()
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZUpdatePassword>({
    resolver: zodResolver(ZUpdatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: ZUpdatePassword) {
    mutate(data, {
      onError: (err) => toast.error(err.message),
    })
  }

  return (
    <div className="rounded-[var(--r-xl)] border border-[var(--border-default)] bg-[var(--surface-base)] p-6">
      <h3
        className="text-[16px] font-[700] tracking-[-0.02em] text-[var(--ink-900)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Change Password
      </h3>
      <p
        className="mt-1 text-[13px] text-[var(--ink-400)]"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        Update your account password. Minimum 8 characters.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mt-5 flex flex-col gap-4">
          {/* Current password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="currentPassword"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('currentPassword')}
                className={`${inputClass} pr-10`}
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-400)] transition-colors duration-200 hover:text-[var(--ink-900)] focus-visible:outline-none"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError message={errors.currentPassword?.message} />
          </div>

          {/* New password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="newPassword"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('newPassword')}
                className={`${inputClass} pr-10`}
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-400)] transition-colors duration-200 hover:text-[var(--ink-900)] focus-visible:outline-none"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError message={errors.newPassword?.message} />
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={`${inputClass} pr-10`}
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-400)] transition-colors duration-200 hover:text-[var(--ink-900)] focus-visible:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError message={errors.confirmPassword?.message} />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex h-[44px] items-center justify-center gap-2 rounded-[var(--r-md)] bg-[var(--blue-600)] px-6 text-[14px] font-[600] text-white transition-colors duration-200 hover:bg-[var(--blue-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-600)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Update password
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// ─── Delete Account Section ───────────────────────────────────────────────────

function DeleteAccountSection() {
  const [confirmInput, setConfirmInput] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const { mutate, isPending } = useDeleteAccount()

  const isConfirmed = confirmInput === 'DELETE'

  function handleConfirmDelete() {
    if (!isConfirmed) return
    mutate()
  }

  return (
    <div className="rounded-[var(--r-xl)] border border-[var(--error)]/25 bg-[var(--surface-base)] p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 rounded-[var(--r-sm)] bg-[var(--error)]/10 p-2">
          <TriangleAlert className="h-4 w-4 text-[var(--error)]" />
        </div>
        <div className="flex-1">
          <h3
            className="text-[16px] font-[700] tracking-[-0.02em] text-[var(--ink-900)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Delete Account
          </h3>
          <p
            className="mt-1 text-[13px] text-[var(--ink-400)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Permanently delete your Invox account and all associated data, including invoices and
            clients. This action cannot be undone.
          </p>

          <div className="mt-4">
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <AlertDialogTrigger
                className="flex h-[40px] items-center justify-center gap-2 rounded-[var(--r-md)] border border-[var(--error)] bg-transparent px-5 text-[13px] font-[600] text-[var(--error)] transition-colors duration-200 hover:bg-[var(--error)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--error)] focus-visible:ring-offset-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Delete my account
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle
                    className="text-[18px] font-[700] tracking-[-0.02em] text-[var(--ink-900)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription
                    className="text-[14px] text-[var(--ink-500)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    This will permanently delete your account, all invoices, clients, and business
                    data. There is no way to recover your data after this.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Confirm input */}
                <div className="mt-2 flex flex-col gap-1.5">
                  <label
                    htmlFor="deleteConfirm"
                    className="text-[12px] text-[var(--ink-700)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Type{' '}
                    <span
                      className="font-[600] text-[var(--error)]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      DELETE
                    </span>{' '}
                    to confirm
                  </label>
                  <input
                    id="deleteConfirm"
                    type="text"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder="DELETE"
                    className="h-[44px] w-full rounded-[var(--r-md)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] transition-colors duration-200 focus:border-[var(--error)] focus:outline-none focus:ring-2 focus:ring-[var(--error)]/20"
                    style={{ fontFamily: 'var(--font-mono)' }}
                    autoComplete="off"
                  />
                </div>

                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel
                    onClick={() => setConfirmInput('')}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <button
                    type="button"
                    disabled={!isConfirmed || isPending}
                    onClick={handleConfirmDelete}
                    className="flex h-[40px] items-center justify-center gap-2 rounded-[var(--r-md)] bg-[var(--error)] px-5 text-[14px] font-[600] text-white transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--error)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Delete account
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AccountTab ───────────────────────────────────────────────────────────────

export function AccountTab() {
  return (
    <div className="flex flex-col gap-6">
      <ChangePasswordSection />
      <DeleteAccountSection />
    </div>
  )
}
