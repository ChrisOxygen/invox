'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Check, ChevronsUpDown, Plus, Search, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { ClientSheet } from '@/features/clients/components/ClientSheet'

type ClientOption = {
  id: string
  name: string
  company: string | null
  email: string | null
}

type ClientSelectorProps = {
  value: string | null
  onChange: (clientId: string) => void
  disabled?: boolean
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function ClientSelector({ value, onChange, disabled }: ClientSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [clientSheetOpen, setClientSheetOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, isPending } = useQuery({
    queryKey: ['clients', { search: debouncedSearch, page: 1, pageSize: 20 }],
    queryFn: async () => {
      const params = new URLSearchParams({ pageSize: '20' })
      if (debouncedSearch) params.set('search', debouncedSearch)
      const res = await fetch(`/api/v1/clients?${params}`)
      if (!res.ok) throw new Error('Failed to fetch clients')
      return res.json() as Promise<{ clients: ClientOption[]; total: number }>
    },
    staleTime: 30 * 1000,
  })

  const clients = data?.clients ?? []
  const selectedClient = clients.find((c) => c.id === value) ?? null

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = useCallback((client: ClientOption) => {
    onChange(client.id)
    setOpen(false)
    setSearch('')
  }, [onChange])

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen((v) => !v)}
          disabled={disabled}
          className="flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors"
          style={{
            borderColor: open ? 'var(--blue-600)' : 'var(--border-default)',
            background: 'var(--surface-base)',
            color: selectedClient ? 'var(--ink-900)' : 'var(--ink-300)',
            fontFamily: 'var(--font-body)',
            outline: open ? `2px solid var(--blue-100)` : 'none',
            outlineOffset: '0px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            minHeight: '42px',
          }}
        >
          <span className="truncate">
            {selectedClient ? (
              <span style={{ color: 'var(--ink-900)' }}>
                {selectedClient.name}
                {selectedClient.company && (
                  <span style={{ color: 'var(--ink-400)', marginLeft: '6px', fontSize: '12px' }}>
                    {selectedClient.company}
                  </span>
                )}
              </span>
            ) : (
              'Select a client...'
            )}
          </span>
          <ChevronsUpDown size={14} style={{ color: 'var(--ink-300)', flexShrink: 0 }} />
        </button>

        {open && (
          <div
            className="absolute z-50 w-full rounded-lg border shadow-sm"
            style={{
              top: 'calc(100% + 4px)',
              background: 'var(--surface-base)',
              borderColor: 'var(--border-default)',
            }}
          >
            {/* Search */}
            <div
              className="flex items-center gap-2 border-b px-3 py-2"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <Search size={13} style={{ color: 'var(--ink-300)', flexShrink: 0 }} />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-900)' }}
              />
              {isPending && <Loader2 size={12} className="animate-spin" style={{ color: 'var(--ink-300)' }} />}
            </div>

            {/* List */}
            <div className="max-h-52 overflow-y-auto py-1">
              {clients.length === 0 && !isPending && (
                <p
                  className="px-3 py-4 text-center text-sm"
                  style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)' }}
                >
                  {search ? 'No clients found' : 'No clients yet'}
                </p>
              )}
              {clients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleSelect(client)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface-overlay)]"
                >
                  <Check
                    size={13}
                    style={{
                      color: 'var(--blue-600)',
                      opacity: value === client.id ? 1 : 0,
                      flexShrink: 0,
                    }}
                  />
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium"
                      style={{ color: 'var(--ink-900)', fontFamily: 'var(--font-body)' }}
                    >
                      {client.name}
                    </p>
                    {(client.company || client.email) && (
                      <p
                        className="truncate text-xs"
                        style={{ color: 'var(--ink-400)', fontFamily: 'var(--font-body)' }}
                      >
                        {client.company ?? client.email}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Add new */}
            <div
              className="border-t"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setClientSheetOpen(true)
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-[var(--surface-overlay)]"
                style={{ color: 'var(--blue-600)', fontFamily: 'var(--font-body)' }}
              >
                <Plus size={13} />
                Add new client
              </button>
            </div>
          </div>
        )}
      </div>

      <ClientSheet
        open={clientSheetOpen}
        onOpenChange={setClientSheetOpen}
        onSuccess={() => setClientSheetOpen(false)}
      />
    </>
  )
}
