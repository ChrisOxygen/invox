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

  const sizeClasses = size === 'sm' ? 'text-[13px] px-3 py-1.5' : 'text-[14px] px-4 py-2'
  const variantClasses =
    variant === 'default'
      ? 'bg-(--blue-600) text-white border-(--blue-600)'
      : 'bg-transparent text-(--ink-900) border-(--border-strong)'

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={filename}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded font-display font-semibold border cursor-pointer transition-[background,border-color,color] duration-[200ms] ease-[ease] ${sizeClasses} ${variantClasses}`}
        >
          {loading ? (
            <Loader2 className="w-[14px] h-[14px] animate-spin" />
          ) : (
            <Download className="w-[14px] h-[14px]" />
          )}
          {loading ? 'Preparing...' : 'Download PDF'}
        </span>
      )}
    </PDFDownloadLink>
  )
}
