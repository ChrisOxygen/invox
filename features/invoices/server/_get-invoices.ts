import { prisma } from '@/shared/lib/prisma'
import type { InvoiceFilters, InvoiceListItem } from '../types'
import type { InvoiceStatus } from '@/prisma/generated/client/enums'

export async function _getInvoices(
  profileId: string,
  params: InvoiceFilters
): Promise<{ invoices: InvoiceListItem[]; total: number }> {
  const { status, search, page = 1, pageSize = 20 } = params
  const skip = (page - 1) * pageSize

  const statusFilter =
    status && status !== 'ALL' ? { status: status as InvoiceStatus } : {}

  const searchFilter = search
    ? {
        OR: [
          { invoiceNumber: { contains: search, mode: 'insensitive' as const } },
          { client: { name: { contains: search, mode: 'insensitive' as const } } },
        ],
      }
    : {}

  const where = {
    profileId,
    ...statusFilter,
    ...searchFilter,
  }

  const [rawInvoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        total: true,
        subtotal: true,
        currency: true,
        issueDate: true,
        dueDate: true,
        createdAt: true,
        client: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.invoice.count({ where }),
  ])

  const invoices: InvoiceListItem[] = rawInvoices.map((inv) => ({
    ...inv,
    issueDate: inv.issueDate.toISOString(),
    dueDate: inv.dueDate.toISOString(),
    createdAt: inv.createdAt.toISOString(),
  }))

  return { invoices, total }
}
