'use client'

import Link from 'next/link'
import { FileText, SearchX, X, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { InvoiceStatus } from '../../types'

interface InvoicesEmptyStateProps {
  status?: InvoiceStatus | 'ALL' | undefined
  hasFilters: boolean
  onClearFilters?: () => void
}

const STATUS_EMPTY_COPY: Partial<Record<InvoiceStatus, { heading: string; description: string }>> = {
  DRAFT: {
    heading: 'No draft invoices',
    description: 'Invoices you are still working on will appear here.',
  },
  SENT: {
    heading: 'No sent invoices',
    description: 'Invoices you have sent to clients will appear here.',
  },
  PAID: {
    heading: 'No paid invoices yet',
    description: 'Once a client pays, mark the invoice as paid and it will show up here.',
  },
  PARTIAL: {
    heading: 'No partially paid invoices',
    description: 'Invoices with a partial payment recorded will appear here.',
  },
  OVERDUE: {
    heading: 'No overdue invoices',
    description: 'Great work — all your invoices are on track.',
  },
  CANCELLED: {
    heading: 'No cancelled invoices',
    description: 'Invoices you have cancelled will appear here.',
  },
}

export function InvoicesEmptyState({ status, hasFilters, onClearFilters }: InvoicesEmptyStateProps) {
  // Filtered empty state — no results match current filters
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="flex items-center justify-center rounded-full mb-5"
          style={{ width: 56, height: 56, backgroundColor: 'var(--surface-overlay)', color: 'var(--ink-400)' }}
        >
          <SearchX className="w-6 h-6" />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--ink-900)',
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}
        >
          No invoices match your filters
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--ink-400)',
            maxWidth: 300,
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          Try adjusting your search or status filter to find what you are looking for.
        </p>

        {onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 13,
              borderColor: 'var(--border-strong)',
              color: 'var(--ink-700)',
              borderRadius: 'var(--r-md)',
            }}
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  // Status-specific empty states (when no filter search is active but a status tab is selected)
  if (status && status !== 'ALL') {
    const copy = STATUS_EMPTY_COPY[status as InvoiceStatus]

    // Special cheerful state for overdue (good news)
    const isOverdue = status === 'OVERDUE'

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="flex items-center justify-center rounded-full mb-5"
          style={{
            width: 56,
            height: 56,
            backgroundColor: isOverdue ? '#EDFAF3' : 'var(--surface-overlay)',
            color: isOverdue ? '#0A8F52' : 'var(--ink-400)',
          }}
        >
          <FileText className="w-6 h-6" />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--ink-900)',
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}
        >
          {copy?.heading ?? `No ${status.toLowerCase()} invoices`}
          {isOverdue ? ' 🎉' : ''}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--ink-400)',
            maxWidth: 300,
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          {copy?.description ?? `No invoices with status "${status.toLowerCase()}" found.`}
        </p>

        {!isOverdue && (
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
            style={{
              fontFamily: 'var(--font-display)',
              backgroundColor: 'var(--blue-600)',
              color: '#fff',
              height: 32,
              paddingLeft: 12,
              paddingRight: 12,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Create Invoice
          </Link>
        )}
      </div>
    )
  }

  // Default: no invoices at all
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="flex items-center justify-center rounded-full mb-5"
        style={{ width: 56, height: 56, backgroundColor: 'var(--blue-50)', color: 'var(--blue-600)' }}
      >
        <FileText className="w-6 h-6" />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--ink-900)',
          letterSpacing: '-0.02em',
          marginBottom: 6,
        }}
      >
        Create your first invoice
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--ink-400)',
          maxWidth: 300,
          marginBottom: 20,
          lineHeight: 1.5,
        }}
      >
        Send professional, branded invoices to your clients and track payments from draft to paid.
      </p>

      <Link
        href="/invoices/new"
        className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
        style={{
          fontFamily: 'var(--font-display)',
          backgroundColor: 'var(--blue-600)',
          color: '#fff',
          height: 32,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        Create Invoice
      </Link>
    </div>
  )
}
