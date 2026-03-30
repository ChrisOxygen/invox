'use client'

import Link from 'next/link'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface EmailSentConfirmationProps {
  email: string
  onResend: () => void
}

export function EmailSentConfirmation({ email, onResend }: EmailSentConfirmationProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      {/* Success icon */}
      <div
        className="flex items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-(--success) w-14 h-14"
      >
        <CheckCircle size={28} strokeWidth={2} />
      </div>

      {/* Heading + body */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-[800] tracking-h2 text-(--ink-900) leading-[1.15]">
          Check your inbox
        </h1>
        <p className="font-sans text-[15px] text-(--ink-400) leading-[1.6]">
          We sent a password reset link to{' '}
          <strong className="font-sans text-(--ink-900) font-semibold">
            {email}
          </strong>
          . Check your spam folder if you don&apos;t see it.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="w-full">
          <Button
            variant="outline"
            className="w-full h-11 font-display text-sm font-semibold border-(--border-default) text-(--ink-900) rounded-md"
          >
            Open Gmail
          </Button>
        </a>

        <p className="font-sans text-[13px] text-(--ink-400)">
          Didn&apos;t receive it?{' '}
          <button
            type="button"
            onClick={onResend}
            className="font-sans text-[13px] text-(--blue-600) font-semibold transition-colors bg-transparent border-0 p-0 cursor-pointer hover:text-(--blue-700)"
          >
            Resend email
          </button>
        </p>
      </div>

      {/* Back to login */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 font-sans text-[13px] text-(--ink-400) no-underline transition-colors hover:text-(--ink-900)"
      >
        <ArrowLeft size={13} strokeWidth={2} />
        Back to sign in
      </Link>
    </div>
  )
}
