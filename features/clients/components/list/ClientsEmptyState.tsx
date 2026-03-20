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
          className="flex items-center justify-center rounded-full mb-5"
          style={{ width: 56, height: 56, backgroundColor: 'var(--surface-overlay)', color: 'var(--ink-400)' }}
        >
          <SearchX className="w-6 h-6" />
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          No results found
        </h3>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-400)', maxWidth: 300, marginBottom: 20, lineHeight: 1.5 }}>
          Try adjusting your search — no clients match your current query.
        </p>

        {onClear && (
          <Button
            variant="outline"
            onClick={onClear}
            size="sm"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, borderColor: 'var(--border-strong)', color: 'var(--ink-700)', borderRadius: 'var(--r-md)' }}
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
        className="flex items-center justify-center rounded-full mb-5"
        style={{ width: 56, height: 56, backgroundColor: 'var(--blue-50)', color: 'var(--blue-600)' }}
      >
        <Users className="w-6 h-6" />
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.02em', marginBottom: 6 }}>
        No clients yet
      </h3>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-400)', maxWidth: 300, marginBottom: 20, lineHeight: 1.5 }}>
        Add your first client to get started managing your business relationships.
      </p>

      {onAdd && (
        <Button
          onClick={onAdd}
          size="sm"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, backgroundColor: 'var(--blue-600)', color: '#fff', borderRadius: 'var(--r-md)', border: 'none' }}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Client
        </Button>
      )}
    </div>
  )
}
