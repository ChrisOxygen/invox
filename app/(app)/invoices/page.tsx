import { InvoicesPageClient } from '@/features/invoices/components/list/InvoicesPageClient'

export default function InvoicesPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div
        className="border-b px-6 py-5 border-(--border-default) bg-(--surface-base)"
      >
        <h1
          className="[font-family:var(--font-display)] text-[22px] font-bold text-(--ink-900) tracking-[-0.025em]"
        >
          Invoices
        </h1>
        <p
          className="[font-family:var(--font-body)] text-(--ink-400) text-[13px] mt-0.5"
        >
          Manage and track all your invoices
        </p>
      </div>
      <div className="flex-1 px-6 py-6">
        <InvoicesPageClient />
      </div>
    </div>
  )
}
