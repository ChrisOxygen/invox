'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { MonthlyRevenue } from '../server/_get-dashboard-stats'

interface RevenueBarChartProps {
  data: MonthlyRevenue[]
  currency: string
}

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}k`
  if (value === 0) return '₦0'
  return `₦${value}`
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  const value = payload[0].value ?? 0
  return (
    <div
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--r-md)',
        padding: '8px 14px',
        boxShadow: '0 4px 16px rgba(13,13,26,0.08)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          color: 'var(--ink-400)',
          marginBottom: 3,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 15,
          fontWeight: 500,
          color: 'var(--ink-900)',
        }}
      >
        ₦{value.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export function RevenueBarChart({ data }: RevenueBarChartProps) {
  const hasData = data.some((d) => d.revenue > 0)

  return (
    <div style={{ position: 'relative', height: 220 }}>
      {!hasData && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--ink-300)',
            }}
          >
            No revenue data yet
          </p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          barSize={28}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border-default)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--ink-400)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontFamily: 'var(--font-body)', fontSize: 11, fill: 'var(--ink-400)' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-overlay)', radius: 4 }} />
          <Bar dataKey="revenue" fill="var(--blue-600)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
