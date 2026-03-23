"use client";

import { useState } from "react";
import { Building2, Palette, FileText, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useProfile } from "@/features/settings/hooks/use-profile";
import { BusinessInfoForm } from "./BusinessInfoForm";
import { BrandingForm } from "./BrandingForm";
import { InvoiceDefaultsForm } from "./InvoiceDefaultsForm";
import { AccountTab } from "./AccountTab";

type Section = "business" | "branding" | "invoice" | "account";

const NAV: {
  id: Section;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "business",
    label: "Business Info",
    hint: "Name, address, contact",
    icon: Building2,
  },
  {
    id: "branding",
    label: "Branding",
    hint: "Logo and brand color",
    icon: Palette,
  },
  {
    id: "invoice",
    label: "Invoice Defaults",
    hint: "Currency and numbering",
    icon: FileText,
  },
  {
    id: "account",
    label: "Account & Security",
    hint: "Password and data",
    icon: ShieldCheck,
  },
];

export function SettingsPageClient() {
  const [active, setActive] = useState<Section>("business");
  const { data: profile, isPending, error } = useProfile();

  if (isPending) {
    return (
      <div className="flex gap-6 items-start">
        <div className="w-52 shrink-0 flex flex-col gap-1.5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-14.5 w-full rounded" />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <Skeleton className="h-18 w-full rounded" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded border border-(--error)/20 bg-(--error)/5 p-5">
        <p className="text-[14px] text-(--error) font-body">
          Failed to load settings. Please refresh the page.
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <ScrollArea className="h-[calc(100vh-90px)]">
      <div className="flex gap-6 items-start pr-4 py-4">
        {/* ── Sidebar nav ── */}
        <nav className="w-52 shrink-0 flex flex-col gap-1">
          {NAV.map(({ id, label, hint, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className="w-full rounded border px-3.5 py-3 text-left transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: isActive ? "var(--blue-50)" : "transparent",
                  borderColor: isActive ? "var(--blue-200)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      "var(--surface-overlay)";
                    e.currentTarget.style.borderColor = "var(--border-default)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className="h-3.75 w-3.75 shrink-0"
                    style={{
                      color: isActive ? "var(--blue-600)" : "var(--ink-400)",
                    }}
                  />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span
                      className="text-[13px] font-semibold leading-none font-display truncate"
                      style={{
                        color: isActive ? "var(--blue-700)" : "var(--ink-700)",
                      }}
                    >
                      {label}
                    </span>
                    <span className="text-[11px] text-(--ink-400) font-body truncate leading-none mt-0.5">
                      {hint}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* ── Content area ── */}
        <div className="flex-1 min-w-0">
          {active === "business" && (
            <SettingsCard
              title="Business Information"
              description="This information appears on your invoices and PDF documents. Keep it accurate for a professional presentation."
            >
              <BusinessInfoForm defaultValues={profile} />
            </SettingsCard>
          )}

          {active === "branding" && (
            <SettingsCard
              title="Branding"
              description="Customize how your invoices look to clients with your logo and brand color."
            >
              <BrandingForm
                defaultValues={{
                  logoUrl: profile.logoUrl,
                  brandColor: profile.brandColor ?? "#1740F5",
                }}
                businessName={profile.businessName}
              />
            </SettingsCard>
          )}

          {active === "invoice" && (
            <SettingsCard
              title="Invoice Defaults"
              description="Set the default currency and invoice numbering format for all new invoices."
            >
              <InvoiceDefaultsForm
                defaultValues={{
                  currency: profile.currency,
                  invoicePrefix: profile.invoicePrefix,
                }}
              />
            </SettingsCard>
          )}

          {active === "account" && <AccountTab />}
        </div>
      </div>
    </ScrollArea>
  );
}

// ─── SettingsCard ─────────────────────────────────────────────────────────────

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-(--border-default) bg-(--surface-base) overflow-hidden">
      {/* Header */}
      <div className="border-b border-(--border-default) px-6 py-5">
        <h2 className="text-[16px] font-bold tracking-[-0.02em] text-(--ink-900) font-display">
          {title}
        </h2>
        <p className="mt-1 text-[13px] text-(--ink-400) font-body leading-relaxed">
          {description}
        </p>
      </div>
      {/* Body */}
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}
