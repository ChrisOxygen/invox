'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, KeyRound, TriangleAlert } from 'lucide-react'
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

const labelClass =
  'text-[12px] font-semibold text-(--ink-700) font-display'
const inputClass =
  'h-10 w-full rounded border border-(--border-default) bg-(--surface-base) px-3.5 text-[14px] text-(--ink-900) placeholder:text-(--ink-300) transition-colors duration-200 focus:border-(--blue-600) focus:outline-none focus:ring-2 focus:ring-(--blue-600)/20 font-body'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-[11px] text-(--error) font-body" role="alert">
      {message}
    </p>
  )
}

// ─── Change Password Section ──────────────────────────────────────────────────

function ChangePasswordSection() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  function onSubmit(data: ZUpdatePassword) {
    mutate(data, { onError: (err) => toast.error(err.message) })
  }

  return (
    <div className="rounded border border-(--border-default) bg-(--surface-base) overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-(--border-default) px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-(--surface-overlay) border border-(--border-default) shrink-0">
          <KeyRound className="h-4 w-4 text-(--ink-500)" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold tracking-[-0.02em] text-(--ink-900) font-display">
            Change Password
          </h2>
          <p className="text-[12px] text-(--ink-400) font-body">
            Minimum 8 characters required
          </p>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="px-6 py-6 flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="currentPassword" className={labelClass}>Current Password</label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('currentPassword')}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--ink-400) transition-colors duration-200 hover:text-(--ink-900) focus-visible:outline-none"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FieldError message={errors.currentPassword?.message} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className={labelClass}>New Password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('newPassword')}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--ink-400) transition-colors duration-200 hover:text-(--ink-900) focus-visible:outline-none"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError message={errors.newPassword?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className={labelClass}>Confirm New Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--ink-400) transition-colors duration-200 hover:text-(--ink-900) focus-visible:outline-none"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-(--border-default) px-6 py-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex h-9 items-center justify-center gap-2 rounded bg-(--blue-600) px-5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-(--blue-700) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--blue-600) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 font-display"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Update password
          </button>
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
    <div className="rounded border border-(--error)/30 bg-(--surface-base) overflow-hidden">
      {/* Red top bar */}
      <div className="h-1 w-full bg-(--error)" />

      <div className="px-6 py-5 flex items-start gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-(--error)/10 border border-(--error)/20 shrink-0 mt-0.5">
          <TriangleAlert className="h-4 w-4 text-(--error)" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-bold tracking-[-0.02em] text-(--ink-900) font-display">
            Delete Account
          </h2>
          <p className="mt-1 text-[13px] text-(--ink-400) font-body leading-relaxed">
            Permanently delete your Invox account and all associated data — invoices, clients, and business profile. This action cannot be undone.
          </p>

          <div className="mt-4">
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <AlertDialogTrigger className="flex h-9 items-center justify-center gap-2 rounded border border-(--error) bg-transparent px-4 text-[13px] font-semibold text-(--error) transition-all duration-200 hover:bg-(--error) hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--error) focus-visible:ring-offset-2 font-display">
                Delete my account
              </AlertDialogTrigger>

              <AlertDialogContent className="rounded border border-(--border-default) bg-(--surface-base) max-w-105">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[18px] font-bold tracking-[-0.02em] text-(--ink-900) font-display">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[14px] text-(--ink-500) font-body leading-relaxed">
                    This will permanently delete your account, all invoices, clients, and business data. There is no way to recover your data after this.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mt-2 flex flex-col gap-1.5">
                  <label htmlFor="deleteConfirm" className="text-[12px] text-(--ink-700) font-body">
                    Type{' '}
                    <span className="font-semibold text-(--error) font-mono">DELETE</span>
                    {' '}to confirm
                  </label>
                  <input
                    id="deleteConfirm"
                    type="text"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder="DELETE"
                    className="h-10 w-full rounded border border-(--border-default) bg-(--surface-base) px-3.5 text-[14px] text-(--ink-900) placeholder:text-(--ink-300) transition-colors duration-200 focus:border-(--error) focus:outline-none focus:ring-2 focus:ring-(--error)/20 font-mono"
                    autoComplete="off"
                  />
                </div>

                <AlertDialogFooter className="mt-4 gap-2">
                  <AlertDialogCancel
                    onClick={() => setConfirmInput('')}
                    className="rounded h-9 text-[13px] font-display"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <button
                    type="button"
                    disabled={!isConfirmed || isPending}
                    onClick={handleConfirmDelete}
                    className="flex h-9 items-center justify-center gap-2 rounded bg-(--error) px-5 text-[13px] font-semibold text-white transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--error) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-display"
                  >
                    {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
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
    <div className="flex flex-col gap-5">
      <ChangePasswordSection />
      <DeleteAccountSection />
    </div>
  )
}
