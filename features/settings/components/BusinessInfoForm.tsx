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
    <p className="text-[11px] text-(--error) [font-family:var(--font-body)]" role="alert">
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
    'h-11 w-full rounded-md border border-(--border-default) bg-(--surface-base) px-3.5 text-[14px] text-(--ink-900) placeholder:text-(--ink-300) transition-colors duration-200 focus:border-(--blue-600) focus:outline-none focus:ring-2 focus:ring-(--blue-600)/20 [font-family:var(--font-body)]'
  const labelClass =
    'text-[12px] font-semibold uppercase tracking-[0.06em] text-(--ink-700) [font-family:var(--font-display)]'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        {/* Business name — full width */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="businessName" className={labelClass}>
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            placeholder="Chidi Okeke Design Studio"
            {...register('businessName')}
            className={inputClass}
          />
          <FieldError message={errors.businessName?.message} />
        </div>

        {/* Address — full width */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className={labelClass}>
            Street Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="12 Adeola Odeku Street"
            {...register('address')}
            className={inputClass}
          />
          <FieldError message={errors.address?.message} />
        </div>

        {/* City + State */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input
              id="city"
              type="text"
              placeholder="Lagos"
              {...register('city')}
              className={inputClass}
            />
            <FieldError message={errors.city?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="state" className={labelClass}>
              State
            </label>
            <input
              id="state"
              type="text"
              placeholder="Lagos State"
              {...register('state')}
              className={inputClass}
            />
            <FieldError message={errors.state?.message} />
          </div>
        </div>

        {/* Zip + Country */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="zipCode" className={labelClass}>
              Zip / Postal Code
            </label>
            <input
              id="zipCode"
              type="text"
              placeholder="100001"
              {...register('zipCode')}
              className={inputClass}
            />
            <FieldError message={errors.zipCode?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="country" className={labelClass}>
              Country
            </label>
            <input
              id="country"
              type="text"
              placeholder="Nigeria"
              {...register('country')}
              className={inputClass}
            />
            <FieldError message={errors.country?.message} />
          </div>
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+234 801 234 5678"
              {...register('phone')}
              className={inputClass}
            />
            <FieldError message={errors.phone?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelClass}>
              Business Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="hello@yourbusiness.com"
              {...register('email')}
              className={inputClass}
            />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        {/* Website — full width */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="website" className={labelClass}>
            Website
          </label>
          <input
            id="website"
            type="url"
            placeholder="https://yourbusiness.com"
            {...register('website')}
            className={inputClass}
          />
          <FieldError message={errors.website?.message} />
        </div>

        {/* TIN + RC Number */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="taxNumber" className={labelClass}>
              TIN (Tax Identification Number)
            </label>
            <input
              id="taxNumber"
              type="text"
              placeholder="12345678-0001"
              {...register('taxNumber')}
              className={inputClass}
            />
            <FieldError message={errors.taxNumber?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rcNumber" className={labelClass}>
              RC Number (CAC)
            </label>
            <input
              id="rcNumber"
              type="text"
              placeholder="RC-1234567"
              {...register('rcNumber')}
              className={inputClass}
            />
            <FieldError message={errors.rcNumber?.message} />
          </div>
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
