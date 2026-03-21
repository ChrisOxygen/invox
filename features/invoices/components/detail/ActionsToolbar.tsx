'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Send,
  Link2,
  MoreHorizontal,
  Copy,
  FileDown,
  Eye,
  CopyPlus,
  XCircle,
  Trash2,
  MessageCircle,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { InvoiceStatusBadge } from '../list/InvoiceStatusBadge'
import { useUpdateInvoiceStatus } from '../../hooks/use-update-invoice-status'
import { useGenerateShareToken } from '../../hooks/use-generate-share-token'
import type { InvoiceDetail } from '../../types'

export type ActionsToolbarProps = {
  invoice: InvoiceDetail
  onRecordPayment: () => void
}

function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate)
  const now = new Date()
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function isShareTokenValid(shareToken: string | null, shareTokenExp: string | null): boolean {
  if (!shareToken || !shareTokenExp) return false
  return new Date(shareTokenExp) > new Date()
}

export function ActionsToolbar({ invoice, onRecordPayment }: ActionsToolbarProps) {
  const [isShareLoading, setIsShareLoading] = useState(false)

  const updateStatusMutation = useUpdateInvoiceStatus()
  const generateShareToken = useGenerateShareToken()

  const handleMarkAsSent = () => {
    updateStatusMutation.mutate(
      { invoiceId: invoice.id, status: 'SENT' },
      {
        onSuccess: () => toast.success('Invoice marked as sent'),
        onError: (err) => toast.error(err.message || 'Failed to update status'),
      }
    )
  }

  const handleShareLink = async () => {
    const tokenValid = isShareTokenValid(invoice.shareToken, invoice.shareTokenExp)

    if (tokenValid && invoice.shareToken) {
      const url = `${window.location.origin}/i/${invoice.shareToken}`
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied!')
      } catch {
        toast.error('Failed to copy link')
      }
      return
    }

    setIsShareLoading(true)
    generateShareToken.mutate(
      { invoiceId: invoice.id },
      {
        onSuccess: async (data) => {
          const url = `${window.location.origin}/i/${data.shareToken}`
          try {
            await navigator.clipboard.writeText(url)
            toast.success('Share link created and copied!')
          } catch {
            toast.error('Link created but could not copy automatically')
          }
        },
        onError: (err) => toast.error(err.message || 'Failed to generate share link'),
        onSettled: () => setIsShareLoading(false),
      }
    )
  }

  const handleWhatsApp = () => {
    if (!invoice.shareToken) return
    const url = `${window.location.origin}/i/${invoice.shareToken}`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`Hi, here is your invoice: ${url}`)}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCancelInvoice = () => {
    updateStatusMutation.mutate(
      { invoiceId: invoice.id, status: 'CANCELLED' },
      {
        onSuccess: () => toast.success('Invoice cancelled'),
        onError: (err) => toast.error(err.message || 'Failed to cancel invoice'),
      }
    )
  }

  const isOverdue = invoice.status === 'OVERDUE'
  const daysOverdue = isOverdue ? getDaysOverdue(invoice.dueDate) : 0
  const tokenValid = isShareTokenValid(invoice.shareToken, invoice.shareTokenExp)
  const isMarkingSent = updateStatusMutation.isPending

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--s3)]">
      {/* Left: status + overdue label */}
      <div className="flex flex-col gap-1">
        <InvoiceStatusBadge status={invoice.status} />
        {isOverdue && daysOverdue > 0 && (
          <span className="[font-family:var(--font-body)] text-[12px] text-(--error)">
            {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
          </span>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-[var(--s2)]">
        {/* Edit — DRAFT only */}
        {invoice.status === 'DRAFT' && (
          <Link href={`/invoices/${invoice.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="[font-family:var(--font-display)] text-[13px] border-(--border-strong) text-(--ink-900) rounded-md"
            >
              Edit
            </Button>
          </Link>
        )}

        {/* Mark as Sent — DRAFT only */}
        {invoice.status === 'DRAFT' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAsSent}
            disabled={isMarkingSent}
            className="gap-1.5 [font-family:var(--font-display)] text-[13px] border-(--border-strong) text-(--ink-900) rounded-md"
          >
            {isMarkingSent ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Mark as Sent
          </Button>
        )}

        {/* Record Payment — SENT, PARTIAL, or OVERDUE */}
        {(invoice.status === 'SENT' ||
          invoice.status === 'PARTIAL' ||
          invoice.status === 'OVERDUE') && (
          <Button
            size="sm"
            onClick={onRecordPayment}
            className="gap-1.5 bg-(--blue-600) text-white [font-family:var(--font-display)] text-[13px] rounded-md"
          >
            Record Payment
          </Button>
        )}

        {/* Share Link — always shown */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareLink}
          disabled={isShareLoading || generateShareToken.isPending}
          className="gap-1.5 [font-family:var(--font-display)] text-[13px] border-(--border-strong) text-(--ink-900) rounded-md"
        >
          {isShareLoading || generateShareToken.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : tokenValid ? (
            <Copy className="h-3.5 w-3.5" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
          Share Link
        </Button>

        {/* WhatsApp — when share token exists */}
        {tokenValid && invoice.shareToken && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsApp}
            className="gap-1.5 [font-family:var(--font-display)] text-[13px] rounded-md"
            style={{ borderColor: '#25D366', color: '#25D366' }}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </Button>
        )}

        {/* More menu — always shown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex h-8 w-8 items-center justify-center rounded border p-0 transition-colors hover:bg-(--surface-overlay) border-(--border-strong) text-(--ink-400)"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-(--border-default) bg-(--surface-base)"
          >
            <DropdownMenuItem
              className="gap-2 cursor-pointer [font-family:var(--font-body)] text-[13px] text-(--ink-900)"
              onClick={() => window.open(`/invoices/${invoice.id}/preview`, '_self')}
            >
              <Eye className="h-4 w-4 text-(--ink-400)" />
              Preview PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer [font-family:var(--font-body)] text-[13px] text-(--ink-900)"
              onClick={() => window.location.assign(`/api/v1/invoices/${invoice.id}/pdf`)}
            >
              <FileDown className="h-4 w-4 text-(--ink-400)" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <CopyPlus className="h-4 w-4 text-(--ink-400)" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-(--border-default)" />
            {invoice.status !== 'CANCELLED' && (
              <DropdownMenuItem
                className="gap-2 cursor-pointer [font-family:var(--font-body)] text-[13px] text-(--warning)"
                onClick={handleCancelInvoice}
              >
                <XCircle className="h-4 w-4" />
                Cancel Invoice
              </DropdownMenuItem>
            )}
            {invoice.status === 'DRAFT' && (
              <DropdownMenuItem
                className="gap-2 cursor-pointer [font-family:var(--font-body)] text-[13px] text-(--error)"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
