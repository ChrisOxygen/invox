'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { useInvoices } from '../../hooks/use-invoices'
import type { InvoiceFilters } from '../../types'
import { InvoiceFilters as InvoiceFiltersComponent } from './InvoiceFilters'
import { InvoicesTable } from './InvoicesTable'
import { InvoicesEmptyState } from './InvoicesEmptyState'

const PAGE_SIZE = 20

export function InvoicesPageClient() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [filters, setFilters] = useState<InvoiceFilters>({
    status: undefined,
    search: undefined,
    page: 1,
    pageSize: PAGE_SIZE,
  })
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data, isPending } = useInvoices(filters)

  const invoices = data?.invoices ?? []
  const total = data?.total ?? 0
  const page = filters.page ?? 1
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const hasFilters = Boolean(
    (filters.status && filters.status !== 'ALL') ||
    (filters.search && filters.search.trim().length > 0)
  )

  const isEmpty = !isPending && invoices.length === 0

  const handleFilterChange = useCallback((next: InvoiceFilters) => {
    setFilters(next)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({ status: undefined, search: undefined, page: 1, pageSize: PAGE_SIZE })
  }, [])

  const handleDuplicate = useCallback(async (id: string) => {
    setIsDuplicating(true)
    try {
      const res = await fetch(`/api/v1/invoices/${id}/duplicate`, { method: 'POST' })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error?.message ?? 'Failed to duplicate invoice')
      }
      const newInvoice = await res.json()
      await queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Invoice duplicated')
      router.push(`/invoices/${newInvoice.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to duplicate invoice')
    } finally {
      setIsDuplicating(false)
    }
  }, [queryClient, router])

  const handleDeleteConfirm = async () => {
    if (!deletingInvoiceId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/v1/invoices/${deletingInvoiceId}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error?.message ?? 'Failed to delete invoice')
      }
      await queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Invoice deleted')
      setDeletingInvoiceId(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete invoice')
    } finally {
      setIsDeleting(false)
    }
  }

  const startFrom = (page - 1) * PAGE_SIZE + 1
  const endAt = Math.min(page * PAGE_SIZE, total)

  return (
    <>
      {/* Filters */}
      <div className="mb-5">
        <InvoiceFiltersComponent filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Table or empty state */}
      {isEmpty ? (
        <InvoicesEmptyState
          status={filters.status ?? 'ALL'}
          hasFilters={hasFilters}
          onClearFilters={hasFilters ? handleClearFilters : undefined}
        />
      ) : (
        <>
          <InvoicesTable
            invoices={invoices}
            isPending={isPending || isDuplicating}
            onDuplicate={handleDuplicate}
            onDelete={(id) => setDeletingInvoiceId(id)}
          />

          {/* Pagination */}
          {total > PAGE_SIZE && (
            <div
              className="flex items-center justify-between mt-4"
              style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-400)' }}
            >
              <span>
                Showing{' '}
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--ink-700)' }}>
                  {startFrom}–{endAt}
                </span>
                {' '}of{' '}
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--ink-700)' }}>
                  {total}
                </span>
                {' '}invoices
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page ?? 1) - 1) }))
                  }
                  disabled={page <= 1 || isPending}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 12,
                    borderColor: 'var(--border-default)',
                    color: 'var(--ink-700)',
                    borderRadius: 'var(--r-md)',
                    height: 32,
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: Math.min(totalPages, (prev.page ?? 1) + 1),
                    }))
                  }
                  disabled={page >= totalPages || isPending}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 12,
                    borderColor: 'var(--border-default)',
                    color: 'var(--ink-700)',
                    borderRadius: 'var(--r-md)',
                    height: 32,
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deletingInvoiceId}
        onOpenChange={(open) => {
          if (!open) setDeletingInvoiceId(null)
        }}
      >
        <DialogContent
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--r-xl)',
            maxWidth: 420,
          }}
        >
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--ink-900)',
                letterSpacing: '-0.02em',
              }}
            >
              Delete invoice?
            </DialogTitle>
            <DialogDescription
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--ink-400)',
                lineHeight: 1.5,
                marginTop: 6,
              }}
            >
              This will permanently delete the invoice. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingInvoiceId(null)}
              disabled={isDeleting}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 13,
                borderColor: 'var(--border-default)',
                color: 'var(--ink-700)',
                borderRadius: 'var(--r-md)',
                height: 36,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 13,
                backgroundColor: 'var(--error)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--r-md)',
                height: 36,
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Deleting…
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
