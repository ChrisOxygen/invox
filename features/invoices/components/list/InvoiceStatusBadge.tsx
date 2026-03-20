'use client'

import type { InvoiceStatus } from '../../types'

interface BadgeConfig {
  background: string
  color: string
  dotColor: string
  label: string
}

const STATUS_CONFIG: Record<InvoiceStatus, BadgeConfig> = {
  DRAFT: {
    background: '#EEF1FF',
    color: '#1232D0',
    dotColor: '#1740F5',
    label: 'Draft',
  },
  SENT: {
    background: '#E6F7FA',
    color: '#006A7A',
    dotColor: '#00B8D4',
    label: 'Sent',
  },
  PAID: {
    background: '#EDFAF3',
    color: '#0A8F52',
    dotColor: '#0ECB7A',
    label: 'Paid',
  },
  PARTIAL: {
    background: '#FFF7EA',
    color: '#B57200',
    dotColor: '#F5A623',
    label: 'Partial',
  },
  OVERDUE: {
    background: '#FFF0F0',
    color: '#C72020',
    dotColor: '#F53A3A',
    label: 'Overdue',
  },
  CANCELLED: {
    background: '#F0F0F8',
    color: '#3D3D6B',
    dotColor: '#8080A8',
    label: 'Cancelled',
  },
}

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
  size?: 'sm' | 'default'
}

export function InvoiceStatusBadge({ status, size = 'default' }: InvoiceStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  const isSmall = size === 'sm'

  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        backgroundColor: config.background,
        color: config.color,
        borderRadius: 999,
        paddingLeft: isSmall ? 8 : 12,
        paddingRight: isSmall ? 8 : 12,
        paddingTop: isSmall ? 2 : 4,
        paddingBottom: isSmall ? 2 : 4,
        fontFamily: 'var(--font-display)',
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap' as const,
        userSelect: 'none' as const,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: config.dotColor,
          flexShrink: 0,
          display: 'inline-block',
        }}
      />
      {config.label}
    </span>
  )
}
