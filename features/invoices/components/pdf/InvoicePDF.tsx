import React from 'react'
import { Document, Page, View, Text, Image } from '@react-pdf/renderer'
import { createPdfStyles, BRAND_FALLBACK } from './pdf-styles'
import type { InvoiceDetail } from '../../types'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatAmount(amount: number, currency: string): string {
  if (currency === 'NGN') {
    return `\u20A6${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

// ─── Component ──────────────────────────────────────────────────────────────

export type InvoicePDFProps = {
  invoice: InvoiceDetail
}

export function InvoicePDF({ invoice }: InvoicePDFProps) {
  const brandColor = invoice.profile.brandColor ?? BRAND_FALLBACK
  const styles = createPdfStyles(brandColor)
  const currency = invoice.currency

  const businessAddress = [
    invoice.profile.address,
    invoice.profile.city,
    invoice.profile.state,
    invoice.profile.country,
  ]
    .filter(Boolean)
    .join(', ')

  const clientAddress = [
    invoice.client.address,
    invoice.client.city,
    invoice.client.state,
    invoice.client.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Document
      title={`Invoice ${invoice.invoiceNumber}`}
      author={invoice.profile.businessName ?? 'Invox'}
      subject={`Invoice for ${invoice.client.name}`}
      creator="Invox"
      producer="Invox (react-pdf)"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Header strip ─────────────────────────────────────────── */}
        <View style={styles.header} fixed>
          {/* Left: logo or business name */}
          <View>
            {invoice.profile.logoUrl ? (
              <Image src={invoice.profile.logoUrl} style={styles.headerLogo} />
            ) : (
              <Text style={styles.headerBusinessName}>
                {invoice.profile.businessName ?? 'Your Business'}
              </Text>
            )}
            {invoice.profile.logoUrl && invoice.profile.businessName && (
              <Text style={styles.headerBusinessSub}>{invoice.profile.businessName}</Text>
            )}
          </View>

          {/* Right: INVOICE title + number */}
          <View style={styles.headerRight}>
            <Text style={styles.headerInvoiceLabel}>Invoice</Text>
            <Text style={styles.headerInvoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* ── PAID stamp overlay ────────────────────────────────────── */}
        {invoice.status === 'PAID' && (
          <View style={styles.paidStamp}>
            <Text style={styles.paidStampText}>PAID</Text>
          </View>
        )}

        {/* ── Info block ────────────────────────────────────────────── */}
        <View style={styles.infoBlock}>
          {/* FROM */}
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>From</Text>
            <Text style={styles.infoName}>
              {invoice.profile.businessName ?? 'Your Business'}
            </Text>
            {businessAddress ? (
              <Text style={styles.infoLine}>{businessAddress}</Text>
            ) : null}
            {invoice.profile.phone ? (
              <Text style={styles.infoLine}>{invoice.profile.phone}</Text>
            ) : null}
            {invoice.profile.email ? (
              <Text style={styles.infoLine}>{invoice.profile.email}</Text>
            ) : null}
            {invoice.profile.website ? (
              <Text style={styles.infoMuted}>{invoice.profile.website}</Text>
            ) : null}
            {invoice.profile.taxNumber ? (
              <Text style={styles.infoMuted}>TIN: {invoice.profile.taxNumber}</Text>
            ) : null}
            {invoice.profile.rcNumber ? (
              <Text style={styles.infoMuted}>RC: {invoice.profile.rcNumber}</Text>
            ) : null}
          </View>

          {/* BILL TO + dates */}
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Bill To</Text>
            <Text style={styles.infoName}>{invoice.client.name}</Text>
            {invoice.client.company ? (
              <Text style={styles.infoLine}>{invoice.client.company}</Text>
            ) : null}
            {clientAddress ? (
              <Text style={styles.infoLine}>{clientAddress}</Text>
            ) : null}
            {invoice.client.email ? (
              <Text style={styles.infoLine}>{invoice.client.email}</Text>
            ) : null}
            {invoice.client.phone ? (
              <Text style={styles.infoLine}>{invoice.client.phone}</Text>
            ) : null}

            {/* Invoice dates */}
            <View style={styles.datesBlock}>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Issue Date</Text>
                <Text style={styles.dateValue}>{formatDate(invoice.issueDate)}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Due Date</Text>
                <Text style={styles.dateValue}>{formatDate(invoice.dueDate)}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Currency</Text>
                <Text style={styles.dateValue}>{currency}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Line items table ─────────────────────────────────────── */}
        <View style={styles.tableWrapper}>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <View style={styles.colDescription}>
              <Text style={styles.tableHeaderCell}>Description</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.tableHeaderCell}>Qty</Text>
            </View>
            <View style={styles.colUnitPrice}>
              <Text style={styles.tableHeaderCell}>Unit Price</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={styles.tableHeaderCell}>Amount</Text>
            </View>
          </View>

          {/* Table rows */}
          {invoice.items.map((item, index) => (
            <View
              key={item.id}
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              wrap={false}
            >
              <View style={styles.colDescription}>
                <Text style={styles.cellText}>{item.description}</Text>
              </View>
              <View style={styles.colQty}>
                <Text style={styles.cellMono}>{item.quantity}</Text>
              </View>
              <View style={styles.colUnitPrice}>
                <Text style={styles.cellMono}>{formatAmount(item.unitPrice, currency)}</Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={styles.cellMono}>{formatAmount(item.subtotal, currency)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Totals ───────────────────────────────────────────────── */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{formatAmount(invoice.subtotal, currency)}</Text>
            </View>

            {invoice.discountAmount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  Discount{invoice.discountType === 'PERCENTAGE' ? ` (${invoice.discount}%)` : ''}
                </Text>
                <Text style={styles.totalsValue}>
                  -{formatAmount(invoice.discountAmount, currency)}
                </Text>
              </View>
            )}

            {invoice.taxAmount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  Tax{invoice.taxType === 'PERCENTAGE' ? ` (${invoice.taxRate}%)` : ''}
                </Text>
                <Text style={styles.totalsValue}>{formatAmount(invoice.taxAmount, currency)}</Text>
              </View>
            )}

            <View style={styles.totalsDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatAmount(invoice.total, currency)}</Text>
            </View>
          </View>
        </View>

        {/* ── Notes ────────────────────────────────────────────────── */}
        {invoice.notes ? (
          <View style={styles.notesWrapper}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        ) : null}

        {/* ── Footer (fixed — repeats on every page) ───────────────── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLeft}>
            {invoice.profile.businessName ?? 'Your Business'}
          </Text>
          <Text style={styles.footerCenter}>Generated by Invox</Text>
          <Text
            style={styles.footerPageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
