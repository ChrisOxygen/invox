'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download, Loader2 } from 'lucide-react'
import { InvoicePDF } from './InvoicePDF'
import type { InvoiceDetail } from '../../types'

export type DownloadButtonProps = {
  invoice: InvoiceDetail
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md'
}

export function DownloadButton({ invoice, variant = 'default', size = 'md' }: DownloadButtonProps) {
  const filename = `INVOX-${invoice.invoiceNumber}-${invoice.client.name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: 'var(--r-md)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    border: '1px solid transparent',
    transition: 'background 200ms ease, border-color 200ms ease, color 200ms ease',
    fontSize: size === 'sm' ? '13px' : '14px',
    padding: size === 'sm' ? '6px 12px' : '8px 16px',
  }

  const variantStyle: React.CSSProperties =
    variant === 'default'
      ? {
          background: 'var(--blue-600)',
          color: '#ffffff',
          borderColor: 'var(--blue-600)',
        }
      : {
          background: 'transparent',
          color: 'var(--ink-900)',
          borderColor: 'var(--border-strong)',
        }

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={filename}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <span style={{ ...baseStyle, ...variantStyle }}>
          {loading ? (
            <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Download style={{ width: '14px', height: '14px' }} />
          )}
          {loading ? 'Preparing...' : 'Download PDF'}
        </span>
      )}
    </PDFDownloadLink>
  )
}
