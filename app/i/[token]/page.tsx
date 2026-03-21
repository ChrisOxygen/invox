import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { Globe, Mail, Phone } from 'lucide-react'
import { _getInvoiceByToken } from '@/features/invoices/server/_get-invoice-by-token'
import { formatCurrency } from '@/shared/lib/utils'
import { PrintButton } from '@/features/invoices/components/pdf/PrintButton'
import type { PublicInvoice } from '@/features/invoices/server/_get-invoice-by-token'

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  let invoice: PublicInvoice
  try {
    invoice = await _getInvoiceByToken(token)
  } catch {
    notFound()
  }

  const { profile, client, items } = invoice
  const brandColor = profile.brandColor ?? '#1740F5'

  function formatDate(iso: string) {
    try {
      return format(parseISO(iso), 'd MMM yyyy')
    } catch {
      return '—'
    }
  }

  const STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Draft',
    SENT: 'Sent',
    PAID: 'Paid',
    PARTIAL: 'Partial Payment',
    OVERDUE: 'Overdue',
    CANCELLED: 'Cancelled',
  }

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    DRAFT: { bg: '#EEF1FF', color: '#1232D0' },
    SENT: { bg: '#E6F7FA', color: '#006A7A' },
    PAID: { bg: '#EDFAF3', color: '#0A8F52' },
    PARTIAL: { bg: '#FFF7EA', color: '#B57200' },
    OVERDUE: { bg: '#FFF0F0', color: '#C72020' },
    CANCELLED: { bg: '#F0F0F8', color: '#3D3D6B' },
  }

  const statusStyle = STATUS_COLORS[invoice.status] ?? { bg: '#F0F0F8', color: '#3D3D6B' }
  const statusLabel = STATUS_LABELS[invoice.status] ?? invoice.status

  const businessLocation = [profile.city, profile.state, profile.country]
    .filter(Boolean)
    .join(', ')
  const clientLocation = [client.city, client.state, client.country].filter(Boolean).join(', ')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F7FB; font-family: 'DM Sans', sans-serif; }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .invoice-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: '#F7F7FB' }}>
        {/* Top bar */}
        <div
          className="no-print"
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #E3E3EE',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 16,
                fontWeight: 800,
                color: '#0D0D1A',
                letterSpacing: '-0.03em',
              }}
            >
              invox
            </span>
            <span
              style={{
                width: 1,
                height: 16,
                backgroundColor: '#E3E3EE',
                display: 'inline-block',
                marginLeft: 4,
                marginRight: 4,
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: '#5A5A8A',
              }}
            >
              Invoice {invoice.invoiceNumber}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PrintButton />
          </div>
        </div>

        {/* Invoice card */}
        <div
          className="invoice-card"
          style={{
            maxWidth: 760,
            margin: '32px auto',
            backgroundColor: 'white',
            border: '1px solid #E3E3EE',
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 16,
          }}
        >
          {/* Brand header strip */}
          <div
            style={{
              backgroundColor: brandColor,
              height: 6,
            }}
          />

          {/* Invoice header */}
          <div
            style={{
              padding: '36px 40px 28px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            {/* Business identity */}
            <div>
              {profile.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.logoUrl}
                  alt={profile.businessName ?? 'Business logo'}
                  style={{ maxHeight: 48, maxWidth: 160, objectFit: 'contain', marginBottom: 12 }}
                />
              ) : (
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 20,
                    fontWeight: 800,
                    color: brandColor,
                    letterSpacing: '-0.03em',
                    marginBottom: 8,
                  }}
                >
                  {profile.businessName ?? 'Your Business'}
                </p>
              )}
              {profile.address && (
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: '#5A5A8A',
                    lineHeight: 1.5,
                  }}
                >
                  {profile.address}
                  {businessLocation && <><br />{businessLocation}</>}
                </p>
              )}
              {profile.phone && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5A5A8A', marginTop: 4 }}>
                  {profile.phone}
                </p>
              )}
              {profile.email && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5A5A8A' }}>
                  {profile.email}
                </p>
              )}
              {profile.taxNumber && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#8080A8', marginTop: 4 }}>
                  TIN: {profile.taxNumber}
                </p>
              )}
              {profile.rcNumber && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#8080A8' }}>
                  RC: {profile.rcNumber}
                </p>
              )}
            </div>

            {/* Invoice meta */}
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#0D0D1A',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                INVOICE
              </p>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 500,
                  color: brandColor,
                  marginBottom: 12,
                }}
              >
                {invoice.invoiceNumber}
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color,
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: statusStyle.color,
                    display: 'inline-block',
                  }}
                />
                {statusLabel}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#8080A8' }}>
                    Issue Date
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: '#1C1C3A' }}>
                    {formatDate(invoice.issueDate)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#8080A8' }}>
                    Due Date
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      fontWeight: 500,
                      color: invoice.status === 'OVERDUE' ? '#C72020' : '#1C1C3A',
                    }}
                  >
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: '#E3E3EE', margin: '0 40px' }} />

          {/* Bill from / Bill to */}
          <div
            style={{
              padding: '24px 40px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 32,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#8080A8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                From
              </p>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0D0D1A',
                  letterSpacing: '-0.01em',
                  marginBottom: 4,
                }}
              >
                {profile.businessName ?? '—'}
              </p>
              {profile.website && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5A5A8A' }}>
                  {profile.website}
                </p>
              )}
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#8080A8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Bill To
              </p>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0D0D1A',
                  letterSpacing: '-0.01em',
                  marginBottom: 4,
                }}
              >
                {client.name}
              </p>
              {client.company && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5A5A8A' }}>
                  {client.company}
                </p>
              )}
              {client.address && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5A5A8A', lineHeight: 1.5 }}>
                  {client.address}
                  {clientLocation && <><br />{clientLocation}</>}
                </p>
              )}
              {client.email && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5A5A8A', marginTop: 4 }}>
                  {client.email}
                </p>
              )}
              {client.phone && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5A5A8A' }}>
                  {client.phone}
                </p>
              )}
            </div>
          </div>

          {/* Line items */}
          <div style={{ padding: '0 40px 24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: brandColor,
                  }}
                >
                  {['Description', 'Qty', 'Unit Price', 'Amount'].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'white',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        padding: '10px 12px',
                        textAlign: i === 0 ? 'left' : 'right',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? 'white' : '#FAFAFE',
                      borderBottom: '1px solid #E3E3EE',
                    }}
                  >
                    <td
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: '#1C1C3A',
                        padding: '12px 12px',
                      }}
                    >
                      {item.description}
                    </td>
                    <td
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        color: '#5A5A8A',
                        padding: '12px 12px',
                        textAlign: 'right',
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        color: '#5A5A8A',
                        padding: '12px 12px',
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </td>
                    <td
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#0D0D1A',
                        padding: '12px 12px',
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatCurrency(item.subtotal, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ padding: '0 40px 28px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ minWidth: 260 }}>
              {[
                { label: 'Subtotal', value: invoice.subtotal },
                ...(invoice.taxAmount > 0
                  ? [
                      {
                        label: `Tax (${invoice.taxType === 'PERCENTAGE' ? `${invoice.taxRate}%` : 'Fixed'})`,
                        value: invoice.taxAmount,
                      },
                    ]
                  : []),
                ...(invoice.discountAmount > 0
                  ? [
                      {
                        label: `Discount (${invoice.discountType === 'PERCENTAGE' ? `${invoice.discount}%` : 'Fixed'})`,
                        value: -invoice.discountAmount,
                        isNegative: true,
                      },
                    ]
                  : []),
              ].map(({ label, value, isNegative }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid #E3E3EE',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      color: '#5A5A8A',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      fontWeight: 500,
                      color: isNegative ? '#0A8F52' : '#0D0D1A',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isNegative ? '−' : ''}{formatCurrency(Math.abs(value ?? 0), invoice.currency)}
                  </span>
                </div>
              ))}
              {/* Grand total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  backgroundColor: brandColor,
                  borderRadius: 8,
                  marginTop: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Total Due
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 18,
                    fontWeight: 500,
                    color: 'white',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <>
              <div style={{ height: 1, backgroundColor: '#E3E3EE', margin: '0 40px' }} />
              <div style={{ padding: '20px 40px 24px' }}>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#8080A8',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  Notes
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: '#3D3D6B',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {invoice.notes}
                </p>
              </div>
            </>
          )}

          {/* Payment & contact footer */}
          <div
            style={{
              backgroundColor: '#F7F7FB',
              borderTop: '1px solid #E3E3EE',
              padding: '20px 40px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {profile.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail style={{ width: 13, height: 13, color: '#8080A8' }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#5A5A8A' }}>
                    {profile.email}
                  </span>
                </span>
              )}
              {profile.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone style={{ width: 13, height: 13, color: '#8080A8' }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#5A5A8A' }}>
                    {profile.phone}
                  </span>
                </span>
              )}
              {profile.website && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe style={{ width: 13, height: 13, color: '#8080A8' }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#5A5A8A' }}>
                    {profile.website}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Powered by Invox footer */}
        <div
          className="no-print"
          style={{
            textAlign: 'center',
            padding: '16px 24px 40px',
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: '#8080A8',
              marginBottom: 6,
            }}
          >
            This invoice was created with
          </p>
          <a
            href="/"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 14,
              fontWeight: 800,
              color: '#1740F5',
              textDecoration: 'none',
              letterSpacing: '-0.03em',
              display: 'inline-block',
              marginBottom: 8,
            }}
          >
            invox
          </a>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: '#ADADC8',
            }}
          >
            Create professional invoices free →{' '}
            <a
              href="/register"
              style={{
                color: '#1740F5',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Sign up free
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
