'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { InvoiceStatusBadge } from '@/features/invoices/components/list/InvoiceStatusBadge'
import { InvoiceInfoCard } from '@/features/invoices/components/detail/InvoiceInfoCard'
import { PrintButton } from '@/features/invoices/components/pdf/PrintButton'
import type { InvoiceDetail } from '@/features/invoices/types'

// dynamic imports must live in a Client Component
const PDFPreview = dynamic(
  () =>
    import('@/features/invoices/components/pdf/PDFPreview').then((m) => ({
      default: m.PDFPreview,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-(--surface-overlay) rounded">
        <div className="text-center">
          <div className="w-9 h-9 rounded-full border-3 border-(--border-default) border-t-(--blue-600) animate-spin mx-auto mb-3" />
          <p className="font-body text-[13px] text-(--ink-400)">
            Rendering PDF…
          </p>
        </div>
      </div>
    ),
  }
)

const DownloadButton = dynamic(
  () =>
    import('@/features/invoices/components/pdf/DownloadButton').then((m) => ({
      default: m.DownloadButton,
    })),
  { ssr: false }
)

interface InvoicePreviewPageClientProps {
  invoice: InvoiceDetail
}

export function InvoicePreviewPageClient({ invoice }: InvoicePreviewPageClientProps) {
  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media print {
          body > * { display: none !important; }
          #invoice-print-target { display: block !important; }
        }
      `}</style>

      <div className="flex flex-col h-full min-h-0">
        {/* ── Top bar ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-(--s3) pb-(--s4) border-b border-(--border-default) mb-(--s5) flex-wrap">
          <div className="flex items-center gap-(--s3)">
            <Link
              href={`/invoices/${invoice.id}`}
              className="inline-flex items-center gap-1.5 font-display text-[13px] font-medium text-(--ink-400) no-underline px-2.5 py-1.5 rounded border border-(--border-default) transition-colors hover:text-(--ink-700) hover:border-(--border-strong)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Link>

            <div className="w-px h-5 bg-(--border-default)" />

            <div className="flex items-center gap-(--s2)">
              <span className="font-mono text-[14px] font-medium text-(--blue-600)">
                {invoice.invoiceNumber}
              </span>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
          </div>

          <div className="flex items-center gap-(--s2)">
            <PrintButton />
            <DownloadButton invoice={invoice} variant="default" size="sm" />
          </div>
        </div>

        {/* ── Split pane ───────────────────────────────────────────── */}
        <div
          className="grid gap-(--s5) flex-1 min-h-0 preview-grid"
          style={{ gridTemplateColumns: '1fr 1fr' }}
        >
          <div className="overflow-y-auto">
            <InvoiceInfoCard invoice={invoice} />
          </div>

          <div className="rounded border border-(--border-default) overflow-hidden min-h-150">
            <PDFPreview invoice={invoice} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .preview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
