'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import type { InvoiceFilters, InvoiceStatus } from '../../types'

interface InvoiceFiltersProps {
  filters: InvoiceFilters
  onFilterChange: (filters: InvoiceFilters) => void
}

type StatusTab = InvoiceStatus | 'ALL'

const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export function InvoiceFilters({ filters, onFilterChange }: InvoiceFiltersProps) {
  const [inputValue, setInputValue] = useState(filters.search ?? '')

  // Sync input when filters are cleared externally
  useEffect(() => {
    setInputValue(filters.search ?? '')
  }, [filters.search])

  // Debounced search — 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== (filters.search ?? '')) {
        onFilterChange({ ...filters, search: inputValue || undefined, page: 1 })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeStatus = filters.status ?? 'ALL'

  const handleStatusChange = (status: StatusTab) => {
    onFilterChange({
      ...filters,
      status: status === 'ALL' ? undefined : status,
      page: 1,
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Status tabs row */}
      <div className="flex items-center gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleStatusChange(tab.value)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--blue-600)' : 'var(--ink-400)',
                backgroundColor: isActive ? 'var(--blue-50)' : 'transparent',
                border: isActive ? '1px solid var(--blue-200)' : '1px solid transparent',
                borderRadius: 'var(--r-md)',
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                cursor: 'pointer',
                transition: 'all 100ms ease',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  const el = e.currentTarget
                  el.style.color = 'var(--ink-700)'
                  el.style.backgroundColor = 'var(--surface-overlay)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  const el = e.currentTarget
                  el.style.color = 'var(--ink-400)'
                  el.style.backgroundColor = 'transparent'
                }
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Search + New Invoice row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: 'var(--ink-300)' }}
          />
          <Input
            type="text"
            placeholder="Search by invoice # or client..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-9"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--surface-base)',
              color: 'var(--ink-900)',
              borderRadius: 'var(--r-md)',
              height: 36,
            }}
          />
        </div>

        <div className="ml-auto">
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
            style={{
              fontFamily: 'var(--font-display)',
              backgroundColor: 'var(--blue-600)',
              color: '#fff',
              height: 36,
              paddingLeft: 14,
              paddingRight: 14,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Invoice
          </Link>
        </div>
      </div>
    </div>
  )
}
