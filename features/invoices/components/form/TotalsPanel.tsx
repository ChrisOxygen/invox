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
    <div
      className="flex rounded overflow-hidden border"
      style={{ borderColor: 'var(--border-default)', height: '26px' }}
    >
      {(['PERCENTAGE', 'FIXED'] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt)}
          className="px-2 text-xs font-medium transition-colors"
          style={{
            fontFamily: 'var(--font-display)',
            background: value === opt ? 'var(--blue-50)' : 'var(--surface-base)',
            color: value === opt ? 'var(--blue-600)' : 'var(--ink-400)',
            borderRight: opt === 'PERCENTAGE' ? `1px solid var(--border-default)` : 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
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
  const taxType = useWatch({ control, name: 'taxType' })
  const discount = useWatch({ control, name: 'discount' })
  const discountType = useWatch({ control, name: 'discountType' })

  const hasDiscount = Number(discount) > 0
  const hasTax = Number(taxRate) > 0

  return (
    <div className="ml-auto mt-4" style={{ maxWidth: '340px', width: '100%' }}>
      {/* Subtotal */}
      <div className="flex items-center justify-between py-2">
        <span className="text-sm" style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)' }}>
          Subtotal
        </span>
        <span
          className="text-sm"
          style={{ color: 'var(--ink-900)', fontFamily: 'var(--font-mono)' }}
        >
          {formatCurrency(subtotal, currency)}
        </span>
      </div>

      {/* Discount row */}
      <div className="flex items-center gap-3 py-2">
        <span className="text-sm shrink-0" style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)' }}>
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
                className="w-16 rounded px-2 py-1 text-sm text-right outline-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ink-900)',
                  border: '1px solid var(--border-default)',
                  background: 'var(--surface-base)',
                }}
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
          className="text-sm shrink-0"
          style={{
            color: hasDiscount ? 'var(--error)' : 'var(--ink-300)',
            fontFamily: 'var(--font-mono)',
            minWidth: '80px',
            textAlign: 'right',
          }}
        >
          {hasDiscount ? `-${formatCurrency(discountAmount, currency)}` : '—'}
        </span>
      </div>

      {/* Tax row */}
      <div className="flex items-center gap-3 py-2">
        <span className="text-sm shrink-0" style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)' }}>
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
                className="w-16 rounded px-2 py-1 text-sm text-right outline-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ink-900)',
                  border: '1px solid var(--border-default)',
                  background: 'var(--surface-base)',
                }}
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
          className="text-sm shrink-0"
          style={{
            color: hasTax ? 'var(--ink-900)' : 'var(--ink-300)',
            fontFamily: 'var(--font-mono)',
            minWidth: '80px',
            textAlign: 'right',
          }}
        >
          {hasTax ? `+${formatCurrency(taxAmount, currency)}` : '—'}
        </span>
      </div>

      {/* Separator */}
      <div
        className="my-2 h-px"
        style={{ background: 'var(--border-default)' }}
      />

      {/* Total */}
      <div className="flex items-center justify-between py-2">
        <span
          className="font-semibold"
          style={{
            color: 'var(--ink-900)',
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
          }}
        >
          Total
        </span>
        <span
          style={{
            color: 'var(--ink-900)',
            fontFamily: 'var(--font-mono)',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          {formatCurrency(total, currency)}
        </span>
      </div>
    </div>
  )
}
