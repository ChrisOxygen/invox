'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Download,
  Copy,
  Trash2,
} from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { buttonVariants } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn, formatCurrency } from '@/shared/lib/utils'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import type { InvoiceListItem } from '../../types'

interface InvoicesTableProps {
  invoices: InvoiceListItem[]
  isPending: boolean
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-b border-(--border-default)">
          <TableCell>
            <Skeleton className="h-3.5 w-28" />
          </TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-3.5 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-7 w-7 rounded ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function SkeletonCards() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-(--surface-base) border border-(--border-default) rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center justify-between pt-1 border-t border-(--border-default)">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-10" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDisplayDate(isoString: string): string {
  try {
    return format(parseISO(isoString), 'd MMM yyyy')
  } catch {
    return '—'
  }
}

function DueDateCell({ dueDate, status }: { dueDate: string; status: InvoiceListItem['status'] }) {
  const isOverdue = status === 'OVERDUE'
  const displayDate = formatDisplayDate(dueDate)

  if (isOverdue) {
    return (
      <span className="font-body text-[13px] text-(--error)">
        {displayDate}
      </span>
    )
  }

  return (
    <span className="font-body text-[13px] text-(--ink-400)">
      {displayDate}
    </span>
  )
}

const columnHelper = createColumnHelper<InvoiceListItem>()

const thClassName =
  'text-(--ink-400) font-display text-[11px] font-semibold tracking-mono uppercase py-3'

interface InvoiceCardProps {
  invoice: InvoiceListItem
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

function InvoiceCard({ invoice, onDuplicate, onDelete }: InvoiceCardProps) {
  const isDraft = invoice.status === 'DRAFT'
  const isDeletable = invoice.status === 'DRAFT' || invoice.status === 'CANCELLED'

  return (
    <div className="bg-(--surface-base) border border-(--border-default) rounded-xl p-4 space-y-3">
      {/* Top row: invoice # + status + actions */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/invoices/${invoice.id}`}
          className="font-mono text-[13px] font-medium text-(--blue-600) no-underline shrink-0"
        >
          {invoice.invoiceNumber}
        </Link>
        <div className="flex items-center gap-2">
          <InvoiceStatusBadge status={invoice.status} />
          <DropdownMenu>
            <DropdownMenuTrigger className="h-7 w-7 inline-flex items-center justify-center rounded text-(--ink-400) hover:bg-(--surface-overlay) transition-colors duration-100">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Invoice actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-42 border border-(--border-default) bg-(--surface-base) rounded">
              <DropdownMenuItem className="font-body text-[13px] text-(--ink-900) cursor-pointer">
                <Link href={`/invoices/${invoice.id}`} className="flex items-center w-full">
                  <Eye className="h-3.5 w-3.5 mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              {isDraft && (
                <DropdownMenuItem className="font-body text-[13px] text-(--ink-900) cursor-pointer">
                  <Link href={`/invoices/${invoice.id}`} className="flex items-center w-full">
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="font-body text-[13px] text-(--ink-900) cursor-pointer">
                <Link href={`/invoices/${invoice.id}/preview`} className="flex items-center w-full">
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Download PDF
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-body text-[13px] text-(--ink-900) cursor-pointer"
                onClick={() => onDuplicate(invoice.id)}
              >
                <Copy className="h-3.5 w-3.5 mr-2" />
                Duplicate
              </DropdownMenuItem>
              {isDeletable && (
                <>
                  <DropdownMenuSeparator className="bg-(--border-default)" />
                  <DropdownMenuItem
                    className="font-body text-[13px] text-(--error) cursor-pointer"
                    onClick={() => onDelete(invoice.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Client name */}
      <div>
        <p className="font-display text-[15px] font-semibold text-(--ink-900) tracking-tight leading-[1.3]">
          {invoice.client.name}
        </p>
        {invoice.client.company && (
          <p className="font-body text-[12px] text-(--ink-400) mt-0.5 leading-[1.2]">
            {invoice.client.company}
          </p>
        )}
      </div>

      {/* Amount — prominent */}
      <p className="font-mono text-[22px] font-medium text-(--ink-900)" style={{ fontFamily: 'var(--font-mono)' }}>
        {formatCurrency(invoice.total, invoice.currency)}
      </p>

      {/* Footer: dates + view button */}
      <div className="flex items-end justify-between pt-3 border-t border-(--border-default)">
        <div className="flex gap-5">
          <div>
            <p className="font-display text-[10px] font-semibold text-(--ink-300) uppercase tracking-widest mb-0.5">
              Issued
            </p>
            <span className="font-body text-[13px] text-(--ink-400)">
              {formatDisplayDate(invoice.issueDate)}
            </span>
          </div>
          <div>
            <p className="font-display text-[10px] font-semibold text-(--ink-300) uppercase tracking-widest mb-0.5">
              Due
            </p>
            <DueDateCell dueDate={invoice.dueDate} status={invoice.status} />
          </div>
        </div>
        <Link
          href={`/invoices/${invoice.id}`}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'font-display font-semibold text-[12px] border-(--border-default) text-(--ink-700) rounded h-8 shrink-0 no-underline'
          )}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          View
        </Link>
      </div>
    </div>
  )
}

export function InvoicesTable({ invoices, isPending, onDuplicate, onDelete }: InvoicesTableProps) {
  const router = useRouter()

  const columns = [
    columnHelper.accessor('invoiceNumber', {
      header: 'Invoice #',
      cell: (info) => (
        <Link
          href={`/invoices/${info.row.original.id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-[13px] font-medium text-(--blue-600) no-underline"
        >
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('client', {
      header: 'Client',
      cell: (info) => {
        const client = info.getValue()
        return (
          <div>
            <p className="font-display text-[14px] font-semibold text-(--ink-900) tracking-tight-xs leading-[1.3]">
              {client.name}
            </p>
            {client.company && (
              <p className="font-body text-[12px] text-(--ink-400) mt-0.5 leading-[1.2]">
                {client.company}
              </p>
            )}
          </div>
        )
      },
    }),
    columnHelper.accessor('issueDate', {
      header: 'Issue Date',
      cell: (info) => (
        <span className="font-body text-[13px] text-(--ink-400)">
          {formatDisplayDate(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('dueDate', {
      header: 'Due Date',
      cell: (info) => (
        <DueDateCell dueDate={info.getValue()} status={info.row.original.status} />
      ),
    }),
    columnHelper.accessor('total', {
      header: 'Amount',
      cell: (info) => (
        <span className="font-mono text-[13px] font-medium text-(--ink-900)">
          {formatCurrency(info.getValue(), info.row.original.currency)}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <InvoiceStatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const invoice = info.row.original
        const isDraft = invoice.status === 'DRAFT'
        const isDeletable = invoice.status === 'DRAFT' || invoice.status === 'CANCELLED'

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-7 w-7 inline-flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 text-(--ink-400)"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Invoice actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-42 border border-(--border-default) bg-(--surface-base) rounded"
              >
                <DropdownMenuItem
                  className="font-body text-[13px] text-(--ink-900) cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={`/invoices/${invoice.id}`} className="flex items-center w-full">
                    <Eye className="h-3.5 w-3.5 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>

                {isDraft && (
                  <DropdownMenuItem
                    className="font-body text-[13px] text-(--ink-900) cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/invoices/${invoice.id}`)
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  className="font-body text-[13px] text-(--ink-900) cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={`/invoices/${invoice.id}/preview`} className="flex items-center w-full">
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Download PDF
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="font-body text-[13px] text-(--ink-900) cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(invoice.id)
                  }}
                >
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Duplicate
                </DropdownMenuItem>

                {isDeletable && (
                  <>
                    <DropdownMenuSeparator className="bg-(--border-default)" />
                    <DropdownMenuItem
                      className="font-body text-[13px] text-(--error) cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(invoice.id)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: invoices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        {isPending ? (
          <SkeletonCards />
        ) : (
          invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block rounded overflow-hidden border border-(--border-default) bg-(--surface-base)">
        <Table>
          <TableHeader>
            <TableRow className="bg-(--surface-raised) border-b border-(--border-default)">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={thClassName}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <SkeletonRows />
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group cursor-pointer transition-colors duration-100 hover:bg-(--surface-raised) [&:not(:last-child)]:border-b [&:not(:last-child)]:border-(--border-default)"
                  onClick={() => router.push(`/invoices/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
