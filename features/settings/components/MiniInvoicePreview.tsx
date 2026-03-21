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
      className="overflow-hidden rounded-[var(--r-lg)] border border-[var(--border-default)] bg-[var(--surface-base)] shadow-sm"
      style={{ width: 200, minHeight: 280 }}
      aria-label="Invoice preview"
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ backgroundColor: color }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="Business logo"
            className="h-6 w-6 rounded object-contain"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          />
        ) : (
          <div
            className="flex h-6 w-6 items-center justify-center rounded text-[9px] font-[700] text-white"
            style={{ background: 'rgba(255,255,255,0.25)' }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span
          className="truncate text-[10px] font-[700] text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {displayName}
        </span>
      </div>

      {/* Invoice body */}
      <div className="px-4 py-3">
        {/* Invoice number */}
        <div className="flex items-center justify-between">
          <span
            className="text-[8px] font-[500] uppercase tracking-[0.06em] text-[var(--ink-400)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Invoice
          </span>
          <span
            className="text-[9px] font-[500] text-[var(--ink-900)]"
            style={{ fontFamily: 'var(--font-mono)', color }}
          >
            INV-2025-0001
          </span>
        </div>

        {/* Client */}
        <div className="mt-2">
          <span
            className="text-[8px] text-[var(--ink-300)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Billed to
          </span>
          <p
            className="text-[9px] font-[500] text-[var(--ink-900)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Adaeze Okonkwo
          </p>
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-[var(--border-default)]" />

        {/* Line items */}
        <div className="flex flex-col gap-1.5">
          {[
            { desc: 'Logo Design', amount: '₦150,000' },
            { desc: 'Brand Guide', amount: '₦80,000' },
          ].map(({ desc, amount }) => (
            <div key={desc} className="flex items-center justify-between">
              <span
                className="text-[8px] text-[var(--ink-700)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {desc}
              </span>
              <span
                className="text-[8px] text-[var(--ink-900)]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {amount}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-[var(--border-default)]" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span
            className="text-[9px] font-[700] text-[var(--ink-900)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Total
          </span>
          <span
            className="text-[10px] font-[700] text-[var(--ink-900)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            ₦230,000
          </span>
        </div>

        {/* Status badge */}
        <div className="mt-3 flex justify-center">
          <span
            className="rounded-full px-2 py-0.5 text-[8px] font-[600] text-white"
            style={{ backgroundColor: color, fontFamily: 'var(--font-display)' }}
          >
            SENT
          </span>
        </div>
      </div>
    </div>
  )
}
