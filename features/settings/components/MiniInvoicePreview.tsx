'use client'

export interface MiniInvoicePreviewProps {
  brandColor: string
  logoUrl: string | null
  businessName: string | null
}

export function MiniInvoicePreview({
  brandColor,
  logoUrl,
  businessName,
}: MiniInvoicePreviewProps) {
  const color = /^#[0-9A-Fa-f]{6}$/.test(brandColor) ? brandColor : '#1740F5'
  const displayName = businessName?.trim() || 'Your Business'

  return (
    <div
      className="overflow-hidden rounded border border-(--border-default) bg-(--surface-base)"
      style={{
        width: 300,
        minHeight: 400,
        boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
      }}
      aria-label="Invoice preview"
    >
      {/* Brand header */}
      <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: color }}>
        <div className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Business logo"
              className="h-9 w-9 rounded object-contain"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded text-[13px] font-bold text-white shrink-0"
              style={{ background: 'rgba(255,255,255,0.22)' }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-[12px] font-bold text-white font-display leading-none">
            {displayName}
          </span>
        </div>
        <span
          className="text-[10px] font-semibold font-display leading-none"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          INVOICE
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex flex-col gap-4">

        {/* Meta row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] text-(--ink-300) font-body uppercase tracking-[0.05em]">Billed to</p>
            <p className="text-[13px] font-semibold text-(--ink-900) font-display mt-0.5">Adaeze Okonkwo</p>
            <p className="text-[11px] text-(--ink-400) font-body mt-0.5">Lagos, Nigeria</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-(--ink-300) font-body uppercase tracking-[0.05em]">Invoice</p>
            <p className="text-[12px] font-semibold font-mono mt-0.5" style={{ color }}>INV-2025-0001</p>
            <p className="text-[11px] text-(--ink-400) font-body mt-0.5">Due 15 Apr 2025</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-(--border-default)" />

        {/* Line items header */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-(--ink-300) font-display">Description</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-(--ink-300) font-display">Amount</span>
        </div>

        {/* Line items */}
        <div className="flex flex-col gap-2.5">
          {[
            { desc: 'Brand Identity Design', amount: '₦150,000' },
            { desc: 'Brand Style Guide', amount: '₦80,000' },
            { desc: 'Social Media Kit', amount: '₦45,000' },
          ].map(({ desc, amount }) => (
            <div key={desc} className="flex items-center justify-between">
              <span className="text-[12px] text-(--ink-700) font-body">{desc}</span>
              <span className="font-mono text-[12px] text-(--ink-900)">{amount}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-(--border-default)" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-(--ink-900) font-display">Total</span>
          <span className="font-mono text-[15px] font-bold text-(--ink-900)">₦275,000</span>
        </div>

        {/* Status badge */}
        <div className="flex justify-end">
          <span
            className="rounded-full px-3 py-1 text-[10px] font-semibold text-white font-display"
            style={{ backgroundColor: color }}
          >
            SENT
          </span>
        </div>

        {/* Bank details stub */}
        <div
          className="rounded border px-4 py-3 mt-1"
          style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.06em] font-display" style={{ color }}>
            Payment Details
          </p>
          <p className="text-[11px] text-(--ink-400) font-body mt-1">
            Zenith Bank · 2234567890
          </p>
        </div>

      </div>
    </div>
  )
}
