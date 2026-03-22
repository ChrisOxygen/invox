'use client'

import { CreditCard, Receipt } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { InvoiceDetail, InvoicePayment } from '../../types'
import { formatCurrency, formatDate } from '@/shared/lib/utils'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: 'Bank Transfer',
  PAYSTACK: 'Paystack',
  FLUTTERWAVE: 'Flutterwave',
  WISE: 'Wise',
  PAYPAL: 'PayPal',
  CASH: 'Cash',
  OTHER: 'Other',
}

function PaymentRow({ payment, currency }: { payment: InvoicePayment; currency: string }) {
  return (
    <div
      className="flex items-start justify-between gap-(--s3) py-(--s3) border-b border-(--border-default)"
    >
      <div className="flex items-start gap-(--s3) min-w-0 flex-1">
        <div className="mt-0.5 w-7 h-7 rounded flex items-center justify-center shrink-0 bg-(--surface-overlay)">
          <CreditCard className="h-3.5 w-3.5 text-(--ink-400)" />
        </div>
        <div className="min-w-0">
          <p className="[font-family:var(--font-body)] text-[13px] text-(--ink-900) font-medium">
            {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
            <span className="text-(--ink-300) mx-1">·</span>
            <span className="text-(--ink-400) font-normal">
              {formatDate(payment.datePaid)}
            </span>
          </p>
          {payment.note && (
            <p className="mt-0.5 truncate [font-family:var(--font-body)] text-[12px] text-(--ink-400)">
              {payment.note}
            </p>
          )}
        </div>
      </div>
      <span className="font-mono text-[13px] font-semibold text-(--success) shrink-0">
        +{formatCurrency(payment.amount, currency)}
      </span>
    </div>
  )
}

function EmptyPayments() {
  return (
    <div className="flex flex-col items-center justify-center py-(--s10) text-center">
      <div className="w-10 h-10 rounded flex items-center justify-center mb-(--s3) bg-(--surface-overlay)">
        <Receipt className="h-5 w-5 text-(--ink-300)" />
      </div>
      <p className="[font-family:var(--font-body)] text-[13px] text-(--ink-400)">
        No payments recorded yet
      </p>
    </div>
  )
}

export type PaymentLogProps = {
  invoice: InvoiceDetail
  onRecordPayment: () => void
}

export function PaymentLog({ invoice, onRecordPayment }: PaymentLogProps) {
  const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0)
  const paidPercent =
    invoice.total > 0 ? Math.min(100, Math.round((totalPaid / invoice.total) * 100)) : 0

  return (
    <div className="rounded border overflow-hidden bg-(--surface-base) border-(--border-default)">
      {/* Header */}
      <div className="px-(--s5) py-(--s4) border-b border-(--border-default) flex items-center justify-between">
        <h3 className="[font-family:var(--font-display)] text-[15px] font-bold text-(--ink-900) tracking-[-0.02em]">
          Payment History
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRecordPayment}
          className="[font-family:var(--font-display)] text-[12px] border-(--border-strong) text-(--ink-900) rounded"
        >
          Record Payment
        </Button>
      </div>

      {/* Payment rows */}
      <div className="px-(--s5)">
        {invoice.payments.length === 0 ? (
          <EmptyPayments />
        ) : (
          <div>
            {invoice.payments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} currency={invoice.currency} />
            ))}
          </div>
        )}
      </div>

      {/* Footer totals */}
      {invoice.payments.length > 0 && (
        <div className="px-(--s5) py-(--s4) border-t border-(--border-default) bg-(--surface-raised)">
          {/* Progress bar */}
          <div className="w-full rounded-full mb-(--s3) bg-(--border-default) h-px" style={{ height: '4px' }}>
            <div
              className="h-full rounded-full bg-(--blue-600)"
              style={{
                width: `${paidPercent}%`,
                transition: 'width 350ms ease',
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="[font-family:var(--font-body)] text-[12px] text-(--ink-400)">
              Total paid ({paidPercent}%)
            </span>
            <span className="font-mono text-[14px] font-semibold text-(--ink-900)">
              {formatCurrency(totalPaid, invoice.currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
