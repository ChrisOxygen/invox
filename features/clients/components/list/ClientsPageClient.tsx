'use client'

import { useState, useCallback, useEffect } from 'react'
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
import { useClients } from '../../hooks/use-clients'
import { useDeleteClient } from '../../hooks/use-delete-client'
import type { ClientWithStats } from '../../types'
import { ClientSheet } from '../ClientSheet'
import { ClientsTable } from './ClientsTable'
import { ClientFilters } from './ClientFilters'
import { ClientsEmptyState } from './ClientsEmptyState'

const PAGE_SIZE = 20

export function ClientsPageClient() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientWithStats | null>(null)
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null)

  const { data, isPending } = useClients({ search, page, pageSize: PAGE_SIZE })
  const deleteMutation = useDeleteClient()

  const clients = data?.clients ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleEdit = useCallback((client: ClientWithStats) => {
    setEditingClient(client)
    setIsSheetOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setEditingClient(null)
    setIsSheetOpen(true)
  }, [])

  useEffect(() => {
    window.addEventListener('invox:add-client', handleAdd)
    return () => window.removeEventListener('invox:add-client', handleAdd)
  }, [handleAdd])

  const handleDeleteConfirm = () => {
    if (!deletingClientId) return
    deleteMutation.mutate(deletingClientId, {
      onSuccess: () => {
        toast.success('Client deleted')
        setDeletingClientId(null)
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete client')
        setDeletingClientId(null)
      },
    })
  }

  const hasSearch = search.trim().length > 0
  const isEmpty = !isPending && clients.length === 0

  return (
    <>
      {/* Filters */}
      <div className="mb-4">
        <ClientFilters onSearch={handleSearch} total={total} isLoading={isPending} />
      </div>

      {/* Table or empty state */}
      {isEmpty ? (
        <ClientsEmptyState
          variant={hasSearch ? 'no-results' : 'no-clients'}
          onAdd={hasSearch ? undefined : handleAdd}
          onClear={hasSearch ? () => handleSearch('') : undefined}
        />
      ) : (
        <>
          <ClientsTable
            clients={clients}
            isLoading={isPending}
            onEdit={handleEdit}
            onDelete={(id) => setDeletingClientId(id)}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 [font-family:var(--font-body)] text-[13px] text-(--ink-400)">
              <span>
                Page{' '}
                <span className="[font-family:var(--font-mono)] font-medium text-(--ink-700)">{page}</span>
                {' '}of{' '}
                <span className="[font-family:var(--font-mono)] font-medium text-(--ink-700)">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="[font-family:var(--font-display)] font-semibold text-[12px] border-(--border-default) text-(--ink-700) h-8 rounded"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="[font-family:var(--font-display)] font-semibold text-[12px] border-(--border-default) text-(--ink-700) h-8 rounded"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit sheet */}
      <ClientSheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open)
          if (!open) setEditingClient(null)
        }}
        client={editingClient}
        onSuccess={() => {
          setIsSheetOpen(false)
          setEditingClient(null)
        }}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={!!deletingClientId} onOpenChange={(open) => { if (!open) setDeletingClientId(null) }}>
        <DialogContent
          className="bg-(--surface-base) border-(--border-default) max-w-[420px] rounded"
        >
          <DialogHeader>
            <DialogTitle className="[font-family:var(--font-display)] text-[18px] font-bold text-(--ink-900) tracking-[-0.02em]">
              Delete client?
            </DialogTitle>
            <DialogDescription className="[font-family:var(--font-body)] text-[14px] text-(--ink-400) leading-[1.5] mt-[6px]">
              This will hide the client from your list. Their invoices will be retained.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingClientId(null)}
              disabled={deleteMutation.isPending}
              className="[font-family:var(--font-display)] font-semibold text-[13px] border-(--border-default) text-(--ink-700) h-9 rounded"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="[font-family:var(--font-display)] font-semibold text-[13px] bg-(--error) text-white border-0 h-9 rounded"
            >
              {deleteMutation.isPending ? (
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
