'use client'

import type { Control } from 'react-hook-form'
import { Controller, useWatch } from 'react-hook-form'
import type { ZCreateInvoice } from '../../schemas'
import { formatCurrency } from '@/shared/lib/calculate-totals'

type TotalsPanelProps = {
  control: Control<ZCreateInvoice>
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  currency: string
}

function TypeToggle({
  value,
  onChange,
  disabled,
}: {
  value: 'PERCENTAGE' | 'FIXED'
  onChange: (v: 'PERCENTAGE' | 'FIXED') => void
  disabled?: boolean
}) {
  return (
    <div className="flex rounded overflow-hidden border border-(--border-default) h-6.5">
      {(['PERCENTAGE', 'FIXED'] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt)}
          className={`px-2 text-xs font-medium transition-colors font-display ${
            opt === 'PERCENTAGE' ? 'border-r border-(--border-default)' : ''
          } ${
            value === opt
              ? 'bg-(--blue-50) text-(--blue-600)'
              : 'bg-(--surface-base) text-(--ink-400)'
          }`}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          {opt === 'PERCENTAGE' ? '%' : '₦'}
        </button>
      ))}
    </div>
  )
}

export function TotalsPanel({
  control,
  subtotal,
  taxAmount,
  discountAmount,
  total,
  currency,
}: TotalsPanelProps) {
  const taxRate = useWatch({ control, name: 'taxRate' })
  const discount = useWatch({ control, name: 'discount' })

  const hasDiscount = Number(discount) > 0
  const hasTax = Number(taxRate) > 0

  return (
    <div className="ml-auto mt-4 w-full max-w-85">
      {/* Subtotal */}
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-body text-(--ink-400)">
          Subtotal
        </span>
        <span className="text-sm font-mono text-(--ink-900)">
          {formatCurrency(subtotal, currency)}
        </span>
      </div>

      {/* Discount row */}
      <div className="flex items-center gap-3 py-2">
        <span className="text-sm shrink-0 font-body text-(--ink-400)">
          Discount
        </span>
        <div className="flex flex-1 items-center gap-2">
          <Controller
            control={control}
            name="discount"
            render={({ field }) => (
              <input
                {...field}
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="0"
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                className="w-16 rounded px-2 py-1 text-sm text-right outline-none font-mono text-(--ink-900) border border-(--border-default) bg-(--surface-base)"
              />
            )}
          />
          <Controller
            control={control}
            name="discountType"
            render={({ field }) => (
              <TypeToggle value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <span
          className={`text-sm shrink-0 font-mono text-right min-w-20 ${hasDiscount ? 'text-(--error)' : 'text-(--ink-300)'}`}
        >
          {hasDiscount ? `-${formatCurrency(discountAmount, currency)}` : '—'}
        </span>
      </div>

      {/* Tax row */}
      <div className="flex items-center gap-3 py-2">
        <span className="text-sm shrink-0 font-body text-(--ink-400)">
          VAT / Tax
        </span>
        <div className="flex flex-1 items-center gap-2">
          <Controller
            control={control}
            name="taxRate"
            render={({ field }) => (
              <input
                {...field}
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="0"
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                className="w-16 rounded px-2 py-1 text-sm text-right outline-none font-mono text-(--ink-900) border border-(--border-default) bg-(--surface-base)"
              />
            )}
          />
          <Controller
            control={control}
            name="taxType"
            render={({ field }) => (
              <TypeToggle value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <span
          className={`text-sm shrink-0 font-mono text-right min-w-20 ${hasTax ? 'text-(--ink-900)' : 'text-(--ink-300)'}`}
        >
          {hasTax ? `+${formatCurrency(taxAmount, currency)}` : '—'}
        </span>
      </div>

      {/* Separator */}
      <div className="my-2 h-px bg-(--border-default)" />

      {/* Total */}
      <div className="flex items-center justify-between py-2">
        <span className="font-semibold font-display text-[15px] text-(--ink-900)">
          Total
        </span>
        <span className="font-mono text-[20px] text-(--ink-900) tracking-[-0.02em]">
          {formatCurrency(total, currency)}
        </span>
      </div>
    </div>
  )
}
