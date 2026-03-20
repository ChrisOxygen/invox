'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { useOnboarding } from '@/features/onboarding/context/OnboardingContext'
import { _saveOnboardingStep } from '@/features/onboarding/server'
import { createClient } from '@/shared/lib/supabase/client'

// ─── Schema ──────────────────────────────────────────────────────────────────

const ZStep1Schema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
})

type ZStep1 = z.infer<typeof ZStep1Schema>

// ─── Component ───────────────────────────────────────────────────────────────

export function Step1BusinessProfile() {
  const { nextStep, profilePreview, setProfilePreview } = useOnboarding()

  const [logoPreview, setLogoPreview] = useState<string | null>(profilePreview.logoUrl)
  const [logoUrl, setLogoUrl] = useState<string | null>(profilePreview.logoUrl)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ZStep1>({
    resolver: zodResolver(ZStep1Schema),
    defaultValues: { businessName: profilePreview.businessName },
  })

  const currentName = watch('businessName')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoError(null)

    // Validate size — max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('File is too large. Maximum size is 2MB.')
      return
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setLogoPreview(objectUrl)
    setLogoUploading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const ext = file.name.split('.').pop()
      const path = `${user.id}/logo-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(path)
      const publicUrl = urlData.publicUrl

      setLogoUrl(publicUrl)
      setProfilePreview({ businessName: currentName ?? '', logoUrl: publicUrl })
    } catch {
      setLogoError('Upload failed. Please try again.')
      setLogoPreview(null)
      setLogoUrl(null)
    } finally {
      setLogoUploading(false)
    }
  }

  function handleRemoveLogo() {
    setLogoPreview(null)
    setLogoUrl(null)
    setLogoError(null)
    setProfilePreview({ businessName: currentName ?? '', logoUrl: null })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function onSubmit(values: ZStep1) {
    setServerError(null)
    const result = await _saveOnboardingStep({
      businessName: values.businessName,
      ...(logoUrl ? { logoUrl } : {}),
    })
    if (result.error) {
      setServerError(result.error)
      return
    }
    setProfilePreview({ businessName: values.businessName, logoUrl: logoUrl })
    nextStep()
  }

  return (
    <div>
      {/* Heading block */}
      <h1
        className="text-[24px] font-[800] leading-[1.2] tracking-[-0.025em] text-[var(--ink-900)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Tell us about your business
      </h1>
      <p
        className="mt-1.5 text-[14px] text-[var(--ink-400)]"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        This appears on every invoice you send.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Logo upload */}
        <div className="mt-8 flex flex-col items-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={logoUploading}
              aria-label="Upload business logo"
              className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface-raised)] transition-colors duration-[var(--motion-base)] hover:border-[var(--blue-400)] hover:bg-[var(--blue-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-600)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {logoUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-[var(--blue-600)]" />
              ) : logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt="Business logo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center gap-1">
                  <UploadCloud className="h-6 w-6 text-[var(--ink-300)]" />
                  <span
                    className="text-[12px] text-[var(--ink-300)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Upload logo
                  </span>
                </span>
              )}
            </button>

            {/* Remove button — only visible when logo is loaded */}
            {logoPreview && !logoUploading && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                aria-label="Remove logo"
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--error)] text-white shadow-sm transition-transform duration-[var(--motion-fast)] hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--error)] focus-visible:ring-offset-1"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            className="sr-only"
            onChange={handleFileChange}
          />

          {/* Hint + upload error */}
          <p
            className="mt-2 text-[11px] text-[var(--ink-300)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            PNG, JPG or SVG · Max 2MB
          </p>

          {logoError && (
            <p
              className="mt-1 text-[11px] text-[var(--error)]"
              style={{ fontFamily: 'var(--font-body)' }}
              role="alert"
            >
              {logoError}
            </p>
          )}

          {/* Skip logo link */}
          {!logoPreview && (
            <button
              type="button"
              onClick={() => {
                setLogoError(null)
              }}
              className="mt-2 text-[12px] text-[var(--blue-600)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--blue-700)] focus-visible:outline-none focus-visible:underline"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Skip logo for now
            </button>
          )}
        </div>

        {/* Business name field */}
        <div className="mt-6 flex flex-col gap-1.5">
          <label
            htmlFor="businessName"
            className="text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--ink-700)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Business name
          </label>
          <input
            id="businessName"
            type="text"
            placeholder="Chidi Okeke Design Studio"
            aria-describedby={errors.businessName ? 'businessName-error' : undefined}
            aria-invalid={!!errors.businessName}
            {...register('businessName', {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setProfilePreview({
                  businessName: e.target.value,
                  logoUrl: logoUrl,
                })
              },
            })}
            className="h-[44px] w-full rounded-[var(--r-md)] border border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--ink-300)] transition-colors duration-[var(--motion-fast)] focus:border-[var(--blue-600)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-600)]/20 aria-invalid:border-[var(--error)] aria-invalid:ring-2 aria-invalid:ring-[var(--error)]/20"
            style={{ fontFamily: 'var(--font-body)' }}
          />
          {errors.businessName && (
            <p
              id="businessName-error"
              className="text-[11px] text-[var(--error)]"
              style={{ fontFamily: 'var(--font-body)' }}
              role="alert"
            >
              {errors.businessName.message}
            </p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <div
            className="mt-4 rounded-[var(--r-md)] border border-[var(--error)]/20 bg-[var(--error)]/5 px-4 py-3"
            role="alert"
          >
            <p
              className="text-[13px] text-[var(--error)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {serverError}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || logoUploading}
          className="mt-6 flex h-[44px] w-full items-center justify-center gap-2 rounded-[var(--r-md)] bg-[var(--blue-600)] text-[14px] font-[600] text-white transition-colors duration-[var(--motion-base)] hover:bg-[var(--blue-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-600)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Continue
        </button>
      </form>
    </div>
  )
}
