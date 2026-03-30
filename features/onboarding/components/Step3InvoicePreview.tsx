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
        <h2 className="font-display font-extrabold text-[24px] text-(--ink-900) tracking-[-0.02em]">
          Here&apos;s your first invoice
        </h2>
        <p className="font-body text-[14px] text-(--ink-400)">
          This is what your clients will receive.
        </p>
      </div>

      {/* Invoice mockup card */}
      <div className="relative overflow-hidden shadow-sm bg-(--surface-base) border border-(--border-default) rounded-lg">
        {/* Left accent strip */}
        <div className="absolute left-0 top-0 h-full w-1 bg-(--blue-600)" aria-hidden="true" />

        <div className="pl-6 pr-5 py-5 flex flex-col gap-4">
          {/* Invoice header row */}
          <div className="flex items-start justify-between gap-3">
            {/* Left: logo/avatar + business name */}
            <div className="flex flex-col gap-1.5">
              {profilePreview.logoUrl ? (
                <img
                  src={profilePreview.logoUrl}
                  alt={displayName}
                  className="h-10 object-contain max-w-30"
                />
              ) : (
                <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-md bg-(--blue-100)">
                  <span className="font-display font-bold text-[18px] text-(--blue-600)">
                    {initials}
                  </span>
                </div>
              )}
              <span className="font-display font-bold text-[15px] text-(--ink-900)">
                {displayName}
              </span>
            </div>

            {/* Right: INVOICE label + number */}
            <div className="flex flex-col items-end gap-1">
              <span className="font-display font-extrabold text-[18px] text-(--blue-600) tracking-[0.08em]">
                INVOICE
              </span>
              <span className="font-mono text-[12px] text-(--ink-400)">
                INV-2025-0001
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-(--border-default)" />

          {/* Bill to */}
          <div className="flex flex-col gap-1">
            <span className="font-display font-semibold uppercase text-[10px] text-(--ink-300) tracking-[0.08em]">
              Bill To
            </span>
            <span className="font-body text-[14px] text-(--ink-700)">
              Acme Corp
            </span>
          </div>

          {/* Line items table */}
          <div className="flex flex-col rounded-md overflow-hidden border border-(--border-default)">
            {/* Column headers */}
            <div
              className="grid bg-(--surface-overlay) px-[10px] py-[6px] [grid-template-columns:1fr_40px_90px_90px]"
            >
              {(['Description', 'Qty', 'Unit Price', 'Total'] as const).map((h) => (
                <span
                  key={h}
                  className={`font-display font-semibold uppercase text-[10px] text-(--ink-300) tracking-[0.08em] ${h === 'Description' ? 'text-left' : 'text-right'}`}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Row 1 */}
            <div
              className="grid bg-(--surface-base) px-[10px] py-[7px] [grid-template-columns:1fr_40px_90px_90px]"
            >
              <span className="font-body text-[13px] text-(--ink-900)">Design Services</span>
              <span className="font-mono text-right text-[13px] text-(--ink-900)">1</span>
              <span className="font-mono text-right text-[13px] text-(--ink-900)">₦200,000.00</span>
              <span className="font-mono text-right text-[13px] text-(--ink-900)">₦200,000.00</span>
            </div>

            {/* Row 2 */}
            <div
              className="grid bg-(--surface-raised) px-[10px] py-[7px] [grid-template-columns:1fr_40px_90px_90px]"
            >
              <span className="font-body text-[13px] text-(--ink-900)">Brand Strategy</span>
              <span className="font-mono text-right text-[13px] text-(--ink-900)">2</span>
              <span className="font-mono text-right text-[13px] text-(--ink-900)">₦125,000.00</span>
              <span className="font-mono text-right text-[13px] text-(--ink-900)">₦250,000.00</span>
            </div>
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-8">
              <span className="font-body text-[13px] text-(--ink-400)">Subtotal</span>
              <span className="font-mono text-[13px] text-(--ink-900)">₦450,000.00</span>
            </div>
            <div className="flex items-center gap-8 pt-1.5 border-t border-(--border-default)">
              <span className="font-display font-bold text-[16px] text-(--ink-900)">Total Due</span>
              <span className="font-mono text-[18px] text-(--blue-600)">₦450,000.00</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 font-body italic text-[12px] text-(--ink-300) border-t border-(--border-default)">
            Thank you for your business.
          </div>
        </div>
      </div>

      {/* Badge below invoice */}
      <div className="flex items-center justify-center gap-1.5">
        <Sparkles size={14} className="text-(--blue-400) shrink-0" aria-hidden="true" />
        <span className="font-body text-[12px] text-(--ink-400)">
          Your logo and business name appear on every invoice
        </span>
      </div>

      {/* CTA */}
      <Button className="w-full h-11 font-display font-semibold" onClick={nextStep}>
        Continue
      </Button>
    </div>
  )
}
