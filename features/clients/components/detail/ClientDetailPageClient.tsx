'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { useClient } from '../../hooks/use-client'
import { useDeleteClient } from '../../hooks/use-delete-client'
import { ClientSheet } from '../ClientSheet'
import { ClientStatCards } from './ClientStatCards'
import { ClientInfoCard } from './ClientInfoCard'
import { ClientInvoiceHistory } from './ClientInvoiceHistory'

function DetailSkeleton() {
  return (
    <div className="space-y-[var(--s6)]">
      <div className="flex items-center gap-[var(--s3)]">
        <Skeleton className="h-8 w-8 rounded-[var(--r-md)]" />
        <Skeleton className="h-8 w-48 rounded-[var(--r-md)]" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--s4)]">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-[var(--r-xl)]" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--s5)]">
        <Skeleton className="h-64 rounded-[var(--r-xl)]" />
        <div className="lg:col-span-2"><Skeleton className="h-64 rounded-[var(--r-xl)]" /></div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] rounded-[var(--r-xl)] border p-[var(--s10)]" style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)' }}>
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ink-900)', fontFamily: 'var(--font-display)', letterSpacing: '-0.025em' }}>
        Client not found
      </h2>
      <p className="text-sm mb-[var(--s6)] text-center max-w-xs" style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)' }}>
        This client may have been deleted or does not belong to your account.
      </p>
      <Link href="/clients" className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[0.8rem] font-medium transition-colors hover:bg-muted" style={{ borderColor: 'var(--border-strong)', fontFamily: 'var(--font-display)' }}>
        <ArrowLeft className="h-4 w-4" />Back to Clients
      </Link>
    </div>
  )
}

export function ClientDetailPageClient({ id }: { id: string }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: client, isPending, isError } = useClient(id)
  const deleteMutation = useDeleteClient()

  const handleDeleteConfirm = () => {
    if (!client) return
    deleteMutation.mutate(client.id, {
      onSuccess: () => {
        toast.success('Client deleted')
        router.push('/clients')
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete client')
        setDeleteOpen(false)
      },
    })
  }

  if (isPending) return <DetailSkeleton />
  if (isError || !client) return <NotFound />

  return (
    <div className="space-y-[var(--s6)]">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--s4)]">
        <div className="flex items-center gap-[var(--s3)]">
          <Link href="/clients" className="inline-flex items-center gap-1.5 px-2 h-8 rounded-lg text-[0.8rem] font-medium transition-colors hover:bg-muted" style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-display)', fontSize: '13px' }}>
            <ArrowLeft className="h-4 w-4" />Clients
          </Link>
          <span style={{ color: 'var(--border-strong)' }}>/</span>
          <h1 className="font-bold truncate max-w-[200px] sm:max-w-none" style={{ color: 'var(--ink-900)', fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '-0.025em' }}>
            {client.name}
          </h1>
        </div>

        <div className="flex items-center gap-[var(--s2)] flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)} className="gap-1.5" style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-display)', fontSize: '13px' }}>
            <Edit className="h-4 w-4" />Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(true)} className="gap-1.5" style={{ color: 'var(--error)', fontFamily: 'var(--font-display)', fontSize: '13px' }}>
            <Trash2 className="h-4 w-4" />Delete
          </Button>
          <Link href={`/invoices/new?clientId=${id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.8rem] font-medium transition-opacity hover:opacity-90" style={{ background: 'var(--blue-600)', color: 'white', fontFamily: 'var(--font-display)', fontSize: '13px' }}>
            <Plus className="h-4 w-4" />New Invoice
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <ClientStatCards client={client} />

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--s5)]">
        <div className="lg:col-span-1">
          <ClientInfoCard client={client} onEdit={() => setEditOpen(true)} onDelete={() => setDeleteOpen(true)} />
        </div>
        <div className="lg:col-span-2">
          <ClientInvoiceHistory invoices={client.invoices} isLoading={false} clientId={id} />
        </div>
      </div>

      {/* Edit sheet */}
      <ClientSheet open={editOpen} onOpenChange={setEditOpen} client={client} onSuccess={() => setEditOpen(false)} />

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[420px]" style={{ borderColor: 'var(--border-default)' }}>
          <DialogHeader>
            <div className="w-10 h-10 rounded-[var(--r-lg)] flex items-center justify-center mb-[var(--s3)]" style={{ background: '#FFF0F0' }}>
              <Trash2 className="h-5 w-5" style={{ color: 'var(--error)' }} />
            </div>
            <DialogTitle style={{ color: 'var(--ink-900)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Delete {client.name}?
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              This will hide the client from your list. Their invoices will be retained.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-[var(--s2)]">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleteMutation.isPending} style={{ borderColor: 'var(--border-strong)', fontFamily: 'var(--font-display)', fontSize: '13px' }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} disabled={deleteMutation.isPending} style={{ background: 'var(--error)', color: 'white', fontFamily: 'var(--font-display)', fontSize: '13px' }} className="gap-1.5">
              {deleteMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Deleting...</> : <><Trash2 className="h-4 w-4" />Delete Client</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
