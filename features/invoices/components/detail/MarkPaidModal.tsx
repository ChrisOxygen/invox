'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'
import { ZCreatePaymentSchema, type ZCreatePayment } from '../../schemas'
import type { InvoiceDetail } from '../../types'
import { useMarkInvoicePaid } from '../../hooks/use-mark-invoice-paid'
import { formatCurrency } from '@/shared/lib/utils'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: 'Bank Transfer',
  PAYSTACK: 'Paystack',
  FLUTTERWAVE: 'Flutterwave',
  WISE: 'Wise',
  PAYPAL: 'PayPal',
  CASH: 'Cash',
  OTHER: 'Other',
}

export type MarkPaidModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: InvoiceDetail
}

function getTotalPaid(invoice: InvoiceDetail): number {
  return invoice.payments.reduce((sum, p) => sum + p.amount, 0)
}

function getTodayISODate(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

const labelStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--ink-900)',
  letterSpacing: '-0.01em',
} as const

const errorStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '11px',
  color: 'var(--error)',
} as const

export function MarkPaidModal({ open, onOpenChange, invoice }: MarkPaidModalProps) {
  const totalPaid = getTotalPaid(invoice)
  const remaining = Math.max(0, invoice.total - totalPaid)
  const paidPercent = invoice.total > 0 ? Math.min(100, Math.round((totalPaid / invoice.total) * 100)) : 0

  const mutation = useMarkInvoicePaid({
    onSuccess: () => {
      toast.success('Payment recorded')
      onOpenChange(false)
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ZCreatePayment>({
    resolver: zodResolver(ZCreatePaymentSchema),
    defaultValues: {
      amount: remaining,
      datePaid: getTodayISODate(),
      method: 'BANK_TRANSFER',
      note: '',
    },
  })

  // Reset form when modal opens with fresh remaining balance
  useEffect(() => {
    if (open) {
      reset({
        amount: remaining,
        datePaid: getTodayISODate(),
        method: 'BANK_TRANSFER',
        note: '',
      })
    }
  }, [open, remaining, reset])

  const watchedAmount = watch('amount') ?? 0
  const newTotalPaid = totalPaid + (isNaN(watchedAmount) ? 0 : watchedAmount)
  const newPercent = invoice.total > 0 ? Math.min(100, Math.round((newTotalPaid / invoice.total) * 100)) : 0

  const onSubmit = (data: ZCreatePayment) => {
    mutation.mutate({
      invoiceId: invoice.id,
      data,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[460px]"
        style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
      >
        <DialogHeader>
          <DialogTitle
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--ink-900)',
              letterSpacing: '-0.02em',
            }}
          >
            Record Payment
          </DialogTitle>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--ink-400)',
              marginTop: '2px',
            }}
          >
            {invoice.invoiceNumber}
          </p>
        </DialogHeader>

        {/* Outstanding balance summary */}
        <div
          className="rounded-[var(--r-lg)] px-[var(--s4)] py-[var(--s3)]"
          style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-400)' }}>
            Outstanding balance
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--ink-900)',
              letterSpacing: '-0.03em',
              marginTop: '2px',
            }}
          >
            {formatCurrency(remaining, invoice.currency)}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-400)', marginTop: '4px' }}>
            {formatCurrency(totalPaid, invoice.currency)} paid of{' '}
            {formatCurrency(invoice.total, invoice.currency)} total ({paidPercent}%)
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[var(--s4)]">
          {/* Amount */}
          <div className="space-y-[var(--s1)]">
            <Label style={labelStyle}>Amount</Label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: 'var(--ink-400)',
                }}
              >
                ₦
              </span>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                className="pl-7"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  borderColor: errors.amount ? 'var(--error)' : 'var(--border-strong)',
                  borderRadius: 'var(--r-md)',
                }}
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p style={errorStyle}>{errors.amount.message}</p>
            )}
          </div>

          {/* Date Paid */}
          <div className="space-y-[var(--s1)]">
            <Label style={labelStyle}>Date Paid</Label>
            <Input
              type="date"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                borderColor: errors.datePaid ? 'var(--error)' : 'var(--border-strong)',
                borderRadius: 'var(--r-md)',
              }}
              {...register('datePaid')}
            />
            {errors.datePaid && (
              <p style={errorStyle}>{errors.datePaid.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-[var(--s1)]">
            <Label style={labelStyle}>Payment Method</Label>
            <Select
              defaultValue="BANK_TRANSFER"
              onValueChange={(val) => setValue('method', val as ZCreatePayment['method'], { shouldValidate: true })}
            >
              <SelectTrigger
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  borderColor: errors.method ? 'var(--error)' : 'var(--border-strong)',
                  borderRadius: 'var(--r-md)',
                }}
              >
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}>
                {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-900)' }}
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.method && (
              <p style={errorStyle}>{errors.method.message}</p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-[var(--s1)]">
            <Label style={labelStyle}>
              Note{' '}
              <span style={{ fontWeight: 400, color: 'var(--ink-300)' }}>(optional)</span>
            </Label>
            <Textarea
              rows={2}
              placeholder="e.g. Reference: TXN-00432"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                borderColor: 'var(--border-strong)',
                borderRadius: 'var(--r-md)',
                resize: 'none',
              }}
              {...register('note')}
            />
          </div>

          {/* Running total */}
          <div
            className="rounded-[var(--r-md)] px-[var(--s3)] py-[var(--s2)]"
            style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-100)' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--blue-700)',
              }}
            >
              After this payment:{' '}
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {formatCurrency(Math.min(newTotalPaid, invoice.total), invoice.currency)}
              </span>{' '}
              paid of{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(invoice.total, invoice.currency)}
              </span>{' '}
              ({newPercent}%)
            </p>
          </div>

          <DialogFooter className="gap-[var(--s2)] pt-[var(--s2)]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
              style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--ink-400)' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="gap-1.5"
              style={{
                background: 'var(--blue-600)',
                color: 'white',
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                borderRadius: 'var(--r-md)',
              }}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Recording…
                </>
              ) : (
                'Record Payment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
