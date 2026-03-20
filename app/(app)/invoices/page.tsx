import { InvoicesPageClient } from '@/features/invoices/components/list/InvoicesPageClient'

export default function InvoicesPage() {
  return (
    <div className="flex flex-col" style={{ minHeight: '100%' }}>
      <div
        className="border-b px-6 py-5"
        style={{ borderColor: 'var(--border-default)', background: 'var(--surface-base)' }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--ink-900)',
            letterSpacing: '-0.025em',
          }}
        >
          Invoices
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--ink-400)',
            fontSize: '13px',
            marginTop: '2px',
          }}
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
