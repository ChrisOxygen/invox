'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { buttonVariants } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useDashboardStats } from '../hooks/use-dashboard-stats'
import { StatsCards } from './StatsCards'
import { DashboardRecentInvoices } from './DashboardRecentInvoices'

const RevenueBarChart = dynamic(
  () => import('./RevenueBarChart').then((m) => ({ default: m.RevenueBarChart })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-55 w-full" />,
  }
)

const StatusDonutChart = dynamic(
  () => import('./StatusDonutChart').then((m) => ({ default: m.StatusDonutChart })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-55 w-full" />,
  }
)

const sectionHeadingStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--ink-700)',
  letterSpacing: '-0.01em',
}

function EmptyDashboard() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--s20) var(--s4)',
        gap: 'var(--s4)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 'var(--r-xl)',
          backgroundColor: 'var(--blue-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FileText style={{ color: 'var(--blue-600)' }} className="h-7 w-7" />
      </div>
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--ink-900)',
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}
        >
          Create your first invoice
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--ink-400)',
            maxWidth: 340,
          }}
        >
          Start billing clients and tracking payments. Your dashboard will come alive once
          you create your first invoice.
        </p>
      </div>
      <Link
        href="/invoices/new"
        className={buttonVariants({ variant: 'default' })}
        style={{ marginTop: 8 }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Invoice
      </Link>
    </div>
  )
}

export function DashboardPageClient() {
  const { data: stats, isPending } = useDashboardStats()

  const isEmpty = !isPending && (stats?.totalInvoices ?? 0) === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s6)' }}>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--ink-900)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--ink-400)',
              marginTop: 3,
            }}
          >
            Your business at a glance
          </p>
        </div>
        <Link href="/invoices/new" className={buttonVariants({ variant: 'default' })}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Link>
      </div>

      {/* Stats cards */}
      <StatsCards stats={stats} isPending={isPending} />

      {/* Empty state */}
      {isEmpty ? (
        <div
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--r-xl)',
          }}
        >
          <EmptyDashboard />
        </div>
      ) : (
        <>
          {/* Charts row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--s4)',
            }}
            className="lg:grid-cols-[3fr_2fr]"
          >
            {/* Revenue chart */}
            <div
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--r-xl)',
                padding: 'var(--s5)',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <p style={sectionHeadingStyle}>Revenue — Last 6 Months</p>
              </div>
              {isPending ? (
                <Skeleton className="h-55 w-full" />
              ) : (
                <RevenueBarChart
                  data={stats?.monthlyRevenue ?? []}
                  currency={stats?.currency ?? 'NGN'}
                />
              )}
            </div>

            {/* Status distribution */}
            <div
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--r-xl)',
                padding: 'var(--s5)',
              }}
            >
              <p style={{ ...sectionHeadingStyle, marginBottom: 16 }}>Invoice Status</p>
              {isPending ? (
                <Skeleton className="h-55 w-full" />
              ) : (
                <StatusDonutChart data={stats?.statusCounts ?? []} />
              )}
            </div>
          </div>

          {/* Recent invoices */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <p style={sectionHeadingStyle}>Recent Invoices</p>
              <Link
                href="/invoices"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--blue-600)',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                View all →
              </Link>
            </div>
            <DashboardRecentInvoices
              invoices={stats?.recentInvoices ?? []}
              isPending={isPending}
            />
          </div>
        </>
      )}
    </div>
  )
}
