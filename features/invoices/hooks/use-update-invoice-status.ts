'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InvoiceStatus } from '../types'

interface StatusApiError extends Error {
  code?: string
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ invoiceId, status }: { invoiceId: string; status: InvoiceStatus }) => {
      const res = await fetch(`/api/v1/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const error: StatusApiError = new Error(json?.error?.message ?? 'Failed to update invoice status')
        error.code = json?.error?.code
        throw error
      }
      return res.json()
    },
    onSuccess: (_data, { invoiceId }) => {
      queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
    },
  })
}
