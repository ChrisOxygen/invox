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
      className="flex items-start justify-between gap-[var(--s3)] py-[var(--s3)]"
      style={{ borderBottom: '1px solid var(--border-default)' }}
    >
      <div className="flex items-start gap-[var(--s3)] min-w-0 flex-1">
        <div
          className="mt-0.5 w-7 h-7 rounded-[var(--r-md)] flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--surface-overlay)' }}
        >
          <CreditCard className="h-3.5 w-3.5" style={{ color: 'var(--ink-400)' }} />
        </div>
        <div className="min-w-0">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--ink-900)',
              fontWeight: 500,
            }}
          >
            {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
            <span style={{ color: 'var(--ink-300)', margin: '0 4px' }}>·</span>
            <span style={{ color: 'var(--ink-400)', fontWeight: 400 }}>
              {formatDate(payment.datePaid)}
            </span>
          </p>
          {payment.note && (
            <p
              className="mt-0.5 truncate"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--ink-400)',
              }}
            >
              {payment.note}
            </p>
          )}
        </div>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--success)',
          flexShrink: 0,
        }}
      >
        +{formatCurrency(payment.amount, currency)}
      </span>
    </div>
  )
}

function EmptyPayments() {
  return (
    <div
      className="flex flex-col items-center justify-center py-[var(--s10)] text-center"
    >
      <div
        className="w-10 h-10 rounded-[var(--r-xl)] flex items-center justify-center mb-[var(--s3)]"
        style={{ background: 'var(--surface-overlay)' }}
      >
        <Receipt className="h-5 w-5" style={{ color: 'var(--ink-300)' }} />
      </div>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--ink-400)',
        }}
      >
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
    <div
      className="rounded-[var(--r-xl)] border overflow-hidden"
      style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)' }}
    >
      {/* Header */}
      <div
        className="px-[var(--s5)] py-[var(--s4)] border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--ink-900)',
            letterSpacing: '-0.02em',
          }}
        >
          Payment History
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRecordPayment}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            borderColor: 'var(--border-strong)',
            color: 'var(--ink-900)',
            borderRadius: 'var(--r-md)',
          }}
        >
          Record Payment
        </Button>
      </div>

      {/* Payment rows */}
      <div className="px-[var(--s5)]">
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
        <div
          className="px-[var(--s5)] py-[var(--s4)] border-t"
          style={{ borderColor: 'var(--border-default)', background: 'var(--surface-raised)' }}
        >
          {/* Progress bar */}
          <div
            className="w-full rounded-full mb-[var(--s3)]"
            style={{ height: '4px', background: 'var(--border-default)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${paidPercent}%`,
                background: 'var(--blue-600)',
                transition: 'width 350ms ease',
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--ink-400)',
              }}
            >
              Total paid ({paidPercent}%)
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--ink-900)',
              }}
            >
              {formatCurrency(totalPaid, invoice.currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
