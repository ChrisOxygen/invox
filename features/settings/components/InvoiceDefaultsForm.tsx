'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  ZUpdateInvoiceDefaultsSchema,
  type ZUpdateInvoiceDefaults,
} from '@/features/settings/schemas'
import { useUpdateProfile } from '@/features/settings/hooks/use-update-profile'

interface InvoiceDefaultsFormProps {
  defaultValues: {
    currency: string
    invoicePrefix: string
  }
}

const CURRENCIES = [
  { value: 'NGN', label: '₦ Nigerian Naira', flag: 'NGN' },
  { value: 'USD', label: '$ US Dollar', flag: 'USD' },
  { value: 'GBP', label: '£ British Pound', flag: 'GBP' },
  { value: 'EUR', label: '€ Euro', flag: 'EUR' },
  { value: 'CAD', label: 'C$ Canadian Dollar', flag: 'CAD' },
  { value: 'AUD', label: 'A$ Australian Dollar', flag: 'AUD' },
] as const

type CurrencyValue = (typeof CURRENCIES)[number]['value']

export function InvoiceDefaultsForm({ defaultValues }: InvoiceDefaultsFormProps) {
  const { mutate, isPending } = useUpdateProfile({
    onSuccess: () => toast.success('Invoice defaults saved'),
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ZUpdateInvoiceDefaults>({
    resolver: zodResolver(ZUpdateInvoiceDefaultsSchema),
    defaultValues: {
      currency: (defaultValues.currency as CurrencyValue) ?? 'NGN',
      invoicePrefix: defaultValues.invoicePrefix ?? 'INV',
    },
  })

  function onSubmit(data: ZUpdateInvoiceDefaults) {
    mutate(data, {
      onError: (err) => toast.error(err.message),
    })
  }

  const labelClass =
    'text-[12px] font-semibold uppercase tracking-[0.06em] text-(--ink-700) [font-family:var(--font-display)]'
  const inputClass =
    'h-11 w-full rounded-md border border-(--border-default) bg-(--surface-base) px-3.5 text-[14px] text-(--ink-900) placeholder:text-(--ink-300) transition-colors duration-200 focus:border-(--blue-600) focus:outline-none focus:ring-2 focus:ring-(--blue-600)/20'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-5">
        {/* Currency */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="currency" className={labelClass}>
            Default Currency
          </label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => field.onChange(val as CurrencyValue)}
              >
                <SelectTrigger
                  id="currency"
                  className="h-11 rounded-md border-(--border-default) text-[14px] text-(--ink-900) [font-family:var(--font-body)]"
                >
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="[font-family:var(--font-body)]"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.currency && (
            <p className="text-[11px] text-(--error) [font-family:var(--font-body)]" role="alert">
              {errors.currency.message}
            </p>
          )}
        </div>

        {/* Invoice Prefix */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invoicePrefix" className={labelClass}>
            Invoice Prefix
          </label>
          <input
            id="invoicePrefix"
            type="text"
            placeholder="INV"
            maxLength={10}
            {...register('invoicePrefix')}
            className={`${inputClass} font-mono`}
          />
          <p className="text-[12px] text-(--ink-400) [font-family:var(--font-body)]">
            Used in invoice numbers, e.g.{' '}
            <span className="font-mono">INV-2025-0001</span>. Only letters,
            numbers, and hyphens.
          </p>
          {errors.invoicePrefix && (
            <p className="text-[11px] text-(--error) [font-family:var(--font-body)]" role="alert">
              {errors.invoicePrefix.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex h-11 items-center justify-center gap-2 rounded-md bg-(--blue-600) px-6 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-(--blue-700) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--blue-600) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 [font-family:var(--font-display)]"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </form>
  )
}
