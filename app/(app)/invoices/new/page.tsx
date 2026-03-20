import { InvoiceForm } from '@/features/invoices/components/form/InvoiceForm'

export default function NewInvoicePage() {
  return (
    <div style={{ minHeight: '100%' }}>
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
          New Invoice
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--ink-400)',
            fontSize: '13px',
            marginTop: '2px',
          }}
        >
          Create a professional invoice for your client
        </p>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-8">
        <InvoiceForm />
      </div>
    </div>
  )
}
