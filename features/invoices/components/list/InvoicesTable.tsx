'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format, parseISO, differenceInDays } from 'date-fns'
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
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatCurrency } from '@/shared/lib/utils'
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
          <TableCell className="text-right">
            <Skeleton className="h-3.5 w-20 ml-auto" />
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
    const daysOverdue = differenceInDays(new Date(), parseISO(dueDate))
    return (
      <div>
        <span className="[font-family:var(--font-body)] text-[13px] text-(--error)">
          {displayDate}
        </span>
        <br />
        <span className="[font-family:var(--font-body)] text-[11px] text-(--error) opacity-80">
          {daysOverdue > 0 ? `${daysOverdue}d overdue` : 'Due today'}
        </span>
      </div>
    )
  }

  return (
    <span className="[font-family:var(--font-body)] text-[13px] text-(--ink-400)">
      {displayDate}
    </span>
  )
}

const columnHelper = createColumnHelper<InvoiceListItem>()

const thClassName =
  'text-(--ink-400) [font-family:var(--font-display)] text-[11px] font-semibold tracking-[0.08em] uppercase py-3'

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
            <p className="[font-family:var(--font-display)] text-[14px] font-semibold text-(--ink-900) tracking-[-0.01em] leading-[1.3]">
              {client.name}
            </p>
            {client.company && (
              <p className="[font-family:var(--font-body)] text-[12px] text-(--ink-400) mt-0.5 leading-[1.2]">
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
        <span className="[font-family:var(--font-body)] text-[13px] text-(--ink-400)">
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
        <span className="block text-right font-mono text-[13px] font-medium text-(--ink-900)">
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
                  className="[font-family:var(--font-body)] text-[13px] text-(--ink-900) cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={`/invoices/${invoice.id}`} className="flex items-center w-full">
                    <Eye className="h-3.5 w-3.5 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>

                {isDraft && (
                  <DropdownMenuItem
                    className="[font-family:var(--font-body)] text-[13px] text-(--ink-900) cursor-pointer"
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
                  className="[font-family:var(--font-body)] text-[13px] text-(--ink-900) cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={`/invoices/${invoice.id}/preview`} className="flex items-center w-full">
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Download PDF
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="[font-family:var(--font-body)] text-[13px] text-(--ink-900) cursor-pointer"
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
                      className="[font-family:var(--font-body)] text-[13px] text-(--error) cursor-pointer"
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
    <div className="rounded overflow-hidden border border-(--border-default) bg-(--surface-base)">
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
            table.getRowModel().rows.map((row, idx) => (
              <TableRow
                key={row.id}
                className="group cursor-pointer transition-colors duration-100"
                style={{
                  borderBottom:
                    idx < table.getRowModel().rows.length - 1
                      ? '1px solid var(--border-default)'
                      : 'none',
                }}
                onClick={() => router.push(`/invoices/${row.original.id}`)}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-raised)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = ''
                }}
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
  )
}
