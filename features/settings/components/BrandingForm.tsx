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

const labelClass = 'text-[12px] font-semibold text-(--ink-700) [font-family:var(--font-display)]'

export function BrandingForm({ defaultValues, businessName }: BrandingFormProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(defaultValues.logoUrl)
  const [brandColor, setBrandColor] = useState<string>(defaultValues.brandColor || '#1740F5')

  const { mutate, isPending } = useUpdateProfile({
    onSuccess: () => toast.success('Branding saved'),
  })

  function handleSave() {
    mutate(
      { logoUrl: logoUrl ?? undefined, brandColor },
      { onError: (err) => toast.error(err.message) }
    )
  }

  return (
    <div className="flex flex-col gap-0 lg:flex-row lg:gap-8">

      {/* ── Left: controls ── */}
      <div className="flex flex-1 flex-col gap-6">

        {/* Logo */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Business Logo</label>
          <p className="text-[13px] text-(--ink-400) [font-family:var(--font-body)]">
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
          <label className={labelClass}>Brand Color</label>
          <p className="text-[13px] text-(--ink-400) [font-family:var(--font-body)]">
            Used in the invoice header and accents.
          </p>
          <div className="mt-1">
            <BrandColorPicker value={brandColor} onChange={setBrandColor} />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end border-t border-(--border-default) pt-5 mt-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex h-9 items-center justify-center gap-2 rounded bg-(--blue-600) px-5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-(--blue-700) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--blue-600) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 [font-family:var(--font-display)]"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>

      {/* ── Right: preview stage ── */}
      <div className="mt-8 lg:mt-0 lg:w-auto">
        <div
          className="rounded border border-(--border-default) flex flex-col"
          style={{ backgroundColor: 'var(--surface-overlay)' }}
        >
          {/* Stage header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-(--border-default)">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-(--ink-400) [font-family:var(--font-display)]">
              Preview
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-(--ink-300) [font-family:var(--font-body)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--success)" />
              Live
            </span>
          </div>

          {/* Preview stage area */}
          <div className="flex items-start justify-center p-6">
            <MiniInvoicePreview
              brandColor={brandColor}
              logoUrl={logoUrl}
              businessName={businessName}
            />
          </div>
        </div>
      </div>

    </div>
  )
}
