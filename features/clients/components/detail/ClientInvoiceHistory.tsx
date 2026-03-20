'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FileText, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import type { InvoiceHistoryItem } from '../../types'

const formatCurrency = (amount: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount)

const formatDate = (date: Date | string): string =>
  new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED'

const STATUS_CONFIG: Record<InvoiceStatus, { bg: string; text: string; dot: string; label: string }> = {
  DRAFT:     { bg: 'var(--blue-50)',  text: 'var(--blue-700)',  dot: 'var(--blue-400)', label: 'Draft' },
  SENT:      { bg: '#E0F7FA',         text: '#006A7A',          dot: '#00ACC1',         label: 'Sent' },
  PAID:      { bg: '#EDFAF3',         text: '#0A8F52',          dot: 'var(--success)',  label: 'Paid' },
  PARTIAL:   { bg: '#FFF7EA',         text: '#B57200',          dot: 'var(--warning)',  label: 'Partial' },
  OVERDUE:   { bg: '#FFF0F0',         text: '#C72020',          dot: 'var(--error)',    label: 'Overdue' },
  CANCELLED: { bg: 'var(--ink-50)',   text: 'var(--ink-500)',   dot: 'var(--ink-300)',  label: 'Cancelled' },
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: config.bg, color: config.text, borderRadius: '999px', fontFamily: 'var(--font-display)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.dot }} />
      {config.label}
    </span>
  )
}

function SkeletonRows() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

function EmptyState({ clientId }: { clientId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-12 h-12 rounded-[var(--r-xl)] flex items-center justify-center mb-[var(--s4)]" style={{ background: 'var(--surface-overlay)' }}>
        <FileText className="h-5 w-5" style={{ color: 'var(--ink-300)' }} />
      </div>
      <p className="font-semibold mb-1" style={{ color: 'var(--ink-900)', fontFamily: 'var(--font-display)', fontSize: '15px' }}>
        No invoices yet
      </p>
      <p className="text-sm mb-[var(--s5)] max-w-xs" style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)' }}>
        Create your first invoice for this client to start tracking your billing history.
      </p>
      <Link
        href={`/invoices/new?clientId=${clientId}`}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium transition-opacity hover:opacity-90"
        style={{ background: 'var(--blue-600)', color: 'white', fontFamily: 'var(--font-display)' }}
      >
        <Plus className="h-4 w-4" />
        Create Invoice
      </Link>
    </div>
  )
}

type SortKey = 'invoiceNumber' | 'issueDate' | 'dueDate' | 'total'
type SortDir = 'asc' | 'desc'

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />
  if (dir === 'asc') return <ArrowUp className="ml-1.5 h-3.5 w-3.5" />
  return <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
}

const thStyle = { color: 'var(--ink-400)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }

export function ClientInvoiceHistory({ invoices, isLoading, clientId }: {
  invoices: InvoiceHistoryItem[]; isLoading: boolean; clientId: string
}) {
  const [sortKey, setSortKey] = useState<SortKey>('issueDate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = useMemo(() => {
    return [...invoices].sort((a, b) => {
      let aVal: number | string = ''
      let bVal: number | string = ''
      switch (sortKey) {
        case 'invoiceNumber': aVal = a.invoiceNumber; bVal = b.invoiceNumber; break
        case 'issueDate': aVal = new Date(a.issueDate).getTime(); bVal = new Date(b.issueDate).getTime(); break
        case 'dueDate': aVal = new Date(a.dueDate).getTime(); bVal = new Date(b.dueDate).getTime(); break
        case 'total': aVal = a.total; bVal = b.total; break
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [invoices, sortKey, sortDir])

  const SortableHead = ({ col, children }: { col: SortKey; children: React.ReactNode }) => (
    <TableHead style={thStyle}>
      <button className="flex items-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity" onClick={() => handleSort(col)} style={{ color: sortKey === col ? 'var(--ink-900)' : 'var(--ink-400)' }}>
        {children}
        <SortIcon active={sortKey === col} dir={sortDir} />
      </button>
    </TableHead>
  )

  return (
    <div className="rounded-[var(--r-xl)] border overflow-hidden" style={{ background: 'var(--surface-base)', borderColor: 'var(--border-default)' }}>
      <div className="px-[var(--s5)] py-[var(--s4)] border-b flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
        <div>
          <h3 className="font-bold" style={{ color: 'var(--ink-900)', fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '-0.02em' }}>
            Invoice History
          </h3>
          {!isLoading && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)' }}>
              {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total
            </p>
          )}
        </div>
        <Link
          href={`/invoices/new?clientId=${clientId}`}
          className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[0.8rem] font-medium transition-colors hover:bg-muted"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--ink-900)', fontFamily: 'var(--font-display)', fontSize: '13px' }}
        >
          <Plus className="h-3.5 w-3.5" />
          New Invoice
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow style={{ background: 'var(--surface-raised)' }}>
            <SortableHead col="invoiceNumber">Invoice #</SortableHead>
            <SortableHead col="issueDate">Issue Date</SortableHead>
            <SortableHead col="dueDate">Due Date</SortableHead>
            <SortableHead col="total">Amount</SortableHead>
            <TableHead style={thStyle}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SkeletonRows />
          ) : sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}><EmptyState clientId={clientId} /></TableCell>
            </TableRow>
          ) : (
            sorted.map((invoice) => (
              <TableRow key={invoice.id} style={{ borderColor: 'var(--border-default)' }}>
                <TableCell>
                  <Link href={`/invoices/${invoice.id}`} className="hover:underline underline-offset-2 font-medium transition-colors" style={{ color: 'var(--blue-600)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                    {invoice.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <span style={{ color: 'var(--ink-900)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>{formatDate(invoice.issueDate)}</span>
                </TableCell>
                <TableCell>
                  <span style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>{formatDate(invoice.dueDate)}</span>
                </TableCell>
                <TableCell>
                  <span style={{ color: 'var(--ink-900)', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500 }}>
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
