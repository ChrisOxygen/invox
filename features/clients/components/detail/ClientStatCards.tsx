'use client'

import { useMemo } from 'react'
import type { ClientWithInvoices } from '../../types'

const formatCurrency = (amount: number, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount)

function computeStats(client: ClientWithInvoices) {
  const invoices = client.invoices ?? []
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalPaid = invoices.filter((inv) => inv.status === 'PAID').reduce((sum, inv) => sum + inv.total, 0)
  const outstanding = Math.max(0, totalBilled - totalPaid)
  const hasOverdue = invoices.some((inv) => inv.status === 'OVERDUE')
  return { totalBilled, totalPaid, outstanding, invoiceCount: invoices.length, hasOverdue }
}

function StatCard({ label, value, accentColor, isMono = false, subLabel }: {
  label: string; value: string; accentColor: string; isMono?: boolean; subLabel?: string
}) {
  return (
    <div
      className="relative overflow-hidden rounded border p-(--s5) bg-(--surface-base) border-(--border-default)"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      <p className="text-xs font-semibold uppercase mb-(--s2) text-(--ink-400) font-display tracking-[0.08em]">
        {label}
      </p>
      <p
        className={`text-2xl leading-tight ${isMono ? 'font-[family-name:var(--font-mono)] tracking-[0]' : 'font-[family-name:var(--font-display)] tracking-[-0.02em]'}`}
        style={{ color: accentColor }}
      >
        {value}
      </p>
      {subLabel && (
        <p className="text-xs mt-(--s1) text-(--ink-300) font-body">
          {subLabel}
        </p>
      )}
    </div>
  )
}

export function ClientStatCards({ client }: { client: ClientWithInvoices }) {
  const stats = useMemo(() => computeStats(client), [client])

  const outstandingColor = stats.hasOverdue
    ? 'var(--error)'
    : stats.outstanding > 0
    ? 'var(--warning)'
    : 'var(--success)'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-(--s4)">
      <StatCard label="Total Billed" value={formatCurrency(stats.totalBilled)} accentColor="var(--blue-600)" isMono />
      <StatCard label="Total Paid" value={formatCurrency(stats.totalPaid)} accentColor="var(--success)" isMono />
      <StatCard label="Outstanding" value={formatCurrency(stats.outstanding)} accentColor={outstandingColor} isMono subLabel={stats.hasOverdue ? 'Includes overdue' : undefined} />
      <StatCard label="Invoices" value={String(stats.invoiceCount)} accentColor="var(--ink-400)" />
    </div>
  )
}
