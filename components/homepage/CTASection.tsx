import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'
import { RevealOnScroll } from '../RevealOnScroll'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const trustItems = [
  'All features included',
  'No credit card required',
  'Free while we grow',
]

const lineItems = [
  { label: 'UI/UX Design — 3 weeks', amount: '₦180,000' },
  { label: 'Frontend Development', amount: '₦240,000' },
  { label: 'Project Management', amount: '₦30,000' },
]

function InvoicePreview() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto">
      {/* Floating accent card behind */}
      <div
        className="absolute -top-3 -right-3 w-full h-full rounded-(--r-xl) border border-(--border-default) bg-(--surface-raised)"
        aria-hidden="true"
      />

      {/* Main invoice card */}
      <div className="relative rounded-(--r-xl) border border-(--border-default) bg-(--surface-base) overflow-hidden shadow-sm">
        {/* Blue top accent bar */}
        <div className="h-1 w-full bg-(--blue-600)" />

        <div className="px-6 pt-5 pb-6 flex flex-col gap-5">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest text-(--ink-300) font-display"
              >
                Invoice
              </span>
              <span
                className="text-sm font-medium text-(--ink-700) font-display"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                INV-2025-0042
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EDFAF3] text-[#0A8F52] font-display">
              <span className="w-1.5 h-1.5 rounded-full bg-(--success)" />
              Paid
            </span>
          </div>

          {/* Client */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-(--ink-300) font-display">
              Billed to
            </span>
            <span className="text-sm font-semibold text-(--ink-900) font-display">
              Acme Creative Studio
            </span>
            <span className="text-xs text-(--ink-400) font-body">
              Lagos, Nigeria
            </span>
          </div>

          {/* Line items */}
          <div className="flex flex-col gap-2 border-t border-(--border-default) pt-4">
            {lineItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <span className="text-xs text-(--ink-500) font-body truncate">
                  {item.label}
                </span>
                <span
                  className="text-xs font-medium text-(--ink-700) shrink-0"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {item.amount}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-(--border-strong) pt-4 flex items-end justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-(--ink-400) font-display">
              Total
            </span>
            <span
              className="text-2xl font-medium text-(--ink-900) leading-none"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              ₦450,000
            </span>
          </div>

          {/* CTA bar */}
          <div className="rounded-(--r-md) bg-(--blue-50) px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-(--blue-700) font-body">
              Sent via Invox · 2 mins ago
            </span>
            <span className="text-xs font-semibold text-(--blue-600) font-display">
              View →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CTASection() {
  return (
    <section className="bg-(--surface-page)">
      <div className="content-wrapper py-20 sm:py-28">
        <RevealOnScroll>
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

            {/* Left — copy */}
            <div className="flex flex-col gap-8 flex-1 min-w-0">
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-(--blue-600) font-display">
                <span className="w-5 h-px bg-(--blue-600)" />
                Free during early access
              </span>

              <div className="flex flex-col gap-4">
                <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-(--ink-900) leading-[1.08] tracking-[-0.03em]">
                  Invoice smarter.
                  <br />
                  <span className="text-(--blue-600)">Get paid faster.</span>
                </h2>
                <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-md">
                  Built for Nigerian freelancers and small businesses — create branded invoices,
                  track payments, and share via WhatsApp in under two minutes. Every feature, completely free right now.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  render={<Link href="/register" />}
                  nativeButton={false}
                  className="bg-(--blue-600) hover:bg-(--blue-700) text-white font-semibold px-7 py-5 rounded-(--r-md) text-sm shadow-none transition-colors duration-200 font-display inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  Create Your First Invoice
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Trust items */}
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {trustItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-(--ink-400) font-body"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-(--success) shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — invoice preview */}
            <div className="w-full lg:shrink-0 lg:w-90">
              <InvoicePreview />
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default CTASection
