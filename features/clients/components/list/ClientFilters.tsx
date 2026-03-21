'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'

interface ClientFiltersProps {
  onSearch: (value: string) => void
  total: number
  isLoading: boolean
}

export function ClientFilters({ onSearch, total, isLoading }: ClientFiltersProps) {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue, onSearch])

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-(--ink-300)" />
        <Input
          type="text"
          placeholder="Search clients…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-9 [font-family:var(--font-body)] text-[14px] border-(--border-default) bg-(--surface-base) text-(--ink-900) rounded-md h-9"
        />
      </div>

      <span className="[font-family:var(--font-body)] text-[13px] text-(--ink-400) whitespace-nowrap text-right min-w-20">
        {isLoading ? (
          <span className="inline-block h-3.5 w-16 rounded animate-pulse bg-(--border-default)" />
        ) : (
          <>
            <span className="[font-family:var(--font-mono)] font-medium text-(--ink-700)">
              {total}
            </span>
            {' '}{total === 1 ? 'client' : 'clients'}
          </>
        )}
      </span>
    </div>
  )
}
