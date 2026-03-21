'use client'

import { PDFViewer } from '@react-pdf/renderer'
import { InvoicePDF } from './InvoicePDF'
import type { InvoiceDetail } from '../../types'

export type PDFPreviewProps = {
  invoice: InvoiceDetail
  className?: string
}

export function PDFPreview({ invoice, className }: PDFPreviewProps) {
  return (
    <PDFViewer
      style={{ width: '100%', height: '100%', border: 'none' }}
      className={className}
      showToolbar={false}
    >
      <InvoicePDF invoice={invoice} />
    </PDFViewer>
  )
}
