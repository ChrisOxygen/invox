'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ZUpdateBusinessInfoSchema, type ZUpdateBusinessInfo } from '@/features/settings/schemas'
import { useUpdateProfile } from '@/features/settings/hooks/use-update-profile'
import type { ProfileData } from '@/features/settings/hooks/use-profile'

interface BusinessInfoFormProps {
  defaultValues: ProfileData
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      className="text-[11px] text-[var(--error)]"
      style={{ fontFamily: 'var(--font-body)' }}
      role="alert"
    >
      {message}
    </p>
  )
}

export function BusinessInfoForm({ defaultValues }: BusinessInfoFormProps) {
  const { mutate, isPending } = useUpdateProfile({
    onSuccess: () => toast.success('Business info saved'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ZUpdateBusinessInfo>({
    resolver: zodResolver(ZUpdateBusinessInfoSchema),
    defaultValues: {
      businessName: defaultValues.businessName ?? '',
      address: defaultValues.address ?? '',
      city: defaultValues.city ?? '',
      state: defaultValues.state ?? '',
      zipCode: defaultValues.zipCode ?? '',
      country: defaultValues.country ?? '',
      phone: defaultValues.phone ?? '',
      email: defaultValues.email ?? '',
      website: defaultValues.website ?? '',
      taxNumber: defaultValues.taxNumber ?? '',
      rcNumber: defaultValues.rcNumber ?? '',
    },
  })

  function onSubmit(data: ZUpdateBusinessInfo) {
    mutate(data, {
      onError: (err) => toast.error(err.message),
    })
  }

  const inputClass =
    'h-[44px] w-full rounded-[var(--r-md)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] transition-colors duration-200 focus:border-[var(--blue-600)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-600)]/20'
  const labelClass =
    'text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--ink-700)]'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        {/* Business name — full width */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="businessName"
            className={labelClass}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            placeholder="Chidi Okeke Design Studio"
            {...register('businessName')}
            className={inputClass}
            style={{ fontFamily: 'var(--font-body)' }}
          />
          <FieldError message={errors.businessName?.message} />
        </div>

        {/* Address — full width */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="address"
            className={labelClass}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Street Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="12 Adeola Odeku Street"
            {...register('address')}
            className={inputClass}
            style={{ fontFamily: 'var(--font-body)' }}
          />
          <FieldError message={errors.address?.message} />
        </div>

        {/* City + State */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="city"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              City
            </label>
            <input
              id="city"
              type="text"
              placeholder="Lagos"
              {...register('city')}
              className={inputClass}
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <FieldError message={errors.city?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="state"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              State
            </label>
            <input
              id="state"
              type="text"
              placeholder="Lagos State"
              {...register('state')}
              className={inputClass}
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <FieldError message={errors.state?.message} />
          </div>
        </div>

        {/* Zip + Country */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="zipCode"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Zip / Postal Code
            </label>
            <input
              id="zipCode"
              type="text"
              placeholder="100001"
              {...register('zipCode')}
              className={inputClass}
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <FieldError message={errors.zipCode?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="country"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              placeholder="Nigeria"
              {...register('country')}
              className={inputClass}
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <FieldError message={errors.country?.message} />
          </div>
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+234 801 234 5678"
              {...register('phone')}
              className={inputClass}
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <FieldError message={errors.phone?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Business Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="hello@yourbusiness.com"
              {...register('email')}
              className={inputClass}
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        {/* Website — full width */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="website"
            className={labelClass}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Website
          </label>
          <input
            id="website"
            type="url"
            placeholder="https://yourbusiness.com"
            {...register('website')}
            className={inputClass}
            style={{ fontFamily: 'var(--font-body)' }}
          />
          <FieldError message={errors.website?.message} />
        </div>

        {/* TIN + RC Number */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="taxNumber"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              TIN (Tax Identification Number)
            </label>
            <input
              id="taxNumber"
              type="text"
              placeholder="12345678-0001"
              {...register('taxNumber')}
              className={inputClass}
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <FieldError message={errors.taxNumber?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rcNumber"
              className={labelClass}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              RC Number (CAC)
            </label>
            <input
              id="rcNumber"
              type="text"
              placeholder="RC-1234567"
              {...register('rcNumber')}
              className={inputClass}
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <FieldError message={errors.rcNumber?.message} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex h-[44px] items-center justify-center gap-2 rounded-[var(--r-md)] bg-[var(--blue-600)] px-6 text-[14px] font-[600] text-white transition-colors duration-200 hover:bg-[var(--blue-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-600)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </form>
  )
}
