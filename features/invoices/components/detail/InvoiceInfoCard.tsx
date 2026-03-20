'use client'

import { Mail, Phone } from 'lucide-react'
import { InvoiceStatusBadge } from '../list/InvoiceStatusBadge'
import type { InvoiceDetail } from '../../types'
import { formatCurrency, formatDate } from '@/shared/lib/utils'

const thStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'var(--ink-400)',
  paddingBottom: '8px',
} as const

export type InvoiceInfoCardProps = {
  invoice: InvoiceDetail
}

export function InvoiceInfoCard({ invoice }: InvoiceInfoCardProps) {
  const client = invoice.client

  return (
    <div
      className="rounded-[var(--r-xl)] border overflow-hidden"
      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)' }}
    >
      {/* ── Invoice header ── */}
      <div
        className="px-[var(--s5)] py-[var(--s5)] border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--s3)]"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ink-300)',
              marginBottom: '4px',
            }}
          >
            Invoice
          </p>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--blue-600)',
              letterSpacing: '-0.03em',
            }}
          >
            {invoice.invoiceNumber}
          </span>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      {/* ── Dates ── */}
      <div
        className="grid grid-cols-2 divide-x px-[var(--s5)] py-[var(--s4)] border-b"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="pr-[var(--s5)]">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ink-400)',
              marginBottom: '4px',
            }}
          >
            Issued
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--ink-900)',
            }}
          >
            {formatDate(invoice.issueDate)}
          </p>
        </div>
        <div className="pl-[var(--s5)]">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ink-400)',
              marginBottom: '4px',
            }}
          >
            Due
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color:
                invoice.status === 'OVERDUE' ? 'var(--error)' : 'var(--ink-900)',
              fontWeight: invoice.status === 'OVERDUE' ? 600 : 400,
            }}
          >
            {formatDate(invoice.dueDate)}
          </p>
        </div>
      </div>

      {/* ── Bill To ── */}
      <div
        className="px-[var(--s5)] py-[var(--s4)] border-b"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-400)',
            marginBottom: '8px',
          }}
        >
          Bill To
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--ink-900)',
            letterSpacing: '-0.02em',
          }}
        >
          {client.name}
        </p>
        {client.company && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--ink-400)',
              marginTop: '2px',
            }}
          >
            {client.company}
          </p>
        )}
        <div className="mt-[var(--s2)] space-y-1">
          {client.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--ink-300)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-400)' }}>
                {client.email}
              </span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--ink-300)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-400)' }}>
                {client.phone}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Line items ── */}
      <div className="px-[var(--s5)] pt-[var(--s4)]">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              <th className="text-left pb-2" style={thStyle}>Description</th>
              <th className="text-right pb-2 w-12" style={thStyle}>Qty</th>
              <th className="text-right pb-2 w-28" style={thStyle}>Unit Price</th>
              <th className="text-right pb-2 w-28" style={thStyle}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr
                key={item.id}
                style={{ borderBottom: '1px solid var(--border-default)' }}
              >
                <td
                  className="py-[var(--s3)] pr-[var(--s4)]"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-900)' }}
                >
                  {item.description}
                </td>
                <td
                  className="py-[var(--s3)] text-right"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink-400)' }}
                >
                  {item.quantity}
                </td>
                <td
                  className="py-[var(--s3)] text-right"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink-400)' }}
                >
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td
                  className="py-[var(--s3)] text-right"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500, color: 'var(--ink-900)' }}
                >
                  {formatCurrency(item.subtotal, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totals ── */}
      <div
        className="px-[var(--s5)] py-[var(--s4)] border-t"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="flex flex-col items-end gap-[var(--s2)]">
          {/* Subtotal */}
          <div className="flex items-center gap-[var(--s8)] min-w-[220px] justify-between">
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--ink-400)',
              }}
            >
              Subtotal
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink-900)' }}>
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </span>
          </div>

          {/* Discount */}
          {invoice.discountAmount > 0 && (
            <div className="flex items-center gap-[var(--s8)] min-w-[220px] justify-between">
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--ink-400)',
                }}
              >
                Discount
                {invoice.discountType === 'PERCENTAGE' && ` (${invoice.discount}%)`}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--success)' }}>
                -{formatCurrency(invoice.discountAmount, invoice.currency)}
              </span>
            </div>
          )}

          {/* Tax */}
          {invoice.taxAmount > 0 && (
            <div className="flex items-center gap-[var(--s8)] min-w-[220px] justify-between">
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--ink-400)',
                }}
              >
                Tax
                {invoice.taxType === 'PERCENTAGE' && ` (${invoice.taxRate}%)`}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink-900)' }}>
                +{formatCurrency(invoice.taxAmount, invoice.currency)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div
            className="w-full"
            style={{ height: '1px', background: 'var(--border-default)', marginTop: '4px', marginBottom: '4px' }}
          />

          {/* Total */}
          <div className="flex items-center gap-[var(--s8)] min-w-[220px] justify-between">
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--ink-900)',
                letterSpacing: '-0.02em',
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--ink-900)',
                letterSpacing: '-0.03em',
              }}
            >
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Notes ── */}
      {invoice.notes && (
        <div
          className="px-[var(--s5)] py-[var(--s4)] border-t"
          style={{ borderColor: 'var(--border-default)', background: 'var(--surface-raised)' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ink-400)',
              marginBottom: '6px',
            }}
          >
            Notes
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--ink-400)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  )
}
