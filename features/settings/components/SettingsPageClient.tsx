'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useProfile } from '@/features/settings/hooks/use-profile'
import { BusinessInfoForm } from './BusinessInfoForm'
import { BrandingForm } from './BrandingForm'
import { InvoiceDefaultsForm } from './InvoiceDefaultsForm'
import { AccountTab } from './AccountTab'

export function SettingsPageClient() {
  const { data: profile, isPending, error } = useProfile()

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold tracking-[-0.025em] text-(--ink-900) [font-family:var(--font-display)]">
          Settings
        </h1>
        <p className="mt-1 text-[14px] text-(--ink-400) [font-family:var(--font-body)]">
          Manage your business profile and preferences
        </p>
      </div>

      {/* Loading skeleton */}
      {isPending && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Error state */}
      {!isPending && error && (
        <div className="rounded-lg border border-(--error)/20 bg-(--error)/5 p-6">
          <p className="text-[14px] text-(--error) [font-family:var(--font-body)]">
            Failed to load profile. Please refresh the page.
          </p>
        </div>
      )}

      {/* Tabs */}
      {!isPending && profile && (
        <Tabs defaultValue="business" className="w-full">
          <TabsList className="mb-6 flex h-auto w-full justify-start gap-1 rounded-lg border border-(--border-default) bg-(--surface-overlay) p-1">
            {(
              [
                { value: 'business', label: 'Business Info' },
                { value: 'branding', label: 'Branding' },
                { value: 'invoice', label: 'Invoice Defaults' },
                { value: 'account', label: 'Account' },
              ] as const
            ).map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded px-4 py-2 text-[13px] font-semibold text-(--ink-500) transition-all duration-200 data-[state=active]:bg-(--surface-base) data-[state=active]:text-(--ink-900) data-[state=active]:shadow-sm [font-family:var(--font-display)]"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Business Info */}
          <TabsContent value="business">
            <div className="rounded-lg border border-(--border-default) bg-(--surface-base) p-6">
              <h3 className="text-[16px] font-bold tracking-[-0.02em] text-(--ink-900) [font-family:var(--font-display)]">
                Business Information
              </h3>
              <p className="mt-1 text-[13px] text-(--ink-400) [font-family:var(--font-body)]">
                This information appears on your invoices. Keep it accurate for professional
                presentation.
              </p>
              <div className="mt-6">
                <BusinessInfoForm defaultValues={profile} />
              </div>
            </div>
          </TabsContent>

          {/* Branding */}
          <TabsContent value="branding">
            <div className="rounded-lg border border-(--border-default) bg-(--surface-base) p-6">
              <h3 className="text-[16px] font-bold tracking-[-0.02em] text-(--ink-900) [font-family:var(--font-display)]">
                Branding
              </h3>
              <p className="mt-1 text-[13px] text-(--ink-400) [font-family:var(--font-body)]">
                Customize how your invoices look to clients with your logo and brand color.
              </p>
              <div className="mt-6">
                <BrandingForm
                  defaultValues={{
                    logoUrl: profile.logoUrl,
                    brandColor: profile.brandColor ?? '#1740F5',
                  }}
                  businessName={profile.businessName}
                />
              </div>
            </div>
          </TabsContent>

          {/* Invoice Defaults */}
          <TabsContent value="invoice">
            <div className="rounded-lg border border-(--border-default) bg-(--surface-base) p-6">
              <h3 className="text-[16px] font-bold tracking-[-0.02em] text-(--ink-900) [font-family:var(--font-display)]">
                Invoice Defaults
              </h3>
              <p className="mt-1 text-[13px] text-(--ink-400) [font-family:var(--font-body)]">
                Set the default currency and invoice numbering for all new invoices.
              </p>
              <div className="mt-6">
                <InvoiceDefaultsForm
                  defaultValues={{
                    currency: profile.currency,
                    invoicePrefix: profile.invoicePrefix,
                  }}
                />
              </div>
            </div>
          </TabsContent>

          {/* Account */}
          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
