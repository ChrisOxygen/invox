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
          className="flex items-center justify-center rounded-full mb-5 w-14 h-14 bg-(--surface-overlay) text-(--ink-400)"
        >
          <SearchX className="w-6 h-6" />
        </div>

        <h3 className="[font-family:var(--font-display)] text-[16px] font-bold text-(--ink-900) tracking-[-0.02em] mb-1.5">
          No invoices match your filters
        </h3>

        <p className="[font-family:var(--font-body)] text-[14px] text-(--ink-400) max-w-75 mb-5 leading-normal">
          Try adjusting your search or status filter to find what you are looking for.
        </p>

        {onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="[font-family:var(--font-display)] font-semibold text-[13px] border-(--border-strong) text-(--ink-700) rounded"
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
          className="flex items-center justify-center rounded-full mb-5 w-14 h-14"
          style={{
            backgroundColor: isOverdue ? '#EDFAF3' : 'var(--surface-overlay)',
            color: isOverdue ? '#0A8F52' : 'var(--ink-400)',
          }}
        >
          <FileText className="w-6 h-6" />
        </div>

        <h3 className="[font-family:var(--font-display)] text-[16px] font-bold text-(--ink-900) tracking-[-0.02em] mb-1.5">
          {copy?.heading ?? `No ${status.toLowerCase()} invoices`}
          {isOverdue ? ' 🎉' : ''}
        </h3>

        <p className="[font-family:var(--font-body)] text-[14px] text-(--ink-400) max-w-75 mb-5 leading-normal">
          {copy?.description ?? `No invoices with status "${status.toLowerCase()}" found.`}
        </p>

        {!isOverdue && (
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-1.5 rounded text-sm font-semibold transition-colors hover:opacity-90 [font-family:var(--font-display)] bg-(--blue-600) text-white h-8 px-3"
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
      <div className="flex items-center justify-center rounded-full mb-5 w-14 h-14 bg-(--blue-50) text-(--blue-600)">
        <FileText className="w-6 h-6" />
      </div>

      <h3 className="[font-family:var(--font-display)] text-[16px] font-bold text-(--ink-900) tracking-[-0.02em] mb-1.5">
        Create your first invoice
      </h3>

      <p className="[font-family:var(--font-body)] text-[14px] text-(--ink-400) max-w-75 mb-5 leading-normal">
        Send professional, branded invoices to your clients and track payments from draft to paid.
      </p>

      <Link
        href="/invoices/new"
        className="inline-flex items-center gap-1.5 rounded text-sm font-semibold transition-colors hover:opacity-90 [font-family:var(--font-display)] bg-(--blue-600) text-white h-8 px-3"
      >
        <Plus className="w-3.5 h-3.5" />
        Create Invoice
      </Link>
    </div>
  )
}
