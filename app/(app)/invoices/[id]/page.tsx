import { InvoiceDetailPageClient } from '@/features/invoices/components/detail/InvoiceDetailPageClient'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="flex flex-col" style={{ minHeight: '100%' }}>
      <div
        className="border-b px-6 py-4"
        style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
      >
        <nav style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-400)' }}>
          <a href="/invoices" style={{ color: 'var(--ink-400)' }}>
            Invoices
          </a>
          <span className="mx-2">/</span>
          <span style={{ color: 'var(--ink-900)' }}>Invoice Detail</span>
        </nav>
      </div>
      <div className="px-6 py-6">
        <InvoiceDetailPageClient id={id} />
      </div>
    </div>
  )
}
