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
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
          style={{ color: 'var(--ink-300)' }}
        />
        <Input
          type="text"
          placeholder="Search clients…"
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

      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--ink-400)',
          whiteSpace: 'nowrap',
          minWidth: 80,
          textAlign: 'right',
        }}
      >
        {isLoading ? (
          <span
            className="inline-block h-3.5 w-16 rounded animate-pulse"
            style={{ backgroundColor: 'var(--border-default)' }}
          />
        ) : (
          <>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--ink-700)' }}>
              {total}
            </span>
            {' '}{total === 1 ? 'client' : 'clients'}
          </>
        )}
      </span>
    </div>
  )
}
