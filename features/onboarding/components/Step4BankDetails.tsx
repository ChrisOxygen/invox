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
        <h2
          className="font-[family-name:var(--font-display)] font-extrabold"
          style={{ fontSize: '24px', color: 'var(--ink-900)', letterSpacing: '-0.02em' }}
        >
          Add your bank details
        </h2>
        <p
          className="font-[family-name:var(--font-body)]"
          style={{ fontSize: '14px', color: 'var(--ink-400)' }}
        >
          These appear on your invoices so clients know where to pay.
        </p>

        {/* Trust note */}
        <div className="flex items-center gap-1.5 mt-1">
          <LockKeyhole
            size={14}
            style={{ color: 'var(--ink-300)', flexShrink: 0 }}
            aria-hidden="true"
          />
          <span
            className="font-[family-name:var(--font-body)]"
            style={{ fontSize: '12px', color: 'var(--ink-300)' }}
          >
            Your information is encrypted and never shared
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Bank name */}
          <div className="flex flex-col gap-1.5">
            <Label className="font-[family-name:var(--font-display)] font-semibold uppercase" style={{ fontSize: '12px', color: 'var(--ink-700)', letterSpacing: '0.06em' }}>
              Bank Name
            </Label>
            <Input {...register('bankName')} placeholder="Guaranty Trust Bank" className="font-[family-name:var(--font-body)] h-11 rounded-[var(--r-md)] px-3.5 text-[14px]" />
          </div>

          {/* Account name */}
          <div className="flex flex-col gap-1.5">
            <Label className="font-[family-name:var(--font-display)] font-semibold uppercase" style={{ fontSize: '12px', color: 'var(--ink-700)', letterSpacing: '0.06em' }}>
              Account Name
            </Label>
            <Input {...register('accountName')} placeholder="Chidi Okeke Design Studio" className="font-[family-name:var(--font-body)] h-11 rounded-[var(--r-md)] px-3.5 text-[14px]" />
          </div>

          {/* Account number */}
          <div className="flex flex-col gap-1.5">
            <Label className="font-[family-name:var(--font-display)] font-semibold uppercase" style={{ fontSize: '12px', color: 'var(--ink-700)', letterSpacing: '0.06em' }}>
              Account Number
            </Label>
            <Input {...register('accountNumber')} placeholder="0123456789" inputMode="numeric" maxLength={10} className="font-[family-name:var(--font-mono)] h-11 rounded-[var(--r-md)] px-3.5 text-[14px]" />
          </div>

          {/* Settings note */}
          <p
            className="font-[family-name:var(--font-body)]"
            style={{
              fontSize: '12px',
              color: 'var(--ink-300)',
              padding: '10px 12px',
              backgroundColor: 'var(--surface-overlay)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border-default)',
            }}
          >
            You can add or update these later in{' '}
            <span style={{ color: 'var(--ink-500)', fontWeight: 500 }}>
              Settings → Bank Details
            </span>
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-2">
            <Button
              type="submit"
              className="w-full font-[family-name:var(--font-display)] font-semibold"
              style={{ height: '44px' }}
            >
              Save &amp; Continue
            </Button>

            <button
              type="button"
              onClick={nextStep}
              className="font-[family-name:var(--font-body)] transition-colors"
              style={{
                fontSize: '13px',
                color: 'var(--blue-600)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--blue-700)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--blue-600)'
              }}
            >
              Skip for now →
            </button>
          </div>
        </form>
    </div>
  )
}
