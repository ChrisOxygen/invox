import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { Globe, Mail, Phone } from 'lucide-react'
import { _getInvoiceByToken } from '@/features/invoices/server/_get-invoice-by-token'
import { formatCurrency } from '@/shared/lib/utils'
import { PrintButton } from '@/features/invoices/components/pdf/PrintButton'
import type { PublicInvoice } from '@/features/invoices/server/_get-invoice-by-token'

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  let invoice: PublicInvoice
  try {
    invoice = await _getInvoiceByToken(token)
  } catch {
    notFound()
  }

  const { profile, client, items } = invoice
  const brandColor = profile.brandColor ?? 'var(--blue-600)'

  function formatDate(iso: string) {
    try {
      return format(parseISO(iso), 'd MMM yyyy')
    } catch {
      return '—'
    }
  }

  const STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Draft',
    SENT: 'Sent',
    PAID: 'Paid',
    PARTIAL: 'Partial Payment',
    OVERDUE: 'Overdue',
    CANCELLED: 'Cancelled',
  }

  // className strings — uses CSS variables where tokens exist, Tailwind arbitrary values otherwise
  const STATUS_BADGE_CLASSES: Record<string, string> = {
    DRAFT: 'bg-[var(--blue-50)] text-[var(--blue-700)]',
    SENT: 'bg-[#E6F7FA] text-[#006A7A]',
    PAID: 'bg-[#EDFAF3] text-[#0A8F52]',
    PARTIAL: 'bg-[#FFF7EA] text-[#B57200]',
    OVERDUE: 'bg-[#FFF0F0] text-[#C72020]',
    CANCELLED: 'bg-[var(--ink-50)] text-[var(--ink-500)]',
  }
  const STATUS_DOT_CLASSES: Record<string, string> = {
    DRAFT: 'bg-[var(--blue-700)]',
    SENT: 'bg-[#006A7A]',
    PAID: 'bg-[var(--success)]',
    PARTIAL: 'bg-[var(--warning)]',
    OVERDUE: 'bg-[#C72020]',
    CANCELLED: 'bg-[var(--ink-500)]',
  }

  const statusBadgeClass =
    STATUS_BADGE_CLASSES[invoice.status] ?? 'bg-[var(--ink-50)] text-[var(--ink-500)]'
  const statusDotClass = STATUS_DOT_CLASSES[invoice.status] ?? 'bg-[var(--ink-500)]'
  const statusLabel = STATUS_LABELS[invoice.status] ?? invoice.status

  const businessLocation = [profile.city, profile.state, profile.country]
    .filter(Boolean)
    .join(', ')
  const clientLocation = [client.city, client.state, client.country].filter(Boolean).join(', ')

  return (
    <div
      className="min-h-screen bg-[var(--surface-page)]"
      style={{ '--brand': brandColor } as React.CSSProperties}
    >
      {/* Top bar */}
      <div className="no-print bg-[var(--surface-base)] border-b border-[var(--border-default)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-display)] text-base font-extrabold text-[var(--ink-900)] tracking-[-0.03em]">
            invox
          </span>
          <span className="w-px h-4 bg-[var(--border-default)] mx-1 inline-block" />
          <span className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)]">
            Invoice {invoice.invoiceNumber}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PrintButton />
        </div>
      </div>

      {/* Invoice card */}
      <div className="invoice-card max-w-[760px] mx-auto mt-8 mb-4 bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[var(--r-xl)] overflow-hidden">
        {/* Brand header strip */}
        <div style={{ backgroundColor: 'var(--brand)' }} className="h-[6px]" />

        {/* Invoice header */}
        <div className="px-10 pt-9 pb-7 flex items-start justify-between gap-6 flex-wrap">
          {/* Business identity */}
          <div>
            {profile.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logoUrl}
                alt={profile.businessName ?? 'Business logo'}
                className="max-h-12 max-w-[160px] object-contain mb-3"
              />
            ) : (
              <p
                style={{ color: 'var(--brand)' }}
                className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-[-0.03em] mb-2"
              >
                {profile.businessName ?? 'Your Business'}
              </p>
            )}
            {profile.address && (
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)] leading-[1.5]">
                {profile.address}
                {businessLocation && (
                  <>
                    <br />
                    {businessLocation}
                  </>
                )}
              </p>
            )}
            {profile.phone && (
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)] mt-1">
                {profile.phone}
              </p>
            )}
            {profile.email && (
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)]">
                {profile.email}
              </p>
            )}
            {profile.taxNumber && (
              <p className="font-[family-name:var(--font-body)] text-[12px] text-[var(--ink-300)] mt-1">
                TIN: {profile.taxNumber}
              </p>
            )}
            {profile.rcNumber && (
              <p className="font-[family-name:var(--font-body)] text-[12px] text-[var(--ink-300)]">
                RC: {profile.rcNumber}
              </p>
            )}
          </div>

          {/* Invoice meta */}
          <div className="text-right">
            <p className="font-[family-name:var(--font-display)] text-[28px] font-extrabold text-[var(--ink-900)] tracking-[-0.04em] leading-none mb-1.5">
              INVOICE
            </p>
            <p
              style={{ color: 'var(--brand)' }}
              className="font-[family-name:var(--font-mono)] text-sm font-medium mb-3"
            >
              {invoice.invoiceNumber}
            </p>
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-[family-name:var(--font-display)] text-[12px] font-semibold mb-4 ${statusBadgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
              {statusLabel}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between gap-6">
                <span className="font-[family-name:var(--font-body)] text-[12px] text-[var(--ink-300)]">
                  Issue Date
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[12px] font-medium text-[var(--ink-700)]">
                  {formatDate(invoice.issueDate)}
                </span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="font-[family-name:var(--font-body)] text-[12px] text-[var(--ink-300)]">
                  Due Date
                </span>
                <span
                  className={`font-[family-name:var(--font-mono)] text-[12px] font-medium ${invoice.status === 'OVERDUE' ? 'text-[#C72020]' : 'text-[var(--ink-700)]'}`}
                >
                  {formatDate(invoice.dueDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border-default)] mx-10" />

        {/* Bill from / Bill to */}
        <div className="px-10 py-6 grid grid-cols-2 gap-8">
          <div>
            <p className="font-[family-name:var(--font-display)] text-[11px] font-semibold text-[var(--ink-300)] tracking-[0.08em] uppercase mb-2">
              From
            </p>
            <p className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--ink-900)] tracking-[-0.01em] mb-1">
              {profile.businessName ?? '—'}
            </p>
            {profile.website && (
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)]">
                {profile.website}
              </p>
            )}
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-[11px] font-semibold text-[var(--ink-300)] tracking-[0.08em] uppercase mb-2">
              Bill To
            </p>
            <p className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--ink-900)] tracking-[-0.01em] mb-1">
              {client.name}
            </p>
            {client.company && (
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)]">
                {client.company}
              </p>
            )}
            {client.address && (
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)] leading-[1.5]">
                {client.address}
                {clientLocation && (
                  <>
                    <br />
                    {clientLocation}
                  </>
                )}
              </p>
            )}
            {client.email && (
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)] mt-1">
                {client.email}
              </p>
            )}
            {client.phone && (
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)]">
                {client.phone}
              </p>
            )}
          </div>
        </div>

        {/* Line items */}
        <div className="px-10 pb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--brand)' }}>
                {(['Description', 'Qty', 'Unit Price', 'Amount'] as const).map((h, i) => (
                  <th
                    key={h}
                    className={`font-[family-name:var(--font-display)] text-[11px] font-semibold text-white tracking-[0.06em] uppercase px-3 py-2.5 ${i === 0 ? 'text-left' : 'text-right'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`border-b border-[var(--border-default)] ${idx % 2 === 0 ? 'bg-[var(--surface-base)]' : 'bg-[var(--surface-raised)]'}`}
                >
                  <td className="font-[family-name:var(--font-body)] text-sm text-[var(--ink-700)] px-3 py-3">
                    {item.description}
                  </td>
                  <td className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--ink-400)] px-3 py-3 text-right">
                    {item.quantity}
                  </td>
                  <td className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--ink-400)] px-3 py-3 text-right whitespace-nowrap">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="font-[family-name:var(--font-mono)] text-[13px] font-medium text-[var(--ink-900)] px-3 py-3 text-right whitespace-nowrap">
                    {formatCurrency(item.subtotal, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-10 pb-7 flex justify-end">
          <div className="min-w-[260px]">
            {[
              { label: 'Subtotal', value: invoice.subtotal },
              ...(invoice.taxAmount > 0
                ? [
                    {
                      label: `Tax (${invoice.taxType === 'PERCENTAGE' ? `${invoice.taxRate}%` : 'Fixed'})`,
                      value: invoice.taxAmount,
                    },
                  ]
                : []),
              ...(invoice.discountAmount > 0
                ? [
                    {
                      label: `Discount (${invoice.discountType === 'PERCENTAGE' ? `${invoice.discount}%` : 'Fixed'})`,
                      value: -invoice.discountAmount,
                      isNegative: true,
                    },
                  ]
                : []),
            ].map(({ label, value, isNegative }) => (
              <div
                key={label}
                className="flex justify-between py-1.5 border-b border-[var(--border-default)]"
              >
                <span className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-400)]">
                  {label}
                </span>
                <span
                  className={`font-[family-name:var(--font-mono)] text-[13px] font-medium whitespace-nowrap ${isNegative ? 'text-[#0A8F52]' : 'text-[var(--ink-900)]'}`}
                >
                  {isNegative ? '−' : ''}
                  {formatCurrency(Math.abs(value ?? 0), invoice.currency)}
                </span>
              </div>
            ))}
            {/* Grand total */}
            <div
              style={{ backgroundColor: 'var(--brand)' }}
              className="flex justify-between items-center px-4 py-3.5 rounded-[var(--r-md)] mt-2"
            >
              <span className="font-[family-name:var(--font-display)] text-[13px] font-bold text-white tracking-[-0.01em]">
                Total Due
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[18px] font-medium text-white whitespace-nowrap">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <>
            <div className="h-px bg-[var(--border-default)] mx-10" />
            <div className="px-10 pt-5 pb-6">
              <p className="font-[family-name:var(--font-display)] text-[11px] font-semibold text-[var(--ink-300)] tracking-[0.08em] uppercase mb-2">
                Notes
              </p>
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[var(--ink-500)] leading-[1.6] whitespace-pre-line">
                {invoice.notes}
              </p>
            </div>
          </>
        )}

        {/* Payment & contact footer */}
        <div className="bg-[var(--surface-page)] border-t border-[var(--border-default)] px-10 py-5 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-5 flex-wrap">
            {profile.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-[13px] h-[13px] text-[var(--ink-300)]" />
                <span className="font-[family-name:var(--font-body)] text-[12px] text-[var(--ink-400)]">
                  {profile.email}
                </span>
              </span>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-[13px] h-[13px] text-[var(--ink-300)]" />
                <span className="font-[family-name:var(--font-body)] text-[12px] text-[var(--ink-400)]">
                  {profile.phone}
                </span>
              </span>
            )}
            {profile.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-[13px] h-[13px] text-[var(--ink-300)]" />
                <span className="font-[family-name:var(--font-body)] text-[12px] text-[var(--ink-400)]">
                  {profile.website}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Powered by Invox footer */}
      <div className="no-print text-center px-6 pt-4 pb-10">
        <p className="font-[family-name:var(--font-body)] text-[12px] text-[var(--ink-300)] mb-1.5">
          This invoice was created with
        </p>
        <a
          href="/"
          className="font-[family-name:var(--font-display)] text-sm font-extrabold text-[var(--blue-600)] no-underline tracking-[-0.03em] inline-block mb-2"
        >
          invox
        </a>
        <p className="font-[family-name:var(--font-body)] text-[12px] text-[var(--ink-200)]">
          Create professional invoices free →{' '}
          <a href="/register" className="text-[var(--blue-600)] no-underline font-medium">
            Sign up free
          </a>
        </p>
      </div>
    </div>
  )
}
