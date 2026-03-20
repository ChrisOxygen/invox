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
        className="flex items-center justify-center rounded-full"
        style={{
          width: 56,
          height: 56,
          backgroundColor: 'color-mix(in srgb, var(--success) 12%, transparent)',
          color: 'var(--success)',
        }}
      >
        <CheckCircle size={28} strokeWidth={2} />
      </div>

      {/* Heading + body */}
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
          Check your inbox
        </h1>
        <p
          className="font-[family-name:var(--font-body)]"
          style={{ fontSize: 15, color: 'var(--ink-400)', lineHeight: 1.6 }}
        >
          We sent a password reset link to{' '}
          <strong
            className="font-[family-name:var(--font-body)]"
            style={{ color: 'var(--ink-900)', fontWeight: 600 }}
          >
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
            className="w-full h-11 font-[family-name:var(--font-display)] text-sm font-semibold"
            style={{
              borderRadius: 'var(--r-md)',
              borderColor: 'var(--border-default)',
              color: 'var(--ink-900)',
            }}
          >
            Open Gmail
          </Button>
        </a>

        <p
          className="font-[family-name:var(--font-body)]"
          style={{ fontSize: 13, color: 'var(--ink-400)' }}
        >
          Didn&apos;t receive it?{' '}
          <button
            type="button"
            onClick={onResend}
            className="font-[family-name:var(--font-body)] transition-colors"
            style={{
              fontSize: 13,
              color: 'var(--blue-600)',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--blue-700)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--blue-600)')}
          >
            Resend email
          </button>
        </p>
      </div>

      {/* Back to login */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 font-[family-name:var(--font-body)] transition-colors"
        style={{ fontSize: 13, color: 'var(--ink-400)', textDecoration: 'none' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-900)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-400)')}
      >
        <ArrowLeft size={13} strokeWidth={2} />
        Back to sign in
      </Link>
    </div>
  )
}
