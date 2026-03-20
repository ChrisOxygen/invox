'use client'

import { useQuery } from '@tanstack/react-query'
import type { InvoiceDetail } from '../types'

export function useInvoice(id: string) {
  return useQuery<InvoiceDetail>({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/invoices/${id}`)
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error?.message ?? 'Failed to fetch invoice')
      }
      return res.json()
    },
    staleTime: 1000 * 60 * 2,
    enabled: Boolean(id),
  })
}
