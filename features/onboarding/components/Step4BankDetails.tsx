'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LockKeyhole } from 'lucide-react'
import { useOnboarding } from '@/features/onboarding/context/OnboardingContext'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

const ZBankDetailsSchema = z.object({
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().max(10).optional(),
})

type ZBankDetails = z.infer<typeof ZBankDetailsSchema>

export function Step4BankDetails() {
  const { nextStep } = useOnboarding()

  const {
    register,
    handleSubmit,
  } = useForm<ZBankDetails>({
    resolver: zodResolver(ZBankDetailsSchema),
    defaultValues: { bankName: '', accountName: '', accountNumber: '' },
  })

  function onSubmit(_values: ZBankDetails) {
    nextStep()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-extrabold text-[24px] text-(--ink-900) tracking-[-0.02em]">
          Add your bank details
        </h2>
        <p className="font-body text-[14px] text-(--ink-400)">
          These appear on your invoices so clients know where to pay.
        </p>

        {/* Trust note */}
        <div className="flex items-center gap-1.5 mt-1">
          <LockKeyhole size={14} className="text-(--ink-300) shrink-0" aria-hidden="true" />
          <span className="font-body text-[12px] text-(--ink-300)">
            Your information is encrypted and never shared
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Bank name */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-display font-semibold uppercase text-[12px] text-(--ink-700) tracking-[0.06em]">
            Bank Name
          </Label>
          <Input {...register('bankName')} placeholder="Guaranty Trust Bank" className="font-body h-11 rounded-md px-3.5 text-[14px]" />
        </div>

        {/* Account name */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-display font-semibold uppercase text-[12px] text-(--ink-700) tracking-[0.06em]">
            Account Name
          </Label>
          <Input {...register('accountName')} placeholder="Chidi Okeke Design Studio" className="font-body h-11 rounded-md px-3.5 text-[14px]" />
        </div>

        {/* Account number */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-display font-semibold uppercase text-[12px] text-(--ink-700) tracking-[0.06em]">
            Account Number
          </Label>
          <Input {...register('accountNumber')} placeholder="0123456789" inputMode="numeric" maxLength={10} className="font-mono h-11 rounded-md px-3.5 text-[14px]" />
        </div>

        {/* Settings note */}
        <p className="font-body text-[12px] text-(--ink-300) px-3 py-2.5 bg-(--surface-overlay) rounded-md border border-(--border-default)">
          You can add or update these later in{' '}
          <span className="text-(--ink-500) font-medium">
            Settings → Bank Details
          </span>
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-2">
          <Button
            type="submit"
            className="w-full h-11 font-display font-semibold"
          >
            Save &amp; Continue
          </Button>

          <button
            type="button"
            onClick={nextStep}
            className="font-body text-[13px] text-(--blue-600) bg-transparent border-none cursor-pointer px-1.5 py-1 text-center transition-colors hover:text-(--blue-700) focus-visible:outline-none focus-visible:underline"
          >
            Skip for now →
          </button>
        </div>
      </form>
    </div>
  )
}
