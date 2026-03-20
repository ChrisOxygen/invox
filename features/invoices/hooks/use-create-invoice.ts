'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ZCreateInvoice } from '../schemas'

interface InvoiceApiError extends Error {
  code?: string
}

export function useCreateInvoice(options?: {
  onSuccess?: (data: { id: string; invoiceNumber: string }) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ZCreateInvoice) => {
      const res = await fetch('/api/v1/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        const err: InvoiceApiError = new Error(json.error?.message ?? 'Failed to create invoice')
        err.code = json.error?.code
        throw err
      }
      return res.json() as Promise<{ id: string; invoiceNumber: string }>
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      options?.onSuccess?.(data)
    },
  })
}
