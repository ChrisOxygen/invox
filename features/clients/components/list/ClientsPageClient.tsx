'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Plus, Loader2 } from 'lucide-react'
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
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.025em', lineHeight: 1.2 }}
          >
            Clients
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-400)', marginTop: 4 }}>
            Manage your client contacts and relationships
          </p>
        </div>

        <Button
          onClick={handleAdd}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, backgroundColor: 'var(--blue-600)', color: '#fff', borderRadius: 'var(--r-md)', border: 'none', height: 36, paddingLeft: 14, paddingRight: 14 }}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Client
        </Button>
      </div>

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
            <div
              className="flex items-center justify-between mt-4"
              style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-400)' }}
            >
              <span>
                Page{' '}
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--ink-700)' }}>{page}</span>
                {' '}of{' '}
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--ink-700)' }}>{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, borderColor: 'var(--border-default)', color: 'var(--ink-700)', borderRadius: 'var(--r-md)', height: 32 }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, borderColor: 'var(--border-default)', color: 'var(--ink-700)', borderRadius: 'var(--r-md)', height: 32 }}
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
          style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-default)', borderRadius: 'var(--r-xl)', maxWidth: 420 }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.02em' }}>
              Delete client?
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-400)', lineHeight: 1.5, marginTop: 6 }}>
              This will hide the client from your list. Their invoices will be retained.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingClientId(null)}
              disabled={deleteMutation.isPending}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, borderColor: 'var(--border-default)', color: 'var(--ink-700)', borderRadius: 'var(--r-md)', height: 36 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, backgroundColor: 'var(--error)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', height: 36 }}
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
