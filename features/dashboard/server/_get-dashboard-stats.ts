import { prisma } from '@/shared/lib/prisma'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import type { InvoiceStatus } from '@/prisma/generated/client/enums'

export type MonthlyRevenue = {
  month: string
  revenue: number
}

export type StatusCount = {
  status: InvoiceStatus
  count: number
}

export type RecentInvoice = {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  total: number
  currency: string
  dueDate: string
  createdAt: string
  client: { name: string; company: string | null }
}

export type DashboardStats = {
  totalOutstanding: number
  totalPaidThisMonth: number
  totalOverdue: number
  totalInvoices: number
  statusCounts: StatusCount[]
  monthlyRevenue: MonthlyRevenue[]
  recentInvoices: RecentInvoice[]
  currency: string
}

export async function _getDashboardStats(profileId: string): Promise<DashboardStats> {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const sixMonthsAgo = startOfMonth(subMonths(now, 5))

  const [
    outstandingAgg,
    overdueAgg,
    paidThisMonthAgg,
    totalCount,
    statusGroups,
    recentRaw,
    paidInSixMonths,
    profileData,
  ] = await Promise.all([
    // Total outstanding: SENT + OVERDUE
    prisma.invoice.aggregate({
      where: { profileId, status: { in: ['SENT', 'OVERDUE'] } },
      _sum: { total: true },
    }),
    // Total overdue amount
    prisma.invoice.aggregate({
      where: { profileId, status: 'OVERDUE' },
      _sum: { total: true },
    }),
    // Total paid this month
    prisma.invoice.aggregate({
      where: {
        profileId,
        status: { in: ['PAID', 'PARTIAL'] },
        paidAt: { gte: monthStart, lte: monthEnd },
      },
      _sum: { total: true },
    }),
    // Total invoice count
    prisma.invoice.count({ where: { profileId } }),
    // Status distribution
    prisma.invoice.groupBy({
      by: ['status'],
      where: { profileId },
      _count: { status: true },
    }),
    // Recent 10 invoices
    prisma.invoice.findMany({
      where: { profileId },
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        total: true,
        currency: true,
        dueDate: true,
        createdAt: true,
        client: { select: { name: true, company: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    // Paid invoices in last 6 months for chart
    prisma.invoice.findMany({
      where: {
        profileId,
        status: { in: ['PAID', 'PARTIAL'] },
        paidAt: { gte: sixMonthsAgo },
      },
      select: { total: true, paidAt: true },
    }),
    // Profile currency
    prisma.profile.findUnique({
      where: { id: profileId },
      select: { currency: true },
    }),
  ])

  // Build 6-month revenue map (oldest → newest)
  const monthlyMap: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const key = format(subMonths(now, i), 'MMM yy')
    monthlyMap[key] = 0
  }
  for (const inv of paidInSixMonths) {
    if (inv.paidAt) {
      const key = format(inv.paidAt, 'MMM yy')
      if (key in monthlyMap) {
        monthlyMap[key] = (monthlyMap[key] ?? 0) + inv.total
      }
    }
  }

  const monthlyRevenue: MonthlyRevenue[] = Object.entries(monthlyMap).map(([month, revenue]) => ({
    month,
    revenue,
  }))

  const statusCounts: StatusCount[] = statusGroups.map((g) => ({
    status: g.status,
    count: g._count.status,
  }))

  const recentInvoices: RecentInvoice[] = recentRaw.map((inv) => ({
    ...inv,
    dueDate: inv.dueDate.toISOString(),
    createdAt: inv.createdAt.toISOString(),
  }))

  return {
    totalOutstanding: outstandingAgg._sum.total ?? 0,
    totalPaidThisMonth: paidThisMonthAgg._sum.total ?? 0,
    totalOverdue: overdueAgg._sum.total ?? 0,
    totalInvoices: totalCount,
    statusCounts,
    monthlyRevenue,
    recentInvoices,
    currency: profileData?.currency ?? 'NGN',
  }
}
