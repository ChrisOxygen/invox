'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format, parseISO, differenceInDays } from 'date-fns'
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
import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatCurrency } from '@/shared/lib/utils'
import { InvoiceStatusBadge } from '@/features/invoices/components/list/InvoiceStatusBadge'
import type { RecentInvoice } from '../server/_get-dashboard-stats'
import type { InvoiceStatus } from '@/prisma/generated/client/enums'

interface DashboardRecentInvoicesProps {
  invoices: RecentInvoice[]
  isPending: boolean
}

function formatDisplayDate(iso: string): string {
  try {
    return format(parseISO(iso), 'd MMM yyyy')
  } catch {
    return '—'
  }
}

function DueDateCell({ dueDate, status }: { dueDate: string; status: InvoiceStatus }) {
  if (status === 'OVERDUE') {
    const days = differenceInDays(new Date(), parseISO(dueDate))
    return (
      <div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--error)' }}>
          {formatDisplayDate(dueDate)}
        </span>
        <br />
        <span
          style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--error)', opacity: 0.75 }}
        >
          {days > 0 ? `${days}d overdue` : 'Due today'}
        </span>
      </div>
    )
  }
  return (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-400)' }}>
      {formatDisplayDate(dueDate)}
    </span>
  )
}

const columnHelper = createColumnHelper<RecentInvoice>()

const thStyle = {
  color: 'var(--ink-400)',
  fontFamily: 'var(--font-display)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  paddingTop: 10,
  paddingBottom: 10,
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} style={{ borderBottom: '1px solid var(--border-default)' }}>
          <TableCell><Skeleton className="h-3.5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-3.5 w-28" /></TableCell>
          <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-3.5 w-20 ml-auto" /></TableCell>
          <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function DashboardRecentInvoices({ invoices, isPending }: DashboardRecentInvoicesProps) {
  const router = useRouter()

  const columns = [
    columnHelper.accessor('invoiceNumber', {
      header: 'Invoice #',
      cell: (info) => (
        <Link
          href={`/invoices/${info.row.original.id}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--blue-600)',
            textDecoration: 'none',
          }}
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
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--ink-900)',
                letterSpacing: '-0.01em',
              }}
            >
              {client.name}
            </p>
            {client.company && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--ink-400)',
                  marginTop: 1,
                }}
              >
                {client.company}
              </p>
            )}
          </div>
        )
      },
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
        <span
          className="block text-right"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ink-900)',
          }}
        >
          {formatCurrency(info.getValue(), info.row.original.currency)}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <InvoiceStatusBadge status={info.getValue()} size="sm" />,
    }),
  ]

  const table = useReactTable({
    data: invoices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHeader>
          <TableRow
            style={{
              backgroundColor: 'var(--surface-raised)',
              borderBottom: '1px solid var(--border-default)',
            }}
          >
            {table.getHeaderGroups().map((hg) =>
              hg.headers.map((header) => (
                <TableHead key={header.id} style={thStyle}>
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
          ) : invoices.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center"
                style={{ padding: '40px 0' }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--ink-300)',
                  }}
                >
                  No invoices yet
                </p>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, idx) => {
              const isOverdue = row.original.status === 'OVERDUE'
              return (
                <TableRow
                  key={row.id}
                  className="group cursor-pointer"
                  style={{
                    borderBottom:
                      idx < table.getRowModel().rows.length - 1
                        ? '1px solid var(--border-default)'
                        : 'none',
                    backgroundColor: isOverdue ? 'rgba(245,58,58,0.025)' : undefined,
                  }}
                  onClick={() => router.push(`/invoices/${row.original.id}`)}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = isOverdue
                      ? 'rgba(245,58,58,0.05)'
                      : 'var(--surface-raised)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = isOverdue
                      ? 'rgba(245,58,58,0.025)'
                      : ''
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
