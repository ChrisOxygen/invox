'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Separator } from '@/shared/components/ui/separator'

import { ZCreateInvoiceSchema } from '../../schemas'
import type { ZCreateInvoice } from '../../schemas'
import type { InvoiceDetail } from '../../types'
import { useCreateInvoice } from '../../hooks/use-create-invoice'
import { useUpdateInvoice } from '../../hooks/use-update-invoice'
import { calculateTotals, formatCurrency } from '@/shared/lib/calculate-totals'

import { ClientSelector } from './ClientSelector'
import { LineItemRow } from './LineItemRow'
import { TotalsPanel } from './TotalsPanel'

type InvoiceFormProps = {
  invoice?: InvoiceDetail
  onSuccess?: (data: { id: string; invoiceNumber: string }) => void
}

const DUE_DATE_PRESETS = [
  { label: 'On receipt', days: 0 },
  { label: 'Net 15', days: 15 },
  { label: 'Net 30', days: 30 },
  { label: 'Net 45', days: 45 },
]

function toDateInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

export function InvoiceForm({ invoice, onSuccess }: InvoiceFormProps) {
  const router = useRouter()
  const isEditing = Boolean(invoice)

  const createMutation = useCreateInvoice({ onSuccess })
  const updateMutation = useUpdateInvoice()
  const isPending = createMutation.isPending || updateMutation.isPending

  const today = new Date()
  const defaultDueDate = new Date(today)
  defaultDueDate.setDate(defaultDueDate.getDate() + 30)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<ZCreateInvoice>({
    resolver: zodResolver(ZCreateInvoiceSchema) as any,
    defaultValues: invoice
      ? {
          clientId: invoice.client?.id ?? '',
          issueDate: toDateInput(invoice.issueDate),
          dueDate: toDateInput(invoice.dueDate),
          currency: invoice.currency,
          taxRate: invoice.taxRate,
          taxType: invoice.taxType,
          discount: invoice.discount,
          discountType: invoice.discountType,
          subtotal: invoice.subtotal,
          taxAmount: invoice.taxAmount,
          discountAmount: invoice.discountAmount,
          total: invoice.total,
          notes: invoice.notes ?? '',
          internalNotes: invoice.internalNotes ?? '',
          items: invoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        }
      : {
          clientId: '',
          issueDate: toDateInput(today),
          dueDate: toDateInput(defaultDueDate),
          currency: 'NGN',
          taxRate: 0,
          taxType: 'PERCENTAGE',
          discount: 0,
          discountType: 'PERCENTAGE',
          subtotal: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: 0,
          notes: '',
          internalNotes: '',
          items: [{ description: '', quantity: 1, unitPrice: 0, subtotal: 0 }],
        },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' })

  // Watch fields for live totals calculation
  const watchedItems = useWatch({ control: form.control, name: 'items' })
  const watchedTaxRate = useWatch({ control: form.control, name: 'taxRate' })
  const watchedTaxType = useWatch({ control: form.control, name: 'taxType' })
  const watchedDiscount = useWatch({ control: form.control, name: 'discount' })
  const watchedDiscountType = useWatch({ control: form.control, name: 'discountType' })
  const watchedCurrency = useWatch({ control: form.control, name: 'currency' })

  const totals = calculateTotals({
    items: watchedItems ?? [],
    taxRate: Number(watchedTaxRate) || 0,
    taxType: watchedTaxType ?? 'PERCENTAGE',
    discount: Number(watchedDiscount) || 0,
    discountType: watchedDiscountType ?? 'PERCENTAGE',
  })

  // Sync calculated totals back to form
  useEffect(() => {
    form.setValue('subtotal', totals.subtotal)
    form.setValue('taxAmount', totals.taxAmount)
    form.setValue('discountAmount', totals.discountAmount)
    form.setValue('total', totals.total)
  }, [totals.subtotal, totals.taxAmount, totals.discountAmount, totals.total, form])

  // Auto-save draft (edit mode only)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleAutoSave = useCallback(() => {
    if (!isEditing || !invoice) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      const values = form.getValues()
      try {
        await updateMutation.mutateAsync({ ...values, id: invoice.id })
      } catch {
        // Silent auto-save failure
      }
    }, 2000)
  }, [isEditing, invoice, form, updateMutation])

  useEffect(() => {
    const subscription = form.watch(() => handleAutoSave())
    return () => subscription.unsubscribe()
  }, [form, handleAutoSave])

  function setDueDatePreset(days: number) {
    const issue = new Date(form.getValues('issueDate'))
    const due = new Date(issue)
    due.setDate(due.getDate() + days)
    form.setValue('dueDate', toDateInput(due))
  }

  const onSubmit = async (values: ZCreateInvoice, markAsSent = false) => {
    try {
      if (isEditing && invoice) {
        await updateMutation.mutateAsync({ ...values, id: invoice.id })
        if (markAsSent) {
          await fetch(`/api/v1/invoices/${invoice.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'SENT' }),
          })
        }
        toast.success(markAsSent ? 'Invoice marked as sent' : 'Invoice saved')
        router.push(`/invoices/${invoice.id}`)
      } else {
        const result = await createMutation.mutateAsync(values)
        if (markAsSent) {
          await fetch(`/api/v1/invoices/${result.id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'SENT' }),
          })
        }
        toast.success(markAsSent ? 'Invoice created and marked as sent' : 'Draft saved')
        router.push(`/invoices/${result.id}`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit(v, false))} className="space-y-0">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">

          {/* ── Left column: form ── */}
          <div className="space-y-8">

            {/* Section: Header */}
            <div className="rounded border border-(--border-default) bg-(--surface-base)">
              <div className="flex items-center justify-between px-6 py-4 border-b border-(--border-default)">
                <p className="text-sm font-semibold font-display text-(--ink-900)">
                  Invoice Details
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase font-display text-(--ink-400) tracking-[0.08em]">
                    Invoice #
                  </span>
                  <span
                    className="font-mono text-sm font-medium"
                    style={{ color: invoice ? 'var(--blue-600)' : 'var(--ink-300)' }}
                  >
                    {invoice?.invoiceNumber ?? 'Auto-generated'}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Dates row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Issue date */}
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold uppercase font-display text-(--ink-400) tracking-[0.08em]">
                          Issue Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            disabled={isPending}
                            className="rounded font-body"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-(--error)" />
                      </FormItem>
                    )}
                  />

                  {/* Due date */}
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold uppercase font-display text-(--ink-400) tracking-[0.08em]">
                          Due Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            disabled={isPending}
                            className="rounded font-body"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-(--error)" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {DUE_DATE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setDueDatePreset(preset.days)}
                      className="rounded px-2 py-0.5 text-xs transition-colors hover:bg-(--blue-50) hover:text-(--blue-600) font-body text-(--ink-400) border border-(--border-default) bg-(--surface-base)"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section: Bill To */}
            <div className="rounded border p-6 border-(--border-default) bg-(--surface-base)">
              <p className="mb-5 text-sm font-semibold font-display text-(--ink-900)">
                Bill To
              </p>
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold uppercase font-display text-(--ink-400) tracking-[0.08em]">
                      Client *
                    </FormLabel>
                    <FormControl>
                      <ClientSelector
                        value={field.value || null}
                        onChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-(--error)" />
                  </FormItem>
                )}
              />
            </div>

            {/* Section: Line Items */}
            <div className="rounded border border-(--border-default) bg-(--surface-base)">
              {/* Table header */}
              <div className="flex items-center gap-2 border-b px-4 py-3 border-(--border-default)">
                <span className="flex-1 text-xs font-semibold uppercase text-(--ink-400) font-display tracking-[0.08em]">
                  Description
                </span>
                <span className="text-xs font-semibold uppercase text-center text-(--ink-400) font-display tracking-[0.08em]" style={{ width: '72px' }}>
                  Qty
                </span>
                <span className="text-xs font-semibold uppercase text-right text-(--ink-400) font-display tracking-[0.08em]" style={{ width: '110px' }}>
                  Unit Price
                </span>
                <span className="text-xs font-semibold uppercase text-right text-(--ink-400) font-display tracking-[0.08em] pr-2" style={{ width: '110px' }}>
                  Amount
                </span>
                <div style={{ width: '28px' }} />
              </div>

              {/* Line item rows */}
              <div className="px-2 py-2 space-y-0.5">
                {fields.length === 0 && (
                  <div className="flex flex-col items-center gap-2 py-10 text-(--ink-300)">
                    <FileText size={32} />
                    <p className="text-sm font-body">
                      Add your first line item
                    </p>
                  </div>
                )}
                {fields.map((field, index) => (
                  <LineItemRow
                    key={field.id}
                    index={index}
                    control={form.control}
                    watch={form.watch}
                    setValue={form.setValue}
                    remove={() => remove(index)}
                    currency={watchedCurrency ?? 'NGN'}
                  />
                ))}
              </div>

              {/* Add item button */}
              <div className="border-t px-4 py-3 border-(--border-default)">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => append({ description: '', quantity: 1, unitPrice: 0, subtotal: 0 })}
                  className="rounded h-8 gap-1.5 text-sm text-(--blue-600) font-body"
                >
                  <Plus size={13} />
                  Add item
                </Button>
              </div>

              {/* Totals */}
              <div className="border-t px-6 py-4 border-(--border-default)">
                <TotalsPanel
                  control={form.control}
                  subtotal={totals.subtotal}
                  taxAmount={totals.taxAmount}
                  discountAmount={totals.discountAmount}
                  total={totals.total}
                  currency={watchedCurrency ?? 'NGN'}
                />
              </div>
            </div>

            {/* Section: Notes */}
            <div className="rounded border p-6 border-(--border-default) bg-(--surface-base)">
              <p className="mb-5 text-sm font-semibold font-display text-(--ink-900)">
                Notes
              </p>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold uppercase font-display text-(--ink-400) tracking-[0.08em]">
                        Notes to Client
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ''}
                          placeholder="Payment terms, bank account details, thank you note..."
                          rows={3}
                          className="rounded resize-none font-body"
                          disabled={isPending}
                        />
                      </FormControl>
                      <p className="text-xs text-(--ink-300) font-body">
                        Visible on the PDF invoice
                      </p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold uppercase font-display text-(--ink-400) tracking-[0.08em]">
                        Internal Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ''}
                          placeholder="Private notes — not shown on the invoice..."
                          rows={2}
                          className="rounded resize-none font-body"
                          disabled={isPending}
                        />
                      </FormControl>
                      <p className="text-xs text-(--ink-300) font-body">
                        Hidden from the client and PDF
                      </p>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between gap-3 pb-8">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isPending}
                className="rounded font-display"
              >
                Cancel
              </Button>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isPending}
                  className="rounded font-display"
                >
                  {isPending && createMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    'Save Draft'
                  )}
                </Button>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={form.handleSubmit((v) => onSubmit(v, true))}
                  className="rounded bg-(--blue-600) font-display"
                >
                  {isPending && updateMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    isEditing ? 'Save & Send' : 'Create & Send'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* ── Right column: live summary ── */}
          <div className="hidden lg:block">
            <div className="sticky top-6 rounded border p-5 border-(--border-default) bg-(--surface-raised)">
              <p className="mb-4 text-xs font-semibold uppercase font-display text-(--ink-400) tracking-[0.08em]">
                Summary
              </p>

              {/* Total amount */}
              <div className="mb-4">
                <div
                  className="font-mono font-semibold text-(--ink-900) tracking-[-0.04em]"
                  style={{ fontSize: '28px' }}
                >
                  {formatCurrency(totals.total, watchedCurrency ?? 'NGN')}
                </div>
                <p className="mt-1 text-xs text-(--ink-400) font-body">
                  {fields.length} line item{fields.length !== 1 ? 's' : ''}
                </p>
              </div>

              <Separator className="bg-(--border-default)" />

              {/* Mini breakdown */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-(--ink-400) font-body">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(totals.subtotal, watchedCurrency ?? 'NGN')}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-(--error) font-body">
                    <span>Discount</span>
                    <span className="font-mono">-{formatCurrency(totals.discountAmount, watchedCurrency ?? 'NGN')}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-xs text-(--ink-900) font-body">
                    <span>Tax</span>
                    <span className="font-mono">+{formatCurrency(totals.taxAmount, watchedCurrency ?? 'NGN')}</span>
                  </div>
                )}
              </div>

              {/* Draft badge */}
              <div className="mt-5">
                <span className="rounded px-3 py-1 text-xs font-semibold bg-(--blue-50) text-(--blue-700) font-display">
                  {isEditing ? invoice?.status : 'DRAFT'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </form>
    </Form>
  )
}
