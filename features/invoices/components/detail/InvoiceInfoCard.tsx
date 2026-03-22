'use client'

import { Mail, Phone } from 'lucide-react'
import { InvoiceStatusBadge } from '../list/InvoiceStatusBadge'
import type { InvoiceDetail } from '../../types'
import { formatCurrency, formatDate } from '@/shared/lib/utils'

const thClassName =
  'font-display text-[11px] font-bold tracking-[0.08em] uppercase text-(--ink-400) pb-2'

export type InvoiceInfoCardProps = {
  invoice: InvoiceDetail
}

export function InvoiceInfoCard({ invoice }: InvoiceInfoCardProps) {
  const client = invoice.client

  return (
    <div className="rounded border overflow-hidden bg-(--surface-base) border-(--border-default)">
      {/* ── Invoice header ── */}
      <div className="px-(--s5) py-(--s5) border-b border-(--border-default) flex flex-col sm:flex-row sm:items-center sm:justify-between gap-(--s3)">
        <div>
          <p className="font-body text-[11px] font-semibold tracking-[0.08em] uppercase text-(--ink-300) mb-1">
            Invoice
          </p>
          <span className="font-mono text-[22px] text-(--blue-600) tracking-[-0.03em]">
            {invoice.invoiceNumber}
          </span>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      {/* ── Dates ── */}
      <div className="grid grid-cols-2 divide-x px-(--s5) py-(--s4) border-b border-(--border-default)">
        <div className="pr-(--s5)">
          <p className="font-display text-[11px] font-bold tracking-[0.08em] uppercase text-(--ink-400) mb-1">
            Issued
          </p>
          <p className="font-body text-[14px] text-(--ink-900)">
            {formatDate(invoice.issueDate)}
          </p>
        </div>
        <div className="pl-(--s5)">
          <p className="font-display text-[11px] font-bold tracking-[0.08em] uppercase text-(--ink-400) mb-1">
            Due
          </p>
          <p
            className={`font-body text-[14px] ${invoice.status === 'OVERDUE' ? 'text-(--error) font-semibold' : 'text-(--ink-900) font-normal'}`}
          >
            {formatDate(invoice.dueDate)}
          </p>
        </div>
      </div>

      {/* ── Bill To ── */}
      <div className="px-(--s5) py-(--s4) border-b border-(--border-default)">
        <p className="font-display text-[11px] font-bold tracking-[0.08em] uppercase text-(--ink-400) mb-2">
          Bill To
        </p>
        <p className="font-display text-[15px] font-bold text-(--ink-900) tracking-[-0.02em]">
          {client.name}
        </p>
        {client.company && (
          <p className="font-body text-[13px] text-(--ink-400) mt-0.5">
            {client.company}
          </p>
        )}
        <div className="mt-(--s2) space-y-1">
          {client.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0 text-(--ink-300)" />
              <span className="font-body text-[13px] text-(--ink-400)">
                {client.email}
              </span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0 text-(--ink-300)" />
              <span className="font-body text-[13px] text-(--ink-400)">
                {client.phone}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Line items ── */}
      <div className="px-(--s5) pt-(--s4)">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-(--border-default)">
              <th className={`text-left ${thClassName}`}>Description</th>
              <th className={`text-right w-12 ${thClassName}`}>Qty</th>
              <th className={`text-right w-28 ${thClassName}`}>Unit Price</th>
              <th className={`text-right w-28 ${thClassName}`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-(--border-default)"
              >
                <td className="py-(--s3) pr-(--s4) font-body text-[14px] text-(--ink-900)">
                  {item.description}
                </td>
                <td className="py-(--s3) text-right font-mono text-[13px] text-(--ink-400)">
                  {item.quantity}
                </td>
                <td className="py-(--s3) text-right font-mono text-[13px] text-(--ink-400)">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="py-(--s3) text-right font-mono text-[13px] font-medium text-(--ink-900)">
                  {formatCurrency(item.subtotal, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totals ── */}
      <div className="px-(--s5) py-(--s4) border-t border-(--border-default)">
        <div className="flex flex-col items-end gap-(--s2)">
          {/* Subtotal */}
          <div className="flex items-center gap-(--s8) min-w-55 justify-between">
            <span className="font-body text-[13px] text-(--ink-400)">
              Subtotal
            </span>
            <span className="font-mono text-[13px] text-(--ink-900)">
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </span>
          </div>

          {/* Discount */}
          {invoice.discountAmount > 0 && (
            <div className="flex items-center gap-(--s8) min-w-55 justify-between">
              <span className="font-body text-[13px] text-(--ink-400)">
                Discount
                {invoice.discountType === 'PERCENTAGE' && ` (${invoice.discount}%)`}
              </span>
              <span className="font-mono text-[13px] text-(--success)">
                -{formatCurrency(invoice.discountAmount, invoice.currency)}
              </span>
            </div>
          )}

          {/* Tax */}
          {invoice.taxAmount > 0 && (
            <div className="flex items-center gap-(--s8) min-w-55 justify-between">
              <span className="font-body text-[13px] text-(--ink-400)">
                Tax
                {invoice.taxType === 'PERCENTAGE' && ` (${invoice.taxRate}%)`}
              </span>
              <span className="font-mono text-[13px] text-(--ink-900)">
                +{formatCurrency(invoice.taxAmount, invoice.currency)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-(--border-default) my-1" />

          {/* Total */}
          <div className="flex items-center gap-(--s8) min-w-55 justify-between">
            <span className="font-display text-[15px] font-bold text-(--ink-900) tracking-[-0.02em]">
              Total
            </span>
            <span className="font-mono text-[20px] text-(--ink-900) tracking-[-0.03em]">
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Notes ── */}
      {invoice.notes && (
        <div className="px-(--s5) py-(--s4) border-t border-(--border-default) bg-(--surface-raised)">
          <p className="font-display text-[11px] font-bold tracking-[0.08em] uppercase text-(--ink-400) mb-1.5">
            Notes
          </p>
          <p className="font-body text-[13px] text-(--ink-400) whitespace-pre-wrap">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  )
}
