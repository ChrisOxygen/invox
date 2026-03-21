'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { StatusCount } from '../server/_get-dashboard-stats'

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#B3BCFF',
  SENT: '#00D4E8',
  PAID: '#0ECB7A',
  PARTIAL: '#F5A623',
  OVERDUE: '#F53A3A',
  CANCELLED: '#8080A8',
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  PAID: 'Paid',
  PARTIAL: 'Partial',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
}

interface StatusDonutChartProps {
  data: StatusCount[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number }>
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--r-md)',
        padding: '8px 12px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--ink-900)',
        }}
      >
        {payload[0].name}:{' '}
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
          {payload[0].value}
        </span>
      </p>
    </div>
  )
}

export function StatusDonutChart({ data }: StatusDonutChartProps) {
  const filtered = data.filter((d) => d.count > 0)

  if (filtered.length === 0) {
    return (
      <div
        style={{
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-300)' }}>
          No invoices yet
        </p>
      </div>
    )
  }

  const chartData = filtered.map((d) => ({
    name: STATUS_LABELS[d.status] ?? d.status,
    value: d.count,
    status: d.status,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={STATUS_COLORS[entry.status] ?? '#ccc'}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          formatter={(value) => (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--ink-500)',
              }}
            >
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
