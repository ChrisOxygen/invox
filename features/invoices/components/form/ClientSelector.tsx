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
          className="flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors [font-family:var(--font-body)] bg-(--surface-base) min-h-10.5"
          style={{
            borderColor: open ? 'var(--blue-600)' : 'var(--border-default)',
            color: selectedClient ? 'var(--ink-900)' : 'var(--ink-300)',
            outline: open ? `2px solid var(--blue-100)` : 'none',
            outlineOffset: '0px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <span className="truncate">
            {selectedClient ? (
              <span className="text-(--ink-900)">
                {selectedClient.name}
                {selectedClient.company && (
                  <span className="text-(--ink-400) ml-1.5 text-[12px]">
                    {selectedClient.company}
                  </span>
                )}
              </span>
            ) : (
              'Select a client...'
            )}
          </span>
          <ChevronsUpDown size={14} className="text-(--ink-300) shrink-0" />
        </button>

        {open && (
          <div
            className="absolute z-50 w-full rounded-lg border shadow-sm bg-(--surface-base) border-(--border-default)"
            style={{ top: 'calc(100% + 4px)' }}
          >
            {/* Search */}
            <div className="flex items-center gap-2 border-b px-3 py-2 border-(--border-default)">
              <Search size={13} className="text-(--ink-300) shrink-0" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="flex-1 bg-transparent text-sm outline-none [font-family:var(--font-body)] text-(--ink-900)"
              />
              {isPending && <Loader2 size={12} className="animate-spin text-(--ink-300)" />}
            </div>

            {/* List */}
            <div className="max-h-52 overflow-y-auto py-1">
              {clients.length === 0 && !isPending && (
                <p className="px-3 py-4 text-center text-sm text-(--ink-400) [font-family:var(--font-body)]">
                  {search ? 'No clients found' : 'No clients yet'}
                </p>
              )}
              {clients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleSelect(client)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-(--surface-overlay)"
                >
                  <Check
                    size={13}
                    className="text-(--blue-600) shrink-0"
                    style={{ opacity: value === client.id ? 1 : 0 }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-(--ink-900) [font-family:var(--font-body)]">
                      {client.name}
                    </p>
                    {(client.company || client.email) && (
                      <p className="truncate text-xs text-(--ink-400) [font-family:var(--font-body)]">
                        {client.company ?? client.email}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Add new */}
            <div className="border-t border-(--border-default)">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setClientSheetOpen(true)
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-(--surface-overlay) text-(--blue-600) [font-family:var(--font-body)]"
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
