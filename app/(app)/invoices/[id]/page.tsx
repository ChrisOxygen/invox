import { InvoiceDetailPageClient } from '@/features/invoices/components/detail/InvoiceDetailPageClient'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="flex flex-col min-h-full">
      <div
        className="border-b px-6 py-4 border-(--border-default) bg-(--surface-base)"
      >
        <nav className="[font-family:var(--font-body)] text-[13px] text-(--ink-400)">
          <a href="/invoices" className="text-(--ink-400)">
            Invoices
          </a>
          <span className="mx-2">/</span>
          <span className="text-(--ink-900)">Invoice Detail</span>
        </nav>
      </div>
      <div className="px-6 py-6">
        <InvoiceDetailPageClient id={id} />
      </div>
    </div>
  )
}
