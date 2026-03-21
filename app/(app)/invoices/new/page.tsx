import { InvoiceForm } from '@/features/invoices/components/form/InvoiceForm'

export default function NewInvoicePage() {
  return (
    <div className="min-h-full">
      <div
        className="border-b px-6 py-5 border-(--border-default) bg-(--surface-base)"
      >
        <h1
          className="[font-family:var(--font-display)] text-[22px] font-bold text-(--ink-900) tracking-[-0.025em]"
        >
          New Invoice
        </h1>
        <p
          className="[font-family:var(--font-body)] text-(--ink-400) text-[13px] mt-0.5"
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
