import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/shared/lib/supabase/server'
import { _getInvoiceById } from '@/features/invoices/server/_get-invoice-by-id'
import { InvoiceStatusBadge } from '@/features/invoices/components/list/InvoiceStatusBadge'
import { InvoiceInfoCard } from '@/features/invoices/components/detail/InvoiceInfoCard'
import { PrintButton } from '@/features/invoices/components/pdf/PrintButton'

// Dynamic imports — PDFViewer and PDFDownloadLink use browser-only APIs
const PDFPreview = dynamic(
  () =>
    import('@/features/invoices/components/pdf/PDFPreview').then((m) => ({
      default: m.PDFPreview,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'var(--surface-overlay)',
          borderRadius: 'var(--r-xl)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid var(--border-default)',
              borderTopColor: 'var(--blue-600)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--ink-400)',
            }}
          >
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

export default async function InvoicePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  let invoice
  try {
    invoice = await _getInvoiceById(user.id, id)
  } catch {
    notFound()
  }

  return (
    <>
      {/* Print stylesheet — hides chrome, shows only the PDF viewer */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media print {
          body > * { display: none !important; }
          #invoice-print-target { display: block !important; }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
        }}
      >
        {/* ── Top bar ──────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--s3)',
            paddingBottom: 'var(--s4)',
            borderBottom: '1px solid var(--border-default)',
            marginBottom: 'var(--s5)',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: back + invoice info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
            <Link
              href={`/invoices/${id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--ink-400)',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border-default)',
                transition: 'color 200ms, border-color 200ms',
              }}
            >
              <ArrowLeft style={{ width: '14px', height: '14px' }} />
              Back
            </Link>

            <div
              style={{
                width: '1px',
                height: '20px',
                background: 'var(--border-default)',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--blue-600)',
                }}
              >
                {invoice.invoiceNumber}
              </span>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
            <PrintButton />
            <DownloadButton invoice={invoice} variant="default" size="sm" />
          </div>
        </div>

        {/* ── Split pane ───────────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--s5)',
            flex: 1,
            minHeight: 0,
          }}
          className="preview-grid"
        >
          {/* Left: invoice detail summary */}
          <div style={{ overflowY: 'auto' }}>
            <InvoiceInfoCard invoice={invoice} />
          </div>

          {/* Right: live PDF preview */}
          <div
            style={{
              borderRadius: 'var(--r-xl)',
              border: '1px solid var(--border-default)',
              overflow: 'hidden',
              minHeight: '600px',
            }}
          >
            <PDFPreview invoice={invoice} />
          </div>
        </div>
      </div>

      {/* Mobile responsive override */}
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
