'use client'

import { Users, SearchX, Plus, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface ClientsEmptyStateProps {
  variant: 'no-clients' | 'no-results'
  onAdd?: () => void
  onClear?: () => void
}

export function ClientsEmptyState({ variant, onAdd, onClear }: ClientsEmptyStateProps) {
  if (variant === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="flex items-center justify-center rounded-full mb-5 bg-(--surface-overlay) text-(--ink-400) w-14 h-14"
        >
          <SearchX className="w-6 h-6" />
        </div>

        <h3 className="font-display text-[16px] font-bold text-(--ink-900) tracking-[-0.02em] mb-[6px]">
          No results found
        </h3>

        <p className="font-body text-[14px] text-(--ink-400) max-w-[300px] mb-5 leading-[1.5]">
          Try adjusting your search — no clients match your current query.
        </p>

        {onClear && (
          <Button
            variant="outline"
            onClick={onClear}
            size="sm"
            className="font-display font-semibold text-[13px] border-(--border-strong) text-(--ink-700) rounded"
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            Clear search
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="flex items-center justify-center rounded-full mb-5 bg-(--blue-50) text-(--blue-600) w-14 h-14"
      >
        <Users className="w-6 h-6" />
      </div>

      <h3 className="font-display text-[16px] font-bold text-(--ink-900) tracking-[-0.02em] mb-[6px]">
        No clients yet
      </h3>

      <p className="font-body text-[14px] text-(--ink-400) max-w-[300px] mb-5 leading-[1.5]">
        Add your first client to get started managing your business relationships.
      </p>

      {onAdd && (
        <Button
          onClick={onAdd}
          size="sm"
          className="font-display font-semibold text-[13px] bg-(--blue-600) text-white border-0 rounded"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Client
        </Button>
      )}
    </div>
  )
}
