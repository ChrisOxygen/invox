'use client'

import { useQuery } from '@tanstack/react-query'
import type { InvoiceFilters, InvoiceListItem } from '../types'

interface InvoicesResponse {
  invoices: InvoiceListItem[]
  total: number
}

export function useInvoices(filters: InvoiceFilters = {}) {
  const { status, search, page = 1, pageSize = 20 } = filters

  return useQuery<InvoicesResponse>({
    queryKey: ['invoices', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (status && status !== 'ALL') params.set('status', status)
      if (search) params.set('search', search)
      if (page) params.set('page', String(page))
      if (pageSize) params.set('pageSize', String(pageSize))

      const res = await fetch(`/api/v1/invoices?${params}`)
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error?.message ?? 'Failed to fetch invoices')
      }
      return res.json()
    },
    staleTime: 1000 * 30, // 30 seconds
  })
}
