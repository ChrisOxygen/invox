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
        className="sm:max-w-[460px] bg-(--surface-base) border-(--border-default)"
      >
        <DialogHeader>
          <DialogTitle className="[font-family:var(--font-display)] text-[17px] font-bold text-(--ink-900) tracking-[-0.02em]">
            Record Payment
          </DialogTitle>
          <p className="font-mono text-[12px] text-(--ink-400) mt-0.5">
            {invoice.invoiceNumber}
          </p>
        </DialogHeader>

        {/* Outstanding balance summary */}
        <div className="rounded-lg px-(--s4) py-(--s3) bg-(--surface-raised) border border-(--border-default)">
          <p className="[font-family:var(--font-body)] text-[12px] text-(--ink-400)">
            Outstanding balance
          </p>
          <p className="[font-family:var(--font-mono)] text-[22px] font-bold text-(--ink-900) tracking-[-0.03em] mt-0.5">
            {formatCurrency(remaining, invoice.currency)}
          </p>
          <p className="[font-family:var(--font-body)] text-[12px] text-(--ink-400) mt-1">
            {formatCurrency(totalPaid, invoice.currency)} paid of{' '}
            {formatCurrency(invoice.total, invoice.currency)} total ({paidPercent}%)
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-(--s4)">
          {/* Amount */}
          <div className="space-y-(--s1)">
            <Label className="[font-family:var(--font-display)] text-[12px] font-semibold text-(--ink-900) tracking-[-0.01em]">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none [font-family:var(--font-mono)] text-[14px] text-(--ink-400)">
                ₦
              </span>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                className={`pl-7 [font-family:var(--font-mono)] text-[14px] rounded-md ${errors.amount ? 'border-(--error)' : 'border-(--border-strong)'}`}
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="[font-family:var(--font-body)] text-[11px] text-(--error)">{errors.amount.message}</p>
            )}
          </div>

          {/* Date Paid */}
          <div className="space-y-(--s1)">
            <Label className="[font-family:var(--font-display)] text-[12px] font-semibold text-(--ink-900) tracking-[-0.01em]">
              Date Paid
            </Label>
            <Input
              type="date"
              className={`[font-family:var(--font-body)] text-[14px] rounded-md ${errors.datePaid ? 'border-(--error)' : 'border-(--border-strong)'}`}
              {...register('datePaid')}
            />
            {errors.datePaid && (
              <p className="[font-family:var(--font-body)] text-[11px] text-(--error)">{errors.datePaid.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-(--s1)">
            <Label className="[font-family:var(--font-display)] text-[12px] font-semibold text-(--ink-900) tracking-[-0.01em]">
              Payment Method
            </Label>
            <Select
              defaultValue="BANK_TRANSFER"
              onValueChange={(val) => setValue('method', val as ZCreatePayment['method'], { shouldValidate: true })}
            >
              <SelectTrigger
                className={`[font-family:var(--font-body)] text-[14px] rounded-md ${errors.method ? 'border-(--error)' : 'border-(--border-strong)'}`}
              >
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent className="border-(--border-default) bg-(--surface-base)">
                {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="[font-family:var(--font-body)] text-[14px] text-(--ink-900)"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.method && (
              <p className="[font-family:var(--font-body)] text-[11px] text-(--error)">{errors.method.message}</p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-(--s1)">
            <Label className="[font-family:var(--font-display)] text-[12px] font-semibold text-(--ink-900) tracking-[-0.01em]">
              Note{' '}
              <span className="font-normal text-(--ink-300)">(optional)</span>
            </Label>
            <Textarea
              rows={2}
              placeholder="e.g. Reference: TXN-00432"
              className="[font-family:var(--font-body)] text-[14px] resize-none border-(--border-strong) rounded-md"
              {...register('note')}
            />
          </div>

          {/* Running total */}
          <div className="rounded-md px-(--s3) py-(--s2) bg-(--blue-50) border border-(--blue-100)">
            <p className="[font-family:var(--font-body)] text-[12px] text-(--blue-700)">
              After this payment:{' '}
              <span className="[font-family:var(--font-mono)] font-semibold">
                {formatCurrency(Math.min(newTotalPaid, invoice.total), invoice.currency)}
              </span>{' '}
              paid of{' '}
              <span className="[font-family:var(--font-mono)]">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>{' '}
              ({newPercent}%)
            </p>
          </div>

          <DialogFooter className="gap-(--s2) pt-(--s2)">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
              className="[font-family:var(--font-display)] text-[13px] text-(--ink-400)"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="gap-1.5 bg-(--blue-600) text-white [font-family:var(--font-display)] text-[13px] rounded-md"
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
