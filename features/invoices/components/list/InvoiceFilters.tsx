'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
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
    <div className="flex items-center gap-3">
      {/* Status tabs */}
      <div className="flex items-center gap-1 flex-wrap flex-1">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleStatusChange(tab.value)}
              className="font-display text-[13px] rounded px-3 py-1.5 cursor-pointer transition-all leading-none whitespace-nowrap"
              style={{
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--blue-600)' : 'var(--ink-400)',
                backgroundColor: isActive ? 'var(--blue-50)' : 'transparent',
                border: isActive ? '1px solid var(--blue-200)' : '1px solid transparent',
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

      {/* Search */}
      <div className="relative w-64 shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-(--ink-300)" />
        <Input
          type="text"
          placeholder="Search by invoice # or client..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-9 font-body text-[14px] border-(--border-default) bg-(--surface-base) text-(--ink-900) rounded h-9"
        />
      </div>
    </div>
  )
}
