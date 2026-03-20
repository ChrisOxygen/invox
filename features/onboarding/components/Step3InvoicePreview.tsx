'use client'

import { Sparkles } from 'lucide-react'
import { useOnboarding } from '@/features/onboarding/context/OnboardingContext'
import { Button } from '@/shared/components/ui/button'

export function Step3InvoicePreview() {
  const { nextStep, profilePreview } = useOnboarding()

  const displayName = profilePreview.businessName || 'Your Business'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2
          className="font-[family-name:var(--font-display)] font-extrabold"
          style={{ fontSize: '24px', color: 'var(--ink-900)', letterSpacing: '-0.02em' }}
        >
          Here&apos;s your first invoice
        </h2>
        <p
          className="font-[family-name:var(--font-body)]"
          style={{ fontSize: '14px', color: 'var(--ink-400)' }}
        >
          This is what your clients will receive.
        </p>
      </div>

      {/* Invoice mockup card */}
      <div
        className="relative overflow-hidden shadow-sm"
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--r-xl)',
        }}
      >
        {/* Left accent strip */}
        <div
          className="absolute left-0 top-0 h-full"
          style={{ width: '4px', backgroundColor: 'var(--blue-600)' }}
          aria-hidden="true"
        />

        <div className="pl-6 pr-5 py-5 flex flex-col gap-4">
          {/* Invoice header row */}
          <div className="flex items-start justify-between gap-3">
            {/* Left: logo/avatar + business name */}
            <div className="flex flex-col gap-1.5">
              {profilePreview.logoUrl ? (
                <img
                  src={profilePreview.logoUrl}
                  alt={displayName}
                  style={{ height: '40px', objectFit: 'contain', maxWidth: '120px' }}
                />
              ) : (
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--r-md)',
                    backgroundColor: 'var(--blue-100)',
                  }}
                >
                  <span
                    className="font-[family-name:var(--font-display)] font-bold"
                    style={{ fontSize: '18px', color: 'var(--blue-600)' }}
                  >
                    {initials}
                  </span>
                </div>
              )}
              <span
                className="font-[family-name:var(--font-display)] font-bold"
                style={{ fontSize: '15px', color: 'var(--ink-900)' }}
              >
                {displayName}
              </span>
            </div>

            {/* Right: INVOICE label + number */}
            <div className="flex flex-col items-end gap-1">
              <span
                className="font-[family-name:var(--font-display)] font-extrabold"
                style={{
                  fontSize: '18px',
                  color: 'var(--blue-600)',
                  letterSpacing: '0.08em',
                }}
              >
                INVOICE
              </span>
              <span
                className="font-[family-name:var(--font-mono)]"
                style={{ fontSize: '12px', color: 'var(--ink-400)' }}
              >
                INV-2025-0001
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--border-default)' }} />

          {/* Bill to */}
          <div className="flex flex-col gap-1">
            <span
              className="font-[family-name:var(--font-display)] font-semibold uppercase"
              style={{ fontSize: '10px', color: 'var(--ink-300)', letterSpacing: '0.08em' }}
            >
              Bill To
            </span>
            <span
              className="font-[family-name:var(--font-body)]"
              style={{ fontSize: '14px', color: 'var(--ink-700)' }}
            >
              Acme Corp
            </span>
          </div>

          {/* Line items table */}
          <div className="flex flex-col" style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
            {/* Column headers */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: '1fr 40px 90px 90px',
                padding: '6px 10px',
                backgroundColor: 'var(--surface-overlay)',
              }}
            >
              {(['Description', 'Qty', 'Unit Price', 'Total'] as const).map((h) => (
                <span
                  key={h}
                  className="font-[family-name:var(--font-display)] font-semibold uppercase"
                  style={{
                    fontSize: '10px',
                    color: 'var(--ink-300)',
                    letterSpacing: '0.08em',
                    textAlign: h === 'Description' ? 'left' : 'right',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Row 1 */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: '1fr 40px 90px 90px',
                padding: '7px 10px',
                backgroundColor: 'var(--surface-base)',
              }}
            >
              <span className="font-[family-name:var(--font-body)]" style={{ fontSize: '13px', color: 'var(--ink-900)' }}>
                Design Services
              </span>
              <span className="font-[family-name:var(--font-mono)] text-right" style={{ fontSize: '13px', color: 'var(--ink-900)' }}>1</span>
              <span className="font-[family-name:var(--font-mono)] text-right" style={{ fontSize: '13px', color: 'var(--ink-900)' }}>₦200,000.00</span>
              <span className="font-[family-name:var(--font-mono)] text-right" style={{ fontSize: '13px', color: 'var(--ink-900)' }}>₦200,000.00</span>
            </div>

            {/* Row 2 */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: '1fr 40px 90px 90px',
                padding: '7px 10px',
                backgroundColor: 'var(--surface-raised)',
              }}
            >
              <span className="font-[family-name:var(--font-body)]" style={{ fontSize: '13px', color: 'var(--ink-900)' }}>
                Brand Strategy
              </span>
              <span className="font-[family-name:var(--font-mono)] text-right" style={{ fontSize: '13px', color: 'var(--ink-900)' }}>2</span>
              <span className="font-[family-name:var(--font-mono)] text-right" style={{ fontSize: '13px', color: 'var(--ink-900)' }}>₦125,000.00</span>
              <span className="font-[family-name:var(--font-mono)] text-right" style={{ fontSize: '13px', color: 'var(--ink-900)' }}>₦250,000.00</span>
            </div>
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-8">
              <span
                className="font-[family-name:var(--font-body)]"
                style={{ fontSize: '13px', color: 'var(--ink-400)' }}
              >
                Subtotal
              </span>
              <span
                className="font-[family-name:var(--font-mono)]"
                style={{ fontSize: '13px', color: 'var(--ink-900)' }}
              >
                ₦450,000.00
              </span>
            </div>
            <div
              className="flex items-center gap-8 pt-1.5"
              style={{ borderTop: '1px solid var(--border-default)' }}
            >
              <span
                className="font-[family-name:var(--font-display)] font-bold"
                style={{ fontSize: '16px', color: 'var(--ink-900)' }}
              >
                Total Due
              </span>
              <span
                className="font-[family-name:var(--font-mono)] font-bold"
                style={{ fontSize: '18px', color: 'var(--blue-600)' }}
              >
                ₦450,000.00
              </span>
            </div>
          </div>

          {/* Footer */}
          <div
            className="pt-3 font-[family-name:var(--font-body)] italic"
            style={{
              fontSize: '12px',
              color: 'var(--ink-300)',
              borderTop: '1px solid var(--border-default)',
            }}
          >
            Thank you for your business.
          </div>
        </div>
      </div>

      {/* Badge below invoice */}
      <div className="flex items-center justify-center gap-1.5">
        <Sparkles
          size={14}
          style={{ color: 'var(--blue-400)', flexShrink: 0 }}
          aria-hidden="true"
        />
        <span
          className="font-[family-name:var(--font-body)]"
          style={{ fontSize: '12px', color: 'var(--ink-400)' }}
        >
          Your logo and business name appear on every invoice
        </span>
      </div>

      {/* CTA */}
      <Button
        className="w-full font-[family-name:var(--font-display)] font-semibold"
        style={{ height: '44px' }}
        onClick={nextStep}
      >
        Continue
      </Button>
    </div>
  )
}
