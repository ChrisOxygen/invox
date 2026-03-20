'use client'

import { useEffect } from 'react'
import { GripVertical, Trash2 } from 'lucide-react'
import type { Control, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { ZCreateInvoice } from '../../schemas'
import { formatCurrency } from '@/shared/lib/calculate-totals'

type LineItemRowProps = {
  index: number
  control: Control<ZCreateInvoice>
  watch: UseFormWatch<ZCreateInvoice>
  setValue: UseFormSetValue<ZCreateInvoice>
  remove: () => void
  currency: string
}

export function LineItemRow({ index, control, setValue, remove, currency }: LineItemRowProps) {
  const quantity = useWatch({ control, name: `items.${index}.quantity` })
  const unitPrice = useWatch({ control, name: `items.${index}.unitPrice` })

  // Update subtotal whenever qty or unitPrice changes
  useEffect(() => {
    const subtotal = (Number(quantity) || 0) * (Number(unitPrice) || 0)
    setValue(`items.${index}.subtotal`, subtotal, { shouldValidate: false })
  }, [quantity, unitPrice, index, setValue])

  const subtotal = (Number(quantity) || 0) * (Number(unitPrice) || 0)

  return (
    <div
      className="group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--surface-raised)]"
    >
      {/* Drag handle */}
      <div
        className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: 'var(--ink-200)', flexShrink: 0 }}
      >
        <GripVertical size={14} />
      </div>

      {/* Description */}
      <Controller
        control={control}
        name={`items.${index}.description`}
        render={({ field, fieldState }) => (
          <div className="flex-1">
            <input
              {...field}
              type="text"
              placeholder="Item description..."
              className="w-full rounded px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--surface-overlay)] placeholder:text-[var(--ink-300)]"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--ink-900)',
                background: 'transparent',
                border: fieldState.error ? '1px solid var(--error)' : '1px solid transparent',
              }}
            />
          </div>
        )}
      />

      {/* Qty */}
      <Controller
        control={control}
        name={`items.${index}.quantity`}
        render={({ field }) => (
          <div style={{ width: '72px' }}>
            <input
              {...field}
              type="number"
              inputMode="decimal"
              placeholder="1"
              min="0"
              step="any"
              onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
              className="w-full rounded px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--surface-overlay)] text-center"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--ink-900)',
                background: 'transparent',
                border: '1px solid transparent',
              }}
            />
          </div>
        )}
      />

      {/* Unit price */}
      <Controller
        control={control}
        name={`items.${index}.unitPrice`}
        render={({ field }) => (
          <div style={{ width: '110px' }}>
            <input
              {...field}
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              min="0"
              step="any"
              onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
              className="w-full rounded px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--surface-overlay)] text-right"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--ink-900)',
                background: 'transparent',
                border: '1px solid transparent',
              }}
            />
          </div>
        )}
      />

      {/* Subtotal (read-only) */}
      <div
        style={{
          width: '110px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--ink-900)',
          textAlign: 'right',
          flexShrink: 0,
          paddingRight: '8px',
        }}
      >
        {formatCurrency(subtotal, currency)}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={remove}
        className="opacity-0 transition-opacity group-hover:opacity-100 rounded p-1 hover:bg-red-50"
        style={{ color: 'var(--error)', flexShrink: 0 }}
        aria-label="Remove line item"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
