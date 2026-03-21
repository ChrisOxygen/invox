'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUpdateProfile } from '@/features/settings/hooks/use-update-profile'
import { LogoUploadZone } from './LogoUploadZone'
import { BrandColorPicker } from './BrandColorPicker'
import { MiniInvoicePreview } from './MiniInvoicePreview'

interface BrandingFormProps {
  defaultValues: {
    logoUrl: string | null
    brandColor: string
  }
  businessName: string | null
}

const labelClass = 'text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--ink-700)]'

export function BrandingForm({ defaultValues, businessName }: BrandingFormProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(defaultValues.logoUrl)
  const [brandColor, setBrandColor] = useState<string>(defaultValues.brandColor || '#1740F5')

  const { mutate, isPending } = useUpdateProfile({
    onSuccess: () => toast.success('Branding saved'),
  })

  function handleSave() {
    mutate(
      { logoUrl: logoUrl ?? undefined, brandColor },
      {
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Left: controls */}
      <div className="flex flex-1 flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col gap-2">
          <label
            className={labelClass}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Business Logo
          </label>
          <p
            className="text-[13px] text-[var(--ink-400)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Appears in the header of your PDF invoices.
          </p>
          <div className="mt-1">
            <LogoUploadZone
              currentLogoUrl={logoUrl}
              onUploadComplete={(url) => setLogoUrl(url)}
              onRemove={() => setLogoUrl(null)}
            />
          </div>
        </div>

        {/* Brand color */}
        <div className="flex flex-col gap-2">
          <label
            className={labelClass}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Brand Color
          </label>
          <p
            className="text-[13px] text-[var(--ink-400)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Used in the invoice header and accents.
          </p>
          <div className="mt-1">
            <BrandColorPicker value={brandColor} onChange={setBrandColor} />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex h-[44px] items-center justify-center gap-2 rounded-[var(--r-md)] bg-[var(--blue-600)] px-6 text-[14px] font-[600] text-white transition-colors duration-200 hover:bg-[var(--blue-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-600)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>

      {/* Right: live preview */}
      <div className="flex flex-col items-center gap-3 lg:items-start">
        <p
          className="text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--ink-700)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Preview
        </p>
        <MiniInvoicePreview
          brandColor={brandColor}
          logoUrl={logoUrl}
          businessName={businessName}
        />
        <p
          className="text-[11px] text-[var(--ink-300)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Live preview · updates as you edit
        </p>
      </div>
    </div>
  )
}
