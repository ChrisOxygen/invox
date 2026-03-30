'use client'

import { useEffect } from 'react'
import { GripVertical, Trash2 } from 'lucide-react'
import type { Control, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { ZInvoiceFormInput } from '../../schemas'
import { formatCurrency } from '@/shared/lib/calculate-totals'

type LineItemRowProps = {
  index: number
  control: Control<ZInvoiceFormInput>
  watch: UseFormWatch<ZInvoiceFormInput>
  setValue: UseFormSetValue<ZInvoiceFormInput>
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
    <div className="group flex items-center gap-2 rounded px-2 py-2 transition-colors hover:bg-(--surface-raised)">
      {/* Drag handle */}
      <div className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100 text-(--ink-200) shrink-0">
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
              className={`w-full rounded px-2 py-1.5 text-sm outline-none transition-colors focus:bg-(--surface-overlay) placeholder:text-(--ink-300) font-body text-(--ink-900) bg-transparent border ${fieldState.error ? 'border-(--error)' : 'border-transparent'}`}
            />
          </div>
        )}
      />

      {/* Qty */}
      <Controller
        control={control}
        name={`items.${index}.quantity`}
        render={({ field }) => (
          <div className="w-[72px]">
            <input
              {...field}
              type="number"
              inputMode="decimal"
              placeholder="1"
              min="0"
              step="any"
              onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
              className="w-full rounded px-2 py-1.5 text-sm outline-none transition-colors focus:bg-(--surface-overlay) text-center font-body text-(--ink-900) bg-transparent border border-transparent"
            />
          </div>
        )}
      />

      {/* Unit price */}
      <Controller
        control={control}
        name={`items.${index}.unitPrice`}
        render={({ field }) => (
          <div className="w-[110px]">
            <input
              {...field}
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              min="0"
              step="any"
              onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
              className="w-full rounded px-2 py-1.5 text-sm outline-none transition-colors focus:bg-(--surface-overlay) text-right font-mono text-(--ink-900) bg-transparent border border-transparent"
            />
          </div>
        )}
      />

      {/* Subtotal (read-only) */}
      <div
        className="font-mono text-[13px] text-(--ink-900) text-right shrink-0 pr-2"
        style={{ width: '110px' }}
      >
        {formatCurrency(subtotal, currency)}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={remove}
        className="opacity-0 transition-opacity group-hover:opacity-100 rounded p-1 hover:bg-red-50 text-(--error) shrink-0"
        aria-label="Remove line item"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
