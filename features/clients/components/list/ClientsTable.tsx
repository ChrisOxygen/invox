'use client'

import Link from 'next/link'
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
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
import type { ClientWithStats } from '../../types'

interface ClientsTableProps {
  clients: ClientWithStats[]
  isLoading: boolean
  onEdit: (client: ClientWithStats) => void
  onDelete: (id: string) => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function ClientAvatar({ name }: { name: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0 bg-(--ink-100) text-(--ink-700) font-display text-[12px] font-semibold tracking-[0.02em] w-8 h-8"
    >
      {getInitials(name)}
    </div>
  )
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-b border-(--border-default)">
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-3.5 w-40" /></TableCell>
          <TableCell><Skeleton className="h-3.5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-3.5 w-28" /></TableCell>
          <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-7 w-7 rounded ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

const thClassName = "text-(--ink-400) font-display text-[11px] font-semibold tracking-[0.08em] uppercase py-3"

export function ClientsTable({ clients, isLoading, onEdit, onDelete }: ClientsTableProps) {
  return (
    <div className="rounded overflow-hidden border border-(--border-default) bg-(--surface-base)">
      <Table>
        <TableHeader>
          <TableRow className="bg-(--surface-raised) border-b border-(--border-default)">
            <TableHead className={thClassName}>Client</TableHead>
            <TableHead className={thClassName}>Company</TableHead>
            <TableHead className={thClassName}>Email</TableHead>
            <TableHead className={thClassName}>Phone</TableHead>
            <TableHead className={thClassName}>Invoices</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SkeletonRows />
          ) : (
            clients.map((client, idx) => (
              <TableRow
                key={client.id}
                className="group cursor-pointer transition-colors duration-100"
                style={{ borderBottom: idx < clients.length - 1 ? '1px solid var(--border-default)' : 'none' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-overlay)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '' }}
              >
                <TableCell>
                  <Link href={`/clients/${client.id}`} className="flex items-center gap-3 no-underline">
                    <ClientAvatar name={client.name} />
                    <p className="truncate font-display text-[14px] font-semibold text-(--ink-900) tracking-[-0.01em]">
                      {client.name}
                    </p>
                  </Link>
                </TableCell>

                <TableCell>
                  <span className="font-body text-[13px] text-(--ink-400)">
                    {client.company || '—'}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-body text-[13px] text-(--ink-400)">
                    {client.email || '—'}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-body text-[13px] text-(--ink-400)">
                    {client.phone || '—'}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5 font-mono text-[11px] font-medium bg-(--blue-50) text-(--blue-700) min-w-[28px]">
                    {client._count.invoices}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="h-7 w-7 inline-flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 hover:bg-muted text-(--ink-400)"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="min-w-[160px] border-(--border-default) bg-(--surface-base) rounded"
                    >
                      <DropdownMenuItem className="font-body text-[13px] text-(--ink-900) cursor-pointer">
                        <Link href={`/clients/${client.id}`} className="flex items-center w-full">
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); onEdit(client) }}
                        className="font-body text-[13px] text-(--ink-900) cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-(--border-default)" />
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); onDelete(client.id) }}
                        className="font-body text-[13px] text-(--error) cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
