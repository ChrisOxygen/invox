'use client'

import { TrendingUp, AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatCurrency } from '@/shared/lib/utils'
import type { DashboardStats } from '../hooks/use-dashboard-stats'

interface StatsCardsProps {
  stats: DashboardStats | undefined
  isPending: boolean
}

interface CardConfig {
  key: 'outstanding' | 'paidThisMonth' | 'overdue' | 'totalInvoices'
  label: string
  icon: React.ElementType
  accentColor: string
  valueColor: string
  description: string
  isCount?: boolean
}

const CARD_CONFIGS: CardConfig[] = [
  {
    key: 'outstanding',
    label: 'Outstanding',
    icon: TrendingUp,
    accentColor: 'var(--blue-600)',
    valueColor: 'var(--ink-900)',
    description: 'Sent + overdue',
  },
  {
    key: 'paidThisMonth',
    label: 'Paid This Month',
    icon: CheckCircle2,
    accentColor: 'var(--success)',
    valueColor: 'var(--ink-900)',
    description: 'Collected this month',
  },
  {
    key: 'overdue',
    label: 'Overdue',
    icon: AlertCircle,
    accentColor: 'var(--error)',
    valueColor: 'var(--error)',
    description: 'Past due date',
  },
  {
    key: 'totalInvoices',
    label: 'Total Invoices',
    icon: FileText,
    accentColor: 'var(--ink-300)',
    valueColor: 'var(--ink-900)',
    description: 'All time',
    isCount: true,
  },
]

interface StatCardProps {
  config: CardConfig
  value: number
  isPending: boolean
  currency: string
}

function StatCard({ config, value, isPending, currency }: StatCardProps) {
  const Icon = config.icon

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${config.accentColor}`,
        borderRadius: 'var(--r-xl)',
        padding: 'var(--s5)',
      }}
    >
      <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--ink-400)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {config.label}
        </p>
        <Icon
          style={{ color: config.accentColor, opacity: 0.6, flexShrink: 0 }}
          className="h-4 w-4"
        />
      </div>

      {isPending ? (
        <Skeleton className="h-8 w-36 mb-2" />
      ) : (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: config.isCount ? 36 : 26,
            fontWeight: 500,
            color: config.valueColor,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          {config.isCount ? value.toLocaleString() : formatCurrency(value, currency)}
        </p>
      )}

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--ink-300)',
        }}
      >
        {config.description}
      </p>
    </div>
  )
}

export function StatsCards({ stats, isPending }: StatsCardsProps) {
  const currency = stats?.currency ?? 'NGN'

  const values = {
    outstanding: stats?.totalOutstanding ?? 0,
    paidThisMonth: stats?.totalPaidThisMonth ?? 0,
    overdue: stats?.totalOverdue ?? 0,
    totalInvoices: stats?.totalInvoices ?? 0,
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--s4)',
      }}
    >
      {CARD_CONFIGS.map((config) => (
        <StatCard
          key={config.key}
          config={config}
          value={values[config.key]}
          isPending={isPending}
          currency={currency}
        />
      ))}
    </div>
  )
}
