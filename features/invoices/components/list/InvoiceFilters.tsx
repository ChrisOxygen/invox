'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/shared/components/ui/sheet'
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
  const [isSheetOpen, setIsSheetOpen] = useState(false)

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
  const activeFilterCount = activeStatus !== 'ALL' ? 1 : 0

  const handleStatusChange = (status: StatusTab) => {
    onFilterChange({
      ...filters,
      status: status === 'ALL' ? undefined : status,
      page: 1,
    })
  }

  // Mobile: select status + close sheet in one tap
  const handleMobileStatusChange = (status: StatusTab) => {
    handleStatusChange(status)
    setIsSheetOpen(false)
  }

  const handleClearStatus = () => {
    onFilterChange({ ...filters, status: undefined, page: 1 })
    setIsSheetOpen(false)
  }

  return (
    <>
      {/* ── Mobile (< md) ────────────────────────────────────── */}
      <div className="flex items-center gap-2 md:hidden">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-(--ink-300)" />
          <Input
            type="text"
            placeholder="Search invoices..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-9 font-body text-[14px] border-(--border-default) bg-(--surface-base) text-(--ink-900) rounded h-9 w-full"
          />
        </div>

        {/* Filter button with active count badge */}
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="relative inline-flex items-center gap-1.5 font-display text-[13px] font-semibold rounded px-3 h-9 border transition-colors duration-100 whitespace-nowrap shrink-0 border-(--border-default) bg-(--surface-base) text-(--ink-700) hover:bg-(--surface-overlay)"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-(--blue-600) text-white font-mono text-[10px] font-medium flex items-center justify-center px-1 leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile bottom sheet ───────────────────────────────── */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="rounded-t-2xl border-(--border-default) bg-(--surface-base) px-0 pb-8"
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-(--border-strong)" />
          </div>

          <SheetHeader className="px-5 pt-3 pb-4 border-b border-(--border-default)">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-display text-[16px] font-bold text-(--ink-900) tracking-tight">
                Filter invoices
              </SheetTitle>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="h-7 w-7 inline-flex items-center justify-center rounded text-(--ink-400) hover:bg-(--surface-overlay) transition-colors duration-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </SheetHeader>

          <div className="px-5 pt-5 pb-2">
            <p className="font-display text-[11px] font-semibold text-(--ink-300) uppercase tracking-widest mb-3">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => {
                const isActive = activeStatus === tab.value
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleMobileStatusChange(tab.value)}
                    data-active={isActive}
                    className="font-display text-[14px] rounded-full px-4 py-2 cursor-pointer transition-all leading-none whitespace-nowrap border font-medium text-(--ink-500) border-(--border-default) bg-(--surface-raised) hover:bg-(--surface-overlay) data-[active=true]:font-semibold data-[active=true]:text-(--blue-600) data-[active=true]:bg-(--blue-50) data-[active=true]:border-(--blue-200)"
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <SheetFooter className="px-5 pt-4 mt-1 border-t border-(--border-default)">
              <button
                type="button"
                onClick={handleClearStatus}
                className="w-full font-display text-[13px] font-semibold rounded h-9 border border-(--border-default) text-(--ink-500) hover:bg-(--surface-overlay) transition-colors duration-100"
              >
                Clear filters
              </button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Desktop (≥ md) ────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1 flex-wrap flex-1">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleStatusChange(tab.value)}
                data-active={isActive}
                className="font-display text-[13px] rounded px-3 py-1.5 cursor-pointer transition-all leading-none whitespace-nowrap border border-transparent font-medium text-(--ink-400) hover:text-(--ink-700) hover:bg-(--surface-overlay) data-[active=true]:font-semibold data-[active=true]:text-(--blue-600) data-[active=true]:bg-(--blue-50) data-[active=true]:border-(--blue-200) data-[active=true]:hover:bg-(--blue-50) data-[active=true]:hover:text-(--blue-600)"
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
    </>
  )
}
